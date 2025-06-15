
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "Find flatmates based on your preferences and lifestyle"
  },
  {
    icon: Shield,
    title: "Verified Profiles", 
    description: "All users are verified for your safety and security"
  },
  {
    icon: Heart,
    title: "Perfect Compatibility",
    description: "Advanced filters to find your ideal living companion"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="relative py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-charcoal">
            Why Choose FlatMates?
          </h2>
          <p className="text-base sm:text-lg text-charcoal max-w-2xl mx-auto px-4">
            We make finding the perfect flatmate simple, safe, and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-deep-blue to-orange p-3 sm:p-4 rounded-2xl shadow-xl inline-block">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-charcoal mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
