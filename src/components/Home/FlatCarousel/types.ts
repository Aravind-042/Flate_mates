
export interface FlatListing {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  security_deposit: number | null;
  is_furnished: boolean | null;
  parking_available: boolean | null;
  amenities: string[] | null;
  address_line1: string;
  address_line2: string | null;
  images: string[] | null;
  owner_id: string;
  created_at: string;
  locations?: {
    city: string;
    area: string;
  };
}

export interface FlatCarouselProps {
  listings: FlatListing[];
}

export interface FlatCarouselComponentProps {
  handleClick: (listing: FlatListing, index: number) => void;
  controls: any;
  listings: FlatListing[];
  isCarouselActive: boolean;
}
