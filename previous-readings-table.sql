-- Create previous_readings table
CREATE TABLE public.previous_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nozzle_name TEXT UNIQUE NOT NULL,
  previous_reading INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default previous readings
INSERT INTO public.previous_readings (nozzle_name, previous_reading) VALUES
('HSD1', 12345),
('HSD2', 23456),
('MS', 34567),
('HSD', 45678),
('MS-Auto', 56789),
('MSP-Auto', 67890),
('Nozzle 1', 78901),
('Nozzle 2', 89012),
('Nozzle 3', 90123),
('Nozzle 4', 12340);

-- Enable RLS
ALTER TABLE public.previous_readings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.previous_readings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.previous_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.previous_readings FOR UPDATE USING (true);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.previous_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();