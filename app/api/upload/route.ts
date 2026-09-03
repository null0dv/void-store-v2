import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getSanityAdminClient } from '@/lib/sanity-admin';
import { toSlug } from '@/lib/slugify';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_SERIES = new Set(['nullcraft', 'preloved', 'minerals']);
const ALLOWED_STOCK = new Set(['in-stock', 'ai-made']);

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('void_admin')?.value !== '1') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid form' }, { status: 400 });
  }

  const title = String(form.get('name') || '').trim();
  const price = Number(form.get('price') || 0);
  const rawSeries = String(form.get('series') || 'nullcraft');
  const category = String(form.get('category') || '').trim();
  const rawStockType = String(form.get('stockType') || 'in-stock');
  const description = String(form.get('description') || '').trim();
  const image = form.get('image');

  if (!title) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
  }
  const series = ALLOWED_SERIES.has(rawSeries) ? rawSeries : 'nullcraft';
  const stockType = ALLOWED_STOCK.has(rawStockType) ? rawStockType : 'in-stock';

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: 'image is required' }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'image exceeds 5MB' }, { status: 413 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json({ error: 'image must be jpg / png / webp' }, { status: 415 });
  }

  const sanity = getSanityAdminClient();

  const base = toSlug(title, Date.now());
  const existing = await sanity.fetch<string[]>(
    `*[_type == "product" && slug.current match $prefix].slug.current`,
    { prefix: `${base}*` },
  );
  const used = new Set(existing);
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;

  const buffer = Buffer.from(await image.arrayBuffer());
  const asset = await sanity.assets.upload('image', buffer, {
    filename: image.name || `${slug}.${image.type.split('/')[1] || 'jpg'}`,
    contentType: image.type,
  });

  const created = await sanity.create({
    _type: 'product',
    title,
    slug: { _type: 'slug', current: slug },
    price: Math.round(price),
    series,
    category,
    stockType,
    description,
    sold: false,
    sortOrder: Math.floor(Date.now() / 1000),
    mainImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  });

  revalidateTag('products');

  return NextResponse.json({
    ok: true,
    product: { _id: created._id, slug, title, image: asset.url },
  });
}
