#!/usr/bin/env node
// Regenerate slugs for products in Sanity, using pinyin for Chinese titles.
// Idempotent: only patches when the new slug differs from the current one.
// Ensures uniqueness by appending -2, -3, ... on collision.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { pinyin } from 'pinyin-pro';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
}

const requireEnv = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};

const sanity = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-01',
  token: requireEnv('SANITY_API_WRITE_TOKEN'),
  useCdn: false,
});

function toSlug(input, fallback) {
  if (!input) return fallback ? String(fallback) : '';
  const raw = String(input).trim();
  const hasCJK = /[㐀-鿿豈-﫿]/.test(raw);
  const source = hasCJK
    ? pinyin(raw, { toneType: 'none', v: true, separator: ' ', nonZh: 'consecutive' })
    : raw;
  const slug = source
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60);
  return slug || (fallback ? String(fallback) : '');
}

async function main() {
  const products = await sanity.fetch(
    `*[_type == "product"] | order(sortOrder desc){ _id, title, "slug": slug.current, legacyId }`
  );
  console.log(`[fix-slugs] loaded ${products.length} products`);

  const used = new Set();
  const patches = [];

  for (const p of products) {
    let base = toSlug(p.title, p.legacyId ?? p._id);
    let candidate = base;
    let n = 2;
    while (used.has(candidate)) candidate = `${base}-${n++}`;
    used.add(candidate);
    if (candidate !== p.slug) {
      patches.push({ id: p._id, from: p.slug, to: candidate, title: p.title });
    } else {
      console.log(`[keep] ${p.title} → ${p.slug}`);
    }
  }

  if (!patches.length) {
    console.log('[fix-slugs] nothing to change');
    return;
  }

  console.log(`[fix-slugs] patching ${patches.length} product(s):`);
  const tx = sanity.transaction();
  for (const p of patches) {
    console.log(`  ${p.title}  |  ${p.from}  →  ${p.to}`);
    tx.patch(p.id, { set: { 'slug': { _type: 'slug', current: p.to } } });
  }
  await tx.commit();
  console.log('[fix-slugs] done.');
}

main().catch((e) => {
  console.error('[fix-slugs] fatal:', e);
  process.exit(1);
});
