'use client';

import { MessageCircle, Phone, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { formatIndianMobile } from '@/lib/phone';
import type { SellerContact } from '@/types/land-record';

type ContactSellerProps = {
  listingId: string;
  title: string;
  isAuthenticated: boolean;
  /** Only provided to logged-in visitors; the database hides it from everyone else. */
  contact: SellerContact | null;
  isDemo?: boolean;
};

/** "Contact seller": login required, then details are revealed on click. */
export function ContactSeller({ listingId, title, isAuthenticated, contact, isDemo }: ContactSellerProps) {
  const t = useTranslations('Marketplace.detail.contact');
  const [revealed, setRevealed] = useState(false);

  if (!isAuthenticated) {
    return (
      <div>
        <p className="mb-4 text-muted-foreground">{t('loginPrompt')}</p>
        <Button asChild size="lg" className="w-full">
          <Link href={{ pathname: '/login', query: { next: `/marketplace/${listingId}` } }}>{t('login')}</Link>
        </Button>
      </div>
    );
  }

  if (!contact?.phone) {
    return <p className="text-muted-foreground">{t('unavailable')}</p>;
  }

  if (!revealed) {
    return (
      <Button type="button" size="lg" className="w-full" onClick={() => setRevealed(true)}>
        <Phone />
        {t('reveal')}
      </Button>
    );
  }

  const digits = contact.phone.replace(/\D/g, '');
  const whatsapp = `https://wa.me/${digits}?text=${encodeURIComponent(t('whatsappMessage', { title }))}`;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">{t('seller')}</p>
        <p className="text-lg font-semibold">{contact.name ?? '-'}</p>
        <p className="mt-1 text-lg tabular-nums">{formatIndianMobile(contact.phone)}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <Button asChild size="lg" className="flex-1">
          <a href={`tel:${contact.phone}`}>
            <Phone />
            {t('call')}
          </a>
        </Button>
        <Button asChild size="lg" variant="leaf" className="flex-1">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            {t('whatsapp')}
          </a>
        </Button>
      </div>

      {isDemo && (
        <p className="flex items-start gap-2 text-sm text-notice-foreground">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('demoPhone')}
        </p>
      )}
    </div>
  );
}
