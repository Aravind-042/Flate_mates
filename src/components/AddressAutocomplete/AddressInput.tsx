import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{ id: string; text: string }>;
}

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: [number, number]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const AddressInput = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className
}: AddressInputProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || ''}&country=IN&types=address,poi,place&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Debounce the API call
    suggestionTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);

    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.place_name, suggestion.center);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="text-charcoal">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        ref={inputRef}
        id={label.replace(/\s+/g, '-').toLowerCase()}
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={cn(
          "mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue",
          error && "border-red-500",
          className
        )}
        required={required}
      />
      
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      
      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-light-slate rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              Searching addresses...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-b border-slate-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium text-slate-900">
                  {suggestion.place_name}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};