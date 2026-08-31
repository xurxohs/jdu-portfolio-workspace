import { getCurrentUser } from '@/lib/auth';
import { mediaBucket, mediaKey, type MediaKind } from '@/lib/media';

export const dynamic = 'force-dynamic';

function isMediaKind(value: string | null): value is MediaKind {
  return value === 'profile' || value === 'project';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind');
  if (!isMediaKind(kind)) return new Response(null, { status: 400 });

  let subjectId = url.searchParams.get('id') || '';
  if (kind === 'profile') {
    const user = await getCurrentUser(request);
    if (!user) return new Response(null, { status: 401 });
    subjectId = user.id;
  }
  if (!subjectId || !/^[a-zA-Z0-9_-]+$/.test(subjectId)) return new Response(null, { status: 400 });

  const bucket = mediaBucket();
  if (!bucket) return new Response(null, { status: 404 });
  const object = await bucket.get(mediaKey(kind, subjectId));
  if (!object) return new Response(null, { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Cache-Control', kind === 'profile' ? 'private, no-cache' : 'public, max-age=3600');
  headers.set('ETag', object.httpEtag);
  return new Response(object.body, { headers });
}
