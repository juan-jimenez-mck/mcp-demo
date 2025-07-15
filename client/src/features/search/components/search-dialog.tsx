import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+K or Control+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Close on escape
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 50);
    }
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="h-7 items-center gap-1 rounded-full"
        >
          <Search />
          <kbd className="font-sans text-xs/4 text-gray-500 not-[.os-macos_&]:block dark:text-gray-400">
            ⌘K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogTitle />
      <DialogContent
        className="gap-0 p-0"
        closeIcon={
          <kbd className="bg-background mt-2 cursor-pointer rounded-sm border border-gray-200 px-1.5 font-sans text-xs/4 text-gray-500 not-[.os-macos_&]:block dark:text-gray-400">
            esc
          </kbd>
        }
      >
        <form onSubmit={handleSearch} className="flex flex-col">
          <div className="flex items-center border-b border-gray-200 px-4 py-3 pr-14 dark:border-gray-700">
            <Search className="mr-2 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
            <Input
              id="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex h-10 rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="p-4 pt-2">
            {query ? (
              <div className="py-6 text-center text-sm text-gray-500">
                {query.length > 0 ? 'Searching...' : 'Type to search'}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                Type to search
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
