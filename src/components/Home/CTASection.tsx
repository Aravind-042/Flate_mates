
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button as NeonButton } from "@/components/ui/neon-button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const CTASection = () => {
  const { user, profile } = useAuth();

  const handleCreateListingClick = () => {
    if (!user) {
      toast.info("Sign up to create your own flat listing and find the perfect flatmate!");
    }
  };

  return (
    <section className="relative py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-deep-blue via-orange to-emerald border-0 rounded-3xl shadow-2xl overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            <div className="text-white">
              <UserPlus className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Got a Flat to Share?
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
                Join thousands of flat owners who found their perfect flatmates through our platform.
              </p>
              
              <div className="flex justify-center">
                {user && profile?.role === 'flat_owner' ? (
                  <Link to="/create-listing">
                    <NeonButton 
                      variant="ghost" 
                      size="lg"
                      className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold bg-white text-deep-blue hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span className="hidden sm:inline">Create Your Listing</span>
                      <span className="sm:hidden">Create Listing</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </NeonButton>
                  </Link>
                ) : (
                  <NeonButton 
                    variant="ghost" 
                    size="lg"
                    className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold bg-white text-deep-blue hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200"
                    onClick={handleCreateListingClick}
                  >
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Get Started
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </NeonButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
