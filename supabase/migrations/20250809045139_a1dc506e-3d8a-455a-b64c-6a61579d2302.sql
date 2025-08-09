-- Update profiles table to support Aadhaar authentication
-- Add unique constraint on aadhar_number for farmers
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_aadhar_farmer 
UNIQUE (aadhar_number, user_type);

-- Create index for faster lookups
CREATE INDEX idx_profiles_aadhar_dob ON public.profiles(aadhar_number, date_of_birth) 
WHERE user_type = 'farmer';

-- Update the handle_new_user function to properly handle Aadhaar signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    name, 
    user_type,
    phone,
    whatsapp_number,
    aadhar_number,
    date_of_birth
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp_number',
    NEW.raw_user_meta_data->>'aadhar_number',
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$function$;