import { getCurrentUser } from '@/lib/auth';
import { ensureDatabase } from '@/lib/db';
import { allowedImageTypes, maxImageBytes, mediaBucket, mediaKey, mediaUrl, type MediaKind } from '@/lib/media';

export const dynamic = 'force-dynamic';

function isMediaKind(value: string): value is MediaKind {
  return value === 'profile' || value === 'project';
}

export async function POST(request: Request) {
  const user = getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });

  try {
    const form = await request.formData();
    const kind = String(form.get('kind') || '');
    const file = form.get('file');
    const projectId = String(form.get('projectId') || '').trim();

    if (!isMediaKind(kind)) return Response.json({ error: 'Media kind is required.' }, { status: 400 });
    if (!(file instanceof File) || !file.size) return Response.json({ error: 'An image file is required.' }, { status: 400 });
    if (!allowedImageTypes.has(file.type)) return Response.json({ error: 'Use JPG, PNG, WebP, GIF, or AVIF.' }, { status: 415 });
    if (file.size > maxImageBytes) return Response.json({ error: 'The image must be smaller than 5 MB.' }, { status: 413 });

    let subjectId = user.id;
    if (kind === 'project') {
      if (!projectId || !/^[a-zA-Z0-9_-]+$/.test(projectId)) return Response.json({ error: 'A valid project is required.' }, { status: 400 });
      const db = await ensureDatabase();
      const rows = await db.prepare('SELECT owner_id FROM projects WHERE id = ?').bind(projectId).all<{ owner_id: string }>();
      if (!rows.results.length) return Response.json({ error: 'Project not found.' }, { status: 404 });
      if (String(rows.results[0].owner_id) !== user.id) return Response.json({ error: 'You cannot edit this project.' }, { status: 403 });
      subjectId = projectId;
    }

    const bucket = mediaBucket();
    if (!bucket) return Response.json({ error: 'Image storage is not available.' }, { status: 503 });
    await bucket.put(mediaKey(kind, subjectId), file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: kind === 'profile' ? 'private, no-cache' : 'public, max-age=3600',
      },
      customMetadata: {
        ownerId: user.id,
        originalName: file.name.slice(0, 120),
      },
    });

    return Response.json({ url: mediaUrl(kind, subjectId) }, { status: 201 });
  } catch (error) {
    console.error('Image upload failed', error);
    return Response.json({ error: 'Image could not be uploaded.' }, { status: 500 });
  }
}
