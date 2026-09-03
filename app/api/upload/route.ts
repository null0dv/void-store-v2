import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const price = Number(form.get('price') || 0);
  const series = String(form.get('series') || 'nullcraft');
  const category = String(form.get('category') || '').trim();
  const stockType = String(form.get('stockType') || 'in-stock');
  const description = String(form.get('description') || '').trim();
  const image = form.get('image');

  if (!name || !price || !(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    product: {
      id: `nc-${Date.now()}`,
      name, price, series, category, stockType, description,
      imageSize: image.size,
      imageName: image.name,
    },
  });
}
