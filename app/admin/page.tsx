'use client';

import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

function LoginForm() {
  const params = useSearchParams();
  const from = params.get('from') || '/upload';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: form.get('password') }),
    });
    setPending(false);
    if (res.ok) {
      window.location.href = from.startsWith('/') ? from : '/upload';
    } else {
      setError('密碼錯誤');
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto flex max-w-[520px] flex-col justify-center px-5 py-24 lg:py-32">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <p className="eyebrow mt-6">ADMIN</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.04em] text-ink">_null</h1>
          <p className="mt-3 text-sm text-muted-foreground">需要管理員密碼才能上架商品</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-7">
          <label className="form-label">
            PASSWORD
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              className="form-input"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[.18em] text-red-400">
              {error}
            </p>
          )}

          <button type="submit" disabled={pending} className="primary-button mt-6 w-full justify-center disabled:opacity-50">
            {pending ? 'CHECKING...' : <>ENTER <ArrowRight className="h-4 w-4" /></>}
          </button>

          <Link href="/" className="mt-4 block text-center font-mono text-xs uppercase tracking-[.2em] text-muted-foreground transition hover:text-ink">
            BACK TO SHOP
          </Link>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
