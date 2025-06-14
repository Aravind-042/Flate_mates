
-- Fix the user_role enum type issue by properly handling dependencies
-- Drop dependent objects first, then recreate everything

-- Drop existing objects that depend on user_role (including the function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP TABLE IF EXISTS public.flat_requests;
DROP TABLE IF EXISTS public.flat_listings;
DROP TABLE IF EXISTS public.profiles;

-- Now drop and recreate the enums
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create the enums first
CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  phone_number text NOT NULL DEFAULT '',
  full_name text,
  role user_role NOT NULL DEFAULT 'flat_seeker',
  city text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flat_listings table
CREATE TABLE public.flat_listings (
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

-- Create flat_requests table
CREATE TABLE public.flat_requests (
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

-- Recreate the get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create the handle_new_user function
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for flat listings
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

-- Create RLS policies for flat requests
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
