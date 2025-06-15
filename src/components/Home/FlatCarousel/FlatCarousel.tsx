
import { memo, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car } from "lucide-react";
import { FlatCarouselComponentProps } from "./types";
import { transition } from "./constants";

export const FlatCarousel = memo(
  ({
    handleClick,
    controls,
    listings,
    isCarouselActive,
  }: FlatCarouselComponentProps) => {
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

    // Auto rotation effect
    useAnimationFrame((time) => {
      if (isCarouselActive && listings.length > 0) {
        // Rotate at 0.1 degrees per frame (adjust speed as needed)
        rotation.set(rotation.get() + 0.1);
      }
    });

    // Reset rotation when carousel becomes inactive
    useEffect(() => {
      if (!isCarouselActive) {
        // Optionally stop at current position when user interacts
        controls.stop();
      }
    }, [isCarouselActive, controls]);

    // Calculate scale and opacity based on position
    const getScaleAndOpacity = (index: number, rotationValue: number) => {
      const angle = (index * (360 / faceCount) + rotationValue) % 360;
      // Normalize angle to -180 to 180
      const normalizedAngle = ((angle + 180) % 360) - 180;
      // Calculate how close the tile is to the front center (0 degrees)
      const distanceFromCenter = Math.abs(normalizedAngle) / 180;
      // Scale from 1.2 (front center) to 0.7 (back)
      const scale = 1.2 - (distanceFromCenter * 0.5);
      // Opacity from 1 (front) to 0.6 (back)
      const opacity = 1 - (distanceFromCenter * 0.4);
      return { scale: Math.max(scale, 0.7), opacity: Math.max(opacity, 0.6) };
    };

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
          {listings.map((listing, i) => {
            const { scale, opacity } = getScaleAndOpacity(i, rotation.get());
            
            return (
              <motion.div
                key={`listing-${listing.id}-${i}`}
                className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${
                    i * (360 / faceCount)
                  }deg) translateZ(${radius}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: Math.round((1 - Math.abs(((i * (360 / faceCount) + rotation.get()) % 360 - 180) / 180)) * 100),
                }}
                onClick={() => handleClick(listing, i)}
              >
                <Card className="w-full h-full bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
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
            );
          })}
        </motion.div>
      </div>
    );
  }
);
