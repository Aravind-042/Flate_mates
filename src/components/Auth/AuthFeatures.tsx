
import { Shield, Heart, Home } from "lucide-react";

export const AuthFeatures = () => {
  const features = [
    { icon: Shield, text: "Secure & Verified" },
    { icon: Heart, text: "Perfect Matches" },
    { icon: Home, text: "Find Your Home" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50">
            <Icon className="h-4 w-4 text-deep-blue" />
            <span className="text-sm font-medium text-charcoal">{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
};
