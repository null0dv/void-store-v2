import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { SERIES_LABEL, STOCK_LABEL, getProduct, getProducts } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Not found' };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id && p.series === product.series).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[.22em] text-primary">
          <Link href="/">HOME</Link> <span className="mx-2 text-muted-foreground">/</span>
          <Link href="/products">SHOP</Link> <span className="mx-2 text-muted-foreground">/</span>
          {SERIES_LABEL[product.series]}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-[1.8rem] border border-border bg-card">
              <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
              {product.sold && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <span className="rounded-full border border-ink bg-background px-6 py-3 font-mono text-sm font-bold uppercase tracking-[.24em] text-ink">
                    SOLD
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="eyebrow">{SERIES_LABEL[product.series]}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.04em] text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 font-mono text-2xl font-medium text-primary">{formatPrice(product.price)}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">{STOCK_LABEL[product.stockType]}</span>
              <span className="chip">{product.category.toUpperCase()}</span>
              {product.tags?.map((t) => (
                <span key={t} className="chip text-sun">{t}</span>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-muted-foreground">DESCRIPTION</p>
              <p className="mt-4 whitespace-pre-line leading-8 text-ink">{product.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a className="primary-button" href="https://line.me/R/ti/p/@null.void" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> ENQUIRE ON LINE
              </a>
              <Link className="secondary-button" href="/products">
                <ArrowUpRight className="h-4 w-4" /> BACK TO SHOP
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-[.18em]">
              <div>
                <dt className="text-muted-foreground">ID</dt>
                <dd className="mt-1 text-ink">{product.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">LISTED</dt>
                <dd className="mt-1 text-ink">{product.createdAt}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">SAME SERIES</p>
              <h2 className="section-title">同系列</h2>
            </div>
            <Link className="text-link" href={`/products?series=${product.series}`}>
              MORE {SERIES_LABEL[product.series]} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-5 gap-y-12 md:grid-cols-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
