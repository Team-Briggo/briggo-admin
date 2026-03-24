"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "./badge";
import { Input } from "./input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  className,
}) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions
        .filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(suggestion)
        )
        .slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="pl-2.5 pr-1.5 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1.5 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="w-full"
        />

        {/* Autocomplete Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {value.length === 0 && !inputValue && (
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter to add a tag
        </p>
      )}
    </div>
  );
}
