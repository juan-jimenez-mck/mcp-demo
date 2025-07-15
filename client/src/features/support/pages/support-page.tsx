import Page from '@/components/layout/page';
import { OnThisPage } from '@/components/ui/on-this-page';

export default function SupportPage() {
  return (
    <Page title="Support">
      <div className="flex max-w-7xl flex-col md:flex-row md:gap-10">
        {/* Main content */}
        <main className="flex-1 md:order-1">
          <h2 id="principles" className="mt-10 mb-4 text-2xl font-semibold">
            Design Principles
          </h2>
          <p className="mb-6">
            Our design system is built on these core principles:
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>
              <strong>Consistency:</strong> Uniform patterns and elements create
              a cohesive experience
            </li>
            <li>
              <strong>Accessibility:</strong> Designs work for all users
              regardless of abilities
            </li>
            <li>
              <strong>Simplicity:</strong> Clear, straightforward solutions
              without unnecessary complexity
            </li>
            <li>
              <strong>Flexibility:</strong> Components adapt to different
              contexts while maintaining consistency
            </li>
          </ul>

          <h2 id="colors" className="mt-10 mb-4 text-2xl font-semibold">
            Color System
          </h2>
          <p className="mb-4">
            Our color palette is designed to be accessible and consistent across
            the application:
          </p>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-primary text-primary-foreground rounded-md p-4">
              <p className="font-medium">Primary</p>
              <p className="text-sm opacity-90">
                For main interactive elements
              </p>
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-md p-4">
              <p className="font-medium">Secondary</p>
              <p className="text-sm opacity-90">For less prominent elements</p>
            </div>
            <div className="bg-accent text-accent-foreground rounded-md p-4">
              <p className="font-medium">Accent</p>
              <p className="text-sm opacity-90">For highlights and emphasis</p>
            </div>
            <div className="bg-destructive text-destructive-foreground rounded-md p-4">
              <p className="font-medium">Destructive</p>
              <p className="text-sm opacity-90">
                For actions with significant consequences
              </p>
            </div>
          </div>

          <h2 id="typography" className="mt-10 mb-4 text-2xl font-semibold">
            Typography
          </h2>
          <p className="mb-4">
            Our typography system uses a consistent scale for readability and
            hierarchy:
          </p>
          <div className="mb-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <p className="text-muted-foreground text-sm">
                4xl / Bold / Page titles
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <p className="text-muted-foreground text-sm">
                3xl / Semibold / Major sections
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-medium">Heading 3</h3>
              <p className="text-muted-foreground text-sm">
                2xl / Medium / Subsections
              </p>
            </div>
            <div>
              <h4 className="text-xl font-medium">Heading 4</h4>
              <p className="text-muted-foreground text-sm">
                xl / Medium / Component headers
              </p>
            </div>
            <div>
              <p className="text-base">Body Text</p>
              <p className="text-muted-foreground text-sm">
                base / Regular / Main content
              </p>
            </div>
            <div>
              <p className="text-sm">Small Text</p>
              <p className="text-muted-foreground text-sm">
                sm / Regular / Supporting text
              </p>
            </div>
          </div>

          <h2 id="spacing" className="mt-10 mb-4 text-2xl font-semibold">
            Spacing System
          </h2>
          <p className="mb-4">
            We use a consistent spacing scale to create visual rhythm and
            balance:
          </p>
          <div className="mb-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary h-4 w-4"></div>
              <p>4px - Extra small spacing (1)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary h-6 w-6"></div>
              <p>6px - Small spacing (1.5)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary h-8 w-8"></div>
              <p>8px - Base spacing (2)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary h-12 w-12"></div>
              <p>12px - Medium spacing (3)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary h-16 w-16"></div>
              <p>16px - Large spacing (4)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary h-24 w-24"></div>
              <p>24px - Extra large spacing (6)</p>
            </div>
          </div>

          <h2 id="components" className="mt-10 mb-4 text-2xl font-semibold">
            Component Conventions
          </h2>
          <p className="mb-4">
            Our components follow these conventions to ensure consistency:
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>
              <strong>Props Structure:</strong> Common props like{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-sm">
                variant
              </code>
              ,{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-sm">size</code>
              , and{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-sm">
                className
              </code>{' '}
              are consistent across components
            </li>
            <li>
              <strong>Composition:</strong> Components are composable with
              children or slot props for flexibility
            </li>
            <li>
              <strong>Accessibility:</strong> All components have proper ARIA
              attributes and keyboard navigation
            </li>
            <li>
              <strong>Responsive:</strong> Components adapt to different screen
              sizes by default
            </li>
          </ul>

          <h2 id="code-style" className="mt-10 mb-4 text-2xl font-semibold">
            Code Style Conventions
          </h2>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>
              <strong>Naming:</strong> PascalCase for components, camelCase for
              variables and functions
            </li>
            <li>
              <strong>File Structure:</strong> One component per file, named
              after the component
            </li>
            <li>
              <strong>CSS:</strong> We use Tailwind CSS with consistent class
              ordering
            </li>
            <li>
              <strong>Imports:</strong> Group imports by external dependencies,
              internal modules, then types
            </li>
          </ul>

          <h2 id="resources" className="mt-10 mb-4 text-2xl font-semibold">
            Resources
          </h2>
          <p className="mb-4">
            Useful resources for working with our design system:
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>
              <a
                href="/design-system/figma"
                className="text-primary hover:underline"
              >
                Design System Figma Library
              </a>
            </li>
            <li>
              <a
                href="/design-system/components"
                className="text-primary hover:underline"
              >
                Component Documentation
              </a>
            </li>
            <li>
              <a
                href="/design-system/accessibility"
                className="text-primary hover:underline"
              >
                Accessibility Guidelines
              </a>
            </li>
            <li>
              <a
                href="/design-system/code-style"
                className="text-primary hover:underline"
              >
                Code Style Guide
              </a>
            </li>
          </ul>
        </main>

        {/* Sidebar with "On This Page" navigation */}
        <div className="mb-8 w-full md:sticky md:top-20 md:order-2 md:mb-0 md:w-64 md:self-start">
          <OnThisPage />
        </div>
      </div>
    </Page>
  );
}
