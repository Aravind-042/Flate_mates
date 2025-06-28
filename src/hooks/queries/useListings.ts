import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ListingService, type ListingWithLocation } from '@/services/listingService';
import type { FlatListing } from '@/types/flat';
import { toast } from 'sonner';

// Query Keys
export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters: string) => [...listingKeys.lists(), { filters }] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  owner: (ownerId: string) => [...listingKeys.all, 'owner', ownerId] as const,
  featured: () => [...listingKeys.all, 'featured'] as const,
};

// Hooks
export const useListings = () => {
  return useQuery({
    queryKey: listingKeys.lists(),
    queryFn: ListingService.getActiveListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => ListingService.getListingById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOwnerListings = (ownerId: string) => {
  return useQuery({
    queryKey: listingKeys.owner(ownerId),
    queryFn: () => ListingService.getListingsByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useFeaturedListings = (limit?: number) => {
  return useQuery({
    queryKey: [...listingKeys.featured(), { limit }],
    queryFn: () => ListingService.getFeaturedListings(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSearchListings = (filters: Parameters<typeof ListingService.searchListings>[0]) => {
  return useQuery({
    queryKey: listingKeys.list(JSON.stringify(filters)),
    queryFn: () => ListingService.searchListings(filters),
    enabled: Object.keys(filters).length > 0,
  });
};

// Mutations
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingData, ownerId }: { listingData: FlatListing; ownerId: string }) => {
      const dbData = ListingService.transformToDbInsert(listingData, ownerId);
      return ListingService.createListing(dbData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch listings
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(variables.ownerId) });
      toast.success('Listing created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof ListingService.updateListing>[1] }) =>
      ListingService.updateListing(id, updates),
    onSuccess: (data) => {
      // Update the specific listing in cache
      queryClient.setQueryData(listingKeys.detail(data.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(data.owner_id) });
      toast.success('Listing updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update listing: ${error.message}`);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingService.deleteListing,
    onSuccess: (_, listingId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: listingKeys.detail(listingId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success('Listing deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete listing: ${error.message}`);
    },
  });
};

export const useMarkAsRented = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingService.markAsRented,
    onSuccess: (data) => {
      // Update the specific listing in cache
      queryClient.setQueryData(listingKeys.detail(data.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.owner(data.owner_id) });
      toast.success('Listing marked as rented!');
    },
    onError: (error) => {
      toast.error(`Failed to mark as rented: ${error.message}`);
    },
  });
};