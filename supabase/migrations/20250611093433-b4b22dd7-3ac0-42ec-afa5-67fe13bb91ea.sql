
-- First, create the user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner');
    END IF;
END $$;

-- Create request_status enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
    END IF;
END $$;

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can insert their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can update their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can delete their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view requests related to them" ON public.flat_requests;
DROP POLICY IF EXISTS "Seekers can create requests" ON public.flat_requests;
DROP POLICY IF EXISTS "Owners can update request status" ON public.flat_requests;
DROP POLICY IF EXISTS "Seekers can update their own requests" ON public.flat_requests;

-- Create a security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Profiles policies - users can only see and edit their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Flat listings policies
CREATE POLICY "Anyone can view active listings" 
  ON public.flat_listings 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Owners can insert their own listings" 
  ON public.flat_listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id AND public.get_current_user_role() = 'flat_owner');

CREATE POLICY "Owners can update their own listings" 
  ON public.flat_listings 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings" 
  ON public.flat_listings 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Flat requests policies
CREATE POLICY "Users can view requests related to them" 
  ON public.flat_requests 
  FOR SELECT 
  USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

CREATE POLICY "Seekers can create requests" 
  ON public.flat_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = seeker_id AND public.get_current_user_role() = 'flat_seeker');

CREATE POLICY "Owners can update request status" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Seekers can update their own requests" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = seeker_id);

-- Update the handle_new_user function to properly handle the user_role enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'flat_seeker'::user_role)
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
