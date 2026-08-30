import { env } from 'cloudflare:workers';
import type { CurrentUser } from '@/lib/auth';

export type PortfolioData = {
  projects: Array<{
    id: string;
    title: string;
    owner: string;
    category: string;
    status: 'Published' | 'Draft';
    description: string;
    tags: string[];
    accent: string;
    updated: string;
    views: string;
    features: string[];
    demoUrl: string;
    coverUrl: string;
  }>;
  questions: Record<string, Array<{
    id: string;
    author: string;
    initials: string;
    role: string;
    time: string;
    text: string;
    answer?: { author: string; initials: string; text: string };
  }>>;
  reviews: Array<{
    id: string;
    projectId: string;
    project: string;
    author: string;
    initials: string;
    role: string;
    rating: number;
    text: string;
  }>;
};

export type ProfileData = {
  name: string;
  handle: string;
  role: string;
  track: string;
  bio: string;
};

export type BoardColumn = 'todo' | 'progress' | 'done';

export type BoardItem = {
  id: string;
  projectId: string;
  column: BoardColumn;
  title: string;
  detail: string;
};

type DbProject = Record<string, unknown>;
type DbQuestion = Record<string, unknown>;
type DbReview = Record<string, unknown>;
type DbProfile = Record<string, unknown>;
type DbBoardItem = Record<string, unknown>;

const bootstrapStatements = [
  `CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, owner TEXT NOT NULL, owner_id TEXT NOT NULL, category TEXT NOT NULL, status TEXT NOT NULL, description TEXT NOT NULL, tags_json TEXT NOT NULL, accent TEXT NOT NULL, updated TEXT NOT NULL, views TEXT NOT NULL, features_json TEXT NOT NULL, demo_url TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects (owner_id)`,
  `CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, author TEXT NOT NULL, initials TEXT NOT NULL, role TEXT NOT NULL, time_label TEXT NOT NULL, text TEXT NOT NULL, answer_author TEXT, answer_initials TEXT, answer_text TEXT, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_project_id ON questions (project_id)`,
  `CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, project TEXT NOT NULL, author TEXT NOT NULL, initials TEXT NOT NULL, role TEXT NOT NULL, rating INTEGER NOT NULL, text TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews (project_id)`,
  `CREATE TABLE IF NOT EXISTS profiles (user_id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, handle TEXT NOT NULL, role TEXT NOT NULL, track TEXT NOT NULL, bio TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS registrations (id TEXT PRIMARY KEY NOT NULL, channel TEXT NOT NULL, contact TEXT NOT NULL, name TEXT NOT NULL, user_id TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS board_items (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, column_key TEXT NOT NULL, title TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_board_items_project_id ON board_items (project_id)`,
];

const seedProjects = [
  ['01', 'Nihongo Talk Trainer', 'Akari Karimova', 'seed-akari', 'Learning systems', 'Published', 'A warm, practical space where Japanese learners can practice real conversations and keep their progress.', '["Web app","Education","Japanese"]', 'violet', '2 hours ago', '1.2k', '["Scenario-based practice","Pronunciation feedback","Learning history","Teacher workspace"]', ''],
  ['02', 'Osh Table', 'Muhammad Rakhimov', 'seed-muhammad', 'Community tools', 'Published', 'A multilingual restaurant guide built from local voices, useful maps, and stories worth sharing.', '["Reviews","Map","Local"]', 'orange', 'Yesterday', '846', '["Restaurant profiles","Community reviews","Photo + map context","Search and filters"]', ''],
  ['03', 'JDU Open Archive', 'Sardor Yusupov', 'seed-sardor', 'Culture + code', 'Published', 'A living index of student-made systems, design experiments, and the next version of Tashkent.', '["Portfolio","Archive","Multi-language"]', 'blue', '3 days ago', '2.4k', '["Project stories","External links","Questions + board","Four-language UI"]', ''],
  ['04', 'Quiet City Index', 'M. Safarova', 'seed-safarova', 'Culture + code', 'Draft', 'A calm guide to overlooked places, independent makers, and small rituals around the city.', '["Editorial","City","Research"]', 'green', 'Last week', '—', '["Editorial stories","Category search","Creator profiles"]', ''],
] as const;

const seedQuestions = [
  ['q-01-01', '01', 'Nodira K.', 'NK', 'student', '2 days ago', 'How do you keep the practice prompts from feeling repetitive?', 'Akari Karimova', 'AK', 'Each scenario rotates by level and mood, so the learner practises the same skill in a new context.'],
  ['q-01-02', '01', 'Kenji Mori', 'KM', 'mentor', 'yesterday', 'Which part of the flow helped you feel more confident speaking?', null, null, null],
  ['q-02-01', '02', 'Dilnoza A.', 'DA', 'visitor', '4 hours ago', 'Can I filter the restaurants by a vegetarian menu and a quiet atmosphere?', 'Muhammad Rakhimov', 'MR', 'Yes — open Filters and combine “Vegetarian” with “Calm”. More community tags are coming next.'],
  ['q-02-02', '02', 'Saidbek T.', 'ST', 'local guide', 'last week', 'How do you check whether a review is still accurate?', null, null, null],
  ['q-03-01', '03', 'Mina S.', 'MS', 'reviewer', '3 days ago', 'Will students be able to submit a case study without writing code?', 'Sardor Yusupov', 'SY', 'Yes. The archive accepts a story, a visual, and a demo link, so the format stays open to different kinds of work.'],
  ['q-04-01', '04', 'Aziza R.', 'AR', 'editor', 'last week', 'What is the first place you would like to visit from this list?', null, null, null],
] as const;

const seedReviews = [
  ['r-01', '01', 'Nihongo Talk Trainer', 'Mai Sato', 'MS', 'language mentor', 5, 'The project makes speaking practice feel approachable. I understood the flow in less than a minute.'],
  ['r-02', '02', 'Osh Table', 'Aziza R.', 'AR', 'early visitor', 5, 'I found two new places for the weekend and liked that every recommendation has a real local voice behind it.'],
  ['r-03', '03', 'JDU Open Archive', 'Timur K.', 'TK', 'portfolio reviewer', 4, 'Clear enough to present in three minutes, but deep enough to keep exploring. The project story is strong.'],
] as const;

const seedBoardItems = [
  ['b-01-01', '01', 'todo', 'Shape the story', 'Problem statement'],
  ['b-01-02', '01', 'todo', 'Name the audience', 'Audience notes'],
  ['b-01-03', '01', 'progress', 'Build the flow', 'Core interaction'],
  ['b-01-04', '01', 'progress', 'Responsive pass', 'Mobile and desktop'],
  ['b-01-05', '01', 'done', 'Show the work', 'Project concept'],
  ['b-01-06', '01', 'done', 'Visual direction', 'Rocket interface'],
  ['b-02-01', '02', 'todo', 'Collect local voices', 'Review prompts'],
  ['b-02-02', '02', 'progress', 'Map the flow', 'Search and filters'],
  ['b-02-03', '02', 'done', 'Test the first route', 'Restaurant detail'],
  ['b-03-01', '03', 'todo', 'Clarify archive rules', 'Published vs draft'],
  ['b-03-02', '03', 'progress', 'Connect project stories', 'Case study flow'],
  ['b-03-03', '03', 'done', 'Prepare the demo', 'Report meeting'],
] as const;

function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('D1 binding DB is not available');
  return db;
}

function jsonValue<T>(value: unknown, fallback: T): T {
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

function idFor(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function ensureDatabase() {
  const db = database();
  await db.batch(bootstrapStatements.map((statement) => db.prepare(statement)));
  const countResult = await db.prepare('SELECT COUNT(*) AS count FROM projects').all<{ count: number }>();
  const now = new Date().toISOString();
  if (Number(countResult.results[0]?.count || 0) === 0) {
    await db.batch([
      ...seedProjects.map((project) => db.prepare(`INSERT INTO projects (id, title, owner, owner_id, category, status, description, tags_json, accent, updated, views, features_json, demo_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...project, now)),
      ...seedQuestions.map((question) => db.prepare(`INSERT INTO questions (id, project_id, author, initials, role, time_label, text, answer_author, answer_initials, answer_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...question, now)),
      ...seedReviews.map((review) => db.prepare(`INSERT INTO reviews (id, project_id, project, author, initials, role, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...review, now)),
    ]);
  }
  const boardCountResult = await db.prepare('SELECT COUNT(*) AS count FROM board_items').all<{ count: number }>();
  if (Number(boardCountResult.results[0]?.count || 0) === 0) {
    await db.batch(seedBoardItems.map((item) => db.prepare(`INSERT INTO board_items (id, project_id, column_key, title, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(...item, now)));
  }
  return db;
}

function mapProject(row: DbProject) {
  return {
    id: String(row.id),
    title: String(row.title),
    owner: String(row.owner),
    category: String(row.category),
    status: String(row.status) === 'Published' ? 'Published' as const : 'Draft' as const,
    description: String(row.description),
    tags: jsonValue<string[]>(row.tags_json, []),
    accent: String(row.accent),
    updated: String(row.updated),
    views: String(row.views),
    features: jsonValue<string[]>(row.features_json, []),
    demoUrl: String(row.demo_url || ''),
    coverUrl: `/api/media?kind=project&id=${encodeURIComponent(String(row.id))}`,
  };
}

function mapQuestion(row: DbQuestion) {
  const question = {
    id: String(row.id),
    author: String(row.author),
    initials: String(row.initials),
    role: String(row.role),
    time: String(row.time_label),
    text: String(row.text),
  };
  return row.answer_author ? {
    ...question,
    answer: {
      author: String(row.answer_author),
      initials: String(row.answer_initials),
      text: String(row.answer_text),
    },
  } : question;
}

function mapReview(row: DbReview) {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    project: String(row.project),
    author: String(row.author),
    initials: String(row.initials),
    role: String(row.role),
    rating: Number(row.rating),
    text: String(row.text),
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const db = await ensureDatabase();
  const [projectRows, questionRows, reviewRows] = await Promise.all([
    db.prepare('SELECT * FROM projects ORDER BY created_at DESC, id ASC').all<DbProject>(),
    db.prepare('SELECT * FROM questions ORDER BY created_at ASC, id ASC').all<DbQuestion>(),
    db.prepare('SELECT * FROM reviews ORDER BY created_at DESC, id ASC').all<DbReview>(),
  ]);
  const questions: PortfolioData['questions'] = {};
  for (const row of questionRows.results) {
    const projectId = String(row.project_id);
    questions[projectId] = [...(questions[projectId] || []), mapQuestion(row)];
  }
  return {
    projects: projectRows.results.map(mapProject),
    questions,
    reviews: reviewRows.results.map(mapReview),
  };
}

function profileHandle(name: string) {
  return `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jdu-creator'}`;
}

function mapProfile(row: DbProfile): ProfileData {
  return {
    name: String(row.name),
    handle: String(row.handle),
    role: String(row.role),
    track: String(row.track),
    bio: String(row.bio),
  };
}

export async function getProfile(user: CurrentUser): Promise<ProfileData | null> {
  const db = await ensureDatabase();
  const result = await db.prepare('SELECT name, handle, role, track, bio FROM profiles WHERE user_id = ?').bind(user.id).all<DbProfile>();
  return result.results[0] ? mapProfile(result.results[0]) : null;
}

export async function upsertProfile(input: Omit<ProfileData, 'handle'> & { handle?: string }, user: CurrentUser) {
  const db = await ensureDatabase();
  const profile = {
    name: input.name.trim(),
    handle: input.handle?.trim() || profileHandle(input.name),
    role: input.role.trim(),
    track: input.track.trim(),
    bio: input.bio.trim(),
  };
  await db.prepare(`INSERT INTO profiles (user_id, name, handle, role, track, bio, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET name = excluded.name, handle = excluded.handle, role = excluded.role, track = excluded.track, bio = excluded.bio, updated_at = excluded.updated_at`).bind(user.id, profile.name, profile.handle, profile.role, profile.track, profile.bio, new Date().toISOString()).run();
  return profile;
}

export async function createRegistration(input: { channel: 'email' | 'telegram'; contact: string; name: string }, user: CurrentUser | null) {
  const db = await ensureDatabase();
  const registration = {
    id: idFor('registration'),
    channel: input.channel,
    contact: input.contact.trim(),
    name: input.name.trim(),
    userId: user?.id || null,
    createdAt: new Date().toISOString(),
  };
  await db.prepare('INSERT INTO registrations (id, channel, contact, name, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(
    registration.id,
    registration.channel,
    registration.contact,
    registration.name,
    registration.userId,
    registration.createdAt,
  ).run();
  return registration;
}

async function ownedProject(projectId: string, user: CurrentUser) {
  const db = await ensureDatabase();
  const result = await db.prepare('SELECT id, owner_id, title FROM projects WHERE id = ?').bind(projectId).all<{ id: string; owner_id: string; title: string }>();
  const project = result.results[0];
  if (!project) throw new Error('Project not found');
  if (project.owner_id !== user.id) throw new Error('Project is not owned by this user');
  return { db, project };
}

export async function createProject(input: { title: string; owner: string; category: string; description: string; demoUrl: string; status?: 'Published' | 'Draft' }, user: CurrentUser) {
  const db = await ensureDatabase();
  const id = idFor('p');
  const now = new Date().toISOString();
  const status = input.status === 'Published' ? 'Published' : 'Draft';
  await db.prepare(`INSERT INTO projects (id, title, owner, owner_id, category, status, description, tags_json, accent, updated, views, features_json, demo_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pink', 'Just now', '—', ?, ?, ?)`).bind(
    id,
    input.title,
    input.owner || user.name,
    user.id,
    input.category,
    status,
    input.description,
    JSON.stringify(['New', 'JDU', 'Draft']),
    JSON.stringify(['Project story', 'External link', 'Questions + board']),
    input.demoUrl || '',
    now,
  ).run();
  const data = await getPortfolioData();
  return data.projects.find((project) => project.id === id);
}

export async function updateProject(projectId: string, input: { title: string; owner: string; category: string; description: string; demoUrl: string; status: 'Published' | 'Draft' }, user: CurrentUser) {
  const { db } = await ownedProject(projectId, user);
  await db.prepare(`UPDATE projects SET title = ?, owner = ?, category = ?, status = ?, description = ?, demo_url = ?, updated = 'Just now' WHERE id = ?`).bind(input.title, input.owner || user.name, input.category, input.status, input.description, input.demoUrl || '', projectId).run();
  const data = await getPortfolioData();
  return data.projects.find((project) => project.id === projectId);
}

export async function deleteProject(projectId: string, user: CurrentUser) {
  const { db } = await ownedProject(projectId, user);
  await db.batch([
    db.prepare('DELETE FROM questions WHERE project_id = ?').bind(projectId),
    db.prepare('DELETE FROM reviews WHERE project_id = ?').bind(projectId),
    db.prepare('DELETE FROM board_items WHERE project_id = ?').bind(projectId),
    db.prepare('DELETE FROM projects WHERE id = ?').bind(projectId),
  ]);
  return { id: projectId };
}

function mapBoardItem(row: DbBoardItem): BoardItem {
  const column = String(row.column_key);
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    column: column === 'progress' || column === 'done' ? column : 'todo',
    title: String(row.title),
    detail: String(row.detail),
  };
}

export async function listBoardItems(projectId: string) {
  const db = await ensureDatabase();
  const result = await db.prepare('SELECT * FROM board_items WHERE project_id = ? ORDER BY created_at ASC, id ASC').bind(projectId).all<DbBoardItem>();
  return result.results.map(mapBoardItem);
}

export async function createBoardItem(projectId: string, input: { column: BoardColumn; title: string; detail: string }, user: CurrentUser) {
  const { db } = await ownedProject(projectId, user);
  const id = idFor('b');
  const now = new Date().toISOString();
  await db.prepare('INSERT INTO board_items (id, project_id, column_key, title, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, projectId, input.column, input.title, input.detail, now).run();
  return { id, projectId, column: input.column, title: input.title, detail: input.detail } satisfies BoardItem;
}

export async function updateBoardItem(itemId: string, column: BoardColumn, user: CurrentUser) {
  const db = await ensureDatabase();
  const result = await db.prepare('SELECT id, project_id FROM board_items WHERE id = ?').bind(itemId).all<{ id: string; project_id: string }>();
  const item = result.results[0];
  if (!item) throw new Error('Board item not found');
  await ownedProject(item.project_id, user);
  await db.prepare('UPDATE board_items SET column_key = ? WHERE id = ?').bind(column, itemId).run();
  const updated = await db.prepare('SELECT * FROM board_items WHERE id = ?').bind(itemId).all<DbBoardItem>();
  return updated.results[0] ? mapBoardItem(updated.results[0]) : null;
}

export async function createQuestion(projectId: string, text: string, user: CurrentUser) {
  const db = await ensureDatabase();
  const id = idFor('q');
  const now = new Date().toISOString();
  const project = await db.prepare('SELECT id FROM projects WHERE id = ?').bind(projectId).all();
  if (!project.results.length) throw new Error('Project not found');
  await db.prepare(`INSERT INTO questions (id, project_id, author, initials, role, time_label, text, created_at) VALUES (?, ?, ?, ?, 'viewer', 'just now', ?, ?)`).bind(id, projectId, user.name, user.initials, text, now).run();
  return { id, author: user.name, initials: user.initials, role: 'viewer', time: 'just now', text };
}

export async function createReview(projectId: string, rating: number, text: string, user: CurrentUser) {
  const db = await ensureDatabase();
  const id = idFor('r');
  const now = new Date().toISOString();
  const project = await db.prepare('SELECT title FROM projects WHERE id = ?').bind(projectId).all<{ title: string }>();
  const projectTitle = project.results[0]?.title;
  if (!projectTitle) throw new Error('Project not found');
  await db.prepare(`INSERT INTO reviews (id, project_id, project, author, initials, role, rating, text, created_at) VALUES (?, ?, ?, ?, ?, 'community member', ?, ?, ?)`).bind(id, projectId, projectTitle, user.name, user.initials, rating, text, now).run();
  return { id, projectId, project: projectTitle, author: user.name, initials: user.initials, role: 'community member', rating, text };
}
