import { getCurrentUser } from '@/lib/auth';
import { createBoardItem, listBoardItems, updateBoardItem, type BoardColumn } from '@/lib/db';

export const dynamic = 'force-dynamic';

function validColumn(value: unknown): value is BoardColumn {
  return value === 'todo' || value === 'progress' || value === 'done';
}

function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'Project not found' || message === 'Board item not found') return Response.json({ error: message }, { status: 404 });
  if (message === 'Project is not owned by this user') return Response.json({ error: 'Only the project creator can update the board.' }, { status: 403 });
  return Response.json({ error: fallback }, { status: 500 });
}

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get('projectId')?.trim();
  if (!projectId) return Response.json({ error: 'Project ID is required.' }, { status: 400 });
  try {
    return Response.json({ items: await listBoardItems(projectId) });
  } catch (error) {
    console.error('Board lookup failed', error);
    return errorResponse(error, 'Board data is temporarily unavailable.');
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const projectId = String(body.projectId || '').trim();
    const title = String(body.title || '').trim();
    const detail = String(body.detail || '').trim();
    const column = body.column;
    if (!projectId || !title || !validColumn(column)) return Response.json({ error: 'Project, column and task title are required.' }, { status: 400 });
    if (title.length > 120 || detail.length > 180) return Response.json({ error: 'Board item text is too long.' }, { status: 400 });
    return Response.json(await createBoardItem(projectId, { column, title, detail }, user), { status: 201 });
  } catch (error) {
    console.error('Board item creation failed', error);
    return errorResponse(error, 'Board item could not be saved.');
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const itemId = String(body.itemId || '').trim();
    const column = body.column;
    if (!itemId || !validColumn(column)) return Response.json({ error: 'Board item and column are required.' }, { status: 400 });
    return Response.json(await updateBoardItem(itemId, column, user));
  } catch (error) {
    console.error('Board item update failed', error);
    return errorResponse(error, 'Board item could not be updated.');
  }
}
