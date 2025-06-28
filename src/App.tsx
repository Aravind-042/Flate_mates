import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import FlatDetail from "./pages/FlatDetail";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthPage } from "@/components/AuthPage";
import { Layout } from "@/components/Layout";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Aggressive caching for better performance
      staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
      
      // Smart retry logic
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors (401, 403)
        if (error?.status === 401 || error?.status === 403) return false;
        // Don't retry on client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) return false;
        // Retry up to 3 times for server errors and network issues
        return failureCount < 3;
      },
      
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Enable background refetching for better UX
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      
      // Reduce network requests when data is fresh
      refetchOnMount: (query) => {
        // Only refetch if data is older than 5 minutes
        return Date.now() - (query.state.dataUpdatedAt || 0) > 5 * 60 * 1000;
      },
    },
    mutations: {
      // Retry mutations once for network issues
      retry: (failureCount, error: any) => {
        // Don't retry validation errors
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 1;
      },
      
      // Optimistic updates for better UX
      onMutate: () => {
        // Cancel outgoing refetches to avoid overwriting optimistic updates
        return { previousData: null };
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <DatabaseSetup />
            <Routes>
              {/* Auth page without layout (no navigation) */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* All other pages with layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="about" element={<About />} />
                <Route path="browse" element={<Browse />} />
                <Route path="flat/:id" element={<FlatDetail />} />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="create-listing" element={<CreateListing />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          
          {/* React Query DevTools for development */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;