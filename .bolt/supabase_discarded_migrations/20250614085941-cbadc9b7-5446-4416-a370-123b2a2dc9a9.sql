
-- Drop existing tables and recreate with improved schema
DROP TABLE IF EXISTS public.flat_requests CASCADE;
DROP TABLE IF EXISTS public.flat_listings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing enums and recreate with more comprehensive options
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;

-- Create comprehensive enums
CREATE TYPE user_role AS ENUM ('flat_seeker', 'flat_owner', 'both');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'expired');
CREATE TYPE property_type AS ENUM ('apartment', 'independent_house', 'villa', 'pg', 'shared_room', 'studio');
CREATE TYPE gender_preference AS ENUM ('male', 'female', 'any');
CREATE TYPE listing_status AS ENUM ('active', 'inactive', 'rented', 'expired');

-- Enhanced profiles table with better structure
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL DEFAULT '',
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'flat_seeker',
  city TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  profession TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents TEXT[], -- URLs to verification documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table for better city/area management
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  pincode TEXT,
  state TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city, area)
);

-- Enhanced flat listings with better organization
CREATE TABLE public.flat_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic listing info
  title TEXT NOT NULL,
  description TEXT,
  status listing_status DEFAULT 'active',
  
  -- Property details
  property_type property_type NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1 CHECK (bedrooms > 0),
  bathrooms INTEGER NOT NULL DEFAULT 1 CHECK (bathrooms > 0),
  total_rooms INTEGER CHECK (total_rooms >= bedrooms),
  floor_number INTEGER,
  total_floors INTEGER,
  carpet_area_sqft INTEGER,
  is_furnished BOOLEAN DEFAULT FALSE,
  furnishing_details TEXT[],
  
  -- Location
  location_id UUID REFERENCES public.locations(id),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark TEXT,
  
  -- Rent and costs
  monthly_rent INTEGER NOT NULL CHECK (monthly_rent > 0),
  security_deposit INTEGER DEFAULT 0 CHECK (security_deposit >= 0),
  maintenance_charges INTEGER DEFAULT 0,
  brokerage_amount INTEGER DEFAULT 0,
  rent_includes TEXT[] DEFAULT '{}', -- electricity, water, internet, etc.
  
  -- Amenities and features
  parking_available BOOLEAN DEFAULT FALSE,
  parking_type TEXT, -- covered, open, etc.
  amenities TEXT[] DEFAULT '{}',
  nearby_facilities TEXT[] DEFAULT '{}', -- metro, hospital, mall, etc.
  
  -- Flatmate preferences
  preferred_gender gender_preference DEFAULT 'any',
  preferred_age_min INTEGER CHECK (preferred_age_min >= 18),
  preferred_age_max INTEGER CHECK (preferred_age_max <= 100),
  preferred_professions TEXT[] DEFAULT '{}',
  lifestyle_preferences TEXT[] DEFAULT '{}', -- non-smoker, vegetarian, etc.
  max_occupants INTEGER DEFAULT 1 CHECK (max_occupants > 0),
  current_occupants INTEGER DEFAULT 0 CHECK (current_occupants >= 0),
  
  -- Contact preferences
  contact_phone BOOLEAN DEFAULT TRUE,
  contact_whatsapp BOOLEAN DEFAULT FALSE,
  contact_email BOOLEAN DEFAULT TRUE,
  preferred_contact_time TEXT, -- morning, evening, etc.
  
  -- Media
  images TEXT[] DEFAULT '{}',
  video_tour_url TEXT,
  virtual_tour_url TEXT,
  
  -- Availability
  available_from DATE,
  lease_duration_months INTEGER, -- minimum lease period
  
  -- Metadata
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (preferred_age_min <= preferred_age_max),
  CHECK (current_occupants <= max_occupants),
  CHECK (floor_number <= total_floors)
);

-- Enhanced flat requests with better tracking
CREATE TABLE public.flat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.flat_listings(id) ON DELETE CASCADE,
  seeker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Request details
  message TEXT,
  preferred_move_in_date DATE,
  lease_duration_preference INTEGER, -- in months
  budget_range_min INTEGER,
  budget_range_max INTEGER,
  
  -- Status tracking
  status request_status DEFAULT 'pending',
  status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_changed_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  
  -- Communication
  last_message_at TIMESTAMP WITH TIME ZONE,
  owner_response TEXT,
  seeker_response TEXT,
  
  -- Meeting/viewing
  viewing_scheduled_at TIMESTAMP WITH TIME ZONE,
  viewing_address TEXT,
  viewing_status TEXT, -- scheduled, completed, cancelled
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(listing_id, seeker_id) -- Prevent duplicate requests
);

-- Favorites/Wishlist table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.flat_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Reviews and ratings
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.flat_listings(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_type TEXT NOT NULL, -- 'flatmate', 'owner', 'property'
  
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(reviewer_id, reviewee_id, listing_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'request', 'message', 'listing', 'system'
  related_id UUID, -- ID of related entity (request, listing, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history for analytics
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_query TEXT,
  filters JSONB,
  result_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some popular locations
INSERT INTO public.locations (city, area, state, is_popular) VALUES
('Mumbai', 'Andheri West', 'Maharashtra', true),
('Mumbai', 'Bandra', 'Maharashtra', true),
('Mumbai', 'Powai', 'Maharashtra', true),
('Delhi', 'Gurgaon', 'Haryana', true),
('Delhi', 'Noida', 'Uttar Pradesh', true),
('Bangalore', 'Koramangala', 'Karnataka', true),
('Bangalore', 'Whitefield', 'Karnataka', true),
('Bangalore', 'HSR Layout', 'Karnataka', true),
('Pune', 'Hinjewadi', 'Maharashtra', true),
('Pune', 'Kharadi', 'Maharashtra', true),
('Chennai', 'OMR', 'Tamil Nadu', true),
('Hyderabad', 'Gachibowli', 'Telangana', true);

-- Create updated handle_new_user function
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flat_listings_updated_at BEFORE UPDATE ON public.flat_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flat_requests_updated_at BEFORE UPDATE ON public.flat_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles for listings" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.flat_listings fl 
      WHERE fl.owner_id = profiles.id AND fl.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.flat_requests fr 
      WHERE (fr.seeker_id = auth.uid() AND fr.owner_id = profiles.id)
      OR (fr.owner_id = auth.uid() AND fr.seeker_id = profiles.id)
    )
  );

-- RLS Policies for locations (public read access)
CREATE POLICY "Anyone can view locations" ON public.locations
  FOR SELECT TO authenticated, anon USING (true);

-- RLS Policies for flat_listings
CREATE POLICY "Anyone can view active listings" ON public.flat_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can manage their own listings" ON public.flat_listings
  FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for flat_requests
CREATE POLICY "Users can view requests involving them" ON public.flat_requests
  FOR SELECT USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

CREATE POLICY "Seekers can create requests" ON public.flat_requests
  FOR INSERT WITH CHECK (auth.uid() = seeker_id);

CREATE POLICY "Users can update requests involving them" ON public.flat_requests
  FOR UPDATE USING (auth.uid() = seeker_id OR auth.uid() = owner_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for search_history
CREATE POLICY "Users can manage their own search history" ON public.search_history
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_flat_listings_owner_id ON public.flat_listings(owner_id);
CREATE INDEX idx_flat_listings_location_id ON public.flat_listings(location_id);
CREATE INDEX idx_flat_listings_status ON public.flat_listings(status);
CREATE INDEX idx_flat_listings_monthly_rent ON public.flat_listings(monthly_rent);
CREATE INDEX idx_flat_listings_created_at ON public.flat_listings(created_at DESC);

CREATE INDEX idx_flat_requests_listing_id ON public.flat_requests(listing_id);
CREATE INDEX idx_flat_requests_seeker_id ON public.flat_requests(seeker_id);
CREATE INDEX idx_flat_requests_owner_id ON public.flat_requests(owner_id);
CREATE INDEX idx_flat_requests_status ON public.flat_requests(status);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_city ON public.profiles(city);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
