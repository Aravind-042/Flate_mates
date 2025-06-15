
export interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export interface ParticlesProps {
  isFocused: boolean
  isClicked: boolean
  mousePosition: { x: number; y: number }
  isUnsupportedBrowser: boolean
}

export interface SuggestionsProps {
  isFocused: boolean
  suggestions: string[]
  isUnsupportedBrowser: boolean
  onSuggestionClick: (suggestion: string) => void
}

export interface SearchInputProps {
  inputRef: React.RefObject<HTMLInputElement>
  searchQuery: string
  placeholder: string
  isFocused: boolean
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
}

export interface SearchButtonProps {
  searchQuery: string
  isAnimating: boolean
}
