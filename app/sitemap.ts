import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://void.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/products?series=nullcraft`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/products?series=preloved`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/products?series=minerals`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const products = await getProducts().catch(() => []);
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
