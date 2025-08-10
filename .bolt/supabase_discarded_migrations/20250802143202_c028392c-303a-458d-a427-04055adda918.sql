-- Add more locations for different cities
INSERT INTO locations (id, area, city, state, latitude, longitude, pincode, is_popular) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Cyber City', 'Gurgaon', 'Haryana', 28.4595, 77.0266, '122002', true),
('550e8400-e29b-41d4-a716-446655440002', 'Whitefield', 'Bangalore', 'Karnataka', 12.9698, 77.7500, '560066', true),
('550e8400-e29b-41d4-a716-446655440003', 'Powai', 'Mumbai', 'Maharashtra', 19.1197, 72.9081, '400076', true),
('550e8400-e29b-41d4-a716-446655440004', 'Sector 62', 'Noida', 'Uttar Pradesh', 28.6139, 77.3850, '201309', true),
('550e8400-e29b-41d4-a716-446655440005', 'Electronic City', 'Bangalore', 'Karnataka', 12.8456, 77.6603, '560100', true),
('550e8400-e29b-41d4-a716-446655440006', 'Hitech City', 'Hyderabad', 'Telangana', 17.4474, 78.3731, '500081', true),
('550e8400-e29b-41d4-a716-446655440007', 'Banjara Hills', 'Hyderabad', 'Telangana', 17.4123, 78.4490, '500034', true),
('550e8400-e29b-41d4-a716-446655440008', 'Indiranagar', 'Bangalore', 'Karnataka', 12.9716, 77.6412, '560038', true),
('550e8400-e29b-41d4-a716-446655440009', 'Lower Parel', 'Mumbai', 'Maharashtra', 19.0144, 72.8319, '400013', true),
('550e8400-e29b-41d4-a716-446655440010', 'Karol Bagh', 'Delhi', 'Delhi', 28.6519, 77.1909, '110005', true);

-- Add more dummy flat listings with these locations
INSERT INTO flat_listings (
  id, title, description, property_type, bedrooms, bathrooms, monthly_rent, security_deposit,
  is_furnished, parking_available, amenities, address_line1, location_id, owner_id,
  images, preferred_gender, status, created_at, updated_at
) VALUES
-- Gurgaon listing
('650e8400-e29b-41d4-a716-446655440001', 
 'Luxury 3BHK in Cyber City', 
 'Premium furnished apartment in the heart of Gurgaon IT hub. Walking distance to major corporate offices and metro station.',
 'apartment', 3, 2, 85000, 170000, true, true,
 ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'power_backup', 'air_conditioning'],
 'Tower A, DLF Cyber Greens, Cyber City',
 '550e8400-e29b-41d4-a716-446655440001',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Bangalore Whitefield
('650e8400-e29b-41d4-a716-446655440002',
 'Modern 2BHK in Whitefield',
 'Spacious apartment near IT parks. Great connectivity to tech companies and shopping malls.',
 'apartment', 2, 2, 32000, 64000, true, true,
 ARRAY['wifi', 'gym', 'security', 'elevator', 'power_backup'],
 'Prestige Shantiniketan, Whitefield',
 '550e8400-e29b-41d4-a716-446655440002',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Mumbai Powai
('650e8400-e29b-41d4-a716-446655440003',
 'Cozy 1BHK in Powai',
 'Perfect for young professionals. Close to IIT Bombay and Hiranandani Gardens.',
 'apartment', 1, 1, 38000, 76000, true, false,
 ARRAY['wifi', 'security', 'elevator', 'air_conditioning'],
 'Hiranandani Gardens, Powai',
 '550e8400-e29b-41d4-a716-446655440003',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop'],
 'female', 'active', now(), now()),

-- Noida listing
('650e8400-e29b-41d4-a716-446655440004',
 'Spacious 3BHK in Sector 62',
 'Family-friendly apartment with excellent amenities. Close to metro and shopping centers.',
 'apartment', 3, 3, 45000, 90000, true, true,
 ARRAY['wifi', 'gym', 'security', 'playground', 'power_backup'],
 'Supertech Ecovillage, Sector 62',
 '550e8400-e29b-41d4-a716-446655440004',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Bangalore Electronic City
('650e8400-e29b-41d4-a716-446655440005',
 'Affordable 2BHK in Electronic City',
 'Budget-friendly option for IT professionals. Good connectivity to major tech parks.',
 'apartment', 2, 2, 25000, 50000, false, true,
 ARRAY['wifi', 'security', 'elevator'],
 'Electronic City Phase 1',
 '550e8400-e29b-41d4-a716-446655440005',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=500&h=300&fit=crop'],
 'male', 'active', now(), now()),

-- Hyderabad Hitech City
('650e8400-e29b-41d4-a716-446655440006',
 'Premium Studio in Hitech City',
 'Modern studio apartment in the financial district. Perfect for working professionals.',
 'studio', 1, 1, 22000, 44000, true, false,
 ARRAY['wifi', 'gym', 'security', 'air_conditioning'],
 'Financial District, Hitech City',
 '550e8400-e29b-41d4-a716-446655440006',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Hyderabad Banjara Hills
('650e8400-e29b-41d4-a716-446655440007',
 'Luxury 4BHK in Banjara Hills',
 'Upscale apartment in prime location. Close to Jubilee Hills and GVK One mall.',
 'apartment', 4, 3, 95000, 190000, true, true,
 ARRAY['wifi', 'gym', 'swimming_pool', 'security', 'power_backup', 'air_conditioning', 'clubhouse'],
 'Road No. 12, Banjara Hills',
 '550e8400-e29b-41d4-a716-446655440007',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Bangalore Indiranagar
('650e8400-e29b-41d4-a716-446655440008',
 'Trendy 2BHK in Indiranagar',
 'Hip neighborhood with great nightlife and restaurants. Perfect for young professionals.',
 'apartment', 2, 2, 42000, 84000, true, false,
 ARRAY['wifi', 'security', 'elevator'],
 '100 Feet Road, Indiranagar',
 '550e8400-e29b-41d4-a716-446655440008',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=500&h=300&fit=crop'],
 'any', 'active', now(), now()),

-- Mumbai Lower Parel
('650e8400-e29b-41d4-a716-446655440009',
 'Corporate 1BHK in Lower Parel',
 'Business district apartment with easy access to corporate offices and fine dining.',
 'apartment', 1, 1, 55000, 110000, true, false,
 ARRAY['wifi', 'gym', 'security', 'air_conditioning'],
 'Phoenix Mills, Lower Parel',
 '550e8400-e29b-41d4-a716-446655440009',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=500&h=300&fit=crop'],
 'female', 'active', now(), now()),

-- Delhi Karol Bagh
('650e8400-e29b-41d4-a716-446655440010',
 'Traditional 3BHK in Karol Bagh',
 'Classic Delhi apartment in central location. Great connectivity to metro and markets.',
 'apartment', 3, 2, 35000, 70000, false, true,
 ARRAY['wifi', 'security', 'power_backup'],
 'Ghaffar Market, Karol Bagh',
 '550e8400-e29b-41d4-a716-446655440010',
 'f3318cb9-7009-4f4d-8342-9c7fa9ec3af3',
 ARRAY['https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=500&h=300&fit=crop'],
 'any', 'active', now(), now());