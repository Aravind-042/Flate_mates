
import { motion, AnimatePresence } from "framer-motion"
import { SearchButtonProps } from "../types"

const SearchButton = ({ searchQuery, isAnimating }: SearchButtonProps) => {
  return (
    <AnimatePresence>
      {searchQuery && (
        <motion.button
          type="submit"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          whileHover={{
            scale: 1.05,
            background: "linear-gradient(45deg, #8B5CF6 0%, #EC4899 100%)",
            boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 sm:px-5 py-2 mr-2 sm:mr-3 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm transition-all shadow-lg"
        >
          Search
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export { SearchButton }
