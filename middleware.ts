import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.cookies.get('void_admin')?.value === '1') return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = '/admin';
  url.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/upload'] };
