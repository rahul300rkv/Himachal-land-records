import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { JsonLd, absoluteUrl } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { TOOL_HREFS, type ToolKey } from '@/lib/tool-links';

/** A manually-specified crumb for non-tool pages. */
export type BreadcrumbItem = { name: string; href: string };

type Props = {
  /**
   * Pass a ToolKey to get the standard Home › Tools › [Tool] trail.
   * Pass an explicit `trail` array to override the full path (omit the
   * current/last crumb's href to render it as plain text with aria-current).
   * Omit both on the /tools index page.
   */
  current?: ToolKey;
  trail?: BreadcrumbItem[];
  className?: string;
};

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export async function Breadcrumbs({ current, trail, className }: Props) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Seo')]);

  const items: BreadcrumbItem[] = trail
    ? trail
    : [
        { name: t('breadcrumb.home'), href: '/' },
        { name: t('breadcrumb.tools'), href: '/tools' },
        ...(current ? [{ name: t(`tools.${current}.name`), href: TOOL_HREFS[current] }] : []),
      ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };

  return (
    <nav aria-label={t('breadcrumb.label')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href + index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="size-4 shrink-0" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link href={item.href as Parameters<typeof Link>[0]['href']} className="inline-flex min-h-10 items-center underline-offset-4 hover:text-foreground hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
