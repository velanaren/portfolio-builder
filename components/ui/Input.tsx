/**
 * Input Component
 * Text input with focus glow effects
 */

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      fullWidth = false,
      type = 'text',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const baseStyles = `
      bg-[var(--bg-tertiary)] text-[var(--text-primary)]
      border border-[var(--border)] rounded-lg
      px-4 py-2.5 text-sm
      transition-all duration-300
      placeholder:text-[var(--text-muted)]
      focus:outline-none
      focus:border-[var(--brand)]
      focus:bg-[rgba(0,217,255,0.05)]
      focus:shadow-[0_0_0_3px_rgba(0,217,255,0.15),inset_0_0_0_1px_var(--brand)]
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}
      ${icon ? 'pl-11' : ''}
      ${isPasswordType ? 'pr-11' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`${baseStyles} ${className}`.trim()}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-[var(--error)] flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--error)]"></span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
