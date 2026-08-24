import { getCurrentUser } from '@/lib/auth';
import { createProject } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
    }, user);
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation failed', error);
    return Response.json({ error: 'Project could not be saved.' }, { status: 500 });
  }
}
