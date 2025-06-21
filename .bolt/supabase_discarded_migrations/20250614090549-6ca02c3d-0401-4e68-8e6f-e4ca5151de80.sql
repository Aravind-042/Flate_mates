
-- First, let's check if the user_role enum exists and create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner', 'both');
    END IF;
END $$;

-- Ensure the profiles table has the correct structure for user registration
-- The frontend sends email, password, full_name, and role
-- The handle_new_user function should properly handle these fields

-- Update the handle_new_user function to handle the signup data correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone_number, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.phone, COALESCE(NEW.raw_user_meta_data->>'phone_number', '')),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'flat_seeker'::user_role)
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
