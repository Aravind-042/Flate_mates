
"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

interface Colors {
  background?: string;
  cardBackground?: string;
  titleColor?: string;
  textColor?: string;
  priceColor?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface CircularFlatListingsProps {
  listings: FlatListing[];
  autoplay?: boolean;
  colors?: Colors;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularFlatListings = ({
  listings,
  autoplay = true,
  colors = {},
}: CircularFlatListingsProps) => {
  const { user } = useAuth();
  
  // Color config
  const colorBackground = colors.background ?? "#f7f7fa";
  const colorCardBg = colors.cardBackground ?? "#ffffff";
  const colorTitle = colors.titleColor ?? "#1a1a1a";
  const colorText = colors.textColor ?? "#6b7280";
  const colorPrice = colors.priceColor ?? "#059669";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const listingsLength = useMemo(() => listings.length, [listings]);
  const activeListing = useMemo(
    () => listings[activeIndex],
    [activeIndex, listings]
  );

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay && listingsLength > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % listingsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, listingsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % listingsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [listingsLength]);
  
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + listingsLength) % listingsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [listingsLength]);

  const handleConnectClick = () => {
    if (!user) {
      toast.info("Sign up to connect with flat owners and start your journey!");
    }
  };

  // Compute transforms for each image
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + listingsLength) % listingsLength === index;
    const isRight = (activeIndex + 1) % listingsLength === index;
    
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div className="flat-listings-container" style={{ backgroundColor: colorBackground }}>
      <div className="flat-listings-grid">
        {/* Images */}
        <div className="image-container" ref={imageContainerRef}>
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="listing-image-card"
              style={{
                ...getImageStyle(index),
                backgroundColor: colorCardBg,
              }}
            >
              {listing.images && listing.images.length > 0 ? (
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="listing-image"
                />
              ) : (
                <div className="listing-image-placeholder">
                  <MapPin className="h-16 w-16 text-coral-400" />
                </div>
              )}
              <Badge 
                variant="secondary" 
                className="property-type-badge"
              >
                {listing.property_type.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="flat-listings-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="listing-title" style={{ color: colorTitle }}>
                {activeListing.title}
              </h3>
              
              <div className="listing-location" style={{ color: colorText }}>
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {activeListing.locations?.area && activeListing.locations?.city 
                    ? `${activeListing.locations.area}, ${activeListing.locations.city}`
                    : activeListing.address_line1}
                </span>
              </div>

              <div className="listing-details" style={{ color: colorText }}>
                <div className="detail-item">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{activeListing.bedrooms} Bed</span>
                </div>
                <div className="detail-item">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{activeListing.bathrooms} Bath</span>
                </div>
                {activeListing.parking_available && (
                  <div className="detail-item">
                    <Car className="h-4 w-4 mr-1" />
                    <span>Parking</span>
                  </div>
                )}
              </div>

              {activeListing.description && (
                <p className="listing-description" style={{ color: colorText }}>
                  {activeListing.description.length > 120 
                    ? activeListing.description.substring(0, 120) + "..." 
                    : activeListing.description}
                </p>
              )}

              <div className="listing-price" style={{ color: colorPrice }}>
                ₹{activeListing.monthly_rent.toLocaleString()}
                <span className="price-period">/month</span>
              </div>

              <div className="listing-action">
                {user ? (
                  <Link to="/browse">
                    <Button className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl">
                      View Details
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
                    onClick={handleConnectClick}
                  >
                    Connect Now
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="arrow-buttons">
            <button
              className="arrow-button prev-button"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous listing"
            >
              <FaArrowLeft size={28} color={colorArrowFg} />
            </button>
            <button
              className="arrow-button next-button"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next listing"
            >
              <FaArrowRight size={28} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .flat-listings-container {
          width: 100%;
          max-width: 56rem;
          padding: 2rem;
          border-radius: 1rem;
          margin: 2rem 0;
        }
        .flat-listings-grid {
          display: grid;
          gap: 5rem;
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 24rem;
          perspective: 1000px;
        }
        .listing-image-card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .listing-image {
          width: 100%;
          height: 70%;
          object-fit: cover;
        }
        .listing-image-placeholder {
          width: 100%;
          height: 70%;
          background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .property-type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          color: #059669;
          border: none;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
        .flat-listings-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .listing-title {
          font-weight: bold;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .listing-location {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.925rem;
        }
        .listing-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
        }
        .listing-description {
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }
        .listing-price {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .price-period {
          font-size: 1rem;
          font-weight: normal;
          opacity: 0.8;
        }
        .listing-action {
          margin-bottom: 2rem;
        }
        .arrow-buttons {
          display: flex;
          gap: 1.5rem;
          padding-top: 3rem;
        }
        .arrow-button {
          width: 2.7rem;
          height: 2.7rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
          border: none;
        }
        @media (min-width: 768px) {
          .flat-listings-grid {
            grid-template-columns: 1fr 1fr;
          }
          .arrow-buttons {
            padding-top: 0;
          }
        }
        `
      }} />
    </div>
  );
};

export default CircularFlatListings;
