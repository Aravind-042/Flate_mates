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

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export class ListingService {
  // Optimized base query with consistent select fields
  private static getBaseQuery() {
    return supabase
      .from('flat_listings')
      .select(`
        id,
        title,
        description,
        property_type,
        bedrooms,
        bathrooms,
        monthly_rent,
        security_deposit,
        is_furnished,
        parking_available,
        amenities,
        address_line1,
        address_line2,
        images,
        owner_id,
        created_at,
        updated_at,
        status,
        preferred_gender,
        preferred_professions,
        lifestyle_preferences,
        contact_phone,
        contact_whatsapp,
        contact_email,
        rent_includes,
        locations (
          city,
          area
        )
      `);
  }

  /**
   * Fetch all active listings with optimized query
   */
  static async getActiveListings(): Promise<ListingWithLocation[]> {
    const cacheKey = 'active_listings';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.getBaseQuery()
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(100); // Reasonable limit to prevent large payloads

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    const result = data || [];
    setCachedData(cacheKey, result, 10 * 60 * 1000); // 10 minute cache
    return result;
  }

  /**
   * Fetch a single listing by ID with caching
   */
  static async getListingById(id: string): Promise<ListingWithLocation | null> {
    const cacheKey = `listing_${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.getBaseQuery()
      .eq('id', id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch listing: ${error.message}`);
    }

    setCachedData(cacheKey, data, 30 * 60 * 1000); // 30 minute cache
    return data;
  }

  /**
   * Fetch listings by owner ID
   */
  static async getListingsByOwner(ownerId: string): Promise<ListingWithLocation[]> {
    const cacheKey = `owner_listings_${ownerId}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.getBaseQuery()
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch owner listings: ${error.message}`);
    }

    const result = data || [];
    setCachedData(cacheKey, result, 5 * 60 * 1000); // 5 minute cache
    return result;
  }

  /**
   * Get featured listings with caching
   */
  static async getFeaturedListings(limit: number = 6): Promise<ListingWithLocation[]> {
    const cacheKey = `featured_listings_${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.getBaseQuery()
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured listings: ${error.message}`);
    }

    const result = data || [];
    setCachedData(cacheKey, result, 20 * 60 * 1000); // 20 minute cache
    return result;
  }

  /**
   * Get unique cities for filter dropdown
   */
  static async getUniqueCities(): Promise<string[]> {
    const cacheKey = 'unique_cities';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('locations')
      .select('city')
      .order('city');

    if (error) {
      throw new Error(`Failed to fetch cities: ${error.message}`);
    }

    const cities = Array.from(new Set(data?.map(item => item.city).filter(Boolean))) || [];
    setCachedData(cacheKey, cities, 60 * 60 * 1000); // 1 hour cache
    return cities;
  }

  /**
   * Optimized search with better query construction
   */
  static async searchListings(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
    searchQuery?: string;
  }): Promise<ListingWithLocation[]> {
    const cacheKey = `search_${JSON.stringify(filters)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    let query = this.getBaseQuery().eq('status', 'active');

    // Apply filters efficiently
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
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.searchQuery) {
      // Use full-text search for better performance
      query = query.textSearch('search_vector', filters.searchQuery, {
        type: 'websearch',
        config: 'english'
      });
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50); // Reasonable limit for search results

    if (error) {
      throw new Error(`Failed to search listings: ${error.message}`);
    }

    const result = data || [];
    setCachedData(cacheKey, result, 5 * 60 * 1000); // 5 minute cache
    return result;
  }

  /**
   * Paginated listings for infinite scroll (future enhancement)
   */
  static async getListingsWithPagination(
    filters: Parameters<typeof this.searchListings>[0] = {},
    page: number = 0,
    pageSize: number = 20
  ): Promise<ListingWithLocation[]> {
    let query = this.getBaseQuery().eq('status', 'active');

    // Apply filters (same as search)
    if (filters.city) query = query.eq('locations.city', filters.city);
    if (filters.minPrice !== undefined) query = query.gte('monthly_rent', filters.minPrice);
    if (filters.maxPrice !== undefined) query = query.lte('monthly_rent', filters.maxPrice);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.bedrooms !== undefined) query = query.eq('bedrooms', filters.bedrooms);
    if (filters.searchQuery) {
      query = query.textSearch('search_vector', filters.searchQuery, {
        type: 'websearch',
        config: 'english'
      });
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      throw new Error(`Failed to fetch paginated listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Create a new listing with cache invalidation
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

    // Invalidate relevant caches
    this.invalidateCache(['active_listings', `owner_listings_${listingData.owner_id}`, 'featured_listings']);

    return data;
  }

  /**
   * Update an existing listing with cache invalidation
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

    // Invalidate relevant caches
    this.invalidateCache([`listing_${id}`, 'active_listings', `owner_listings_${data.owner_id}`]);

    return data;
  }

  /**
   * Delete a listing with cache invalidation
   */
  static async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('flat_listings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete listing: ${error.message}`);
    }

    // Invalidate relevant caches
    this.invalidateCache([`listing_${id}`, 'active_listings']);
  }

  /**
   * Mark listing as rented
   */
  static async markAsRented(id: string): Promise<ListingRow> {
    return this.updateListing(id, { status: 'rented' });
  }

  /**
   * Cache invalidation utility
   */
  private static invalidateCache(keys: string[]) {
    keys.forEach(key => {
      // Remove exact matches
      cache.delete(key);
      
      // Remove pattern matches (for dynamic keys)
      for (const cacheKey of cache.keys()) {
        if (key.includes('*') && cacheKey.includes(key.replace('*', ''))) {
          cache.delete(cacheKey);
        }
      }
    });
  }

  /**
   * Clear all cache (utility for development)
   */
  static clearCache() {
    cache.clear();
  }

  /**
   * Transform database listing to FlatListing type (optimized)
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
   * Transform FlatListing to database insert format (optimized)
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