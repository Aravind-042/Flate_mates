
-- Fix the handle_new_user function to properly cast the role to user_role enum
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

-- Update the get_current_user_role function to be more robust
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Drop and recreate all RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can insert their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can update their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Owners can delete their own listings" ON public.flat_listings;
DROP POLICY IF EXISTS "Users can view requests related to them" ON public.flat_requests;
DROP POLICY IF EXISTS "Seekers can create requests" ON public.flat_requests;
DROP POLICY IF EXISTS "Owners can update request status" ON public.flat_requests;
DROP POLICY IF EXISTS "Seekers can update their own requests" ON public.flat_requests;

-- Recreate profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Recreate flat listings policies  
CREATE POLICY "Anyone can view active listings" 
  ON public.flat_listings 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Owners can insert their own listings" 
  ON public.flat_listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own listings" 
  ON public.flat_listings 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings" 
  ON public.flat_listings 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Recreate flat requests policies
CREATE POLICY "Users can view requests related to them" 
  ON public.flat_requests 
  FOR SELECT 
  USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

CREATE POLICY "Seekers can create requests" 
  ON public.flat_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = seeker_id);

CREATE POLICY "Owners can update request status" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Seekers can update their own requests" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = seeker_id);
