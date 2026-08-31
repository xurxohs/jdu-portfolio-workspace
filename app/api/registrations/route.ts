import { getCurrentUser } from '@/lib/auth';
import { createRegistration } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const channel = body.channel === 'telegram' ? 'telegram' : body.channel === 'email' ? 'email' : null;
    const name = String(body.name || '').trim();
    const contact = String(body.contact || '').trim();
    if (!channel || !name || !contact) return Response.json({ error: 'Name and registration contact are required.' }, { status: 400 });
    if (name.length > 80 || contact.length > 120) return Response.json({ error: 'Registration details are too long.' }, { status: 400 });
    if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (channel === 'telegram' && !/^@?[a-zA-Z0-9_]{5,32}$/.test(contact)) return Response.json({ error: 'Enter a valid Telegram username.' }, { status: 400 });
    const registration = await createRegistration({ channel, name, contact }, await getCurrentUser(request));
    return Response.json({ registration }, { status: 201 });
  } catch (error) {
    console.error('Registration failed', error);
    return Response.json({ error: 'Registration could not be saved.' }, { status: 500 });
  }
}
