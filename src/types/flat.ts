
export interface FlatListing {
  id?: string;
  title: string;
  description: string;
  location: {
    city: string;
    area: string;
    address: string;
    coordinates?: [number, number]; // [lng, lat]
  };
  property: {
    type: string;
    bedrooms: number;
    bathrooms: number;
    furnished: boolean;
    parking: boolean;
  };
  rent: {
    amount: number;
    deposit: number;
    includes: string[];
  };
  amenities: string[];
  preferences: {
    gender: string;
    profession: string[];
    additionalRequirements: string;
  };
  contactPreferences: {
    whatsapp: boolean;
    call: boolean;
    email: boolean;
  };
  images: string[];
  createdAt?: string;
  ownerId?: string;
}
