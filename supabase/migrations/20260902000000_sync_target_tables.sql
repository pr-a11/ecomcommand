-- D2C Dashboard: Integration sync target tables
-- Timestamp: 20260902000000
--
-- The Configuration page's "Sync now" flow writes provider data into
-- marketing_campaigns, orders, customers and shipments. None of those tables
-- existed, so every upsert failed with PGRST205 and the failure was swallowed.
-- It also upserts into instagram_posts using columns that table never had
-- (post_id, media_type, posted_at, impressions, video_views, synced_at) and an
-- ON CONFLICT (user_id, post_id) arbiter with no matching unique index.
--
-- Column names and types below mirror the upsert payloads in
-- src/app/configuration/page.tsx exactly. Each ON CONFLICT target is backed by
-- a UNIQUE index, without which PostgREST rejects the upsert outright.

-- ─── 1. Meta Ads campaigns ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'meta_ads',
    campaign_id TEXT NOT NULL,
    campaign_name TEXT,
    status TEXT DEFAULT 'unknown',
    objective TEXT,
    spend NUMERIC DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    ctr NUMERIC DEFAULT 0,
    cpc NUMERIC DEFAULT 0,
    reach BIGINT DEFAULT 0,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_user_id
    ON public.marketing_campaigns(user_id);
-- ON CONFLICT (user_id, campaign_id) arbiter
CREATE UNIQUE INDEX IF NOT EXISTS idx_marketing_campaigns_user_campaign
    ON public.marketing_campaigns(user_id, campaign_id);

-- ─── 2. Shopify orders ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL,
    order_number BIGINT,
    email TEXT,
    total_price NUMERIC DEFAULT 0,
    financial_status TEXT,
    fulfillment_status TEXT,
    customer_id TEXT,
    created_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
-- ON CONFLICT (user_id, order_id) arbiter
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_user_order
    ON public.orders(user_id, order_id);

-- ─── 3. Shopify customers ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
-- ON CONFLICT (user_id, customer_id) arbiter
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_user_customer
    ON public.customers(user_id, customer_id);

-- ─── 4. Courier shipments ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    shipment_id TEXT NOT NULL,
    order_id TEXT,
    status TEXT DEFAULT 'unknown',
    courier_name TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON public.shipments(user_id);
-- ON CONFLICT (user_id, shipment_id) arbiter
CREATE UNIQUE INDEX IF NOT EXISTS idx_shipments_user_shipment
    ON public.shipments(user_id, shipment_id);

-- ─── 5. Reconcile instagram_posts with the Instagram sync payload ────────────
-- Additive only: existing seeded/demo columns (post_type, gradient, eng_rate,
-- shares) are left untouched.

ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS post_id TEXT;
ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS media_type TEXT;
ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ;
ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS impressions BIGINT DEFAULT 0;
ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS video_views BIGINT DEFAULT 0;
ALTER TABLE public.instagram_posts ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

-- ON CONFLICT (user_id, post_id) arbiter. Pre-existing demo rows have a NULL
-- post_id; NULLs compare as distinct in a Postgres unique index, so they do not
-- collide with each other or block synced rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_instagram_posts_user_post
    ON public.instagram_posts(user_id, post_id);

-- ─── 6. Row Level Security ───────────────────────────────────────────────────

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_marketing_campaigns" ON public.marketing_campaigns;
CREATE POLICY "users_manage_marketing_campaigns"
ON public.marketing_campaigns
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_orders" ON public.orders;
CREATE POLICY "users_manage_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_customers" ON public.customers;
CREATE POLICY "users_manage_customers"
ON public.customers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_shipments" ON public.shipments;
CREATE POLICY "users_manage_shipments"
ON public.shipments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
