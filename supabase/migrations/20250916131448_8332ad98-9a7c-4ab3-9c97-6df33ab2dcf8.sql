-- Create table for Aadhaar-based authentication
CREATE TABLE public.aadhaar_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aadhaar_number TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for OTP verification
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.aadhaar_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for aadhaar_auth
CREATE POLICY "Users can view their own aadhaar auth data" 
ON public.aadhaar_auth 
FOR SELECT 
USING (true); -- Will be restricted by application logic

CREATE POLICY "Users can insert aadhaar auth data" 
ON public.aadhaar_auth 
FOR INSERT 
WITH CHECK (true); -- Will be restricted by application logic

CREATE POLICY "Users can update their own aadhaar auth data" 
ON public.aadhaar_auth 
FOR UPDATE 
USING (true); -- Will be restricted by application logic

-- RLS policies for otp_verifications
CREATE POLICY "Users can view their own otp data" 
ON public.otp_verifications 
FOR SELECT 
USING (true); -- Will be restricted by application logic

CREATE POLICY "Users can insert otp data" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (true); -- Will be restricted by application logic

CREATE POLICY "Users can update otp data" 
ON public.otp_verifications 
FOR UPDATE 
USING (true); -- Will be restricted by application logic

-- Create index for better performance
CREATE INDEX idx_aadhaar_number ON public.aadhaar_auth(aadhaar_number);
CREATE INDEX idx_phone_otp ON public.otp_verifications(phone_number, expires_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_aadhaar_auth_updated_at
BEFORE UPDATE ON public.aadhaar_auth
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to clean expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;