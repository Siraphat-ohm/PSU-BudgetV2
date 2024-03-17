'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error.message);
  }, [error]);
 
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-[100vh]">
      <h2 className="text-center">{error.message}</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}