
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Modal states
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Navigation state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Search and filters
  searchFilters: {
    city: string;
    priceRange: [number, number];
    propertyType: string;
    bedrooms: number | null;
  };
  setSearchFilters: (filters: Partial<UIState['searchFilters']>) => void;
  resetSearchFilters: () => void;
  
  // Performance optimizations
  imageLoadingPriority: 'eager' | 'lazy';
  setImageLoadingPriority: (priority: 'eager' | 'lazy') => void;
  
  // Animation preferences
  enableAnimations: boolean;
  setEnableAnimations: (enable: boolean) => void;
  
  // Notification state
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const defaultSearchFilters = {
  city: '',
  priceRange: [0, 100000] as [number, number],
  propertyType: '',
  bedrooms: null,
};

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Modal states
      authModalOpen: false,
      setAuthModalOpen: (open) => set({ authModalOpen: open }),
      
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Loading states
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      // Navigation
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Search and filters
      searchFilters: defaultSearchFilters,
      setSearchFilters: (filters) => 
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters }
        })),
      resetSearchFilters: () => set({ searchFilters: defaultSearchFilters }),
      
      // Performance optimizations
      imageLoadingPriority: 'lazy',
      setImageLoadingPriority: (priority) => set({ imageLoadingPriority: priority }),
      
      // Animation preferences
      enableAnimations: true,
      setEnableAnimations: (enable) => set({ enableAnimations: enable }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id, timestamp }]
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-store',
    }
  )
);
