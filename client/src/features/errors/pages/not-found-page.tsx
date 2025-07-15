import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-primary text-9xl font-bold">404</h1>
      <p className="mt-4 mb-8 text-2xl">Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
