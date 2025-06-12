
-- First, let's create the user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create request_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  phone_number text NOT NULL DEFAULT '',
  full_name text,
  role user_role NOT NULL DEFAULT 'flat_seeker',
  city text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flat_listings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.flat_listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  property_type text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  furnished boolean NOT NULL DEFAULT false,
  parking boolean NOT NULL DEFAULT false,
  location_address text NOT NULL,
  location_area text NOT NULL,
  location_city text NOT NULL,
  rent_amount integer NOT NULL,
  rent_deposit integer NOT NULL DEFAULT 0,
  rent_includes text[],
  amenities text[],
  preferences_gender text,
  preferences_profession text[],
  preferences_lifestyle text[],
  preferences_additional_requirements text,
  contact_email boolean NOT NULL DEFAULT true,
  contact_whatsapp boolean NOT NULL DEFAULT false,
  contact_call boolean NOT NULL DEFAULT false,
  images text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flat_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.flat_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES public.flat_listings(id) NOT NULL,
  seeker_id uuid REFERENCES auth.users NOT NULL,
  owner_id uuid REFERENCES auth.users NOT NULL,
  message text,
  status request_status NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_requests ENABLE ROW LEVEL SECURITY;

-- Create or replace the handle_new_user function
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

-- Create the trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create RLS policies for profiles
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

-- Create RLS policies for flat listings
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.flat_listings;
CREATE POLICY "Anyone can view active listings" 
  ON public.flat_listings 
  FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Owners can insert their own listings" ON public.flat_listings;
CREATE POLICY "Owners can insert their own listings" 
  ON public.flat_listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their own listings" ON public.flat_listings;
CREATE POLICY "Owners can update their own listings" 
  ON public.flat_listings 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their own listings" ON public.flat_listings;
CREATE POLICY "Owners can delete their own listings" 
  ON public.flat_listings 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Create RLS policies for flat requests
DROP POLICY IF EXISTS "Users can view requests related to them" ON public.flat_requests;
CREATE POLICY "Users can view requests related to them" 
  ON public.flat_requests 
  FOR SELECT 
  USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Seekers can create requests" ON public.flat_requests;
CREATE POLICY "Seekers can create requests" 
  ON public.flat_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = seeker_id);

DROP POLICY IF EXISTS "Owners can update request status" ON public.flat_requests;
CREATE POLICY "Owners can update request status" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Seekers can update their own requests" ON public.flat_requests;
CREATE POLICY "Seekers can update their own requests" 
  ON public.flat_requests 
  FOR UPDATE 
  USING (auth.uid() = seeker_id);
