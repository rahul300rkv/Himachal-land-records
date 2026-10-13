import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Styled native <select>. Native selects give the best mobile experience
 * (OS picker, full keyboard and screen-reader support) at zero JS cost.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'h-11 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-10 text-base text-foreground shadow-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70',
        'aria-[invalid=true]:border-destructive',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
  </div>
));
Select.displayName = 'Select';

export { Select };
