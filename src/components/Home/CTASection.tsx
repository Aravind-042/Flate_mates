
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button as NeonButton } from "@/components/ui/neon-button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const CTASection = () => {
  const { user } = useAuth();

  const handleCreateListingClick = () => {
    if (!user) {
      toast.info("Sign up to create your own flat listing and find the perfect flatmate!");
    }
  };

  return (
    <section className="relative py-8 sm:py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-deep-blue via-orange to-emerald border-0 rounded-3xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <div className="text-white">
              <UserPlus className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                Got a Flat to Share?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2 sm:px-4">
                Join thousands of flat owners who found their perfect flatmates through our platform.
              </p>
              
              <div className="flex justify-center">
                {user ? (
                  <Link to="/create-listing">
                    <NeonButton 
                      variant="ghost" 
                      size="lg"
                      className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-bold bg-white text-deep-blue hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200 rounded-xl"
                    >
                      <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:hidden sm:inline">Create Your Listing</span>
                      <span className="sm:hidden">Create Listing</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                    </NeonButton>
                  </Link>
                ) : (
                  <NeonButton 
                    variant="ghost" 
                    size="lg"
                    className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-bold bg-white text-deep-blue hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200 rounded-xl"
                    onClick={handleCreateListingClick}
                  >
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden xs:hidden sm:inline">Get Started Today</span>
                    <span className="sm:hidden">Get Started</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
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
