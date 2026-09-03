import { pinyin } from 'pinyin-pro';

export function toSlug(input: string, fallback?: string | number): string {
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
