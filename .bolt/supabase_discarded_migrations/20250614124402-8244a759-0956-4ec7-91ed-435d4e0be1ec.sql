
-- Insert sample listings directly for the current flat owner user
-- Using the existing user ID from the network requests
INSERT INTO public.flat_listings (
  title, description, property_type, bedrooms, bathrooms, monthly_rent, 
  security_deposit, is_furnished, parking_available, amenities, 
  address_line1, address_line2, location_id, preferred_gender, 
  max_occupants, current_occupants, available_from, images, owner_id, status
) VALUES 
(
  'Spacious 2BHK in Bandra West',
  'Beautiful fully furnished 2BHK apartment in the heart of Bandra West. Close to linking road and bandstand. Perfect for young professionals.',
  'apartment', 2, 2, 45000, 90000, true, true,
  ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'power_backup'],
  '123 Hill Road, Bandra West', 'Near Linking Road',
  (SELECT id FROM locations WHERE city = 'Mumbai' AND area = 'Bandra West' LIMIT 1),
  'any', 2, 0, '2024-07-01',
  ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Modern 1BHK Near Metro Station',
  'Contemporary 1BHK apartment just 2 minutes walk from Andheri East metro station. Ideal for IT professionals working in nearby offices.',
  'apartment', 1, 1, 28000, 56000, true, false,
  ARRAY['wifi', 'air_conditioning', 'security', 'elevator'],
  '456 Chakala Road, Andheri East', 'Opposite WEH Metro Station',
  (SELECT id FROM locations WHERE city = 'Mumbai' AND area = 'Andheri East' LIMIT 1),
  'male', 1, 0, '2024-06-20',
  ARRAY['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Luxury 3BHK in Connaught Place',
  'Premium 3BHK apartment in the commercial heart of Delhi. Walking distance to metro, restaurants, and shopping centers.',
  'apartment', 3, 3, 75000, 150000, true, true,
  ARRAY['wifi', 'gym', 'security', 'power_backup', 'elevator', 'air_conditioning'],
  '789 Janpath, Connaught Place', 'Block A, Central Delhi',
  (SELECT id FROM locations WHERE city = 'Delhi' AND area = 'Connaught Place' LIMIT 1),
  'any', 3, 0, '2024-07-15',
  ARRAY['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Cozy Studio in Lajpat Nagar',
  'Compact and comfortable studio apartment perfect for students or young professionals. Great connectivity to metro and markets.',
  'studio', 1, 1, 18000, 36000, false, false,
  ARRAY['wifi', 'security'],
  '321 Ring Road, Lajpat Nagar', 'Near Central Market',
  (SELECT id FROM locations WHERE city = 'Delhi' AND area = 'Lajpat Nagar' LIMIT 1),
  'female', 1, 0, '2024-06-30',
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Tech Hub 2BHK in Koramangala',
  'Modern 2BHK apartment in Bangalore tech hub. Walking distance to major IT companies and vibrant nightlife.',
  'apartment', 2, 2, 35000, 70000, true, true,
  ARRAY['wifi', 'gym', 'security', 'power_backup', 'elevator'],
  '555 80 Feet Road, Koramangala', '5th Block, Near Forum Mall',
  (SELECT id FROM locations WHERE city = 'Bangalore' AND area = 'Koramangala' LIMIT 1),
  'any', 2, 0, '2024-07-01',
  ARRAY['https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Trendy 1BHK in Indiranagar',
  'Stylish 1BHK in the happening Indiranagar area. Close to pubs, restaurants, and metro connectivity.',
  'apartment', 1, 1, 25000, 50000, true, false,
  ARRAY['wifi', 'security', 'air_conditioning'],
  '777 100 Feet Road, Indiranagar', 'Near CMH Road',
  (SELECT id FROM locations WHERE city = 'Bangalore' AND area = 'Indiranagar' LIMIT 1),
  'any', 1, 0, '2024-06-25',
  ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'IT Park Adjacent 2BHK in Hinjewadi',
  'Brand new 2BHK apartment adjacent to Hinjewadi IT Park. Perfect for techies working in Phase 1 and 2.',
  'apartment', 2, 2, 22000, 44000, false, true,
  ARRAY['wifi', 'security', 'power_backup', 'elevator'],
  '999 Hinjewadi Road, Hinjewadi', 'Phase 1, Near Infosys',
  (SELECT id FROM locations WHERE city = 'Pune' AND area = 'Hinjewadi' LIMIT 1),
  'male', 2, 0, '2024-07-10',
  ARRAY['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
),
(
  'Heritage 1BHK in Koregaon Park',
  'Charming 1BHK apartment in the upscale Koregaon Park area. Close to German Bakery and Osho Ashram.',
  'apartment', 1, 1, 30000, 60000, true, true,
  ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'air_conditioning'],
  '111 North Main Road, Koregaon Park', 'Near Boat Club',
  (SELECT id FROM locations WHERE city = 'Pune' AND area = 'Koregaon Park' LIMIT 1),
  'female', 1, 0, '2024-06-15',
  ARRAY['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop'],
  'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3', 'active'
);

-- Also add some missing location areas that we referenced in the listings
INSERT INTO public.locations (city, area, pincode, state, latitude, longitude, is_popular) VALUES
('Bangalore', 'Koramangala', '560034', 'Karnataka', 12.9352, 77.6245, true),
('Pune', 'Hinjewadi', '411057', 'Maharashtra', 18.5908, 73.7392, true)
ON CONFLICT (city, area) DO NOTHING;
