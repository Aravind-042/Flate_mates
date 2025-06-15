
import { motion, AnimatePresence } from "framer-motion"
import { CircleDot } from "lucide-react"
import { SuggestionsProps } from "../types"

const Suggestions = ({ isFocused, suggestions, isUnsupportedBrowser, onSuggestionClick }: SuggestionsProps) => {
  return (
    <AnimatePresence>
      {isFocused && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-full mt-1 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-100 dark:border-gray-700"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            filter: isUnsupportedBrowser ? "none" : "drop-shadow(0 15px 15px rgba(0,0,0,0.1))",
          }}
        >
          <div className="p-1">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ 
                  opacity: 0,
                  y: -10,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                  scale: 0.9
                }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
                onClick={() => onSuggestionClick(suggestion)}
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
              >
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: index * 0.06 }}
                >
                  <CircleDot size={14} className="text-purple-400 group-hover:text-purple-600" />
                </motion.div>
                <motion.span
                  className="text-sm text-gray-700 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400"
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                >
                  {suggestion}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { Suggestions }
