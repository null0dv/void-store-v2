import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SERIES_LABEL, type Product } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  return (
    <article className="group">
      <Link className="relative block aspect-square overflow-hidden rounded-[1.35rem] border border-border bg-muted" href={href}>
        {product.tags?.[0] && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary backdrop-blur">
            {product.tags[0]}
          </span>
        )}
        {product.sold && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-background backdrop-blur">
            SOLD
          </span>
        )}
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </Link>
      <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-primary">
        {SERIES_LABEL[product.series]}
      </p>
      <h2 className="mt-2 text-lg font-extrabold tracking-tight text-ink">{product.name}</h2>
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-sm text-muted-foreground">{formatPrice(product.price)}</p>
        <Link className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[.18em] text-ink/55 transition hover:gap-2 hover:text-primary" href={href}>
          VIEW <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
