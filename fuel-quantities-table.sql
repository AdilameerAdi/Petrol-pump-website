-- Create fuel_quantities table
CREATE TABLE public.fuel_quantities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fuel_type TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default quantities
INSERT INTO public.fuel_quantities (fuel_type, quantity) VALUES
('MS', 22.0),
('MSP', 16.0),
('HSD', 35.0);

-- Enable RLS
ALTER TABLE public.fuel_quantities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can read fuel quantities" ON public.fuel_quantities FOR SELECT USING (true);
CREATE POLICY "Managers can update fuel quantities" ON public.fuel_quantities FOR ALL USING (true) WITH CHECK (true);