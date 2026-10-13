import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-secondary text-secondary-foreground',
        info: 'border-primary/20 bg-primary-soft text-primary',
        success: 'border-leaf/25 bg-leaf-soft text-leaf',
        warning: 'border-notice-border bg-notice text-notice-foreground',
        danger: 'border-destructive/25 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
