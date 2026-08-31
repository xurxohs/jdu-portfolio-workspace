import { env } from 'cloudflare:workers';
import { ensureDatabase } from '@/lib/db';

export type AuthChannel = 'email' | 'telegram';

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  initials: string;
};

export type AuthAccount = CurrentUser & {
  channel: AuthChannel;
  login: string;
};

export const sessionCookieName = 'jdu_session';
const sessionDays = 30;

function initialsFor(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
  return initials || 'JD';
}

function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('D1 binding DB is not available');
  return db;
}

function normalizeLogin(channel: AuthChannel, login: string) {
  const trimmed = login.trim().toLowerCase();
  return channel === 'telegram' ? trimmed.replace(/^@/, '') : trimmed;
}

function encodeBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return encodeBase64(bits);
}

function equalStrings(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) difference |= leftBytes[index] ^ rightBytes[index];
  return difference === 0;
}

function accountToUser(row: { id: string; channel: AuthChannel; login: string; name: string }): AuthAccount {
  return {
    id: String(row.id),
    email: row.channel === 'email' ? String(row.login) : `${String(row.login)}@telegram.jdu.local`,
    name: String(row.name),
    initials: initialsFor(String(row.name)),
    channel: row.channel,
    login: String(row.login),
  };
}

function sessionCookie(request: Request, sessionId: string) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookieName}=${encodeURIComponent(sessionId)}; Max-Age=${sessionDays * 24 * 60 * 60}; Path=/; HttpOnly${secure}; SameSite=Lax`;
}

export function clearSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookieName}=; Max-Age=0; Path=/; HttpOnly${secure}; SameSite=Lax`;
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') || '';
  const match = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

async function userFromSession(request: Request): Promise<CurrentUser | null> {
  const sessionId = readCookie(request, sessionCookieName);
  if (!sessionId) return null;
  const db = database();
  const result = await db.prepare(`SELECT a.id, a.channel, a.login, a.name
    FROM auth_sessions s JOIN auth_accounts a ON a.id = s.user_id
    WHERE s.id = ? AND s.expires_at > ?`).bind(sessionId, new Date().toISOString()).all<{ id: string; channel: AuthChannel; login: string; name: string }>();
  const row = result.results[0];
  return row ? accountToUser(row) : null;
}

function hostUser(request: Request): CurrentUser | null {
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

export async function getCurrentUser(request: Request): Promise<CurrentUser | null> {
  try {
    const sessionUser = await userFromSession(request);
    if (sessionUser) return sessionUser;
  } catch {
    // Keep local development usable when D1 is not available yet.
  }
  return process.env.NODE_ENV === 'development' ? hostUser(request) : null;
}

export async function registerAccount(request: Request, input: { channel: AuthChannel; login: string; password: string; name: string }) {
  const db = await ensureDatabase();
  const normalizedLogin = normalizeLogin(input.channel, input.login);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: AuthAccount = {
    id: `account-${crypto.randomUUID().slice(0, 8)}`,
    email: input.channel === 'email' ? normalizedLogin : `${normalizedLogin}@telegram.jdu.local`,
    name: input.name.trim(),
    initials: initialsFor(input.name),
    channel: input.channel,
    login: normalizedLogin,
  };
  const passwordHash = await hashPassword(input.password, salt);
  try {
    await db.prepare(`INSERT INTO auth_accounts (id, channel, login, login_key, password_hash, password_salt, name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(account.id, account.channel, account.login, `${account.channel}:${normalizedLogin}`, passwordHash, encodeBase64(salt.buffer), account.name, new Date().toISOString()).run();
  } catch (error) {
    if (String(error).toLowerCase().includes('unique')) throw new Error('Account already exists');
    throw error;
  }
  const sessionId = await createSession(account.id);
  return { account, cookie: sessionCookie(request, sessionId) };
}

export async function loginAccount(request: Request, input: { channel: AuthChannel; login: string; password: string }) {
  const db = await ensureDatabase();
  const normalizedLogin = normalizeLogin(input.channel, input.login);
  const result = await db.prepare(`SELECT id, channel, login, name, password_hash, password_salt FROM auth_accounts WHERE login_key = ?`)
    .bind(`${input.channel}:${normalizedLogin}`).all<{ id: string; channel: AuthChannel; login: string; name: string; password_hash: string; password_salt: string }>();
  const row = result.results[0];
  if (!row || !equalStrings(await hashPassword(input.password, decodeBase64(String(row.password_salt))), String(row.password_hash))) throw new Error('Invalid login or password');
  const account = accountToUser(row);
  const sessionId = await createSession(account.id);
  return { account, cookie: sessionCookie(request, sessionId) };
}

export async function logoutAccount(request: Request) {
  const sessionId = readCookie(request, sessionCookieName);
  if (sessionId) {
    const db = await ensureDatabase();
    await db.prepare('DELETE FROM auth_sessions WHERE id = ?').bind(sessionId).run();
  }
  return clearSessionCookie(request);
}

async function createSession(userId: string) {
  const sessionId = `session-${crypto.randomUUID().slice(0, 16)}`;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + sessionDays * 24 * 60 * 60 * 1000);
  await database().prepare('INSERT INTO auth_sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(sessionId, userId, createdAt.toISOString(), expiresAt.toISOString()).run();
  return sessionId;
}
