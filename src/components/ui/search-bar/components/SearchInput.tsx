
import { cn } from "@/lib/utils"
import { SearchInputProps } from "../types"

const SearchInput = ({
  inputRef,
  searchQuery,
  placeholder,
  isFocused,
  onSearchChange,
  onFocus,
  onBlur,
}: SearchInputProps) => {
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={onSearchChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        "w-full py-3 sm:py-4 pl-2 pr-4 bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium text-base sm:text-lg relative z-10",
        isFocused ? "text-gray-800 dark:text-white tracking-wide" : "text-gray-600 dark:text-gray-300"
      )}
    />
  )
}

export { SearchInput }
