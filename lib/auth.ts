export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  initials: string;
};

function initialsFor(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
  return initials || 'JD';
}

export function getCurrentUser(request: Request): CurrentUser | null {
  const id = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email');
  const encodedName = request.headers.get('oai-authenticated-user-full-name');
  const nameEncoding = request.headers.get('oai-authenticated-user-full-name-encoding');
  const fullName = encodedName && nameEncoding === 'percent-encoded-utf-8'
    ? decodeURIComponent(encodedName)
    : null;

  if (!id && process.env.NODE_ENV !== 'development') return null;

  const resolvedEmail = email || 'demo@jdu.local';
  const resolvedName = fullName || resolvedEmail.split('@')[0] || 'JDU student';
  return {
    id: id || 'local-demo-user',
    email: resolvedEmail,
    name: resolvedName,
    initials: initialsFor(resolvedName),
  };
}
