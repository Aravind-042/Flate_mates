
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
} from "framer-motion";
import { FlatCarousel } from "./FlatCarousel/FlatCarousel";
import { FlatCarouselModal } from "./FlatCarousel/FlatCarouselModal";
import { FlatCarouselProps, FlatListing } from "./FlatCarousel/types";

export const FlatCarouselSection = ({ listings }: FlatCarouselProps) => {
  const [activeListing, setActiveListing] = useState<FlatListing | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const controls = useAnimation();

  if (!listings || listings.length === 0) {
    return null;
  }

  const handleClick = (listing: FlatListing) => {
    setActiveListing(listing);
    setIsCarouselActive(false);
    controls.stop();
  };

  const handleClose = () => {
    setActiveListing(null);
    setIsCarouselActive(true);
  };

  return (
    <section className="relative py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-charcoal">
            Explore in 3D
          </h2>
          <p className="text-base sm:text-lg text-charcoal max-w-2xl mx-auto px-4">
            Discover amazing flat sharing opportunities in an immersive 3D carousel experience.
          </p>
        </div>

        <motion.div layout className="relative">
          <AnimatePresence mode="sync">
            {activeListing && (
              <FlatCarouselModal
                activeListing={activeListing}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>
          
          <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
            <FlatCarousel
              handleClick={handleClick}
              controls={controls}
              listings={listings}
              isCarouselActive={isCarouselActive}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
