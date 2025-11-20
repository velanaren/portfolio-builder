/**
 * Card Component
 * Glassmorphism card with hover effects
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: 'none' | 'brand' | 'accent';
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      glow = 'none',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'rounded-xl transition-all duration-300';

    // Variant styles
    const variantStyles = {
      default: 'bg-[var(--bg-secondary)] border border-[var(--border)]',
      glass: 'glass', // Uses the .glass utility class from globals.css
      elevated: 'bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-md)]',
      interactive: 'bg-[var(--bg-secondary)] border border-[var(--border)] cursor-pointer',
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hover styles
    const hoverStyles = hover
      ? `
        hover:-translate-y-1
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
        hover:border-[rgba(0,217,255,0.2)]
      `
      : '';

    // Glow styles
    const glowStyles = {
      none: '',
      brand: 'glow-brand',
      accent: 'glow-accent',
    };

    // Combine all styles
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${paddingStyles[padding]}
      ${hoverStyles}
      ${glowStyles[glow]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header subcomponent
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card Title subcomponent
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = '', children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-bold text-[var(--text-primary)] font-[var(--font-display)] ${className}`.trim()}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

// Card Description subcomponent
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = '', children, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-[var(--text-secondary)] ${className}`.trim()}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// Card Content subcomponent
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`pt-4 ${className}`.trim()} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

// Card Footer subcomponent
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center pt-4 border-t border-[var(--border-subtle)] mt-4 ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export default Card;
