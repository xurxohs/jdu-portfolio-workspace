import { registerAccount, type AuthChannel } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function validChannel(value: unknown): value is AuthChannel {
  return value === 'email' || value === 'telegram';
}

function validLogin(channel: AuthChannel, login: string) {
  return channel === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)
    : /^@?[a-zA-Z0-9_]{5,32}$/.test(login);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const channel = body.channel;
    const login = String(body.login || '').trim();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    if (!validChannel(channel) || !name || !login || !password) return Response.json({ error: 'Name, login and password are required.' }, { status: 400 });
    if (name.length > 80 || login.length > 120) return Response.json({ error: 'Registration details are too long.' }, { status: 400 });
    if (!validLogin(channel, login)) return Response.json({ error: channel === 'email' ? 'Enter a valid email address.' : 'Enter a valid Telegram username.' }, { status: 400 });
    if (password.length < 8 || password.length > 128) return Response.json({ error: 'Password must contain 8–128 characters.' }, { status: 400 });
    const result = await registerAccount(request, { channel, login, password, name });
    return Response.json({ user: result.account }, { status: 201, headers: { 'Set-Cookie': result.cookie } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'Account already exists') return Response.json({ error: 'An account with this login already exists.' }, { status: 409 });
    console.error('Account registration failed', error);
    return Response.json({ error: 'Registration could not be completed.' }, { status: 500 });
  }
}
