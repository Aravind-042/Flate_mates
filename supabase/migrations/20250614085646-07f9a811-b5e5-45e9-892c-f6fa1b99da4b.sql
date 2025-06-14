
-- Create enums only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
    END IF;
END $$;

-- Update the handle_new_user function to properly handle the user role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can manage their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Users can view requests involving them" ON public.flat_requests;
DROP POLICY IF EXISTS "Seekers can create requests" ON public.flat_requests;
DROP POLICY IF EXISTS "Users can update requests involving them" ON public.flat_requests;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for flat_listings
CREATE POLICY "Anyone can view active listings" 
  ON public.flat_listings 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Owners can manage their own listings" 
  ON public.flat_listings 
  FOR ALL 
  USING (auth.uid() = owner_id);

-- Create RLS policies for flat_requests
CREATE POLICY "Users can view requests involving them" 
  ON public.flat_requests 
  FOR SELECT 
  USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

CREATE POLICY "Seekers can create requests" 
  ON public.flat_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = seeker_id);

CREATE POLICY "Users can update requests involving them" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = seeker_id OR auth.uid() = owner_id);
