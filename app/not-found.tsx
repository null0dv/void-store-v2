import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto flex max-w-[720px] flex-col items-center justify-center px-5 py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-[clamp(4rem,10vw,7rem)] font-black leading-none tracking-[-.065em] text-ink">
          void.
        </h1>
        <p className="mt-6 text-muted-foreground">你要找的東西不在這裡,或已經被拿走了。</p>
        <Link href="/" className="primary-button mt-10">BACK HOME</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
