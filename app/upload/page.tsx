'use client';

import { ArrowRight, ImagePlus, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { SERIES_LABEL, STOCK_LABEL, type Series, type StockType } from '@/lib/products';

const seriesOptions: Series[] = ['nullcraft', 'preloved', 'minerals'];
const stockOptions: StockType[] = ['in-stock', 'ai-made'];

export default function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<'ok' | 'error' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(file: File | null) {
    if (!file) { setPreview(null); return; }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    setPending(false);
    setResult(res.ok ? 'ok' : 'error');
    if (res.ok) {
      event.currentTarget.reset();
      setPreview(null);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-primary">
            <Link href="/">HOME</Link> <span className="mx-2 text-muted-foreground">/</span> UPLOAD
          </p>
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow">NEW ITEM</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.05em] text-ink sm:text-6xl">
              上架<span className="text-primary">.</span>
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              一件一表單。填完存檔後會出現在 shop 頁面。圖片上傳最大 5MB,JPG / PNG / WebP。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 py-14 lg:px-8 lg:py-20">
        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-6">
            <Field label="NAME *" required>
              <input required name="name" placeholder="Handmade ceramic cup" className="form-input" />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="PRICE (NT$) *" required>
                <input required type="number" min={0} step={1} name="price" placeholder="0" className="form-input" />
              </Field>
              <Field label="CATEGORY">
                <input name="category" placeholder="ceramic / apparel / raw ..." className="form-input" />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="SERIES">
                <select name="series" defaultValue="nullcraft" className="form-input">
                  {seriesOptions.map((s) => (
                    <option key={s} value={s}>{SERIES_LABEL[s]}</option>
                  ))}
                </select>
              </Field>
              <Field label="TYPE">
                <select name="stockType" defaultValue="in-stock" className="form-input">
                  {stockOptions.map((s) => (
                    <option key={s} value={s}>{STOCK_LABEL[s]}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="DESCRIPTION">
              <textarea name="description" rows={5} placeholder="尺寸、材質、狀況、來源..." className="form-input min-h-[140px] py-3" />
            </Field>
          </div>

          <div className="space-y-6">
            <Field label="IMAGE *" required>
              <label
                htmlFor="image-upload"
                className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card transition hover:border-primary/50"
              >
                <input
                  id="image-upload"
                  ref={fileRef}
                  required
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                />
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-ink backdrop-blur hover:bg-background"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview(null);
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                      aria-label="移除圖片"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground transition group-hover:text-ink">
                    <ImagePlus className="h-9 w-9" />
                    <span className="font-mono text-xs uppercase tracking-[.22em]">CLICK TO SELECT</span>
                    <span className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground/70">JPG · PNG · WEBP · 5MB</span>
                  </div>
                )}
              </label>
            </Field>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-muted-foreground">TIPS</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>· 圖片建議 1:1 正方形,長邊 1200px 以上</li>
                <li>· 名稱簡短、DESCRIPTION 交代狀況與尺寸</li>
                <li>· 現貨為單件庫存,售出後請至 admin 標記 sold</li>
              </ul>
            </div>

            <button type="submit" disabled={pending} className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              {pending ? <><UploadCloud className="h-4 w-4 animate-pulse" /> UPLOADING...</> : <><UploadCloud className="h-4 w-4" /> PUBLISH</>}
            </button>

            {result === 'ok' && (
              <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 font-mono text-xs uppercase tracking-[.18em] text-primary">
                UPLOADED · <Link className="underline-offset-4 hover:underline" href="/products">VIEW SHOP <ArrowRight className="inline h-3 w-3" /></Link>
              </div>
            )}
            {result === 'error' && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[.18em] text-red-400">
                UPLOAD FAILED · TRY AGAIN
              </div>
            )}
          </div>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="form-label">
      <span>{label}{required && <span className="ml-1 text-primary">*</span>}</span>
      {children}
    </label>
  );
}
