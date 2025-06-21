
-- Check if tables exist and create them if they don't
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL DEFAULT '',
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'flat_seeker',
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flat_listings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.flat_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  rent_amount INTEGER NOT NULL,
  rent_deposit INTEGER NOT NULL DEFAULT 0,
  rent_includes TEXT[],
  furnished BOOLEAN NOT NULL DEFAULT false,
  parking BOOLEAN NOT NULL DEFAULT false,
  amenities TEXT[],
  location_city TEXT NOT NULL,
  location_area TEXT NOT NULL,
  location_address TEXT NOT NULL,
  preferences_gender TEXT,
  preferences_profession TEXT[],
  preferences_lifestyle TEXT[],
  preferences_additional_requirements TEXT,
  contact_email BOOLEAN NOT NULL DEFAULT true,
  contact_whatsapp BOOLEAN NOT NULL DEFAULT false,
  contact_call BOOLEAN NOT NULL DEFAULT false,
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flat_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.flat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.flat_listings(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace the handle_new_user function (without enum dependency)
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'flat_seeker')
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_requests ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view active listings" ON public.flat_listings;
CREATE POLICY "Anyone can view active listings" 
  ON public.flat_listings 
  FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Owners can manage their own listings" ON public.flat_listings;
CREATE POLICY "Owners can manage their own listings" 
  ON public.flat_listings 
  FOR ALL 
  USING (auth.uid() = owner_id);
