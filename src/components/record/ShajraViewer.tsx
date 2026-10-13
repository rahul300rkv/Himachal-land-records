import { Network } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StateMessage } from '@/components/layout/StateMessage';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ShajraNode } from '@/types/land-record';

function Tree({ nodes, root = false }: { nodes: ShajraNode[]; root?: boolean }) {
  const t = useTranslations('Record.shajra');

  return (
    <ul className={cn('space-y-3', !root && 'ml-3 mt-3 border-l-2 border-primary/20 pl-5 sm:ml-5 sm:pl-6')}>
      {nodes.map((node, index) => (
        <li
          key={`${node.name}-${index}`}
          // The short horizontal tick connects each child to its parent's vertical line.
          className={cn('relative', !root && 'before:absolute before:-left-5 before:top-5 before:w-5 before:border-t-2 before:border-primary/20 sm:before:-left-6 sm:before:w-6')}
        >
          <div className="inline-flex max-w-full flex-col rounded-lg border bg-card px-4 py-2.5 shadow-sm">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-medium [overflow-wrap:anywhere]">{node.name}</span>
              {node.deceased && <Badge>{t('deceased')}</Badge>}
            </span>
            {node.relation && <span className="text-sm text-muted-foreground">{node.relation}</span>}
          </div>
          {node.children && <Tree nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

/** Family tree (shajra nasb) as a nested, screen-reader-friendly list. */
export function ShajraViewer({ tree }: { tree: ShajraNode[] | null }) {
  const t = useTranslations('Record.shajra');

  if (!tree) {
    return <StateMessage icon={Network} title={t('emptyTitle')} body={t('emptyBody')} />;
  }

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <Tree nodes={tree} root />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t('note')}</p>
    </div>
  );
}
