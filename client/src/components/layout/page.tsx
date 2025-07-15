import type { ReactNode } from 'react';

export type PageProps = {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
};

export default function Page({
  title,
  description,
  children,
  actions,
}: PageProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {title && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
              {title}
            </h1>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
