-- D2C Dashboard: API Credentials Migration
-- Timestamp: 20260831230000

-- 1. Types
DROP TYPE IF EXISTS public.integration_provider CASCADE;
CREATE TYPE public.integration_provider AS ENUM ('meta_ads', 'shopify', 'courier');

DROP TYPE IF EXISTS public.credential_status CASCADE;
CREATE TYPE public.credential_status AS ENUM ('active', 'inactive', 'error');

-- 2. Core Table
CREATE TABLE IF NOT EXISTS public.api_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider public.integration_provider NOT NULL,
    credential_key TEXT NOT NULL,
    credential_value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT true,
    status public.credential_status DEFAULT 'inactive'::public.credential_status,
    last_tested_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_api_credentials_user_id ON public.api_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_provider ON public.api_credentials(provider);
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_credentials_user_provider_key 
    ON public.api_credentials(user_id, provider, credential_key);

-- 4. Functions
CREATE OR REPLACE FUNCTION public.update_api_credentials_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "users_manage_own_api_credentials" ON public.api_credentials;
CREATE POLICY "users_manage_own_api_credentials"
ON public.api_credentials
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Triggers
DROP TRIGGER IF EXISTS update_api_credentials_updated_at ON public.api_credentials;
CREATE TRIGGER update_api_credentials_updated_at
    BEFORE UPDATE ON public.api_credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_credentials_updated_at();
