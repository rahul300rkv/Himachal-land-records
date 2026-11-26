'use client';

import { Lock, MessageCircle, Phone, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { formatIndianMobile } from '@/lib/phone';
import { cn } from '@/lib/utils';
import type { SellerContact } from '@/types/land-record';

type ContactSellerProps = {
  listingId: string;
  title: string;
  isAuthenticated: boolean;
  /** Only provided to logged-in visitors; the database hides it from everyone else. */
  contact: SellerContact | null;
  isDemo?: boolean;
};

/**
 * "Contact seller": the name, phone and WhatsApp are always shown in the layout, but blurred.
 * The blurred text is made-up sample text, never the seller's real details, so nothing can be
 * read out of the page. Login is required, then the real details are revealed on click.
 */
export function ContactSeller({ listingId, title, isAuthenticated, contact, isDemo }: ContactSellerProps) {
  const t = useTranslations('Marketplace.detail.contact');
  const [revealed, setRevealed] = useState(false);

  const locked = (label: string) => (
    <div className="relative mb-4">
      <div aria-hidden="true" className="pointer-events-none select-none space-y-4 blur-[6px]">
        <div>
          <p className="text-sm text-muted-foreground">{t('seller')}</p>
          <p className="text-lg font-semibold">Ramesh Kumar</p>
          <p className="mt-1 text-lg tabular-nums">+91 98765 43210</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <div className={cn(buttonVariants({ size: 'lg' }), 'flex-1')}>
            <Phone />
            {t('call')}
          </div>
          <div className={cn(buttonVariants({ size: 'lg', variant: 'leaf' }), 'flex-1')}>
            <MessageCircle />
            {t('whatsapp')}
          </div>
        </div>
      </div>
      <p className="absolute inset-0 flex items-center justify-center px-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-sm font-medium shadow-sm">
          <Lock className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </span>
      </p>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div>
        {locked(t('lockedLogin'))}
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
      <div>
        {locked(t('lockedReveal'))}
        <Button type="button" size="lg" className="w-full" onClick={() => setRevealed(true)}>
          <Phone />
          {t('reveal')}
        </Button>
      </div>
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
