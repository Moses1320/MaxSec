/**
 * SearchBox component - Search input with suggestions
 */

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../atoms/Input";
import { cn } from "../../utils/cn";

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  debounceMs?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  onSelectSuggestion,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSelectSuggestion?.(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="relative w-full">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder={placeholder}
        leftIcon={<Search size={18} />}
        rightIcon={
          query && (
            <button
              onClick={handleClear}
              className="focus:outline-none"
              aria-label="Clear search"
            >
              <X size={18} className="text-space-400" />
            </button>
          )
        }
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-space-800 rounded-lg shadow-medium",
            "border border-lavender-100 dark:border-space-700 z-50 animate-slideDown"
          )}
          role="listbox"
          aria-label="Search suggestions"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={cn(
                "w-full text-left px-4 py-2 hover:bg-platinum-100 dark:hover:bg-space-700 transition-colors",
                index === 0 && "rounded-t-lg",
                index === filteredSuggestions.length - 1 && "rounded-b-lg",
                "first:rounded-t-lg last:rounded-b-lg focus:outline-none focus:bg-platinum-100 dark:focus:bg-space-700"
              )}
              role="option"
              aria-selected={query === suggestion}
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-space-400" />
                <span className="text-sm text-space-700 dark:text-platinum-100">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
