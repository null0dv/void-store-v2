import { createClient } from '@sanity/client';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanity';

let cached: ReturnType<typeof createClient> | null = null;

export function getSanityAdminClient() {
  if (cached) return cached;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set');
  cached = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2026-09-01',
    token,
    useCdn: false,
  });
  return cached;
}
