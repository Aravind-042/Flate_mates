import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="card-primary max-w-lg w-full">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">404</span>
            </div>
            <h1 className="text-heading-1 text-slate-800 mb-4">Page Not Found</h1>
            <p className="text-body text-slate-600 mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="btn-primary w-full"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Button>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate(-1)}
                className="btn-outline flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => navigate('/browse')}
                className="btn-outline flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Flats
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-body-small text-blue-700">
              <strong>Need help?</strong> Try searching for flats or creating a new listing to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;