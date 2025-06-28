import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    },
    mutations: {
      retry: 1,
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
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;