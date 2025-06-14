
-- Add the role column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN role user_role NOT NULL DEFAULT 'flat_seeker';

-- Update the handle_new_user function to include role when creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Create trigger to automatically create profiles for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a profile for the existing user (if one doesn't exist)
INSERT INTO public.profiles (id, email, phone_number, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.phone, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  'flat_seeker'::user_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
