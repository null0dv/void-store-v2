import { ArrowRight, Boxes, Gem, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { getProducts } from '@/lib/products';

const seriesCards = [
  { key: 'nullcraft', name: 'NULLCRAFT', note: '手作陶、單件物件、印刷', icon: Layers, href: '/products?series=nullcraft' },
  { key: 'preloved', name: 'PRE-LOVED', note: '二手選品、Vintage、Archive', icon: Boxes, href: '/products?series=preloved' },
  { key: 'minerals', name: 'MINERALS', note: '天然礦石、原礦、水晶', icon: Gem, href: '/products?series=minerals' },
];

export default async function Home() {
  const all = await getProducts();
  const latest = all.slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <section id="top" className="relative isolate">
        <div className="hero-grid absolute inset-0 -z-10 opacity-80" />
        <div className="void-noise absolute inset-0 -z-20" />
        <div className="mx-auto grid min-h-[640px] max-w-[1280px] items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">CURATED BY _NULL — 2026</p>
            <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.6rem)] font-black leading-[.92] tracking-[-.065em] text-ink">
              Objects from
              <span className="mt-2 block text-primary">the void.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              手作、二手選品、原礦。每一件都經過挑選,不留贅語。
              <br />
              Nothing filler. Everything considered.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link className="primary-button" href="/products">
                ENTER SHOP <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="secondary-button" href="/upload">UPLOAD</Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[.2em] text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> HAND-PICKED</span>
              <span className="flex items-center gap-2"><Gem className="h-4 w-4 text-primary" /> ONE-OF-ONE</span>
              <span className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> SHIP FROM TAIPEI</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] md:mx-0">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sun/25 blur-3xl" />
            <div className="absolute -bottom-14 -left-10 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_34px_90px_-35px_rgba(0,0,0,.85)]">
              <img className="h-full w-full object-cover" src="/demo/hero.jpg" alt="VOID.STORE 精選" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent px-7 pb-7 pt-32 text-ink">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-sun">FEATURED · MINERALS</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">Obsidian shard</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">Volcanic glass · Mexico</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur sm:-left-8 sm:p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">_NULL PICK</p>
              <p className="mt-1 font-extrabold text-ink">One of one · shipped 24h</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">SHOP BY SERIES</p>
            <h2 className="section-title">從系列開始</h2>
          </div>
          <Link className="text-link" href="/products">
            ALL PRODUCTS <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seriesCards.map(({ key, name, note, icon: Icon, href }) => (
            <Link
              key={key}
              className="group rounded-[1.4rem] border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
              href={href}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-xl font-extrabold tracking-tight text-ink">{name}</h3>
              <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{note}</p>
              <ArrowRight className="mt-6 h-5 w-5 text-primary transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        <div className="mt-24 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">RECENT DROPS</p>
            <h2 className="section-title">最新上架</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            每一件都是單件庫存。看到喜歡的直接下單,補貨機率極低。
          </p>
        </div>
        <div className="mt-10 grid gap-x-5 gap-y-12 md:grid-cols-3">
          {latest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="border-y border-border bg-cream px-5 py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:px-3">
          <div>
            <p className="eyebrow text-sun">HOW IT WORKS</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-.04em] text-ink sm:text-5xl">
              下單流程<br />簡單就好。
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              看到喜歡的直接私訊 LINE,匯款後 24 小時內出貨。沒有會員系統,沒有折扣券,沒有滿額贈。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'BROWSE', '從系列或分類挑選喜歡的物件'],
              ['02', 'MESSAGE', '私訊 LINE @null.void 告知品項'],
              ['03', 'SHIP', '匯款後 24 小時內從台北出貨'],
            ].map(([step, title, copy]) => (
              <div key={step} className="group rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40">
                <p className="font-mono text-xs font-bold tracking-[.22em] text-sun">{step}</p>
                <h3 className="mt-8 font-extrabold tracking-tight text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
