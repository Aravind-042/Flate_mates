
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { WalkingLoader } from "@/components/ui/walking-loader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";

// Direct imports instead of lazy loading to fix the loading issue
import Index from "./pages/Index";
import About from "./pages/About";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import FlatDetail from "./pages/FlatDetail";
import NotFound from "./pages/NotFound";
import { AuthPage } from "@/components/AuthPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component for Suspense fallback with timeout
const PageLoader = () => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 10000); // Show timeout message after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!showTimeoutMessage ? (
        <WalkingLoader size="md" speed="normal" text="Loading your page..." />
      ) : (
        <div className="text-center space-y-4">
          <WalkingLoader size="sm" speed="fast" text="Still loading..." />
          <div className="text-muted-foreground max-w-md">
            <p>This is taking longer than expected.</p>
            <p className="text-sm mt-2">Try refreshing the page or check your internet connection.</p>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <DatabaseSetup />
            <Routes>
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
                <Route path="auth" element={<AuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
