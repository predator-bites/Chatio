import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightAction, className = '', id, ...rest },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-primary-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-primary-700/50 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full h-12 rounded-2xl border bg-primary-50/60 px-4 text-primary-700',
              'placeholder:text-primary-700/30 text-base',
              'outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-secondary focus:border-transparent',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-primary-700/10',
              leftIcon ? 'pl-11' : '',
              rightAction ? 'pr-12' : '',
              className,
            ].join(' ')}
            {...rest}
          />
          {rightAction && (
            <span className="absolute right-3">{rightAction}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-primary-700/50">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
