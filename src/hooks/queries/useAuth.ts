import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService, type SignUpData, type SignInData } from '@/services/authService';
import { toast } from 'sonner';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hooks
export const useCurrentSession = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: AuthService.getCurrentSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: AuthService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Mutations
export const useSignUp = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpData) => AuthService.signUp(data),
    onSuccess: (data) => {
      // Update auth cache
      queryClient.setQueryData(authKeys.session(), data.session);
      queryClient.setQueryData(authKeys.user(), data.user);
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists. Please sign in instead.');
      } else if (error.message.includes('Invalid email')) {
        toast.error('Please enter a valid email address.');
      } else if (error.message.includes('Password')) {
        toast.error('Password must be at least 6 characters long.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    },
  });
};

export const useSignIn = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => AuthService.signIn(data),
    onSuccess: (data) => {
      // Update auth cache
      queryClient.setQueryData(authKeys.session(), data.session);
      queryClient.setQueryData(authKeys.user(), data.user);
      
      toast.success('Welcome back!');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address before signing in.');
      } else if (error.message.includes('Too many requests')) {
        toast.error('Too many login attempts. Please wait a moment and try again.');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.signOut,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      toast.success('Signed out successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to sign out: ${error.message}`);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (newPassword: string) => AuthService.updatePassword(newPassword),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update password: ${error.message}`);
    },
  });
};

export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: (newEmail: string) => AuthService.updateEmail(newEmail),
    onSuccess: () => {
      toast.success('Email update initiated. Please verify via your inbox.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update email: ${error.message}`);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.resetPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reset email: ${error.message}`);
    },
  });
};