import { type ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TableLoader } from '@/components/ui/table-loader';
import CollapsibleRow from './collapsible-row';
import type {
  CollapsibleTableAction,
  CollapsibleTableColumn,
  CollapsibleTableItem,
} from '../types';

export type CollapsibleTableProps<T extends CollapsibleTableItem> = {
  readonly data: T[];
  readonly columns: CollapsibleTableColumn<T>[];
  readonly renderDetails: (item: T) => ReactNode;
  readonly loading?: boolean;
  readonly className?: string;
  readonly emptyState?: ReactNode;
  readonly actions?: CollapsibleTableAction<T>[];
};

export default function CollapsibleTable<T extends CollapsibleTableItem>({
  data,
  columns,
  renderDetails,
  loading = false,
  className = '',
  emptyState = (
    <div className="text-muted-foreground p-4 text-center">
      No data available
    </div>
  ),
  actions = [],
}: CollapsibleTableProps<T>) {
  if (loading) {
    return <TableLoader />;
  }

  if (!data.length) {
    return <div className="rounded-md border">{emptyState}</div>;
  }

  return (
    <div className={`rounded-md border ${className} relative`}>
      <div className="overflow-x-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]" />
                {columns.map((column, index) => (
                  <TableHead
                    key={
                      column.id ??
                      column.accessorKey?.toString() ??
                      `column-${index}`
                    }
                    className={`${column.className} font-bold ${column.align ?? ''}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
                <TableHead className="sticky right-0 z-10 w-[50px] shadow-[-8px_0_16px_rgba(0,0,0,0.05)]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <CollapsibleRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  actions={actions}
                  renderDetails={renderDetails}
                />
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}
