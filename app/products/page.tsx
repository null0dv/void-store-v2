import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { SERIES_LABEL, type Series, getProducts } from '@/lib/products';

export const metadata: Metadata = { title: 'Shop', description: 'VOID.STORE — 所有商品' };

const seriesTabs: Array<{ value: Series | 'all'; label: string }> = [
  { value: 'all', label: 'ALL' },
  { value: 'nullcraft', label: 'NULLCRAFT' },
  { value: 'preloved', label: 'PRE-LOVED' },
  { value: 'minerals', label: 'MINERALS' },
];

const pageSize = 12;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; series?: string; page?: string }> }) {
  const filters = await searchParams;
  const all = await getProducts();

  const query = filters.q?.trim().toLocaleLowerCase('zh-Hant') || '';
  const seriesFilter = filters.series as Series | undefined;

  const filtered = all.filter((p) =>
    (!seriesFilter || p.series === seriesFilter) &&
    (!query || `${p.name} ${p.category} ${SERIES_LABEL[p.series]}`.toLocaleLowerCase('zh-Hant').includes(query))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(totalPages, Math.max(1, Number.parseInt(filters.page || '1', 10) || 1));
  const products = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.series) params.set('series', filters.series);
    if (page > 1) params.set('page', String(page));
    const q = params.toString();
    return `/products${q ? `?${q}` : ''}`;
  };

  const tabHref = (value: Series | 'all') => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (value !== 'all') params.set('series', value);
    const q = params.toString();
    return `/products${q ? `?${q}` : ''}`;
  };

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-primary">
            <Link href="/">HOME</Link> <span className="mx-2 text-muted-foreground">/</span> SHOP
          </p>
          <div className="mt-6 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">SHOP</p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.05em] text-ink sm:text-6xl">
                所有商品<br className="sm:hidden" />
                <span className="text-primary">everything.</span>
              </h1>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                依照系列、分類或關鍵字篩選。每件皆為單件庫存,售出即為永久缺貨。
              </p>
            </div>
            <form id="search" className="relative w-full max-w-md" action="/products">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                defaultValue={filters.q}
                className="h-14 w-full rounded-full border border-border bg-background pl-14 pr-24 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="搜尋名稱 / 分類 / 系列"
                aria-label="搜尋商品"
              />
              <button className="absolute right-2 top-2 h-10 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" type="submit">
                SEARCH
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {seriesTabs.map(({ value, label }) => {
            const active = value === 'all' ? !filters.series : filters.series === value;
            return (
              <Link
                key={value}
                className={`shrink-0 rounded-full px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[.2em] transition ${
                  active ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-ink hover:border-primary/40'
                }`}
                href={tabHref(value)}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-9 flex items-center justify-between border-b border-border pb-5">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-muted-foreground">
            {filtered.length} ITEMS · PAGE {currentPage} / {totalPages}
          </p>
          {(filters.q || filters.series) && (
            <Link className="text-link" href="/products">CLEAR</Link>
          )}
        </div>

        <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!products.length && (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-extrabold text-ink">找不到符合條件的商品</p>
            <Link className="text-link mt-3" href="/products">查看全部商品</Link>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-16 flex flex-wrap justify-center gap-2" aria-label="分頁">
            {currentPage > 1 && (
              <Link className="flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 font-mono text-xs font-bold uppercase tracking-[.18em] hover:border-primary" href={pageHref(currentPage - 1)}>
                PREV
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-mono text-xs font-bold ${
                  page === currentPage ? 'bg-primary text-primary-foreground' : 'border border-border bg-card hover:border-primary'
                }`}
                href={pageHref(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link className="flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 font-mono text-xs font-bold uppercase tracking-[.18em] hover:border-primary" href={pageHref(currentPage + 1)}>
                NEXT
              </Link>
            )}
          </nav>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
