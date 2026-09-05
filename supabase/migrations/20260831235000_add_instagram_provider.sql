-- Migration: Add instagram to integration_provider enum
-- Timestamp: 20260831235000

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'instagram'
    AND enumtypid = (
      SELECT oid FROM pg_type WHERE typname = 'integration_provider'
    )
  ) THEN
    ALTER TYPE public.integration_provider ADD VALUE 'instagram';
  END IF;
END;
$$;
