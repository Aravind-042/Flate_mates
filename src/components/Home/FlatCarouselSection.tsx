
import { memo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useMediaQuery } from "@/components/ui/3d-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car } from "lucide-react";
import { Link } from "react-router-dom";

interface FlatListing {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  security_deposit: number | null;
  is_furnished: boolean | null;
  parking_available: boolean | null;
  amenities: string[] | null;
  address_line1: string;
  address_line2: string | null;
  images: string[] | null;
  owner_id: string;
  created_at: string;
  locations?: {
    city: string;
    area: string;
  };
}

interface FlatCarouselProps {
  listings: FlatListing[];
}

const duration = 0.15;
const transition = { duration, ease: [0.32, 0.72, 0, 1] };
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] };

const FlatCarousel = memo(
  ({
    handleClick,
    controls,
    listings,
    isCarouselActive,
  }: {
    handleClick: (listing: FlatListing, index: number) => void;
    controls: any;
    listings: FlatListing[];
    isCarouselActive: boolean;
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800;
    const faceCount = listings.length;
    const faceWidth = cylinderWidth / faceCount;
    const radius = cylinderWidth / (2 * Math.PI);
    const rotation = useMotionValue(0);
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    );

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {listings.map((listing, i) => (
            <motion.div
              key={`listing-${listing.id}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(listing, i)}
            >
              <Card className="w-full h-full bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-1/2">
                  {listing.images && listing.images.length > 0 ? (
                    <motion.img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      initial={{ filter: "blur(4px)" }}
                      animate={{ filter: "blur(0px)" }}
                      transition={transition}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-coral-100 to-violet-100 flex items-center justify-center">
                      <span className="text-coral-500 text-sm">No Image</span>
                    </div>
                  )}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-coral-100 text-coral-700 border-0 text-xs"
                  >
                    {listing.property_type.replace('_', ' ')}
                  </Badge>
                </div>
                <CardContent className="p-3 h-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-charcoal line-clamp-1 mb-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-xs text-charcoal mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">
                        {listing.locations?.area && listing.locations?.city 
                          ? `${listing.locations.area}, ${listing.locations.city}`
                          : listing.address_line1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-charcoal mb-2">
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        <span>{listing.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        <span>{listing.bathrooms}</span>
                      </div>
                      {listing.parking_available && (
                        <Car className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-charcoal">
                      ₹{listing.monthly_rent.toLocaleString()}
                    </div>
                    <div className="text-xs text-charcoal">per month</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }
);

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
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={handleClose}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                style={{ willChange: "opacity" }}
                transition={transitionOverlay}
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-charcoal">{activeListing.title}</h3>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  {activeListing.images && activeListing.images.length > 0 && (
                    <img
                      src={activeListing.images[0]}
                      alt={activeListing.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-charcoal">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {activeListing.locations?.area && activeListing.locations?.city 
                          ? `${activeListing.locations.area}, ${activeListing.locations.city}`
                          : activeListing.address_line1}
                      </span>
                    </div>
                    
                    {activeListing.description && (
                      <p className="text-charcoal">{activeListing.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-charcoal">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{activeListing.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{activeListing.bathrooms} Baths</span>
                        </div>
                        {activeListing.parking_available && (
                          <div className="flex items-center">
                            <Car className="h-4 w-4 mr-1" />
                            <span>Parking</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-charcoal">
                          ₹{activeListing.monthly_rent.toLocaleString()}
                        </div>
                        <div className="text-sm text-charcoal">per month</div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link
                        to={`/flat/${activeListing.id}`}
                        className="w-full bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 inline-block text-center"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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
