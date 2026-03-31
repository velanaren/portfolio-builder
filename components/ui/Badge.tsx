/**
 * Badge Component
 * Status badges with color variants
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = `
      inline-flex items-center gap-1.5
      font-semibold rounded-full
      transition-all duration-200
    `;

    // Variant styles
    const variantStyles = {
      default: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]',
      brand: 'bg-[rgba(0,217,255,0.15)] text-[var(--brand-light)] border border-[rgba(0,217,255,0.3)]',
      success: 'bg-[rgba(16,185,129,0.15)] text-[#34D399] border border-[rgba(16,185,129,0.3)]',
      warning: 'bg-[rgba(245,158,11,0.15)] text-[#FBBF24] border border-[rgba(245,158,11,0.3)]',
      error: 'bg-[rgba(239,68,68,0.15)] text-[#F87171] border border-[rgba(239,68,68,0.3)]',
      info: 'bg-[rgba(59,130,246,0.15)] text-[#60A5FA] border border-[rgba(59,130,246,0.3)]',
      accent: 'bg-[rgba(255,0,110,0.15)] text-[#FF3385] border border-[rgba(255,0,110,0.3)]',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-0.5 text-[10px] h-5',
      md: 'px-2.5 py-1 text-xs h-6',
      lg: 'px-3 py-1.5 text-sm h-7',
    };

    // Dot color styles
    const dotStyles = {
      default: 'bg-[var(--text-tertiary)]',
      brand: 'bg-[var(--brand)]',
      success: 'bg-[var(--success)]',
      warning: 'bg-[var(--warning)]',
      error: 'bg-[var(--error)]',
      info: 'bg-[var(--info)]',
      accent: 'bg-[var(--accent)]',
    };

    // Combine all styles
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {dot && (
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${dotStyles[variant]} animate-pulse`}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
