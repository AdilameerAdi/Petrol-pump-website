-- Create fuel_density table
CREATE TABLE public.fuel_density (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fuel_type TEXT NOT NULL,
  hydrometer_reading DECIMAL(10,4) NOT NULL,
  temperature DECIMAL(10,2) NOT NULL,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default density readings
INSERT INTO public.fuel_density (fuel_type, hydrometer_reading, temperature) VALUES
('MS', 0.7500, 25.0),
('MSP', 0.7600, 25.0),
('HSD', 0.8400, 25.0);

-- Enable RLS
ALTER TABLE public.fuel_density ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can read fuel density" ON public.fuel_density FOR SELECT USING (true);
CREATE POLICY "Managers can update fuel density" ON public.fuel_density FOR ALL USING (true) WITH CHECK (true);