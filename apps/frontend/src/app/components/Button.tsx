import React from 'react';
import { Loader } from './Loader';

type ButtonVariant = 'primary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-primary-50 active:bg-primary-800 disabled:opacity-40',
  ghost:
    'bg-transparent text-primary-700 active:bg-primary-50 disabled:opacity-40',
  outline:
    'bg-transparent border border-primary-700 text-primary-700 active:bg-secondary/10 disabled:opacity-40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-wide',
        'transition-all duration-150 select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? <Loader size="sm" variant="button" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
