
"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
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

// Helper to get the correct cards to show (2 at a time)
function getVisibleListings(listings: FlatListing[], idx: number) {
  if (listings.length === 1) return [listings[0]];
  if (listings.length === 2) {
    return [listings[idx], listings[(idx + 1) % 2]];
  }
  return [
    listings[idx],
    listings[(idx + 1) % listings.length]
  ];
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

  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const listingsLength = useMemo(() => listings.length, [listings]);
  const visibleListings = useMemo(
    () => getVisibleListings(listings, activeIndex),
    [activeIndex, listings]
  );
  const activeListing = visibleListings[0];

  // Autoplay logic
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

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div className="flat-listings-container-v2" style={{ backgroundColor: colorBackground }}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start justify-center w-full">
        {/* Images/Carousel: always show 2 at a time */}
        <div className="flex-1 flex flex-row gap-4 justify-center items-start min-w-0">
          {visibleListings.map((listing, idx) => (
            <motion.div
              key={listing.id}
              className="listing-image-card-v2"
              style={{
                backgroundColor: colorCardBg,
                minWidth: "16rem",
                maxWidth: "20rem",
                boxShadow: idx === 0 ? "0 4px 16px rgba(0,0,0,0.13)" : "0 2px 8px rgba(0,0,0,0.07)",
                border: idx === 0 ? "2px solid #e0e4ee" : "1px solid #ebeaf3",
                opacity: idx === 0 ? 1 : 0.92,
                transform: idx === 0 ? "scale(1)" : "scale(0.94)",
                transition: "all 0.48s cubic-bezier(.4,2,.3,1)",
              }}
              initial={{ x: 60 * (idx ? 1 : 0), opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60 * (idx ? 1 : 0), opacity: 0.5 }}
            >
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="listing-image-v2"
                />
              ) : (
                <div className="listing-image-placeholder-v2">
                  <MapPin className="h-12 w-12 text-coral-400" />
                </div>
              )}
              <Badge
                variant="secondary"
                className="property-type-badge-v2"
              >
                {listing.property_type.replace('_', ' ')}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Content of the active (leftmost) listing */}
        <div className="flat-listings-content-v2 w-full md:max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeListing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.27, ease: "easeInOut" }}
            >
              <h3 className="listing-title-v2" style={{ color: colorTitle }}>
                {activeListing.title}
              </h3>
              <div className="listing-location-v2" style={{ color: colorText }}>
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {activeListing.locations?.area && activeListing.locations?.city
                    ? `${activeListing.locations.area}, ${activeListing.locations.city}`
                    : activeListing.address_line1}
                </span>
              </div>
              <div className="listing-details-v2" style={{ color: colorText }}>
                <div className="detail-item-v2">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{activeListing.bedrooms} Bed</span>
                </div>
                <div className="detail-item-v2">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{activeListing.bathrooms} Bath</span>
                </div>
                {activeListing.parking_available && (
                  <div className="detail-item-v2">
                    <Car className="h-4 w-4 mr-1" />
                    <span>Parking</span>
                  </div>
                )}
              </div>
              {activeListing.description && (
                <p className="listing-description-v2" style={{ color: colorText }}>
                  {activeListing.description.length > 120
                    ? activeListing.description.substring(0, 120) + "..."
                    : activeListing.description}
                </p>
              )}
              <div className="listing-price-v2" style={{ color: colorPrice }}>
                ₹{activeListing.monthly_rent.toLocaleString()}
                <span className="price-period-v2">/month</span>
              </div>
              <div className="listing-action-v2">
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
          <div className="arrow-buttons-v2 flex gap-2 pt-2">
            <button
              className="arrow-button-v2 prev-button"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous listing"
            >
              <FaArrowLeft size={24} color={colorArrowFg} />
            </button>
            <button
              className="arrow-button-v2 next-button"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next listing"
            >
              <FaArrowRight size={24} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive and custom styles (new/altered classnames have -v2 suffix!) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .flat-listings-container-v2 {
          width: 100%;
          max-width: 47rem;
          padding: 1.2rem 0.5rem;
          border-radius: 0.9rem;
          margin: 1rem 0 0.5rem 0;
        }
        .listing-image-card-v2 {
          position: relative;
          border-radius: 1.2rem;
          overflow: hidden;
          min-width: 16rem;
          max-width: 19rem;
          width: 100%;
          height: 14rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          background: #fff;
        }
        .listing-image-v2 {
          width: 100%;
          height: 61%;
          min-height: 7rem;
          object-fit: cover;
        }
        .listing-image-placeholder-v2 {
          width: 100%;
          height: 61%;
          background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .property-type-badge-v2 {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255,255,255,0.96);
          color: #059669;
          border: none;
          font-size: 0.7rem;
          padding: 0.19rem 0.46rem;
        }
        .flat-listings-content-v2 {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 11.6rem;
          margin-top: 1.5rem;
        }
        .listing-title-v2 {
          font-weight: bold;
          font-size: 1.07rem;
          margin-bottom: 0.08rem;
          line-height: 1.18;
        }
        .listing-location-v2 {
          display: flex;
          align-items: center;
          margin-bottom: 0.49rem;
          font-size: 0.84rem;
        }
        .listing-details-v2 {
          display: flex;
          gap: 0.72rem;
          margin-bottom: 0.67rem;
          font-size: 0.80rem;
        }
        .detail-item-v2 {
          display: flex;
          align-items: center;
        }
        .listing-description-v2 {
          line-height: 1.6;
          margin-bottom: 1.1rem;
          font-size: 0.82rem;
        }
        .listing-price-v2 {
          font-size: 1.12rem;
          font-weight: bold;
          margin-bottom: 0.97rem;
        }
        .price-period-v2 {
          font-size: 0.88rem;
          font-weight: normal;
          opacity: 0.75;
        }
        .listing-action-v2 {
          margin-bottom: 0.83rem;
        }
        .arrow-buttons-v2 {
          justify-content: flex-start;
        }
        .arrow-button-v2 {
          width: 2.1rem;
          height: 2.1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
          border: none;
        }
        @media (max-width: 860px) {
          .flat-listings-container-v2 {
            max-width: 99vw;
            padding: 0.7rem 0.1rem;
          }
          .listing-image-card-v2 {
            min-width: 13.5rem;
            max-width: 15rem;
            height: 10.5rem;
          }
          .flat-listings-content-v2 {
            min-width: 8.5rem;
            margin-top: 1rem;
          }
        }
        @media (max-width: 700px) {
          .listing-image-card-v2 {
            min-width: 12rem;
            max-width: 14rem;
            height: 8.8rem;
          }
          .flat-listings-content-v2 {
            min-width: 6.5rem;
            margin-top: 0.2rem;
          }
        }
        `
      }} />
    </div>
  );
};

export default CircularFlatListings;
