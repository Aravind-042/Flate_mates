
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const AccessRestricted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="glass-card">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-charcoal mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be a "Flat Owner" or have "Both" roles to create listings.
              Please update your role in your profile settings.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-xl"
              >
                Go to Profile Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/browse')}
                className="border-2 border-light-slate rounded-xl text-charcoal hover:text-deep-blue"
              >
                Browse Listings Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
