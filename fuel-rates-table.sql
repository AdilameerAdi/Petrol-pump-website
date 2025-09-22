-- Create fuel_rates table
CREATE TABLE public.fuel_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rates JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default rates
INSERT INTO public.fuel_rates (rates) VALUES (
  '{"MS": 95.50, "MSP": 98.20, "HSD": 87.30, "CNG": 65.40}'
);

-- Enable RLS
ALTER TABLE public.fuel_rates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can read rates" ON public.fuel_rates FOR SELECT USING (true);
CREATE POLICY "Admins can insert rates" ON public.fuel_rates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin')
);