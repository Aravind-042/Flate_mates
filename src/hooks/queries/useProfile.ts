import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/services/profileService';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Query Keys
export const profileKeys = {
  all: ['profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  byCity: (city: string) => [...profileKeys.all, 'city', city] as const,
  byProfession: (profession: string) => [...profileKeys.all, 'profession', profession] as const,
  verified: () => [...profileKeys.all, 'verified'] as const,
};

// Hooks
export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => ProfileService.getProfile(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if profile doesn't exist
      if (error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useProfilesByCity = (city: string) => {
  return useQuery({
    queryKey: profileKeys.byCity(city),
    queryFn: () => ProfileService.getProfilesByCity(city),
    enabled: !!city,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useProfilesByProfession = (profession: string) => {
  return useQuery({
    queryKey: profileKeys.byProfession(profession),
    queryFn: () => ProfileService.searchProfilesByProfession(profession),
    enabled: !!profession,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useVerifiedProfiles = () => {
  return useQuery({
    queryKey: profileKeys.verified(),
    queryFn: ProfileService.getVerifiedProfiles,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: ProfileUpdate }) =>
      ProfileService.updateProfile(userId, updates),
    onSuccess: (data) => {
      // Update the profile in cache
      queryClient.setQueryData(profileKeys.detail(data.id), data);
      // Invalidate related queries
      if (data.city) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byCity(data.city) });
      }
      if (data.profession) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byProfession(data.profession) });
      }
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

export const useUpdateVerificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isVerified }: { userId: string; isVerified: boolean }) =>
      ProfileService.updateVerificationStatus(userId, isVerified),
    onSuccess: (data) => {
      // Update the profile in cache
      queryClient.setQueryData(profileKeys.detail(data.id), data);
      // Invalidate verified profiles list
      queryClient.invalidateQueries({ queryKey: profileKeys.verified() });
      toast.success(`Profile ${data.is_verified ? 'verified' : 'unverified'} successfully!`);
    },
    onError: (error) => {
      toast.error(`Failed to update verification status: ${error.message}`);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.deleteProfile,
    onSuccess: (_, userId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: profileKeys.detail(userId) });
      // Invalidate all profile lists
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('Profile deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
    },
  });
};