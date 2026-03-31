/**
 * Button Component
 * Distinctive, Gen Z-friendly button with multiple variants
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-lg
      transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-95
    `;

    // Variant styles
    const variantStyles = {
      primary: `
        bg-[var(--brand)] text-[var(--bg-primary)]
        hover:bg-[var(--brand-light)] hover:shadow-[0_15px_30px_rgba(0,217,255,0.2)]
        hover:-translate-y-0.5
        focus:ring-[var(--brand)]
      `,
      secondary: `
        bg-transparent text-[var(--brand)] border border-[var(--brand)]
        hover:bg-[rgba(0,217,255,0.1)] hover:shadow-[0_0_20px_rgba(0,217,255,0.2)]
        hover:-translate-y-0.5
        focus:ring-[var(--brand)]
      `,
      ghost: `
        bg-transparent text-[var(--text-secondary)]
        hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]
        hover:-translate-y-0.5
        focus:ring-[var(--border-bright)]
      `,
      danger: `
        bg-[var(--error)] text-white
        hover:bg-[#DC2626] hover:shadow-[0_15px_30px_rgba(239,68,68,0.2)]
        hover:-translate-y-0.5
        focus:ring-[var(--error)]
      `,
      success: `
        bg-[var(--success)] text-white
        hover:bg-[var(--success-dark)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.2)]
        hover:-translate-y-0.5
        focus:ring-[var(--success)]
      `,
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-6 py-2.5 text-sm h-10',
      lg: 'px-8 py-3.5 text-base h-12',
      icon: 'p-2.5 h-10 w-10',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combine all styles
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && <span className="inline-flex">{icon}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
