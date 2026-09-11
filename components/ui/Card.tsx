import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hover?: boolean;
}

export function Card({
  padded = true,
  hover = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`
        bg-[var(--surface)] border border-[var(--border)]
        rounded-[var(--radius)]
        ${padded ? 'p-5' : ''}
        ${hover ? 'transition-all hover:border-[var(--border-strong)]' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}