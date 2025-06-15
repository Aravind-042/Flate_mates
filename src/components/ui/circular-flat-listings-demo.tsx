
import React from "react";
import { CircularFlatListings } from '@/components/ui/circular-flat-listings';

interface CircularFlatListingsDemoProps {
  listings?: any[];
}

export const CircularFlatListingsDemo = ({ listings = [] }: CircularFlatListingsDemoProps) => {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal">
          Featured Properties
        </h2>
        <p className="text-lg text-charcoal max-w-2xl mx-auto">
          Discover your perfect flat from our curated selection of premium properties.
        </p>
      </div>
      
      <div className="flex justify-center">
        <CircularFlatListings
          listings={listings}
          autoplay={true}
          colors={{
            background: "#f7f7fa",
            cardBackground: "#ffffff",
            titleColor: "#1a1a1a",
            textColor: "#6b7280",
            priceColor: "#059669",
            arrowBackground: "#141414",
            arrowForeground: "#f1f1f7",
            arrowHoverBackground: "#00A6FB",
          }}
        />
      </div>
    </section>
  );
};
