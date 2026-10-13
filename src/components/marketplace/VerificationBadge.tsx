import { CircleHelp, Link2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { VerificationStatus } from '@/lib/listing-utils';

const CONFIG = {
  verified: { tone: 'success', icon: ShieldCheck },
  linked: { tone: 'info', icon: Link2 },
  unlinked: { tone: 'warning', icon: CircleHelp },
} as const;

/** Shows whether a listing is verified and/or linked to a land record. */
export function VerificationBadge({ status, showHelp = false }: { status: VerificationStatus; showHelp?: boolean }) {
  const t = useTranslations('Marketplace.verification');
  const { tone, icon: Icon } = CONFIG[status];

  return (
    <div>
      <Badge tone={tone}>
        <Icon className="size-3.5" aria-hidden="true" />
        {t(status)}
      </Badge>
      {showHelp && <p className="mt-2 text-sm text-muted-foreground">{t(`${status}Help`)}</p>}
    </div>
  );
}
