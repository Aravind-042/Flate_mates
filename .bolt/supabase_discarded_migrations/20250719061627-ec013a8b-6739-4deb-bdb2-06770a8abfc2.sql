-- First, manually create the missing profile for the existing user
INSERT INTO public.profiles (id, email, full_name, phone_number, role)
VALUES (
  'c4a470bf-e2b4-4d1e-b4ed-b3ca7f24947f',
  'aravind.product@gmail.com',
  'Aravind',
  '',
  'flat_seeker'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Fix the trigger function to properly handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone_number, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.phone, COALESCE(NEW.raw_user_meta_data->>'phone_number', '')),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::text, 'flat_seeker')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();