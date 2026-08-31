import { loginAccount, type AuthChannel } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function validChannel(value: unknown): value is AuthChannel {
  return value === 'email' || value === 'telegram';
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const channel = body.channel;
    const login = String(body.login || '').trim();
    const password = String(body.password || '');
    if (!validChannel(channel) || !login || !password) return Response.json({ error: 'Login and password are required.' }, { status: 400 });
    const result = await loginAccount(request, { channel, login, password });
    return Response.json({ user: result.account }, { headers: { 'Set-Cookie': result.cookie } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'Invalid login or password') return Response.json({ error: 'Invalid login or password.' }, { status: 401 });
    console.error('Account login failed', error);
    return Response.json({ error: 'Login could not be completed.' }, { status: 500 });
  }
}
