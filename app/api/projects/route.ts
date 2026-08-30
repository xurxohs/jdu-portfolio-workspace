import { getCurrentUser } from '@/lib/auth';
import { createProject, deleteProject, updateProject } from '@/lib/db';

export const dynamic = 'force-dynamic';

function validStatus(value: unknown): value is 'Published' | 'Draft' {
  return value === 'Published' || value === 'Draft';
}

function mutationError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'Project not found') return Response.json({ error: message }, { status: 404 });
  if (message === 'Project is not owned by this user') return Response.json({ error: 'Only the project creator can change this project.' }, { status: 403 });
  return Response.json({ error: fallback }, { status: 500 });
}

export async function POST(request: Request) {
  const user = getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    if (!title || !description) return Response.json({ error: 'Title and description are required.' }, { status: 400 });
    const project = await createProject({
      title,
      owner: String(body.owner || '').trim(),
      category: String(body.category || 'Culture + code'),
      description,
      demoUrl: String(body.demoUrl || '').trim(),
      status: validStatus(body.status) ? body.status : 'Draft',
    }, user);
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation failed', error);
    return Response.json({ error: 'Project could not be saved.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const projectId = String(body.projectId || '').trim();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    if (!projectId || !title || !description || !validStatus(body.status)) return Response.json({ error: 'Project, title, status and description are required.' }, { status: 400 });
    const project = await updateProject(projectId, {
      title,
      owner: String(body.owner || '').trim(),
      category: String(body.category || 'Culture + code').trim(),
      description,
      demoUrl: String(body.demoUrl || '').trim(),
      status: body.status,
    }, user);
    return Response.json(project);
  } catch (error) {
    console.error('Project update failed', error);
    return mutationError(error, 'Project could not be updated.');
  }
}

export async function DELETE(request: Request) {
  const user = getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  const projectId = new URL(request.url).searchParams.get('projectId')?.trim();
  if (!projectId) return Response.json({ error: 'Project ID is required.' }, { status: 400 });
  try {
    return Response.json(await deleteProject(projectId, user));
  } catch (error) {
    console.error('Project deletion failed', error);
    return mutationError(error, 'Project could not be deleted.');
  }
}
