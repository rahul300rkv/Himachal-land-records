import { notFound } from 'next/navigation';

/** Catches unknown URLs under a locale so they render the localized 404 page. */
export default function CatchAllPage() {
  notFound();
}
