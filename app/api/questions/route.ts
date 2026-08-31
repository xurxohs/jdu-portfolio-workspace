import { getCurrentUser } from '@/lib/auth';
import { createQuestion } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const projectId = String(body.projectId || '').trim();
    const text = String(body.text || '').trim();
    if (!projectId || !text) return Response.json({ error: 'Project and question are required.' }, { status: 400 });
    return Response.json(await createQuestion(projectId, text, user), { status: 201 });
  } catch (error) {
    console.error('Question creation failed', error);
    return Response.json({ error: 'Question could not be saved.' }, { status: 500 });
  }
}
