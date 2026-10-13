import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StateMessageProps = {
  icon: LucideIcon;
  title: string;
  body?: string;
  tone?: 'neutral' | 'error';
  /** Optional action (button or link) shown under the text. */
  children?: ReactNode;
  className?: string;
};

/** Consistent empty / error / not-available panel used across the app. */
export function StateMessage({ icon: Icon, title, body, tone = 'neutral', children, className }: StateMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('rounded-lg border border-dashed px-6 py-10 text-center', className)}
    >
      <Icon
        className={cn('mx-auto size-8', tone === 'error' ? 'text-destructive' : 'text-muted-foreground')}
        aria-hidden="true"
      />
      <h2 className="mt-3 font-sans text-lg font-semibold tracking-normal">{title}</h2>
      {body && <p className="mx-auto mt-1.5 max-w-md text-muted-foreground">{body}</p>}
      {children && <div className="mt-5 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}
