import React from 'react';
import { cn } from '../lib/utils';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg' }>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-black uppercase transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95",
        {
          'bg-[var(--color-primary)] text-white hover:opacity-90 tracking-[0.2em] shadow-lg': variant === 'primary',
          'bg-[var(--color-accent)] text-[var(--color-primary)] hover:opacity-90 tracking-wider shadow-md': variant === 'secondary',
          'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent tracking-widest': variant === 'outline',
          'bg-transparent text-[var(--color-secondary)] hover:bg-gray-100 tracking-widest': variant === 'ghost',
          'bg-transparent text-[var(--color-error)] border border-[var(--color-error)] border-opacity-20 hover:bg-[var(--color-error)]/10 tracking-widest': variant === 'danger',
          'h-10 px-4 text-xs rounded-xl': size === 'sm',
          'h-12 px-6 text-xs rounded-xl': size === 'md',
          'h-14 px-8 text-sm w-full rounded-2xl': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200", className)} {...props} />
);

export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error', className?: string }) => (
  <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", {
    "bg-[var(--color-primary)] text-white": variant === 'default',
    "bg-[var(--color-success)] text-white": variant === 'success',
    "bg-[var(--color-accent)] text-[var(--color-primary)]": variant === 'warning',
    "bg-[var(--color-error)] text-white": variant === 'error',
  }, className)}>
    {children}
  </span>
);
