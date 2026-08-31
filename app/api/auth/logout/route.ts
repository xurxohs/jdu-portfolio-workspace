import { logoutAccount } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    return Response.json({ ok: true }, { headers: { 'Set-Cookie': await logoutAccount(request) } });
  } catch (error) {
    console.error('Account logout failed', error);
    return Response.json({ error: 'Logout could not be completed.' }, { status: 500 });
  }
}
