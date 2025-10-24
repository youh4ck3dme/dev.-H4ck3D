import React, { useState, useEffect, useRef } from 'react';

interface TagsInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (newValue: string) => void;
  allTags: string[];
  placeholder?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({ id, name, value, onChange, allTags, placeholder }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    const tags = inputValue.split(',').map(t => t.trim());
    const currentTag = tags[tags.length - 1].toLowerCase();

    if (currentTag) {
      const existingTags = new Set(tags.slice(0, -1).map(t => t.toLowerCase()));
      const filtered = allTags.filter(
        tag =>
          tag.toLowerCase().startsWith(currentTag) &&
          !existingTags.has(tag.toLowerCase())
      ).slice(0, 5); // Limit suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const tags = value.split(',').map(t => t.trim().filter(Boolean));
    tags[tags.length - 1] = suggestion;
    const newValue = tags.join(', ') + ', ';
    
    onChange(newValue);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder || "Tags (e.g., React, Firebase, AI)"}
        className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoComplete="off"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map(suggestion => (
            <li
              key={suggestion}
              onMouseDown={(e) => { // use onMouseDown to fire before onBlur
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-700"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsInput;
