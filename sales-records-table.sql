-- Create sales_records table
CREATE TABLE public.sales_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  checkpoint TEXT NOT NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  
  -- Fuel readings and calculations
  readings JSONB NOT NULL, -- Store all nozzle readings
  calculations JSONB NOT NULL, -- Store all calculations
  total_sales_amount DECIMAL(12,2) NOT NULL,
  
  -- Payment methods
  payment_methods JSONB NOT NULL, -- Store all payment method amounts
  total_other_payments DECIMAL(12,2) NOT NULL,
  net_cash DECIMAL(12,2) NOT NULL,
  
  -- Expenses and testing
  approved_expenses DECIMAL(10,2) DEFAULT 0,
  testing_cost DECIMAL(10,2) DEFAULT 0,
  testing_details JSONB, -- Store testing liters and fuel type
  
  -- Final amounts
  final_net_cash DECIMAL(12,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own sales records" ON public.sales_records FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own sales records" ON public.sales_records FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can read all sales records" ON public.sales_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role IN ('admin', 'manager'))
);

-- Index for better performance
CREATE INDEX idx_sales_records_date ON public.sales_records(sale_date);
CREATE INDEX idx_sales_records_user ON public.sales_records(user_id);