import { getCurrentUser } from '@/lib/auth';
import { createReview } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const projectId = String(body.projectId || '').trim();
    const text = String(body.text || '').trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));
    if (!projectId || !text) return Response.json({ error: 'Project and feedback are required.' }, { status: 400 });
    return Response.json(await createReview(projectId, rating, text, user), { status: 201 });
  } catch (error) {
    console.error('Review creation failed', error);
    return Response.json({ error: 'Feedback could not be saved.' }, { status: 500 });
  }
}
