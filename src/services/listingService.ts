import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { FlatListing } from '@/types/flat';

type ListingRow = Database['public']['Tables']['flat_listings']['Row'];
type ListingInsert = Database['public']['Tables']['flat_listings']['Insert'];
type ListingUpdate = Database['public']['Tables']['flat_listings']['Update'];

export interface ListingWithLocation extends ListingRow {
  locations?: {
    city: string;
    area: string;
  };
}

export class ListingService {
  /**
   * Fetch all active listings with location data
   */
  static async getActiveListings(): Promise<ListingWithLocation[]> {
    const { data, error } = await supabase
      .from('flat_listings')
      .select(`
        *,
        locations (
          city,
          area
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Fetch a single listing by ID
   */
  static async getListingById(id: string): Promise<ListingWithLocation | null> {
    const { data, error } = await supabase
      .from('flat_listings')
      .select(`
        *,
        locations (
          city,
          area
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch listing: ${error.message}`);
    }

    return data;
  }

  /**
   * Fetch listings by owner ID
   */
  static async getListingsByOwner(ownerId: string): Promise<ListingWithLocation[]> {
    const { data, error } = await supabase
      .from('flat_listings')
      .select(`
        *,
        locations (
          city,
          area
        )
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch owner listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Create a new listing
   */
  static async createListing(listingData: ListingInsert): Promise<ListingRow> {
    const { data, error } = await supabase
      .from('flat_listings')
      .insert(listingData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create listing: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing listing
   */
  static async updateListing(id: string, updates: ListingUpdate): Promise<ListingRow> {
    const { data, error } = await supabase
      .from('flat_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a listing
   */
  static async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('flat_listings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete listing: ${error.message}`);
    }
  }

  /**
   * Mark listing as rented
   */
  static async markAsRented(id: string): Promise<ListingRow> {
    return this.updateListing(id, { status: 'rented' });
  }

  /**
   * Search listings with filters
   */
  static async searchListings(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
    searchQuery?: string;
  }): Promise<ListingWithLocation[]> {
    let query = supabase
      .from('flat_listings')
      .select(`
        *,
        locations (
          city,
          area
        )
      `)
      .eq('status', 'active');

    // Apply filters
    if (filters.city) {
      query = query.eq('locations.city', filters.city);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('monthly_rent', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('monthly_rent', filters.maxPrice);
    }

    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType as 'apartment' | 'independent_house' | 'villa' | 'pg' | 'shared_room' | 'studio');
    }

    if (filters.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get featured listings
   */
  static async getFeaturedListings(limit: number = 6): Promise<ListingWithLocation[]> {
    const { data, error } = await supabase
      .from('flat_listings')
      .select(`
        *,
        locations (
          city,
          area
        )
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Transform database listing to FlatListing type
   */
  static transformToFlatListing(dbListing: ListingWithLocation): FlatListing {
    return {
      id: dbListing.id,
      title: dbListing.title,
      description: dbListing.description ?? "",
      location: {
        city: dbListing.locations?.city ?? "",
        area: dbListing.locations?.area ?? "",
        address: dbListing.address_line1 ?? "",
      },
      property: {
        type: dbListing.property_type,
        bedrooms: dbListing.bedrooms,
        bathrooms: dbListing.bathrooms,
        furnished: !!dbListing.is_furnished,
        parking: !!dbListing.parking_available,
      },
      rent: {
        amount: dbListing.monthly_rent,
        deposit: dbListing.security_deposit ?? 0,
        includes: dbListing.rent_includes ?? [],
      },
      amenities: dbListing.amenities ?? [],
      preferences: {
        gender: dbListing.preferred_gender ?? "any",
        profession: dbListing.preferred_professions ?? [],
        additionalRequirements: dbListing.lifestyle_preferences?.join(", ") ?? "",
      },
      contactPreferences: {
        whatsapp: !!dbListing.contact_whatsapp,
        call: !!dbListing.contact_phone,
        email: !!dbListing.contact_email,
      },
      images: dbListing.images ?? [],
      createdAt: dbListing.created_at ?? undefined,
      ownerId: dbListing.owner_id ?? undefined,
    };
  }

  /**
   * Transform FlatListing to database insert format
   */
  static transformToDbInsert(flatListing: FlatListing, ownerId: string): ListingInsert {
    return {
      owner_id: ownerId,
      title: flatListing.title,
      description: flatListing.description,
      property_type: flatListing.property.type as Database['public']['Enums']['property_type'],
      bedrooms: flatListing.property.bedrooms,
      bathrooms: flatListing.property.bathrooms,
      is_furnished: flatListing.property.furnished,
      parking_available: flatListing.property.parking,
      monthly_rent: flatListing.rent.amount,
      security_deposit: flatListing.rent.deposit || 0,
      rent_includes: flatListing.rent.includes,
      amenities: flatListing.amenities,
      preferred_gender: flatListing.preferences.gender as Database['public']['Enums']['gender_preference'],
      preferred_professions: flatListing.preferences.profession,
      lifestyle_preferences: flatListing.preferences.additionalRequirements ? [flatListing.preferences.additionalRequirements] : [],
      contact_phone: flatListing.contactPreferences.call,
      contact_whatsapp: flatListing.contactPreferences.whatsapp,
      contact_email: flatListing.contactPreferences.email,
      images: flatListing.images,
      address_line1: flatListing.location.address || `${flatListing.location.area}, ${flatListing.location.city}`,
      status: 'active',
    };
  }
}