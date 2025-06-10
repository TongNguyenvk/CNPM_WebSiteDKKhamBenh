import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const spinnerColors = {
  primary: 'border-primary-600',
  secondary: 'border-secondary-600',
  white: 'border-white',
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className, 
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'loading-spinner',
        spinnerSizes[size],
        `border-t-${spinnerColors[color].split('-')[1]}-${spinnerColors[color].split('-')[2]}`,
        className
      )}
      {...props}
    />
  );
}

export interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'neutral';
}

const dotSizes = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

const dotColors = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  neutral: 'bg-neutral-600',
};

export function LoadingDots({ 
  size = 'md', 
  color = 'primary',
  className, 
  ...props 
}: LoadingDotsProps) {
  return (
    <div className={cn('loading-dots', className)} {...props}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'loading-dot',
            dotSizes[size],
            dotColors[color]
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

export interface LoadingOverlayProps {
  show: boolean;
  children?: React.ReactNode;
  text?: string;
  spinner?: boolean;
}

export function LoadingOverlay({ 
  show, 
  children, 
  text = 'Đang tải...', 
  spinner = true 
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-large max-w-sm mx-4">
        <div className="text-center">
          {spinner && (
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
          )}
          {children || (
            <p className="text-neutral-700 font-medium">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export interface LoadingPageProps {
  text?: string;
  spinner?: boolean;
}

export function LoadingPage({ 
  text = 'Đang tải...', 
  spinner = true 
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        {spinner && (
          <LoadingSpinner size="xl" className="mx-auto mb-6" />
        )}
        <p className="text-lg text-neutral-700 font-medium">{text}</p>
      </div>
    </div>
  );
}

export interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function LoadingButton({ 
  loading, 
  children, 
  loadingText = 'Đang xử lý...' 
}: LoadingButtonProps) {
  return (
    <>
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {loading ? loadingText : children}
    </>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  lines?: number;
}

export function Skeleton({ 
  width, 
  height = '1rem', 
  rounded = false,
  lines = 1,
  className, 
  ...props 
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-neutral-200 animate-pulse',
              rounded ? 'rounded-full' : 'rounded',
              i === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{ 
              width: i === lines - 1 ? '75%' : width, 
              height 
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-neutral-200 animate-pulse',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}
