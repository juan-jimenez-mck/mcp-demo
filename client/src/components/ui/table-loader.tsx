import { Skeleton } from '@/components/ui/skeleton';

type TableLoaderProps = {
  readonly rows?: number;
  readonly columns?: number;
  readonly hasActions?: boolean;
  readonly className?: string;
};

export function TableLoader({
  rows = 5,
  columns = 3,
  hasActions = true,
  className = '',
}: TableLoaderProps) {
  return (
    <div className={`overflow-hidden rounded-md border ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="h-10 w-[50px] px-2">
                <Skeleton className="h-4 w-4" />
              </th>
              {Array.from({ length: columns }).map((_, i) => (
                <th
                  key={`header-${i + 1}`}
                  className="h-10 px-4 text-left align-middle font-medium"
                >
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </th>
              ))}
              {hasActions && (
                <th className="bg-muted/50 sticky right-0 h-10 w-[60px] px-2 shadow-[-8px_0_16px_rgba(0,0,0,0.05)]">
                  <Skeleton className="h-4 w-full" />
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex + 1}`} className="border-b">
                <td className="p-2 align-middle">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <Skeleton className="h-4 w-4" />
                  </div>
                </td>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={`cell-${rowIndex + 1}-${colIndex}`}
                    className="p-4 align-middle"
                  >
                    <Skeleton
                      className="h-4"
                      style={{ width: colIndex === 0 ? '80%' : '60%' }}
                    />
                    {colIndex === 0 && (
                      <Skeleton className="mt-2 h-3" style={{ width: '40%' }} />
                    )}
                  </td>
                ))}
                {hasActions && (
                  <td className="bg-background sticky right-0 p-2 align-middle shadow-[-8px_0_16px_rgba(0,0,0,0.05)]">
                    <div className="flex h-8 w-8 items-center justify-center gap-1">
                      <Skeleton className="h-1 w-1" />
                      <Skeleton className="h-1 w-1" />
                      <Skeleton className="h-1 w-1" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
