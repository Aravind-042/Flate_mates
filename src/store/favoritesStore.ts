
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FavoriteItem {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
}

interface FavoritesState {
  favorites: Set<string>;
  favoriteItems: FavoriteItem[];
  isLoading: boolean;
  
  // Actions
  addToFavorites: (listingId: string) => Promise<void>;
  removeFromFavorites: (listingId: string) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
  loadFavorites: (userId?: string) => Promise<void>;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: new Set<string>(),
        favoriteItems: [],
        isLoading: false,

        addToFavorites: async (listingId: string) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            toast.error('Please sign in to add favorites');
            return;
          }

          try {
            set({ isLoading: true });
            
            const { error } = await supabase
              .from('user_favorites')
              .insert({ user_id: user.id, listing_id: listingId });

            if (error) throw error;

            set((state) => ({
              favorites: new Set([...state.favorites, listingId]),
              isLoading: false
            }));

            toast.success('Added to favorites');
          } catch (error) {
            console.error('Error adding to favorites:', error);
            toast.error('Failed to add to favorites');
            set({ isLoading: false });
          }
        },

        removeFromFavorites: async (listingId: string) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          try {
            set({ isLoading: true });
            
            const { error } = await supabase
              .from('user_favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('listing_id', listingId);

            if (error) throw error;

            set((state) => {
              const newFavorites = new Set(state.favorites);
              newFavorites.delete(listingId);
              return {
                favorites: newFavorites,
                favoriteItems: state.favoriteItems.filter(item => item.listing_id !== listingId),
                isLoading: false
              };
            });

            toast.success('Removed from favorites');
          } catch (error) {
            console.error('Error removing from favorites:', error);
            toast.error('Failed to remove from favorites');
            set({ isLoading: false });
          }
        },

        toggleFavorite: async (listingId: string) => {
          const { favorites } = get();
          
          if (favorites.has(listingId)) {
            await get().removeFromFavorites(listingId);
          } else {
            await get().addToFavorites(listingId);
          }
        },

        isFavorite: (listingId: string) => {
          return get().favorites.has(listingId);
        },

        loadFavorites: async (userId?: string) => {
          if (!userId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            userId = user.id;
          }

          try {
            set({ isLoading: true });
            
            const { data, error } = await supabase
              .from('user_favorites')
              .select('*')
              .eq('user_id', userId);

            if (error) throw error;

            const favoriteIds = new Set(data?.map(item => item.listing_id) || []);
            
            set({
              favorites: favoriteIds,
              favoriteItems: data || [],
              isLoading: false
            });
          } catch (error) {
            console.error('Error loading favorites:', error);
            set({ isLoading: false });
          }
        },

        clearFavorites: () => {
          set({ favorites: new Set(), favoriteItems: [], isLoading: false });
        }
      }),
      {
        name: 'favorites-storage',
        partialize: (state) => ({ 
          favorites: Array.from(state.favorites),
          favoriteItems: state.favoriteItems 
        }),
        onRehydrateStorage: () => (state) => {
          if (state && Array.isArray(state.favorites)) {
            state.favorites = new Set(state.favorites);
          }
        }
      }
    ),
    { name: 'favorites-store' }
  )
);
