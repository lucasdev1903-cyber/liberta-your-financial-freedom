-- Migration: Add fields for Debt Management to liabilities table
-- Date: 2026-03-05

ALTER TABLE public.liabilities
ADD COLUMN IF NOT EXISTS interest_rate numeric(5, 2),
ADD COLUMN IF NOT EXISTS min_payment numeric(12, 2);
