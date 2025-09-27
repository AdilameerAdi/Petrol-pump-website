-- Add used_in_calculation column to requests table
ALTER TABLE public.requests ADD COLUMN used_in_calculation BOOLEAN DEFAULT FALSE;
ALTER TABLE public.requests ADD COLUMN used_date DATE;