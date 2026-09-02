-- Dashboard Data Tables Migration
-- Creates all tables needed to replace mock data across 9 dashboard screens

-- ============================================================
-- SALES TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sales_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  period_label TEXT NOT NULL DEFAULT 'Aug 1 – Aug 29, 2026',
  gross_sales NUMERIC NOT NULL DEFAULT 0,
  gross_sales_change NUMERIC DEFAULT 0,
  invoiced_sales NUMERIC NOT NULL DEFAULT 0,
  invoiced_sales_change NUMERIC DEFAULT 0,
  net_sales NUMERIC NOT NULL DEFAULT 0,
  net_sales_change NUMERIC DEFAULT 0,
  orders INTEGER NOT NULL DEFAULT 0,
  orders_change NUMERIC DEFAULT 0,
  orders_badge TEXT DEFAULT '94 fulfilled',
  aov NUMERIC NOT NULL DEFAULT 0,
  aov_change NUMERIC DEFAULT 0,
  contribution_margin NUMERIC NOT NULL DEFAULT 0,
  contribution_margin_change NUMERIC DEFAULT 0,
  returning_customer_rate NUMERIC NOT NULL DEFAULT 0,
  returning_customer_rate_change NUMERIC DEFAULT 0,
  ads_spend NUMERIC NOT NULL DEFAULT 0,
  ads_spend_change NUMERIC DEFAULT 0,
  attributed_roas NUMERIC NOT NULL DEFAULT 0,
  attributed_roas_change NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sales_by_channel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  shopify NUMERIC DEFAULT 0,
  amazon NUMERIC DEFAULT 0,
  flipkart NUMERIC DEFAULT 0,
  myntra NUMERIC DEFAULT 0,
  eternz NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.net_sales_vs_margin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  net_sales NUMERIC DEFAULT 0,
  net_margin NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sales_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  amount NUMERIC DEFAULT 0,
  is_positive BOOLEAN DEFAULT true,
  is_subtotal BOOLEAN DEFAULT false,
  is_total BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.geographic_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rank_order INTEGER DEFAULT 0,
  state TEXT NOT NULL,
  shopify NUMERIC DEFAULT 0,
  marketplace NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.top_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rank_order INTEGER DEFAULT 0,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  net_sales NUMERIC DEFAULT 0,
  units INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  category TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.returns_by_channel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  returned INTEGER DEFAULT 0,
  return_pct NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.channel_mix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  net_sales NUMERIC DEFAULT 0,
  pct NUMERIC DEFAULT 0,
  color TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FINANCE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.finance_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  gross_sales NUMERIC DEFAULT 0,
  gross_sales_change NUMERIC DEFAULT 0,
  returning_customer_rate NUMERIC DEFAULT 0,
  returning_customer_rate_change NUMERIC DEFAULT 0,
  orders INTEGER DEFAULT 0,
  orders_change NUMERIC DEFAULT 0,
  ads_spend NUMERIC DEFAULT 0,
  ads_spend_change NUMERIC DEFAULT 0,
  attributed_roas NUMERIC DEFAULT 0,
  attributed_roas_change NUMERIC DEFAULT 0,
  contribution_margin NUMERIC DEFAULT 0,
  contribution_margin_change NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pl_waterfall (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  value NUMERIC DEFAULT 0,
  entry_type TEXT DEFAULT 'positive',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.net_sales_over_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  current_period NUMERIC DEFAULT 0,
  previous_period NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.contribution_margin_trend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  margin NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.channel_profitability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  gross_sales NUMERIC DEFAULT 0,
  fees NUMERIC DEFAULT 0,
  net_realisation NUMERIC DEFAULT 0,
  net_margin_pct NUMERIC DEFAULT 0,
  take_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.marketplace_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  marketplace TEXT NOT NULL,
  referral_fee NUMERIC DEFAULT 0,
  closing_fee NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total_fee NUMERIC DEFAULT 0,
  impact NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MARKETING TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketing_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  gross_sales NUMERIC DEFAULT 0,
  gross_sales_change NUMERIC DEFAULT 0,
  total_ad_spend NUMERIC DEFAULT 0,
  total_ad_spend_change NUMERIC DEFAULT 0,
  blended_roas NUMERIC DEFAULT 0,
  attributed_sales NUMERIC DEFAULT 0,
  attributed_roas NUMERIC DEFAULT 0,
  attributed_roas_change NUMERIC DEFAULT 0,
  ad_spend_pct NUMERIC DEFAULT 0,
  cac NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'meta',
  name TEXT NOT NULL,
  spend NUMERIC DEFAULT 0,
  attributed_sales NUMERIC DEFAULT 0,
  orders INTEGER DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Hold',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.conversion_funnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  value INTEGER DEFAULT 0,
  pct NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.channel_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  sessions INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  sales NUMERIC DEFAULT 0,
  conv_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.age_gender_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  age_group TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  sales NUMERIC DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  male INTEGER DEFAULT 0,
  female INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INSTAGRAM TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.instagram_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  followers INTEGER DEFAULT 0,
  followers_change NUMERIC DEFAULT 0,
  reach INTEGER DEFAULT 0,
  reach_change NUMERIC DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  impressions_change NUMERIC DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  engagement_rate_change NUMERIC DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  profile_visits_change NUMERIC DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  link_clicks_change NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  post_type TEXT DEFAULT 'Post',
  gradient TEXT DEFAULT 'from-pink-400 to-rose-600',
  caption TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  eng_rate NUMERIC DEFAULT 0,
  saved INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.instagram_hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  posts INTEGER DEFAULT 0,
  avg_reach INTEGER DEFAULT 0,
  avg_eng NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MARKETPLACE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketplace_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  revenue NUMERIC DEFAULT 0,
  revenue_change NUMERIC DEFAULT 0,
  orders INTEGER DEFAULT 0,
  orders_change NUMERIC DEFAULT 0,
  return_rate NUMERIC DEFAULT 0,
  return_rate_change NUMERIC DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  avg_rating_change NUMERIC DEFAULT 0,
  listing_health INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.inventory_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  sku TEXT NOT NULL,
  shopify INTEGER DEFAULT 0,
  amazon INTEGER DEFAULT 0,
  flipkart INTEGER DEFAULT 0,
  myntra INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  status TEXT DEFAULT 'In Stock',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- OPERATIONS TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.operations_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  dispatched INTEGER DEFAULT 0,
  pending INTEGER DEFAULT 0,
  in_transit INTEGER DEFAULT 0,
  delivered_today INTEGER DEFAULT 0,
  delivered_today_change INTEGER DEFAULT 0,
  return_requests INTEGER DEFAULT 0,
  return_requests_change INTEGER DEFAULT 0,
  avg_delivery_days NUMERIC DEFAULT 0,
  avg_delivery_days_change NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.courier_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  courier TEXT NOT NULL,
  shipments INTEGER DEFAULT 0,
  delivered_pct NUMERIC DEFAULT 0,
  avg_days NUMERIC DEFAULT 0,
  ndr_rate NUMERIC DEFAULT 0,
  cost_per_shipment NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ndr_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  customer TEXT NOT NULL,
  city TEXT NOT NULL,
  courier TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  sku TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  suggested INTEGER DEFAULT 0,
  urgency TEXT DEFAULT 'low',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CUSTOMERS TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.customers_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  total_customers INTEGER DEFAULT 0,
  total_customers_change NUMERIC DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  new_customers_change NUMERIC DEFAULT 0,
  returning_rate NUMERIC DEFAULT 0,
  returning_rate_change NUMERIC DEFAULT 0,
  avg_ltv NUMERIC DEFAULT 0,
  avg_ltv_change NUMERIC DEFAULT 0,
  nps INTEGER DEFAULT 0,
  nps_change NUMERIC DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  avg_rating_change NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  customer TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  product TEXT NOT NULL,
  review_text TEXT DEFAULT '',
  platform TEXT DEFAULT 'Google',
  review_date TEXT DEFAULT '',
  sentiment TEXT DEFAULT 'Positive',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.top_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rank_order INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  orders INTEGER DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  last_order TEXT DEFAULT '',
  segment TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_sales_kpis_user_id ON public.sales_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_by_channel_user_id ON public.sales_by_channel(user_id);
CREATE INDEX IF NOT EXISTS idx_net_sales_vs_margin_user_id ON public.net_sales_vs_margin(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_summary_user_id ON public.sales_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_geographic_sales_user_id ON public.geographic_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_top_skus_user_id ON public.top_skus(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_by_channel_user_id ON public.returns_by_channel(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_mix_user_id ON public.channel_mix(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_kpis_user_id ON public.finance_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_pl_waterfall_user_id ON public.pl_waterfall(user_id);
CREATE INDEX IF NOT EXISTS idx_net_sales_over_time_user_id ON public.net_sales_over_time(user_id);
CREATE INDEX IF NOT EXISTS idx_contribution_margin_trend_user_id ON public.contribution_margin_trend(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_profitability_user_id ON public.channel_profitability(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_fees_user_id ON public.marketplace_fees(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_kpis_user_id ON public.marketing_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_user_id ON public.conversion_funnel(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_sessions_user_id ON public.channel_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_age_gender_data_user_id ON public.age_gender_data(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_kpis_user_id ON public.instagram_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_user_id ON public.instagram_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_user_id ON public.instagram_hashtags(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_kpis_user_id ON public.marketplace_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_user_id ON public.inventory_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_kpis_user_id ON public.operations_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_courier_performance_user_id ON public.courier_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_ndr_orders_user_id ON public.ndr_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_user_id ON public.inventory_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_kpis_user_id ON public.customers_kpis(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_user_id ON public.customer_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_top_customers_user_id ON public.top_customers(user_id);

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE public.sales_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_by_channel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.net_sales_vs_margin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns_by_channel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_mix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_waterfall ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.net_sales_over_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_margin_trend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_profitability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.age_gender_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndr_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_customers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "users_manage_sales_kpis" ON public.sales_kpis;
CREATE POLICY "users_manage_sales_kpis" ON public.sales_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_sales_by_channel" ON public.sales_by_channel;
CREATE POLICY "users_manage_sales_by_channel" ON public.sales_by_channel FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_net_sales_vs_margin" ON public.net_sales_vs_margin;
CREATE POLICY "users_manage_net_sales_vs_margin" ON public.net_sales_vs_margin FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_sales_summary" ON public.sales_summary;
CREATE POLICY "users_manage_sales_summary" ON public.sales_summary FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_geographic_sales" ON public.geographic_sales;
CREATE POLICY "users_manage_geographic_sales" ON public.geographic_sales FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_top_skus" ON public.top_skus;
CREATE POLICY "users_manage_top_skus" ON public.top_skus FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_returns_by_channel" ON public.returns_by_channel;
CREATE POLICY "users_manage_returns_by_channel" ON public.returns_by_channel FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_channel_mix" ON public.channel_mix;
CREATE POLICY "users_manage_channel_mix" ON public.channel_mix FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_finance_kpis" ON public.finance_kpis;
CREATE POLICY "users_manage_finance_kpis" ON public.finance_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_pl_waterfall" ON public.pl_waterfall;
CREATE POLICY "users_manage_pl_waterfall" ON public.pl_waterfall FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_net_sales_over_time" ON public.net_sales_over_time;
CREATE POLICY "users_manage_net_sales_over_time" ON public.net_sales_over_time FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_contribution_margin_trend" ON public.contribution_margin_trend;
CREATE POLICY "users_manage_contribution_margin_trend" ON public.contribution_margin_trend FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_channel_profitability" ON public.channel_profitability;
CREATE POLICY "users_manage_channel_profitability" ON public.channel_profitability FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_marketplace_fees" ON public.marketplace_fees;
CREATE POLICY "users_manage_marketplace_fees" ON public.marketplace_fees FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_marketing_kpis" ON public.marketing_kpis;
CREATE POLICY "users_manage_marketing_kpis" ON public.marketing_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_campaigns" ON public.campaigns;
CREATE POLICY "users_manage_campaigns" ON public.campaigns FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_conversion_funnel" ON public.conversion_funnel;
CREATE POLICY "users_manage_conversion_funnel" ON public.conversion_funnel FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_channel_sessions" ON public.channel_sessions;
CREATE POLICY "users_manage_channel_sessions" ON public.channel_sessions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_age_gender_data" ON public.age_gender_data;
CREATE POLICY "users_manage_age_gender_data" ON public.age_gender_data FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_instagram_kpis" ON public.instagram_kpis;
CREATE POLICY "users_manage_instagram_kpis" ON public.instagram_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_instagram_posts" ON public.instagram_posts;
CREATE POLICY "users_manage_instagram_posts" ON public.instagram_posts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_instagram_hashtags" ON public.instagram_hashtags;
CREATE POLICY "users_manage_instagram_hashtags" ON public.instagram_hashtags FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_marketplace_kpis" ON public.marketplace_kpis;
CREATE POLICY "users_manage_marketplace_kpis" ON public.marketplace_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_inventory_sync" ON public.inventory_sync;
CREATE POLICY "users_manage_inventory_sync" ON public.inventory_sync FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_operations_kpis" ON public.operations_kpis;
CREATE POLICY "users_manage_operations_kpis" ON public.operations_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_courier_performance" ON public.courier_performance;
CREATE POLICY "users_manage_courier_performance" ON public.courier_performance FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_ndr_orders" ON public.ndr_orders;
CREATE POLICY "users_manage_ndr_orders" ON public.ndr_orders FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_inventory_alerts" ON public.inventory_alerts;
CREATE POLICY "users_manage_inventory_alerts" ON public.inventory_alerts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_customers_kpis" ON public.customers_kpis;
CREATE POLICY "users_manage_customers_kpis" ON public.customers_kpis FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_customer_reviews" ON public.customer_reviews;
CREATE POLICY "users_manage_customer_reviews" ON public.customer_reviews FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_top_customers" ON public.top_customers;
CREATE POLICY "users_manage_top_customers" ON public.top_customers FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SEED DATA (inserted for first user found, idempotent)
-- ============================================================

DO $$
DECLARE
  seed_user_id UUID;
BEGIN
  SELECT id INTO seed_user_id FROM public.user_profiles LIMIT 1;

  IF seed_user_id IS NULL THEN
    RAISE NOTICE 'No user profiles found. Seed data will be inserted on first login via application.';
    RETURN;
  END IF;

  -- Sales KPIs
  INSERT INTO public.sales_kpis (user_id, gross_sales, gross_sales_change, invoiced_sales, invoiced_sales_change, net_sales, net_sales_change, orders, orders_change, orders_badge, aov, aov_change, contribution_margin, contribution_margin_change, returning_customer_rate, returning_customer_rate_change, ads_spend, ads_spend_change, attributed_roas, attributed_roas_change)
  VALUES (seed_user_id, 1109200, -10.1, 632314, 31.4, 584721, 31.1, 144, -5.9, '94 fulfilled', 6220, 0.4, 63.4, 4.5, 15.38, -16.9, 80963, -37.9, 2.81, 51.1)
  ON CONFLICT (id) DO NOTHING;

  -- Sales by Channel
  INSERT INTO public.sales_by_channel (user_id, date_label, sort_order, shopify, amazon, flipkart, myntra, eternz) VALUES
    (seed_user_id, '1 Aug', 1, 18200, 8400, 6100, 4200, 2100),
    (seed_user_id, '2 Aug', 2, 22100, 9800, 7200, 5100, 2800),
    (seed_user_id, '3 Aug', 3, 15600, 6200, 4800, 3200, 1800),
    (seed_user_id, '4 Aug', 4, 28400, 12100, 8900, 6400, 3200),
    (seed_user_id, '5 Aug', 5, 19800, 8600, 5900, 4100, 2400),
    (seed_user_id, '6 Aug', 6, 24600, 10200, 7100, 5800, 2900),
    (seed_user_id, '7 Aug', 7, 16200, 7400, 4200, 3100, 1600),
    (seed_user_id, '8 Aug', 8, 31200, 14600, 9800, 7200, 3800),
    (seed_user_id, '9 Aug', 9, 20400, 9100, 6200, 4600, 2200),
    (seed_user_id, '10 Aug', 10, 26800, 11800, 8100, 5900, 3100),
    (seed_user_id, '11 Aug', 11, 18900, 8200, 5400, 3800, 2000),
    (seed_user_id, '12 Aug', 12, 34100, 15800, 10200, 7800, 4200),
    (seed_user_id, '13 Aug', 13, 42800, 19200, 12800, 9400, 5100),
    (seed_user_id, '14 Aug', 14, 38600, 17400, 11600, 8600, 4600),
    (seed_user_id, '15 Aug', 15, 29200, 13100, 8800, 6500, 3400),
    (seed_user_id, '16 Aug', 16, 44200, 20100, 13400, 9800, 5400),
    (seed_user_id, '17 Aug', 17, 22100, 9900, 6600, 4800, 2600),
    (seed_user_id, '18 Aug', 18, 19800, 8800, 5900, 4200, 2200),
    (seed_user_id, '19 Aug', 19, 36400, 16200, 10800, 7900, 4300),
    (seed_user_id, '20 Aug', 20, 28100, 12400, 8300, 6100, 3200),
    (seed_user_id, '21 Aug', 21, 21600, 9600, 6400, 4600, 2400),
    (seed_user_id, '22 Aug', 22, 16800, 7500, 4900, 3500, 1900),
    (seed_user_id, '23 Aug', 23, 24200, 10800, 7200, 5300, 2800),
    (seed_user_id, '24 Aug', 24, 18400, 8100, 5400, 3900, 2100),
    (seed_user_id, '25 Aug', 25, 12200, 5400, 3600, 2600, 1400),
    (seed_user_id, '26 Aug', 26, 9800, 4200, 2800, 2000, 1100),
    (seed_user_id, '27 Aug', 27, 6400, 2800, 1900, 1400, 800),
    (seed_user_id, '28 Aug', 28, 4200, 1800, 1200, 900, 500),
    (seed_user_id, '29 Aug', 29, 2100, 900, 600, 400, 200)
  ON CONFLICT (id) DO NOTHING;

  -- Net Sales vs Margin
  INSERT INTO public.net_sales_vs_margin (user_id, date_label, sort_order, net_sales, net_margin) VALUES
    (seed_user_id, '08-01', 1, 38200, 24100), (seed_user_id, '08-02', 2, 64800, 41200),
    (seed_user_id, '08-03', 3, 28400, 17100), (seed_user_id, '08-04', 4, 71200, 45800),
    (seed_user_id, '08-05', 5, 42100, 26400), (seed_user_id, '08-06', 6, 58600, 37200),
    (seed_user_id, '08-07', 7, 32100, 19400), (seed_user_id, '08-08', 8, 78400, 51200),
    (seed_user_id, '08-09', 9, 44200, 27800), (seed_user_id, '08-10', 10, 62800, 40100),
    (seed_user_id, '08-11', 11, 36400, 22100), (seed_user_id, '08-12', 12, 84100, 54600),
    (seed_user_id, '08-13', 13, 96200, 62400), (seed_user_id, '08-14', 14, 88400, 57200),
    (seed_user_id, '08-15', 15, 64100, 41400), (seed_user_id, '08-16', 16, 98800, 64200),
    (seed_user_id, '08-17', 17, 48200, 30400), (seed_user_id, '08-18', 18, 42100, 26200),
    (seed_user_id, '08-19', 19, 76400, 49600), (seed_user_id, '08-20', 20, 58200, 37400),
    (seed_user_id, '08-21', 21, 46100, 29200), (seed_user_id, '08-22', 22, 34200, 21400),
    (seed_user_id, '08-23', 23, 52400, 33600), (seed_user_id, '08-24', 24, 38100, 24200),
    (seed_user_id, '08-25', 25, 24200, 14800), (seed_user_id, '08-26', 26, 18400, 11200),
    (seed_user_id, '08-27', 27, 12100, 7400), (seed_user_id, '08-28', 28, 8200, 4800),
    (seed_user_id, '08-29', 29, 4100, 2400)
  ON CONFLICT (id) DO NOTHING;

  -- Sales Summary
  INSERT INTO public.sales_summary (user_id, label, sort_order, orders, amount, is_positive, is_subtotal, is_total) VALUES
    (seed_user_id, 'Gross Sales', 1, 144, 1109200, true, false, false),
    (seed_user_id, 'Discounts', 2, 89, -124600, false, false, false),
    (seed_user_id, 'Cancelled Orders', 3, 18, -98400, false, false, false),
    (seed_user_id, 'Invoiced Sales', 4, 126, 886200, true, true, false),
    (seed_user_id, 'Returned Orders', 5, 14, -124800, false, false, false),
    (seed_user_id, 'RTO Orders', 6, 11, -176681, false, false, false),
    (seed_user_id, 'Net Sales', 7, 101, 584721, true, false, true)
  ON CONFLICT (id) DO NOTHING;

  -- Geographic Sales
  INSERT INTO public.geographic_sales (user_id, rank_order, state, shopify, marketplace, total) VALUES
    (seed_user_id, 1, 'Rajasthan', 51200, 34119, 85319),
    (seed_user_id, 2, 'Maharashtra', 44800, 29249, 74049),
    (seed_user_id, 3, 'Gujarat', 41600, 27667, 69267),
    (seed_user_id, 4, 'Telangana', 38400, 27189, 65589),
    (seed_user_id, 5, 'Uttar Pradesh', 36800, 25332, 62132),
    (seed_user_id, 6, 'Tamil Nadu', 31200, 21891, 53091),
    (seed_user_id, 7, 'West Bengal', 28400, 19402, 47802),
    (seed_user_id, 8, 'Karnataka', 26400, 18002, 44402)
  ON CONFLICT (id) DO NOTHING;

  -- Top SKUs
  INSERT INTO public.top_skus (user_id, rank_order, sku, name, net_sales, units, orders, category) VALUES
    (seed_user_id, 1, 'NKL-GLD-001', 'Kundan Layered Necklace Set', 124800, 18, 14, 'Necklace'),
    (seed_user_id, 2, 'CMB-WED-004', 'Bridal Combo — Necklace + Earrings', 98400, 12, 10, 'Combo'),
    (seed_user_id, 3, 'ERG-OXD-008', 'Oxidised Jhumka Earring Pair', 76200, 42, 38, 'Earring'),
    (seed_user_id, 4, 'RNG-SLV-012', 'Silver Toe Ring Set (6pc)', 58600, 31, 28, 'Ring'),
    (seed_user_id, 5, 'NKL-CHK-016', 'Choker Pearl Necklace', 52100, 22, 19, 'Necklace'),
    (seed_user_id, 6, 'BNG-GLS-021', 'Glass Bangle Set (12pc)', 44800, 58, 52, 'Bangle'),
    (seed_user_id, 7, 'BRC-GLD-025', 'Gold-plated Charm Bracelet', 38200, 16, 14, 'Bracelet')
  ON CONFLICT (id) DO NOTHING;

  -- Returns by Channel
  INSERT INTO public.returns_by_channel (user_id, channel, returned, return_pct) VALUES
    (seed_user_id, 'Shopify', 4, 4.2),
    (seed_user_id, 'Amazon', 5, 8.9),
    (seed_user_id, 'Flipkart', 3, 11.2),
    (seed_user_id, 'Myntra', 2, 9.8),
    (seed_user_id, 'Eternz', 0, 0.0)
  ON CONFLICT (id) DO NOTHING;

  -- Channel Mix
  INSERT INTO public.channel_mix (user_id, channel, net_sales, pct, color) VALUES
    (seed_user_id, 'Shopify', 284200, 48.6, 'var(--channel-shopify)'),
    (seed_user_id, 'Amazon', 128400, 22.0, 'var(--channel-amazon)'),
    (seed_user_id, 'Flipkart', 84600, 14.5, 'var(--channel-flipkart)'),
    (seed_user_id, 'Myntra', 62100, 10.6, 'var(--channel-myntra)'),
    (seed_user_id, 'Eternz', 25421, 4.3, 'var(--channel-eternz)')
  ON CONFLICT (id) DO NOTHING;

  -- Finance KPIs
  INSERT INTO public.finance_kpis (user_id, gross_sales, gross_sales_change, returning_customer_rate, returning_customer_rate_change, orders, orders_change, ads_spend, ads_spend_change, attributed_roas, attributed_roas_change, contribution_margin, contribution_margin_change)
  VALUES (seed_user_id, 1109200, -10.1, 15.38, -16.9, 144, -5.9, 80963, -37.9, 2.81, 51.1, 63.4, 4.5)
  ON CONFLICT (id) DO NOTHING;

  -- PL Waterfall
  INSERT INTO public.pl_waterfall (user_id, label, sort_order, value, entry_type) VALUES
    (seed_user_id, 'Gross Sales', 1, 1109200, 'positive'),
    (seed_user_id, 'Discounts', 2, -124600, 'negative'),
    (seed_user_id, 'Cancellations', 3, -98400, 'negative'),
    (seed_user_id, 'Invoiced Sales', 4, 886200, 'subtotal'),
    (seed_user_id, 'Returns', 5, -124800, 'negative'),
    (seed_user_id, 'RTO', 6, -176681, 'negative'),
    (seed_user_id, 'Net Sales', 7, 584721, 'total')
  ON CONFLICT (id) DO NOTHING;

  -- Net Sales Over Time
  INSERT INTO public.net_sales_over_time (user_id, date_label, sort_order, current_period, previous_period) VALUES
    (seed_user_id, 'Aug 1', 1, 38200, 19600), (seed_user_id, 'Aug 3', 2, 28400, 14500),
    (seed_user_id, 'Aug 5', 3, 42100, 21500), (seed_user_id, 'Aug 7', 4, 32100, 16400),
    (seed_user_id, 'Aug 9', 5, 44200, 22600), (seed_user_id, 'Aug 11', 6, 36400, 18600),
    (seed_user_id, 'Aug 13', 7, 96200, 49200), (seed_user_id, 'Aug 15', 8, 64100, 32800),
    (seed_user_id, 'Aug 17', 9, 48200, 24700), (seed_user_id, 'Aug 19', 10, 76400, 39100),
    (seed_user_id, 'Aug 21', 11, 46100, 23600), (seed_user_id, 'Aug 23', 12, 52400, 26800),
    (seed_user_id, 'Aug 25', 13, 24200, 12400), (seed_user_id, 'Aug 27', 14, 12100, 6200),
    (seed_user_id, 'Aug 29', 15, 4100, 2100)
  ON CONFLICT (id) DO NOTHING;

  -- Contribution Margin Trend
  INSERT INTO public.contribution_margin_trend (user_id, date_label, sort_order, margin) VALUES
    (seed_user_id, 'Aug 1', 1, 58.2), (seed_user_id, 'Aug 3', 2, 60.1),
    (seed_user_id, 'Aug 5', 3, 62.4), (seed_user_id, 'Aug 7', 4, 59.8),
    (seed_user_id, 'Aug 9', 5, 61.2), (seed_user_id, 'Aug 11', 6, 63.1),
    (seed_user_id, 'Aug 13', 7, 64.8), (seed_user_id, 'Aug 15', 8, 62.9),
    (seed_user_id, 'Aug 17', 9, 63.4), (seed_user_id, 'Aug 19', 10, 65.1),
    (seed_user_id, 'Aug 21', 11, 63.8), (seed_user_id, 'Aug 23', 12, 64.2),
    (seed_user_id, 'Aug 25', 13, 62.6), (seed_user_id, 'Aug 27', 14, 63.4),
    (seed_user_id, 'Aug 29', 15, 63.4)
  ON CONFLICT (id) DO NOTHING;

  -- Channel Profitability
  INSERT INTO public.channel_profitability (user_id, channel, gross_sales, fees, net_realisation, net_margin_pct, take_rate) VALUES
    (seed_user_id, 'Shopify', 536200, 21400, 514800, 67.2, 4.0),
    (seed_user_id, 'Amazon', 248400, 54600, 193800, 58.4, 22.0),
    (seed_user_id, 'Flipkart', 162100, 38900, 123200, 55.1, 24.0),
    (seed_user_id, 'Myntra', 118600, 33000, 85600, 52.8, 27.8),
    (seed_user_id, 'Eternz', 43900, 8800, 35100, 61.4, 20.0)
  ON CONFLICT (id) DO NOTHING;

  -- Marketplace Fees
  INSERT INTO public.marketplace_fees (user_id, marketplace, referral_fee, closing_fee, shipping_fee, total_fee, impact) VALUES
    (seed_user_id, 'Amazon', 12.0, 4.2, 3.8, 22.0, 54600),
    (seed_user_id, 'Flipkart', 14.0, 5.1, 4.9, 24.0, 38900),
    (seed_user_id, 'Myntra', 18.0, 4.8, 5.0, 27.8, 33000),
    (seed_user_id, 'Eternz', 12.0, 4.0, 4.0, 20.0, 8800)
  ON CONFLICT (id) DO NOTHING;

  -- Marketing KPIs
  INSERT INTO public.marketing_kpis (user_id, gross_sales, gross_sales_change, total_ad_spend, total_ad_spend_change, blended_roas, attributed_sales, attributed_roas, attributed_roas_change, ad_spend_pct, cac)
  VALUES (seed_user_id, 1109200, -10.1, 80963, -37.9, 13.70, 227682, 2.81, 51.1, 7.3, 1472)
  ON CONFLICT (id) DO NOTHING;

  -- Campaigns
  INSERT INTO public.campaigns (user_id, platform, name, spend, attributed_sales, orders, roas, status) VALUES
    (seed_user_id, 'meta', 'Always-On Prospecting', 18200, 108800, 8, 5.98, 'Scale'),
    (seed_user_id, 'meta', 'Retargeting — Recent Visitors', 12400, 48200, 6, 3.89, 'Scale'),
    (seed_user_id, 'meta', 'Reels — Video Views', 2817, 8765, 2, 3.11, 'Scale'),
    (seed_user_id, 'google', 'Brand Search — Always On', 4364, 7304, 2, 1.67, 'Hold'),
    (seed_user_id, 'google', 'Performance Max — Core', 5299, 6778, 2, 1.28, 'Cut'),
    (seed_user_id, 'meta', 'Retarget by Occasion — Wedding', 6800, 21400, 4, 3.15, 'Scale'),
    (seed_user_id, 'google', 'Shopping — All Products', 4355, 6430, 2, 1.48, 'Cut'),
    (seed_user_id, 'meta', 'Catalog / DPA — Retarget', 8900, 12400, 3, 1.39, 'Hold'),
    (seed_user_id, 'google', 'Display Remarketing', 2642, 3343, 1, 1.27, 'Cut'),
    (seed_user_id, 'google', 'Search — Competitor Conquest', 3004, 2671, 1, 0.89, 'Cut')
  ON CONFLICT (id) DO NOTHING;

  -- Conversion Funnel
  INSERT INTO public.conversion_funnel (user_id, stage, sort_order, value, pct) VALUES
    (seed_user_id, 'Sessions', 1, 28400, 100),
    (seed_user_id, 'Add to Cart', 2, 4260, 15.0),
    (seed_user_id, 'Checkout', 3, 2130, 7.5),
    (seed_user_id, 'Purchases', 4, 426, 1.5)
  ON CONFLICT (id) DO NOTHING;

  -- Channel Sessions
  INSERT INTO public.channel_sessions (user_id, channel, sessions, orders, sales, conv_rate) VALUES
    (seed_user_id, 'Organic Search', 9840, 184, 218400, 1.87),
    (seed_user_id, 'Direct', 6210, 96, 142800, 1.55),
    (seed_user_id, 'Meta Ads', 8420, 124, 148200, 1.47),
    (seed_user_id, 'Google Ads', 3930, 48, 79482, 1.22)
  ON CONFLICT (id) DO NOTHING;

  -- Age Gender Data
  INSERT INTO public.age_gender_data (user_id, age_group, sort_order, spend, sales, visitors, male, female) VALUES
    (seed_user_id, '18–24', 1, 8200, 24600, 4200, 1800, 6400),
    (seed_user_id, '25–34', 2, 28400, 84200, 9800, 2400, 7400),
    (seed_user_id, '35–44', 3, 22100, 68400, 7200, 1800, 5400),
    (seed_user_id, '45–54', 4, 14200, 38600, 4100, 1200, 2900),
    (seed_user_id, '55+', 5, 8063, 11882, 2100, 600, 1500)
  ON CONFLICT (id) DO NOTHING;

  -- Instagram KPIs
  INSERT INTO public.instagram_kpis (user_id, followers, followers_change, reach, reach_change, impressions, impressions_change, engagement_rate, engagement_rate_change, profile_visits, profile_visits_change, link_clicks, link_clicks_change)
  VALUES (seed_user_id, 124830, 2.3, 842100, 15.7, 2430000, 22.1, 4.82, 0.6, 18420, 31.2, 3241, 18.9)
  ON CONFLICT (id) DO NOTHING;

  -- Instagram Posts
  INSERT INTO public.instagram_posts (user_id, post_type, gradient, caption, likes, comments, shares, reach, eng_rate, saved) VALUES
    (seed_user_id, 'Reel', 'from-pink-400 to-rose-600', 'Kundan Bridal Set — Timeless Beauty ✨', 4821, 312, 892, 48200, 12.4, 1240),
    (seed_user_id, 'Carousel', 'from-amber-400 to-orange-500', 'Wedding Season Collection 2024 💍', 3642, 241, 621, 36400, 9.8, 980),
    (seed_user_id, 'Reel', 'from-teal-400 to-cyan-600', 'How to style oxidised jewellery 🌿', 5214, 428, 1124, 62100, 11.2, 1820),
    (seed_user_id, 'Post', 'from-violet-400 to-purple-600', 'Diwali Gifting Guide 🪔', 2841, 184, 412, 28400, 7.6, 640),
    (seed_user_id, 'Story', 'from-emerald-400 to-green-600', 'Behind the scenes — crafting process', 1924, 98, 214, 19200, 6.2, 320),
    (seed_user_id, 'Carousel', 'from-blue-400 to-indigo-600', 'Silver Toe Ring Collection 🌸', 3182, 196, 524, 31800, 8.4, 760),
    (seed_user_id, 'Reel', 'from-rose-400 to-pink-600', 'Trending: Layered Necklace Look 💫', 6841, 512, 1482, 84200, 14.1, 2240),
    (seed_user_id, 'Post', 'from-yellow-400 to-amber-500', 'Customer Spotlight — Real Brides 👰', 2214, 162, 341, 22100, 5.9, 480),
    (seed_user_id, 'Carousel', 'from-cyan-400 to-teal-600', 'New Arrivals: Meenakari Collection', 3841, 248, 682, 38400, 9.1, 920)
  ON CONFLICT (id) DO NOTHING;

  -- Instagram Hashtags
  INSERT INTO public.instagram_hashtags (user_id, tag, posts, avg_reach, avg_eng) VALUES
    (seed_user_id, '#indianjewellery', 142, 18400, 6.2),
    (seed_user_id, '#bridaljewellery', 98, 24200, 8.4),
    (seed_user_id, '#kundan', 84, 21800, 7.8),
    (seed_user_id, '#oxidisedjewellery', 76, 16400, 5.9),
    (seed_user_id, '#silverjewellery', 68, 14200, 5.1),
    (seed_user_id, '#ethnicjewellery', 62, 19800, 7.2),
    (seed_user_id, '#weddingjewellery', 54, 28400, 9.6),
    (seed_user_id, '#jewellerydesign', 48, 12800, 4.8),
    (seed_user_id, '#handmadejewellery', 42, 11200, 4.2),
    (seed_user_id, '#diwali2024', 38, 32400, 11.2)
  ON CONFLICT (id) DO NOTHING;

  -- Marketplace KPIs
  INSERT INTO public.marketplace_kpis (user_id, platform, revenue, revenue_change, orders, orders_change, return_rate, return_rate_change, avg_rating, avg_rating_change, listing_health) VALUES
    (seed_user_id, 'amazon', 243800, 18.4, 312, 22.1, 8.2, -1.3, 4.6, 0.1, 84),
    (seed_user_id, 'flipkart', 166200, 9.7, 241, 11.2, 11.4, 2.1, 4.3, -0.1, 71),
    (seed_user_id, 'myntra', 141300, 31.8, 198, 28.4, 6.8, -3.2, 4.7, 0.2, 91)
  ON CONFLICT (id) DO NOTHING;

  -- Inventory Sync
  INSERT INTO public.inventory_sync (user_id, product, sku, shopify, amazon, flipkart, myntra, total, status) VALUES
    (seed_user_id, 'Kundan Layered Necklace Set', 'NKL-GLD-001', 24, 18, 12, 8, 62, 'In Stock'),
    (seed_user_id, 'Bridal Combo Set', 'CMB-WED-004', 8, 4, 3, 2, 17, 'Low Stock'),
    (seed_user_id, 'Oxidised Jhumka Earrings', 'ERG-OXD-008', 84, 62, 48, 36, 230, 'In Stock'),
    (seed_user_id, 'Silver Toe Ring Set', 'RNG-SLV-012', 42, 28, 0, 14, 84, 'OOS on Flipkart'),
    (seed_user_id, 'Choker Pearl Necklace', 'NKL-CHK-016', 16, 12, 8, 6, 42, 'In Stock'),
    (seed_user_id, 'Glass Bangle Set', 'BNG-GLS-021', 124, 84, 62, 48, 318, 'In Stock'),
    (seed_user_id, 'Gold-plated Charm Bracelet', 'BRC-GLD-025', 3, 2, 1, 0, 6, 'Critical Low'),
    (seed_user_id, 'Meenakari Stud Earrings', 'ERG-MNK-031', 38, 24, 18, 14, 94, 'In Stock')
  ON CONFLICT (id) DO NOTHING;

  -- Operations KPIs
  INSERT INTO public.operations_kpis (user_id, dispatched, pending, in_transit, delivered_today, delivered_today_change, return_requests, return_requests_change, avg_delivery_days, avg_delivery_days_change)
  VALUES (seed_user_id, 127, 17, 89, 43, 12, 8, -3, 3.2, -0.4)
  ON CONFLICT (id) DO NOTHING;

  -- Courier Performance
  INSERT INTO public.courier_performance (user_id, courier, shipments, delivered_pct, avg_days, ndr_rate, cost_per_shipment) VALUES
    (seed_user_id, 'Delhivery', 48, 94.2, 2.8, 3.1, 62),
    (seed_user_id, 'Shiprocket', 32, 91.8, 3.4, 4.8, 54),
    (seed_user_id, 'BlueDart', 24, 97.1, 2.1, 1.4, 98),
    (seed_user_id, 'Xpressbees', 18, 89.4, 3.8, 6.2, 48),
    (seed_user_id, 'Ecom Express', 12, 88.2, 4.1, 7.4, 44)
  ON CONFLICT (id) DO NOTHING;

  -- NDR Orders
  INSERT INTO public.ndr_orders (user_id, order_id, customer, city, courier, attempts, reason, status) VALUES
    (seed_user_id, 'ORD-8421', 'Priya Sharma', 'Jaipur', 'Delhivery', 2, 'Customer not available', 'Pending'),
    (seed_user_id, 'ORD-8398', 'Anita Gupta', 'Mumbai', 'Shiprocket', 1, 'Wrong address', 'Reattempt'),
    (seed_user_id, 'ORD-8374', 'Kavya Reddy', 'Hyderabad', 'BlueDart', 3, 'Refused delivery', 'RTO'),
    (seed_user_id, 'ORD-8361', 'Meera Patel', 'Ahmedabad', 'Xpressbees', 1, 'Door locked', 'Reattempt'),
    (seed_user_id, 'ORD-8342', 'Sunita Verma', 'Delhi', 'Delhivery', 2, 'Phone unreachable', 'Pending')
  ON CONFLICT (id) DO NOTHING;

  -- Inventory Alerts
  INSERT INTO public.inventory_alerts (user_id, product, sku, stock, reorder_point, suggested, urgency) VALUES
    (seed_user_id, 'Bridal Combo Set', 'CMB-WED-004', 17, 20, 50, 'high'),
    (seed_user_id, 'Gold-plated Charm Bracelet', 'BRC-GLD-025', 6, 15, 40, 'critical'),
    (seed_user_id, 'Choker Pearl Necklace', 'NKL-CHK-016', 42, 40, 80, 'medium'),
    (seed_user_id, 'Kundan Layered Necklace', 'NKL-GLD-001', 62, 50, 100, 'low'),
    (seed_user_id, 'Meenakari Stud Earrings', 'ERG-MNK-031', 94, 80, 150, 'low')
  ON CONFLICT (id) DO NOTHING;

  -- Customers KPIs
  INSERT INTO public.customers_kpis (user_id, total_customers, total_customers_change, new_customers, new_customers_change, returning_rate, returning_rate_change, avg_ltv, avg_ltv_change, nps, nps_change, avg_rating, avg_rating_change)
  VALUES (seed_user_id, 8432, 12.3, 342, 8.2, 34.2, 8.1, 18420, 5.7, 72, 4, 4.6, 0.1)
  ON CONFLICT (id) DO NOTHING;

  -- Customer Reviews
  INSERT INTO public.customer_reviews (user_id, customer, rating, product, review_text, platform, review_date, sentiment) VALUES
    (seed_user_id, 'Priya Sharma', 5, 'Kundan Layered Necklace Set', 'Absolutely stunning piece! The craftsmanship is exceptional and it arrived beautifully packaged.', 'Google', '28 Aug 2024', 'Positive'),
    (seed_user_id, 'Anita Gupta', 4, 'Bridal Combo Set', 'Beautiful jewellery, exactly as shown in photos. Delivery was a bit delayed but the quality makes up for it.', 'Amazon', '26 Aug 2024', 'Positive'),
    (seed_user_id, 'Kavya Reddy', 5, 'Oxidised Jhumka Earrings', 'Love these earrings! Perfect weight, great finish. The oxidised look is very authentic and traditional.', 'Shopify', '25 Aug 2024', 'Positive'),
    (seed_user_id, 'Meera Patel', 3, 'Glass Bangle Set', 'Bangles are pretty but one broke during shipping. Customer service was helpful and sent a replacement quickly.', 'Flipkart', '24 Aug 2024', 'Neutral'),
    (seed_user_id, 'Sunita Verma', 5, 'Choker Pearl Necklace', 'Gorgeous choker! The pearls look very real and the clasp is sturdy. Perfect for both casual and formal occasions.', 'Myntra', '23 Aug 2024', 'Positive'),
    (seed_user_id, 'Ritu Singh', 2, 'Silver Toe Ring Set', 'The rings are smaller than expected. The size guide on the website is misleading. Returning these.', 'Amazon', '22 Aug 2024', 'Negative'),
    (seed_user_id, 'Deepa Nair', 5, 'Gold-plated Charm Bracelet', 'Excellent quality gold plating! Does not tarnish even after regular use. Very happy with this purchase.', 'Google', '21 Aug 2024', 'Positive'),
    (seed_user_id, 'Pooja Agarwal', 4, 'Meenakari Stud Earrings', 'Beautiful meenakari work, very detailed. The colours are vibrant. Slightly pricey but worth it for the quality.', 'Shopify', '20 Aug 2024', 'Positive')
  ON CONFLICT (id) DO NOTHING;

  -- Top Customers
  INSERT INTO public.top_customers (user_id, rank_order, name, orders, total_spend, last_order, segment) VALUES
    (seed_user_id, 1, 'Priya Sharma', 12, 84200, '28 Aug', 'VIP'),
    (seed_user_id, 2, 'Anita Gupta', 9, 62400, '26 Aug', 'VIP'),
    (seed_user_id, 3, 'Kavya Reddy', 8, 54800, '25 Aug', 'VIP'),
    (seed_user_id, 4, 'Meera Patel', 7, 48200, '24 Aug', 'Returning'),
    (seed_user_id, 5, 'Sunita Verma', 6, 42100, '23 Aug', 'Returning'),
    (seed_user_id, 6, 'Deepa Nair', 5, 36800, '21 Aug', 'Returning'),
    (seed_user_id, 7, 'Pooja Agarwal', 4, 28400, '20 Aug', 'Returning'),
    (seed_user_id, 8, 'Ritu Singh', 3, 18200, '22 Aug', 'New')
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data insertion failed: %', SQLERRM;
END $$;
