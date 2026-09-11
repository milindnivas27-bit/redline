'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const styles: Record<Variant, string> = {
  primary: 'bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 border border-transparent',
  secondary: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)]',
  ghost: 'bg-transparent text-[var(--text)] border border-transparent hover:bg-[var(--border)]/40',
  danger: 'bg-transparent text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger-bg)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-[var(--radius)] font-medium
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2
          ${styles[variant]} ${sizes[size]} ${className}
        `}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';