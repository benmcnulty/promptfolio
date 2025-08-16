'use client';

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground mt-2">
          We apologize for the inconvenience. Please try again.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  );
}