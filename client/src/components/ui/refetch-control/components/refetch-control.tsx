import { Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import type { IntervalOption } from '../types';
import { RefetchIntervalOptions } from '../constants';

type RefetchControlProps = {
  readonly selectedInterval: IntervalOption;
  readonly onIntervalChange?: (interval: IntervalOption) => void;
  readonly className?: string;
  readonly onRefresh?: () => void;
  readonly hideIntervalSelector?: boolean;
};

export default function RefetchControl({
  selectedInterval = RefetchIntervalOptions.OFF,
  onIntervalChange,
  className,
  onRefresh,
  hideIntervalSelector,
}: RefetchControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIntervalSelect = (interval: IntervalOption) => {
    onIntervalChange?.(interval);
  };

  if (hideIntervalSelector) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={className}
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'border-muted-foreground/20 h-9 w-9 rounded-tr-none rounded-br-none',
            className,
          )}
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'border-muted-foreground/20 h-9 w-14 rounded-tl-none rounded-bl-none border-l-0 px-1',
              className,
            )}
          >
            {selectedInterval.label}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="backdrop-blur-sm">
        {Object.entries(RefetchIntervalOptions).map(([interval, option]) => (
          <DropdownMenuItem
            key={interval}
            className={cn(
              'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
              selectedInterval.value === option.value && 'bg-muted/50',
            )}
            onClick={() => handleIntervalSelect(option)}
          >
            <span>{option.label}</span>
            {selectedInterval.value === option.value && (
              <Check className="h-4 w-4 opacity-70" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
