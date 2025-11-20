/**
 * Spinner Component
 * Loading spinner with variants
 */

import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'accent' | 'white' | 'gray';
  fullScreen?: boolean;
  text?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'brand',
      fullScreen = false,
      text,
      className = '',
      ...props
    },
    ref
  ) => {
    // Size styles
    const sizeStyles = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-3',
      xl: 'h-16 w-16 border-4',
    };

    // Variant styles (border color)
    const variantStyles = {
      brand: 'border-[rgba(0,217,255,0.2)] border-t-[var(--brand)]',
      accent: 'border-[rgba(255,0,110,0.2)] border-t-[var(--accent)]',
      white: 'border-[rgba(255,255,255,0.2)] border-t-white',
      gray: 'border-[var(--border)] border-t-[var(--text-tertiary)]',
    };

    const spinnerElement = (
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className={`
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            rounded-full
            animate-spin
          `.trim()}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className="text-sm text-[var(--text-secondary)] font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div
          ref={ref}
          className={`
            fixed inset-0 z-50
            flex items-center justify-center
            bg-[var(--bg-primary)]/90
            backdrop-blur-sm
            ${className}
          `.trim()}
          {...props}
        >
          {spinnerElement}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`flex items-center justify-center ${className}`.trim()}
        {...props}
      >
        {spinnerElement}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// Inline spinner for buttons and small spaces
export const InlineSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div
      className={`
        ${sizeClass}
        border-2 border-[rgba(0,217,255,0.3)]
        border-t-[var(--brand)]
        rounded-full
        animate-spin
        inline-block
      `}
      role="status"
      aria-label="Loading"
    />
  );
};

// Skeleton loader
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}> = ({ className = '', variant = 'rectangular' }) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`
        skeleton
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      role="status"
      aria-label="Loading content"
    />
  );
};

export default Spinner;
