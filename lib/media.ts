import { env } from 'cloudflare:workers';

export type MediaKind = 'profile' | 'project';

type MediaEnv = { MEDIA?: R2Bucket };

export function mediaBucket() {
  return (env as unknown as MediaEnv).MEDIA;
}

export function mediaKey(kind: MediaKind, subjectId: string) {
  return kind === 'profile' ? `profiles/${subjectId}/avatar` : `projects/${subjectId}/cover`;
}

export function mediaUrl(kind: MediaKind, subjectId?: string) {
  const params = new URLSearchParams({ kind });
  if (subjectId) params.set('id', subjectId);
  return `/api/media?${params.toString()}`;
}

export const maxImageBytes = 5 * 1024 * 1024;
export const allowedImageTypes = new Set(['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']);
