-- Migration: Add sync_interval to api_credentials
-- Allows users to configure recurring sync frequency per provider

ALTER TABLE public.api_credentials
ADD COLUMN IF NOT EXISTS sync_interval TEXT DEFAULT 'manual';

-- Index for efficient querying by interval
CREATE INDEX IF NOT EXISTS idx_api_credentials_sync_interval
  ON public.api_credentials(sync_interval);
