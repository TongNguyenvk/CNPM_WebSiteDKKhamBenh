import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const badgeVariants = {
  primary: 'badge-primary',
  secondary: 'badge bg-secondary-100 text-secondary-800',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  neutral: 'badge-neutral',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export function Badge({ 
  variant = 'neutral', 
  size = 'md',
  className, 
  children, 
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string;
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const getVariant = (status: string): BadgeProps['variant'] => {
    const statusMap: Record<string, BadgeProps['variant']> = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'success',
      active: 'success',
      inactive: 'neutral',
    };
    return statusMap[status.toLowerCase()] || 'neutral';
  };

  const getStatusText = (status: string): string => {
    const statusTexts: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
    };
    return statusTexts[status.toLowerCase()] || status;
  };

  return (
    <Badge variant={getVariant(status)} {...props}>
      {getStatusText(status)}
    </Badge>
  );
}
