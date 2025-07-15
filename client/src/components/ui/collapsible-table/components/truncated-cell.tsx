import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TableCell } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { CollapsibleTableColumn, CollapsibleTableItem } from '../types';

export type TruncatedCellProps<T extends CollapsibleTableItem> = {
  readonly column: CollapsibleTableColumn<T>;
  readonly children: ReactNode;
};

export default function TruncatedCell<T extends CollapsibleTableItem>({
  column,
  children,
}: TruncatedCellProps<T>) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkContentIsOverflowing = () => {
      if (cellRef.current) {
        setIsOverflowing(
          cellRef.current.scrollWidth > cellRef.current.clientWidth,
        );
      }
    };

    checkContentIsOverflowing();
    window.addEventListener('resize', checkContentIsOverflowing);
    return () =>
      window.removeEventListener('resize', checkContentIsOverflowing);
  }, [children]);

  if (!isOverflowing) {
    return (
      <TableCell
        ref={cellRef}
        className={`${column.className} ${column.truncate ? 'truncate' : ''} ${column.align ?? ''}`}
        style={column.maxWidth ? { maxWidth: column.maxWidth } : {}}
      >
        {children}
      </TableCell>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableCell
            ref={cellRef}
            className={`${column.className} ${column.truncate ? 'truncate' : ''} ${column.align ?? ''}`}
            style={column.maxWidth ? { maxWidth: column.maxWidth } : {}}
          >
            {children}
          </TableCell>
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
