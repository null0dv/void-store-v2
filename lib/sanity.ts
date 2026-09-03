import { createImageUrlBuilder } from '@sanity/image-url';
import { createClient } from 'next-sanity';
import type { Product, Series, StockType } from './products';

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h5qop6xy';
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-09-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function sanityImageUrl(source: unknown, width = 1200) {
  if (!source) return null;
  try {
    return builder.image(source as never).width(width).auto('format').url();
  } catch {
    return null;
  }
}

type SanityProduct = {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  price: number;
  series: Series;
  category?: string;
  stockType?: StockType;
  description?: string;
  mainImage?: unknown;
  tags?: string[];
  sold?: boolean;
  sortOrder?: number;
  originalCreatedAt?: string;
  legacyId?: number;
  legacyImageUrl?: string;
};

const PRODUCT_PROJECTION = `{
  _id, _createdAt,
  title, "slug": slug.current,
  price, series, category, stockType, description,
  mainImage, tags, sold, sortOrder,
  originalCreatedAt, legacyId, legacyImageUrl
}`;

function toProduct(doc: SanityProduct): Product {
  return {
    id: doc._id,
    slug: doc.slug,
    name: doc.title,
    price: doc.price,
    series: doc.series,
    category: doc.category || '',
    stockType: doc.stockType || 'in-stock',
    description: doc.description || '',
    image: sanityImageUrl(doc.mainImage, 1200) || doc.legacyImageUrl || '',
    tags: doc.tags,
    sold: doc.sold,
    createdAt: doc.originalCreatedAt || doc._createdAt,
  };
}

export async function fetchSanityProducts(): Promise<Product[]> {
  const docs = await sanityClient.fetch<SanityProduct[]>(
    `*[_type == "product" && defined(slug.current)] | order(sold asc, sortOrder desc, coalesce(originalCreatedAt, _createdAt) desc) ${PRODUCT_PROJECTION}`,
    {},
    { next: { revalidate: 60, tags: ['products'] } },
  );
  return docs.map(toProduct);
}

export async function fetchSanityProduct(slug: string): Promise<Product | null> {
  const doc = await sanityClient.fetch<SanityProduct | null>(
    `*[_type == "product" && slug.current == $slug][0] ${PRODUCT_PROJECTION}`,
    { slug },
    { next: { revalidate: 60, tags: ['products', `product:${slug}`] } },
  );
  return doc ? toProduct(doc) : null;
}
