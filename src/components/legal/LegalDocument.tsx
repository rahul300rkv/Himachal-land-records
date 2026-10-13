import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

export type LegalSection = {
  id: string;
  title: string;
  /** Paragraphs. A line starting with "- " is a bullet; consecutive bullets form one list. */
  body: string[];
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  /** Extra content shown after the sections (e.g. a related-links row). */
  children?: ReactNode;
};

type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

function toBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  for (const line of lines) {
    if (line.startsWith('- ')) {
      const item = line.slice(2);
      const last = blocks[blocks.length - 1];
      if (last?.type === 'ul') last.items.push(item);
      else blocks.push({ type: 'ul', items: [item] });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }
  return blocks;
}

/**
 * Shared layout for Disclaimer, Privacy policy and Terms of use:
 * title, last-updated date, intro, numbered sections and a sticky contents list on desktop.
 */
export function LegalDocument({ title, lastUpdated, intro, sections, children }: LegalDocumentProps) {
  const t = useTranslations('Legal');

  return (
    <div className="container py-10 sm:py-14">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{lastUpdated}</p>
        <p className="mt-5 text-lg leading-relaxed">{intro}</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label={t('onThisPage')} className="lg:sticky lg:top-24 lg:self-start">
          <details className="rounded-lg border bg-card lg:border-0 lg:bg-transparent" open>
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold lg:cursor-default lg:px-0 lg:pt-0 [&::-webkit-details-marker]:hidden">
              {t('onThisPage')}
            </summary>
            <ol className="space-y-1.5 px-4 pb-4 text-sm lg:px-0 lg:pb-0">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-2 rounded-sm py-0.5 text-muted-foreground hover:text-primary hover:underline"
                  >
                    <span className="w-5 shrink-0 tabular-nums">{index + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </nav>

        <div className="max-w-3xl">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="border-t py-8 first:border-t-0 first:pt-0">
              <h2 className="text-2xl">
                <span className="mr-2 tabular-nums text-primary">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed">
                {toBlocks(section.body).map((block, i) =>
                  block.type === 'p' ? (
                    <p key={i}>{block.text}</p>
                  ) : (
                    <ul key={i} className="space-y-2 pl-1">
                      {block.items.map((item, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}
