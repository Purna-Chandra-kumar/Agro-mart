-- Create orders table to store buyer orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'direct')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  delivery_partner_id UUID,
  delivery_fee NUMERIC DEFAULT 0,
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Buyers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = buyer_id);

-- Create trigger for automatic timestamp updates on orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();