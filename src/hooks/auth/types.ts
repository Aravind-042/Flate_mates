
export interface Profile {
  id: string;
  email: string;
  phone_number: string;
  full_name: string | null;
  city: string | null;
  profile_picture_url: string | null;
  bio: string | null;
  age: number | null;
  profession: string | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string;
}
