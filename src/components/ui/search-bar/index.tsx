
"use client"

import type React from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SearchBarProps } from "./types"
import { ANIMATION_CONFIG } from "./constants"
import { useSearchBar } from "./hooks/useSearchBar"
import { GooeyFilter } from "./components/GooeyFilter"
import { SearchInput } from "./components/SearchInput"
import { SearchButton } from "./components/SearchButton"
import { Suggestions } from "./components/Suggestions"
import { Particles } from "./components/Particles"

const SearchBar = ({ placeholder = "Search...", onSearch }: SearchBarProps) => {
  const {
    inputRef,
    isFocused,
    setIsFocused,
    searchQuery,
    isAnimating,
    suggestions,
    isClicked,
    mousePosition,
    isUnsupportedBrowser,
    handleSearch,
    handleSubmit,
    handleMouseMove,
    handleClick,
    handleSuggestionClick,
  } = useSearchBar(onSearch)

  return (
    <div className="relative w-full">
      <GooeyFilter />
      <motion.form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-center w-full mx-auto"
        initial={{ width: "300px" }}
        animate={{ width: isFocused ? "380px" : "300px", scale: isFocused ? 1.02 : 1 }}
        transition={ANIMATION_CONFIG.FORM_TRANSITION}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className={cn(
            "flex items-center w-full rounded-full border relative overflow-hidden backdrop-blur-md h-10 sm:h-11",
            isFocused ? "border-transparent shadow-xl" : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50"
          )}
          animate={{
            boxShadow: isClicked
              ? "0 0 40px rgba(139, 92, 246, 0.5), 0 0 15px rgba(236, 72, 153, 0.7) inset"
              : isFocused
              ? "0 15px 35px rgba(0, 0, 0, 0.2)"
              : "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
          onClick={handleClick}
        >
          {isFocused && (
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.15,
                background: [
                  "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
                  "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)",
                  "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)",
                  "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
                ],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          )}

          <Particles
            isFocused={isFocused}
            isClicked={isClicked}
            mousePosition={mousePosition}
            isUnsupportedBrowser={isUnsupportedBrowser}
          />

          {isClicked && (
            <>
              <motion.div
                className="absolute inset-0 -z-5 rounded-full bg-purple-400/10"
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 -z-5 rounded-full bg-white dark:bg-white/20"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </>
          )}

          <motion.div 
            className="pl-3 sm:pl-4 py-2 sm:py-2.5 flex items-center justify-center"
            animate={{
              rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
              scale: isAnimating ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Search
              size={18}
              strokeWidth={isFocused ? 2.5 : 2}
              className={cn(
                "transition-all duration-300",
                isAnimating ? "text-purple-500" : isFocused ? "text-purple-600" : "text-gray-400 dark:text-gray-400",
              )}
            />
          </motion.div>

          <SearchInput
            inputRef={inputRef}
            searchQuery={searchQuery}
            placeholder={placeholder}
            isFocused={isFocused}
            onSearchChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), ANIMATION_CONFIG.BLUR_TIMEOUT)}
          />

          <SearchButton searchQuery={searchQuery} isAnimating={isAnimating} />

          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.1, 0.2, 0.1, 0],
                background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 70%)",
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            />
          )}
        </motion.div>
      </motion.form>

      <Suggestions
        isFocused={isFocused}
        suggestions={suggestions}
        isUnsupportedBrowser={isUnsupportedBrowser}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  )
}

export { SearchBar }
