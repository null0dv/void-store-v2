#!/usr/bin/env node
// Migrate VOID.STORE products from Supabase to Sanity.
// Reads products.json from Supabase Storage bucket, downloads each image,
// uploads image to Sanity as an asset, then creates one product document per row.
//
// Env (put in .env.local at project root):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   SUPABASE_STORAGE_BUCKET   (default: product-images)
//   SUPABASE_PRODUCTS_KEY     (default: products.json)
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET   (default: production)
//   SANITY_API_WRITE_TOKEN    <-- must have write scope
//
// Usage: npm run migrate

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient as createSanityClient } from '@sanity/client';
// Supabase is fetched via storage REST API to avoid an extra dependency.

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf-8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
}

const requireEnv = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};

const SUPABASE_URL = requireEnv('SUPABASE_URL').replace(/\/$/, '');
const SUPABASE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
const PRODUCTS_KEY = process.env.SUPABASE_PRODUCTS_KEY || 'products.json';

const SANITY_PROJECT_ID = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_TOKEN = requireEnv('SANITY_API_WRITE_TOKEN');

const sanity = createSanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-09-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

async function downloadFromSupabase(objectPath) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!res.ok) throw new Error(`Supabase download failed (${res.status}): ${objectPath}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchProductsJson() {
  const buf = await downloadFromSupabase(PRODUCTS_KEY);
  const arr = JSON.parse(buf.toString('utf-8'));
  if (!Array.isArray(arr)) throw new Error('products.json is not an array');
  return arr;
}

function slugify(text, id) {
  const base = String(text || '')
    .normalize('NFKD')
    .replace(/[一-鿿]+/g, (m) => encodeURIComponent(m).replace(/%/g, '').toLowerCase())
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return base || `item-${id}`;
}

function normalizeStockType(raw) {
  const v = String(raw || '').trim();
  if (v === 'AI製' || v === 'ai-made') return 'ai-made';
  return 'in-stock';
}

function normalizeSeries(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (v === 'preloved' || v === '二手選品' || v === 'pre-loved') return 'preloved';
  if (v === 'minerals' || v === '礦石') return 'minerals';
  return 'nullcraft';
}

function parseCreatedAt(raw) {
  if (!raw) return null;
  const s = String(raw)
    .replace(/年|月/g, '/').replace(/日/g, '')
    .replace('上午', 'AM').replace('下午', 'PM');
  const m = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*(AM|PM)?(\d{1,2}):(\d{2}):(\d{2})/);
  if (m) {
    let [, y, mo, d, ap, h, mi, se] = m;
    let hour = parseInt(h, 10);
    if (ap === 'PM' && hour < 12) hour += 12;
    if (ap === 'AM' && hour === 12) hour = 0;
    const iso = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${mi}:${se}+08:00`;
    const dt = new Date(iso);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }
  const dt = new Date(raw);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

function extractSupabaseObjectPath(imageUrl) {
  const m = String(imageUrl || '').match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function extFromPath(p) {
  const m = String(p || '').match(/\.([a-z0-9]{2,5})(?:\?|$)/i);
  return (m ? m[1] : 'jpg').toLowerCase();
}

async function uploadImageToSanity(imageUrl, id) {
  const objectPath = extractSupabaseObjectPath(imageUrl);
  let buf;
  if (objectPath) {
    buf = await downloadFromSupabase(objectPath);
  } else {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`image fetch failed ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
  }
  const ext = extFromPath(objectPath || imageUrl);
  const filename = `product-${id}.${ext}`;
  const asset = await sanity.assets.upload('image', buf, { filename });
  return asset._id;
}

async function migrate() {
  console.log('[migrate] fetching products.json from Supabase...');
  const rows = await fetchProductsJson();
  console.log(`[migrate] found ${rows.length} products in Supabase`);

  const existing = await sanity.fetch(
    `*[_type == "product" && defined(legacyId)]{ _id, legacyId }`
  );
  const existingByLegacyId = new Map(existing.map((d) => [d.legacyId, d._id]));
  console.log(`[migrate] ${existing.length} product(s) already migrated (matched by legacyId)`);

  const usedSlugs = new Set();
  let ok = 0, skipped = 0, failed = 0;

  for (const row of rows) {
    const label = `#${row.id} ${row.name}`;
    if (existingByLegacyId.has(row.id)) {
      console.log(`[skip] ${label} — legacyId already exists in Sanity`);
      skipped++;
      continue;
    }
    try {
      console.log(`[uploading image] ${label}`);
      const assetId = await uploadImageToSanity(row.image, row.id);

      let slug = slugify(row.name, row.id);
      let candidate = slug;
      let n = 2;
      while (usedSlugs.has(candidate)) candidate = `${slug}-${n++}`;
      usedSlugs.add(candidate);

      const doc = {
        _type: 'product',
        title: row.name,
        slug: { _type: 'slug', current: candidate },
        price: Number(row.price) || 0,
        series: normalizeSeries(row.series),
        category: row.category || '',
        stockType: normalizeStockType(row.stock_type),
        description: row.description || '',
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        },
        sold: Boolean(row.sold),
        sortOrder: Number(row.sort_order) || 0,
        originalCreatedAt: parseCreatedAt(row.created_at),
        legacyId: row.id,
        legacyImageUrl: row.image,
      };

      const created = await sanity.create(doc);
      console.log(`[ok]   ${label} → ${created._id} (slug: ${candidate})`);
      ok++;
    } catch (e) {
      console.error(`[fail] ${label} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\n[migrate] done. ok=${ok}, skipped=${skipped}, failed=${failed}`);
  if (failed > 0) process.exit(1);
}

migrate().catch((e) => {
  console.error('[migrate] fatal:', e);
  process.exit(1);
});
