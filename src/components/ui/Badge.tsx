import React from 'react';
import { cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'pending' | 'processing' | 'digitized' | 'verified' | 'discrepancy' | 'rejected' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default', ...props }) => {
  const variantStyles = variant !== 'default' 
    ? STATUS_COLORS[variant] 
    : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize transition-colors",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
