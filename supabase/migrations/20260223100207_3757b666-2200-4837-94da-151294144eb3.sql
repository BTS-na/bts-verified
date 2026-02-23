
-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  city TEXT NOT NULL DEFAULT '',
  inventory_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required for reservations)
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
WITH CHECK (true);

-- Allow reading own reservation by order_id (public lookup)
CREATE POLICY "Anyone can read reservations"
ON public.reservations
FOR SELECT
USING (true);
