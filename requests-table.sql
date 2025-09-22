-- Create requests table
CREATE TABLE public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('expense', 'holiday')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2), -- For expense requests
  date DATE, -- For holiday requests
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own requests" ON public.requests FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own requests" ON public.requests FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can read all requests" ON public.requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins can update requests" ON public.requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role IN ('admin', 'manager'))
);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();