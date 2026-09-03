-- D2C Dashboard: Backfill user_profiles + harden the signup trigger
-- Timestamp: 20260903000000
--
-- Problem observed against the live project (ref qtbsribvtxhwapsiwcyn):
--
--   demo@d2cdashboard.com authenticates fine (auth.users id
--   c7cc046c-ae65-47a2-9ed0-d7ffe7c1f31f) but has NO row in
--   public.user_profiles. Every dashboard table declares
--   user_id UUID REFERENCES public.user_profiles(id), so EVERY write for that
--   user fails:
--
--     23503  insert or update on table "marketing_campaigns"
--            violates foreign key constraint "marketing_campaigns_user_id_fkey"
--     23503  insert or update on table "instagram_posts"
--            violates foreign key constraint "instagram_posts_user_id_fkey"
--
--   instagram_posts predates this changeset, which proves the fault is the
--   missing profile row and not the newly added sync tables. Reads returned
--   200/empty, which is why the UI silently showed mock data instead.
--
-- Root cause: the on_auth_user_created trigger did not populate user_profiles
-- for the existing demo accounts (they were created outside the trigger's
-- reach, or the trigger's role cast aborted). Two fixes below: backfill every
-- orphaned auth user, then make the trigger unable to fail the same way again.

-- ─── 1. Guard against migration 20260831205734's `DROP TYPE ... CASCADE` ─────
-- That statement drops dependent columns. If it ever re-ran against a
-- populated database, user_profiles.role vanished while CREATE TABLE
-- IF NOT EXISTS declined to re-add it. Re-adding is idempotent and harmless.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
    END IF;
END $$;

ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'member'::public.user_role;
ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT 'D2C Dashboard';
ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ─── 2. Backfill a profile for every auth user that lacks one ───────────────
-- Skips users without an email, since user_profiles.email is NOT NULL UNIQUE.
-- Idempotent: the LEFT JOIN plus ON CONFLICT makes re-runs no-ops.

INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role, company_name)
SELECT
    u.id,
    u.email,
    COALESCE(
        NULLIF(u.raw_user_meta_data->>'full_name', ''),
        split_part(u.email, '@', 1)
    ),
    COALESCE(u.raw_user_meta_data->>'avatar_url', ''),
    CASE
        WHEN u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'member')
            THEN (u.raw_user_meta_data->>'role')::public.user_role
        ELSE 'member'::public.user_role
    END,
    COALESCE(NULLIF(u.raw_user_meta_data->>'company_name', ''), 'D2C Dashboard')
FROM auth.users u
LEFT JOIN public.user_profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- ─── 3. Harden the trigger so a future signup cannot hit this again ─────────
-- Two hardening changes over the original:
--   a. The role cast is validated against the enum's labels instead of casting
--      raw metadata directly. An unexpected value like 'owner' previously
--      raised invalid_input_value inside an AFTER INSERT trigger, which aborts
--      the whole auth.users insert and makes signup fail outright.
--   b. The body is wrapped so any unexpected failure logs a warning rather than
--      blocking account creation. A missing profile is recoverable (re-run this
--      backfill); a signup that cannot complete is not.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.email IS NULL THEN
        RETURN NEW;
    END IF;

    BEGIN
        INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role, company_name)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(
                NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
                split_part(NEW.email, '@', 1)
            ),
            COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
            CASE
                WHEN NEW.raw_user_meta_data->>'role' IN ('admin', 'manager', 'member')
                    THEN (NEW.raw_user_meta_data->>'role')::public.user_role
                ELSE 'member'::public.user_role
            END,
            COALESCE(NULLIF(NEW.raw_user_meta_data->>'company_name', ''), 'D2C Dashboard')
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'handle_new_user could not create profile for %: %', NEW.id, SQLERRM;
    END;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ─── 4. Report what the backfill produced ───────────────────────────────────

DO $$
DECLARE
    total   INTEGER;
    profiled INTEGER;
    orphans INTEGER;
BEGIN
    SELECT count(*) INTO total FROM auth.users WHERE email IS NOT NULL;
    SELECT count(*) INTO profiled FROM public.user_profiles;
    SELECT count(*) INTO orphans
    FROM auth.users u
    LEFT JOIN public.user_profiles p ON p.id = u.id
    WHERE p.id IS NULL AND u.email IS NOT NULL;

    RAISE NOTICE 'auth users with email: %, user_profiles rows: %, remaining orphans: %',
        total, profiled, orphans;
END $$;
