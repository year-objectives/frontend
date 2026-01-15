import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'default' | 'outlined';
  className?: string;
}

export function Badge({ children, color, variant = 'default', className = '' }: BadgeProps) {
  const style = color
    ? variant === 'default'
      ? { backgroundColor: color, color: '#fff' }
      : { borderColor: color, color: color }
    : {};

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs';
  const variantStyles = variant === 'default' 
    ? color ? '' : 'bg-neutral-200 text-neutral-800'
    : color ? 'border' : 'border border-neutral-300 text-neutral-700';

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
