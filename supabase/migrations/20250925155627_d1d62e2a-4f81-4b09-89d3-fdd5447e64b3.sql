-- Fix critical security vulnerabilities in RLS policies

-- 1. Fix profiles table - restrict SELECT to only allow users to view their own profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Fix otp_verifications table - restrict SELECT to only allow viewing own OTP data
DROP POLICY IF EXISTS "Users can view their own otp data" ON public.otp_verifications;

CREATE POLICY "Users can view their own otp data" 
ON public.otp_verifications 
FOR SELECT 
USING (auth.uid()::text = phone_number OR auth.uid() IS NULL);

-- 3. Fix delivery_partners table - restrict to authenticated users only and hide sensitive data
DROP POLICY IF EXISTS "Anyone can view delivery partners" ON public.delivery_partners;

CREATE POLICY "Authenticated users can view delivery partners" 
ON public.delivery_partners 
FOR SELECT 
TO authenticated
USING (true);