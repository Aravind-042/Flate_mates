import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ListingService, type ListingWithLocation } from '@/services/listingService';
import type { FlatListing } from '@/types/flat';
import { toast } from 'sonner';

// Optimized Query Keys with hierarchical structure
export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  owner: (ownerId: string) => [...listingKeys.all, 'owner', ownerId] as const,
  featured: (limit?: number) => [...listingKeys.all, 'featured', { limit }] as const,
  search: (query: string, filters: Record<string, any>) => [...listingKeys.all, 'search', query, filters] as const,
  cities: () => [...listingKeys.all, 'cities'] as const,
  stats: () => [...listingKeys.all, 'stats'] as const,
};

// Optimized Hooks with better caching
export const useListings = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: listingKeys.lists(),
    queryFn: ListingService.getActiveListings,
    staleTime: 15 * 60 * 1000, // 15 minutes for listing data
    gcTime: 60 * 60 * 1000, // 1 hour cache
    enabled: options?.enabled ?? true,
    // Prefetch related data
    onSuccess: (data) => {
      // Extract and cache unique cities for filters
      const cities = Array.from(new Set(data.map(listing => listing.locations?.city).filter(Boolean)));
      queryClient.setQueryData(listingKeys.cities(), cities);
    },
  });
};

export const useListing = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => ListingService.getListingById(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes for individual listings
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    // Retry less aggressively for individual listings
    retry: 2,
  });
};

export const useOwnerListings = (ownerId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: listingKeys.owner(ownerId),
    queryFn: () => ListingService.getListingsByOwner(ownerId),
    enabled: (options?.enabled ?? true) && !!ownerId,
    staleTime: 5 * 60 * 1000, // 5 minutes for owner's own listings
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

export const useFeaturedListings = (limit?: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: listingKeys.featured(limit),
    queryFn: () => ListingService.getFeaturedListings(limit),
    staleTime: 20 * 60 * 1000, // 20 minutes for featured listings
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    enabled: options?.enabled ?? true,
  });
};

// Optimized search with debouncing and caching
export const useSearchListings = (
  filters: Parameters<typeof ListingService.searchListings>[0],
  options?: { enabled?: boolean; keepPreviousData?: boolean }
) => {
  return useQuery({
    queryKey: listingKeys.list(filters),
    queryFn: () => ListingService.searchListings(filters),
    enabled: (options?.enabled ?? true) && Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    keepPreviousData: options?.keepPreviousData ?? true, // Smooth transitions
  });
};

// Infinite query for pagination (future enhancement)
export const useInfiniteListings = (
  filters: Parameters<typeof ListingService.searchListings>[0] = {},
  pageSize: number = 20
) => {
  return useInfiniteQuery({
    queryKey: [...listingKeys.list(filters), 'infinite'],
    queryFn: ({ pageParam = 0 }) => 
      ListingService.getListingsWithPagination(filters, pageParam, pageSize),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === pageSize ? pages.length : undefined;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Optimized cities query for filters
export const useCities = () => {
  return useQuery({
    queryKey: listingKeys.cities(),
    queryFn: ListingService.getUniqueCities,
    staleTime: 60 * 60 * 1000, // 1 hour - cities don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours cache
  });
};

// Optimized Mutations with better cache management
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingData, ownerId }: { listingData: FlatListing; ownerId: string }) => {
      const dbData = ListingService.transformToDbInsert(listingData, ownerId);
      return ListingService.createListing(dbData);
    },
    onMutate: async ({ ownerId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listingKeys.owner(ownerId) });
      await queryClient.cancelQueries({ queryKey: listingKeys.lists() });
      
      // Snapshot previous value
      const previousOwnerListings = queryClient.getQueryData(listingKeys.owner(ownerId));
      const previousAllListings = queryClient.getQueryData(listingKeys.lists());
      
      return { previousOwnerListings, previousAllListings };
    },
    onSuccess: (data, variables, context) => {
      // Update specific caches
      queryClient.setQueryData(listingKeys.detail(data.id), data);
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(variables.ownerId) });
      queryClient.invalidateQueries({ queryKey: listingKeys.featured() });
      
      toast.success('Listing created successfully!');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousOwnerListings) {
        queryClient.setQueryData(listingKeys.owner(variables.ownerId), context.previousOwnerListings);
      }
      if (context?.previousAllListings) {
        queryClient.setQueryData(listingKeys.lists(), context.previousAllListings);
      }
      
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof ListingService.updateListing>[1] }) =>
      ListingService.updateListing(id, updates),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listingKeys.detail(id) });
      
      // Snapshot previous value
      const previousListing = queryClient.getQueryData(listingKeys.detail(id));
      
      return { previousListing };
    },
    onSuccess: (data, variables) => {
      // Update the specific listing in cache
      queryClient.setQueryData(listingKeys.detail(data.id), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(data.owner_id) });
      
      toast.success('Listing updated successfully!');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousListing) {
        queryClient.setQueryData(listingKeys.detail(variables.id), context.previousListing);
      }
      
      toast.error(`Failed to update listing: ${error.message}`);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingService.deleteListing,
    onMutate: async (listingId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listingKeys.detail(listingId) });
      
      // Snapshot previous value
      const previousListing = queryClient.getQueryData(listingKeys.detail(listingId));
      
      return { previousListing };
    },
    onSuccess: (_, listingId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: listingKeys.detail(listingId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      
      toast.success('Listing deleted successfully!');
    },
    onError: (error, listingId, context) => {
      // Rollback on error
      if (context?.previousListing) {
        queryClient.setQueryData(listingKeys.detail(listingId), context.previousListing);
      }
      
      toast.error(`Failed to delete listing: ${error.message}`);
    },
  });
};

export const useMarkAsRented = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingService.markAsRented,
    onMutate: async (listingId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listingKeys.detail(listingId) });
      
      // Optimistically update the listing status
      const previousListing = queryClient.getQueryData(listingKeys.detail(listingId));
      if (previousListing) {
        queryClient.setQueryData(listingKeys.detail(listingId), {
          ...previousListing,
          status: 'rented'
        });
      }
      
      return { previousListing };
    },
    onSuccess: (data) => {
      // Update the specific listing in cache
      queryClient.setQueryData(listingKeys.detail(data.id), data);
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(data.owner_id) });
      
      toast.success('Listing marked as rented!');
    },
    onError: (error, listingId, context) => {
      // Rollback on error
      if (context?.previousListing) {
        queryClient.setQueryData(listingKeys.detail(listingId), context.previousListing);
      }
      
      toast.error(`Failed to mark as rented: ${error.message}`);
    },
  });
};

// Prefetch utilities for better UX
export const usePrefetchListing = () => {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: listingKeys.detail(id),
      queryFn: () => ListingService.getListingById(id),
      staleTime: 30 * 60 * 1000,
    });
  };
};

export const usePrefetchOwnerListings = () => {
  const queryClient = useQueryClient();
  
  return (ownerId: string) => {
    queryClient.prefetchQuery({
      queryKey: listingKeys.owner(ownerId),
      queryFn: () => ListingService.getListingsByOwner(ownerId),
      staleTime: 5 * 60 * 1000,
    });
  };
};