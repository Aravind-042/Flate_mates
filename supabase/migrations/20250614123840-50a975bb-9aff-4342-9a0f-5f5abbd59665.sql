
-- First, let's add some additional locations if they don't already exist
INSERT INTO public.locations (city, area, pincode, state, latitude, longitude, is_popular) VALUES
('Mumbai', 'Bandra West', '400050', 'Maharashtra', 19.0596, 72.8295, true),
('Mumbai', 'Andheri East', '400069', 'Maharashtra', 19.1136, 72.8697, true),
('Delhi', 'Connaught Place', '110001', 'Delhi', 28.6315, 77.2167, true),
('Delhi', 'Lajpat Nagar', '110024', 'Delhi', 28.5694, 77.2431, true),
('Bangalore', 'Indiranagar', '560038', 'Karnataka', 12.9719, 77.6412, true),
('Pune', 'Koregaon Park', '411001', 'Maharashtra', 18.5362, 73.8958, true)
ON CONFLICT (city, area) DO NOTHING;

-- For now, let's create dummy listings that will use actual user IDs once users sign up
-- We'll create a temporary table to hold sample listing data that can be easily inserted later

CREATE TEMPORARY TABLE sample_listings (
  title TEXT,
  description TEXT,
  property_type property_type,
  bedrooms INTEGER,
  bathrooms INTEGER,
  monthly_rent INTEGER,
  security_deposit INTEGER,
  is_furnished BOOLEAN,
  parking_available BOOLEAN,
  amenities TEXT[],
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  area TEXT,
  preferred_gender gender_preference,
  max_occupants INTEGER,
  available_from DATE,
  images TEXT[]
);

INSERT INTO sample_listings VALUES
(
  'Spacious 2BHK in Bandra West',
  'Beautiful fully furnished 2BHK apartment in the heart of Bandra West. Close to linking road and bandstand. Perfect for young professionals.',
  'apartment', 2, 2, 45000, 90000, true, true,
  ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'power_backup'],
  '123 Hill Road, Bandra West', 'Near Linking Road',
  'Mumbai', 'Bandra West', 'any', 2, '2024-07-01',
  ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop']
),
(
  'Modern 1BHK Near Metro Station',
  'Contemporary 1BHK apartment just 2 minutes walk from Andheri East metro station. Ideal for IT professionals working in nearby offices.',
  'apartment', 1, 1, 28000, 56000, true, false,
  ARRAY['wifi', 'air_conditioning', 'security', 'elevator'],
  '456 Chakala Road, Andheri East', 'Opposite WEH Metro Station',
  'Mumbai', 'Andheri East', 'male', 1, '2024-06-20',
  ARRAY['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop']
),
(
  'Luxury 3BHK in Connaught Place',
  'Premium 3BHK apartment in the commercial heart of Delhi. Walking distance to metro, restaurants, and shopping centers.',
  'apartment', 3, 3, 75000, 150000, true, true,
  ARRAY['wifi', 'gym', 'security', 'power_backup', 'elevator', 'air_conditioning'],
  '789 Janpath, Connaught Place', 'Block A, Central Delhi',
  'Delhi', 'Connaught Place', 'any', 3, '2024-07-15',
  ARRAY['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop']
),
(
  'Cozy Studio in Lajpat Nagar',
  'Compact and comfortable studio apartment perfect for students or young professionals. Great connectivity to metro and markets.',
  'studio', 1, 1, 18000, 36000, false, false,
  ARRAY['wifi', 'security'],
  '321 Ring Road, Lajpat Nagar', 'Near Central Market',
  'Delhi', 'Lajpat Nagar', 'female', 1, '2024-06-30',
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop']
),
(
  'Tech Hub 2BHK in Koramangala',
  'Modern 2BHK apartment in Bangalore tech hub. Walking distance to major IT companies and vibrant nightlife.',
  'apartment', 2, 2, 35000, 70000, true, true,
  ARRAY['wifi', 'gym', 'security', 'power_backup', 'elevator'],
  '555 80 Feet Road, Koramangala', '5th Block, Near Forum Mall',
  'Bangalore', 'Koramangala', 'any', 2, '2024-07-01',
  ARRAY['https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=500&h=300&fit=crop']
),
(
  'Trendy 1BHK in Indiranagar',
  'Stylish 1BHK in the happening Indiranagar area. Close to pubs, restaurants, and metro connectivity.',
  'apartment', 1, 1, 25000, 50000, true, false,
  ARRAY['wifi', 'security', 'air_conditioning'],
  '777 100 Feet Road, Indiranagar', 'Near CMH Road',
  'Bangalore', 'Indiranagar', 'any', 1, '2024-06-25',
  ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop']
),
(
  'IT Park Adjacent 2BHK in Hinjewadi',
  'Brand new 2BHK apartment adjacent to Hinjewadi IT Park. Perfect for techies working in Phase 1 and 2.',
  'apartment', 2, 2, 22000, 44000, false, true,
  ARRAY['wifi', 'security', 'power_backup', 'elevator'],
  '999 Hinjewadi Road, Hinjewadi', 'Phase 1, Near Infosys',
  'Pune', 'Hinjewadi', 'male', 2, '2024-07-10',
  ARRAY['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop']
),
(
  'Heritage 1BHK in Koregaon Park',
  'Charming 1BHK apartment in the upscale Koregaon Park area. Close to German Bakery and Osho Ashram.',
  'apartment', 1, 1, 30000, 60000, true, true,
  ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'air_conditioning'],
  '111 North Main Road, Koregaon Park', 'Near Boat Club',
  'Pune', 'Koregaon Park', 'female', 1, '2024-06-15',
  ARRAY['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop']
);

-- Create a function that will allow inserting dummy listings once users exist
CREATE OR REPLACE FUNCTION public.create_sample_listings_for_user(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  listing_count INTEGER := 0;
  sample_record RECORD;
BEGIN
  FOR sample_record IN 
    SELECT * FROM sample_listings
    ORDER BY RANDOM()
    LIMIT 3  -- Limit to 3 listings per user to avoid overwhelming
  LOOP
    INSERT INTO public.flat_listings (
      title, description, property_type, bedrooms, bathrooms, monthly_rent, 
      security_deposit, is_furnished, parking_available, amenities, 
      address_line1, address_line2, location_id, preferred_gender, 
      max_occupants, current_occupants, available_from, images, owner_id, status
    ) VALUES (
      sample_record.title,
      sample_record.description,
      sample_record.property_type,
      sample_record.bedrooms,
      sample_record.bathrooms,
      sample_record.monthly_rent,
      sample_record.security_deposit,
      sample_record.is_furnished,
      sample_record.parking_available,
      sample_record.amenities,
      sample_record.address_line1,
      sample_record.address_line2,
      (SELECT id FROM locations WHERE city = sample_record.city AND area = sample_record.area LIMIT 1),
      sample_record.preferred_gender,
      sample_record.max_occupants,
      0, -- current_occupants
      sample_record.available_from,
      sample_record.images,
      user_id,
      'active'
    );
    listing_count := listing_count + 1;
  END LOOP;
  
  RETURN listing_count;
END;
$$;

-- Update the handle_new_user function to automatically create sample listings for new flat owners
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
  
  -- If the new user is a flat owner, create some sample listings
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'flat_seeker'::user_role) = 'flat_owner' THEN
    PERFORM public.create_sample_listings_for_user(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;
