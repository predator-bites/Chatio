import React from 'react';

type LoaderSize = 'sm' | 'md' | 'lg';
type LoaderVariant = 'default' | 'button';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const variantClasses: Record<LoaderVariant, string> = {
  default: 'border-primary-200 border-t-secondary',
  button: 'border-current border-t-transparent',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-block animate-spin rounded-full border-2',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
      role="status"
      aria-label="Loading"
    />
  );
};
