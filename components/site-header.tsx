import { Menu, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <>
      <div className="border-b border-border bg-cream px-5 py-2.5 text-center font-mono text-[11px] uppercase tracking-[.22em] text-muted-foreground sm:text-xs">
        <span className="text-ink">NEW DROP</span>
        <span className="mx-3 text-border">/</span>
        MINERALS RESTOCK — 2026.09
        <Link className="ml-3 text-sun underline-offset-4 hover:underline" href="/products?series=minerals">
          VIEW
        </Link>
      </div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label="VOID.STORE 首頁" className="flex items-baseline">
            <span className="text-xl font-black tracking-[-.05em] text-ink">VOID</span>
            <span className="font-mono text-sm font-medium tracking-[.14em] text-primary">.STORE</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-ink lg:flex" aria-label="主要導覽">
            <Link className="nav-link" href="/products">SHOP</Link>
            <Link className="nav-link" href="/products?series=nullcraft">NULLCRAFT</Link>
            <Link className="nav-link" href="/products?series=preloved">PRE-LOVED</Link>
            <Link className="nav-link" href="/products?series=minerals">MINERALS</Link>
            <Link className="nav-link" href="/upload">UPLOAD</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="icon-button" href="/products#search" aria-label="搜尋商品"><Search className="h-5 w-5" /></Link>
            <Link className="icon-button" href="/cart" aria-label="購物車"><ShoppingBag className="h-5 w-5" /></Link>
            <Link className="hidden rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 sm:inline-flex" href="/admin">_null</Link>
            <details className="relative lg:hidden">
              <summary className="icon-button cursor-pointer list-none" aria-label="開啟選單"><Menu className="h-5 w-5" /></summary>
              <nav className="absolute right-0 top-12 z-50 grid w-52 overflow-hidden rounded-2xl border border-border bg-card p-2 text-sm font-bold shadow-2xl">
                <Link className="rounded-xl px-4 py-3 hover:bg-muted" href="/products">SHOP</Link>
                <Link className="rounded-xl px-4 py-3 hover:bg-muted" href="/products?series=nullcraft">NULLCRAFT</Link>
                <Link className="rounded-xl px-4 py-3 hover:bg-muted" href="/products?series=preloved">PRE-LOVED</Link>
                <Link className="rounded-xl px-4 py-3 hover:bg-muted" href="/products?series=minerals">MINERALS</Link>
                <Link className="rounded-xl px-4 py-3 hover:bg-muted" href="/upload">UPLOAD</Link>
                <Link className="rounded-xl px-4 py-3 text-primary hover:bg-muted" href="/admin">_null</Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream px-5 py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-10 sm:flex-row sm:items-end lg:px-3">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-[-.05em] text-ink">VOID</span>
            <span className="font-mono text-base font-medium tracking-[.14em] text-primary">.STORE</span>
          </div>
          <p className="mt-5 max-w-sm font-mono text-xs leading-6 uppercase tracking-[.14em] text-muted-foreground">
            CURATED BY _NULL<br />
            HANDMADE · PRE-LOVED · MINERALS
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-[.14em] text-muted-foreground sm:text-right">
          <p className="font-bold text-ink">LINE @null.void</p>
          <p className="mt-2">IG @void.store</p>
          <p className="mt-5">© {new Date().getFullYear()} VOID.STORE — ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}
