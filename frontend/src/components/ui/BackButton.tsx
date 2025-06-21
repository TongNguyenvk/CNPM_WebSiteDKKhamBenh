'use client';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export function BackButton({ fallbackUrl, className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleBack}
        className={`inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors ${className}`}
        aria-label="Quay lại trang trước"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Quay lại
      </button>
    </div>
  );
}
