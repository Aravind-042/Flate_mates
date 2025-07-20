-- First, manually create the missing profile for the existing user (without role column)
INSERT INTO public.profiles (id, email, full_name, phone_number)
VALUES (
  'c4a470bf-e2b4-4d1e-b4ed-b3ca7f24947f',
  'aravind.product@gmail.com',
  'Aravind',
  ''
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;