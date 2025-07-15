import { Fragment, useState, type ReactNode } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import type {
  CollapsibleTableColumn,
  CollapsibleTableAction,
  CollapsibleTableItem,
} from '../types';
import TruncatedCell from './truncated-cell';

export type CollapsibleRowProps<T extends CollapsibleTableItem> = {
  readonly item: T;
  readonly columns: CollapsibleTableColumn<T>[];
  readonly actions?: CollapsibleTableAction<T>[];
  readonly renderDetails: (item: T) => ReactNode;
};

export default function CollapsibleRow<T extends CollapsibleTableItem>({
  item,
  columns,
  actions = [],
  renderDetails,
}: CollapsibleRowProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const renderCellContent = (item: T, column: CollapsibleTableColumn<T>) => {
    if (column.accessorKey) {
      if (column.cellRenderer) {
        return column.cellRenderer(item);
      }

      return String(item[column.accessorKey]);
    }

    return '-';
  };

  return (
    <Fragment>
      <TableRow
        className="group hover:bg-muted/30 cursor-pointer"
        onClick={handleToggle}
      >
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            className="pointer-events-none hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        {columns.map((column, index) =>
          column.truncate ? (
            <TruncatedCell
              key={`${item.id}-${column.id ?? column.accessorKey?.toString() ?? index}`}
              column={column}
            >
              {renderCellContent(item, column)}
            </TruncatedCell>
          ) : (
            <TableCell
              key={`${item.id}-${column.id ?? column.accessorKey?.toString() ?? index}`}
              className={`${column.className} ${column.maxWidth ? 'break-words whitespace-normal' : ''} ${column.align ?? ''}`}
              style={column.maxWidth ? { maxWidth: column.maxWidth } : {}}
            >
              {renderCellContent(item, column)}
            </TableCell>
          ),
        )}
        {actions.length > 0 && (
          <TableCell
            className="bg-background sticky right-0 z-10 shadow-[-8px_0_16px_rgba(0,0,0,0.05)] hover:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Row actions"
                  className="hover:bg-transparent"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => action.onClick(item)}
                    variant={action.variant}
                    disabled={action.disabled?.(item)}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={columns.length + 2} className="bg-background p-0">
            <div className="p-4">{renderDetails(item)}</div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
