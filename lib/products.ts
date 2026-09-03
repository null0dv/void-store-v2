export type Series = 'nullcraft' | 'preloved' | 'minerals';
export type StockType = 'in-stock' | 'ai-made';

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  series: Series;
  category: string;
  stockType: StockType;
  description: string;
  image: string;
  tags?: string[];
  sold?: boolean;
  createdAt: string;
};

export const SERIES_LABEL: Record<Series, string> = {
  nullcraft: 'NULLCRAFT',
  preloved: 'PRE-LOVED',
  minerals: 'MINERALS',
};

export const STOCK_LABEL: Record<StockType, string> = {
  'in-stock': 'IN STOCK',
  'ai-made': 'AI MADE',
};

const demo: Product[] = [
  {
    id: 'nc-001',
    slug: 'ceramic-void-cup',
    name: 'Ceramic void cup',
    price: 880,
    series: 'nullcraft',
    category: 'ceramic',
    stockType: 'in-stock',
    description: '手作陶土杯,啞光黑釉,單件成型。杯緣微不對稱是刻意的。',
    image: '/demo/product-1.jpg',
    tags: ['NEW'],
    createdAt: '2026-08-14',
  },
  {
    id: 'nc-002',
    slug: 'obsidian-shard',
    name: 'Obsidian shard',
    price: 1280,
    series: 'minerals',
    category: 'raw',
    stockType: 'in-stock',
    description: '天然黑曜石原石,火山玻璃,墨西哥產。附贈植絨墊。',
    image: '/demo/product-2.jpg',
    tags: ['ONE OF ONE'],
    createdAt: '2026-08-10',
  },
  {
    id: 'nc-003',
    slug: 'issey-vintage-shirt',
    name: 'Issey vintage overshirt',
    price: 3200,
    series: 'preloved',
    category: 'apparel',
    stockType: 'in-stock',
    description: '90s Issey Miyake overshirt,Size M,狀況良好,袖口輕微色差。',
    image: '/demo/product-3.jpg',
    tags: ['SIZE M'],
    createdAt: '2026-08-05',
  },
  {
    id: 'nc-004',
    slug: 'ai-lithograph-a5',
    name: 'AI lithograph — A5',
    price: 480,
    series: 'nullcraft',
    category: 'print',
    stockType: 'ai-made',
    description: '由 _null 訓練 style 產出,SDXL + LoRA,A5 藝術紙,一版一印。',
    image: '/demo/product-4.jpg',
    createdAt: '2026-07-28',
  },
  {
    id: 'nc-005',
    slug: 'clear-quartz-cluster',
    name: 'Clear quartz cluster',
    price: 2400,
    series: 'minerals',
    category: 'raw',
    stockType: 'in-stock',
    description: '巴西白水晶簇,重 340g,無包裹體,晶尖完整。',
    image: '/demo/product-5.jpg',
    tags: ['340G'],
    createdAt: '2026-07-20',
  },
  {
    id: 'nc-006',
    slug: 'null-tee-black',
    name: 'NULL tee — black',
    price: 980,
    series: 'nullcraft',
    category: 'apparel',
    stockType: 'in-stock',
    description: '250g 重磅純棉,絲網印刷 _null logo,單面設計。',
    image: '/demo/product-6.jpg',
    createdAt: '2026-07-15',
  },
];

const USE_SANITY = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export async function getProducts(): Promise<Product[]> {
  if (!USE_SANITY) return demo;
  const { fetchSanityProducts } = await import('./sanity');
  try {
    const items = await fetchSanityProducts();
    return items.length ? items : demo;
  } catch {
    return demo;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!USE_SANITY) return demo.find((p) => p.slug === slug);
  const { fetchSanityProduct } = await import('./sanity');
  try {
    const item = await fetchSanityProduct(slug);
    return item || demo.find((p) => p.slug === slug);
  } catch {
    return demo.find((p) => p.slug === slug);
  }
}

export const CATEGORY_GROUPS: Record<string, string[]> = {
  ceramic: ['ceramic'],
  apparel: ['apparel'],
  minerals: ['raw'],
  print: ['print'],
};
