import { getCurrentUser } from '@/lib/auth';
import { getProfile, upsertProfile } from '@/lib/db';
import { mediaBucket, mediaKey, mediaUrl } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const profile = await getProfile(user);
    if (!profile) return Response.json({ profile: null });
    let avatarUrl: string | undefined;
    try {
      const bucket = mediaBucket();
      if (bucket && await bucket.head(mediaKey('profile', user.id))) avatarUrl = mediaUrl('profile');
    } catch {
      // D1 profile data remains available if the optional avatar object is unavailable.
    }
    return Response.json({ profile: { ...profile, ...(avatarUrl ? { avatarUrl } : {}) } });
  } catch (error) {
    console.error('Profile lookup failed', error);
    return Response.json({ error: 'Profile data is temporarily unavailable.' }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const profile = {
      name: String(body.name || '').trim(),
      handle: String(body.handle || '').trim(),
      role: String(body.role || '').trim(),
      track: String(body.track || '').trim(),
      bio: String(body.bio || '').trim(),
    };
    if (!profile.name || !profile.role || !profile.track || !profile.bio) {
      return Response.json({ error: 'Name, role, track and bio are required.' }, { status: 400 });
    }
    if (profile.name.length > 80 || profile.role.length > 80 || profile.track.length > 80 || profile.bio.length > 400) {
      return Response.json({ error: 'Profile fields are too long.' }, { status: 400 });
    }
    return Response.json({ profile: await upsertProfile(profile, user) });
  } catch (error) {
    console.error('Profile save failed', error);
    return Response.json({ error: 'Profile could not be saved.' }, { status: 500 });
  }
}
