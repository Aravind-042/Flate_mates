
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { FlatListing } from "./types";
import { transitionOverlay } from "./constants";

interface FlatCarouselModalProps {
  activeListing: FlatListing;
  onClose: () => void;
}

export const FlatCarouselModal = ({ activeListing, onClose }: FlatCarouselModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClose}
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
          ease: "easeOut",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-charcoal">{activeListing.title}</h3>
          <button
            onClick={onClose}
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
  );
};
