import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Text input. 16px font on mobile prevents iOS from zooming in on focus. */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground shadow-sm transition-colors',
      'placeholder:text-muted-foreground/80',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70',
      'aria-[invalid=true]:border-destructive',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
