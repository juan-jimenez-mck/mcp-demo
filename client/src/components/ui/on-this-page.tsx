import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type OnThisPageProps = {
  readonly contentSelector?: string;
};

export function OnThisPage({ contentSelector = 'main' }: OnThisPageProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    // Get all headings h2 and h3
    const elements = Array.from(content.querySelectorAll('h2, h3, h4'));

    // Create heading objects with id, text and level
    const headingItems = elements.map((element) => {
      // If heading doesn't have an id, create one from its text content
      if (!element.id) {
        element.id =
          element.textContent?.toLowerCase().replace(/\s+/g, '-') ?? '';
      }

      return {
        id: element.id,
        text: element.textContent ?? '',
        level: Number.parseInt(element.tagName[1] ?? '2'),
      };
    });

    setHeadings(headingItems);

    // Set up intersection observer to highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
      },
    );

    // Observe all heading elements
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [contentSelector]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0">
      <h2 className="mb-4 text-lg font-medium">On This Page</h2>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              'hover:text-foreground block py-1 text-sm transition-colors',
              (() => {
                if (heading.level === 2) return 'pl-0';
                if (heading.level === 3) return 'pl-4';
                return 'pl-8';
              })(),
              activeId === heading.id
                ? 'text-foreground font-medium'
                : 'text-muted-foreground',
            )}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
