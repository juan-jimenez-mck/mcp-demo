import { X, Search } from 'lucide-react';

import { Input } from './input';
import { Button } from './button';
import { useState, useEffect } from 'react';

export type SearchBarProps = {
  readonly onChange: (searchTerm: string) => void;
  readonly debounceMs?: number;
  readonly placeholder?: string;
};

export default function SearchBar({
  onChange,
  debounceMs = 300,
  placeholder = 'Search...',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the onChange callback
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onChange, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    // Immediately call onChange when clearing to provide instant feedback
    onChange('');
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 pl-10"
        />
        {searchTerm && (
          <Button
            onClick={handleClear}
            variant="ghost"
            size="icon"
            className="hover:bg-muted absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
