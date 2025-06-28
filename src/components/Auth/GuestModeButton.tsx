import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const GuestModeButton = () => {
  const navigate = useNavigate();

  const handleGuestMode = () => {
    navigate('/browse');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-6 right-6 z-50"
    >
      <Button
        onClick={handleGuestMode}
        className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sparkle effect */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-3 w-3 text-white/80" />
        </div>
        
        {/* Button content */}
        <div className="relative flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span className="hidden sm:inline">View as Guest</span>
          <span className="sm:hidden">Guest</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Button>
      
      {/* Tooltip for mobile */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap sm:hidden">
        Browse without signing up
      </div>
    </motion.div>
  );
};