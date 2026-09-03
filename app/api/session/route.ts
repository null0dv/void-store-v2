import { createHash, scryptSync, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function verifyPassword(input: string): boolean {
  const hashSpec = process.env.ADMIN_PASSWORD_HASH;
  if (hashSpec) {
    const m = hashSpec.match(/^scrypt\$([0-9a-f]+)\$([0-9a-f]+)$/i);
    if (!m) return false;
    const [, saltHex, hashHex] = m;
    const expected = Buffer.from(hashHex, 'hex');
    const derived = scryptSync(input, Buffer.from(saltHex, 'hex'), expected.length);
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  }
  const plain = process.env.ADMIN_PASSWORD || 'admin123';
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(plain).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !verifyPassword(password)) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set('void_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('void_admin');
  return response;
}
