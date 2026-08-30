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

type DbProject = Record<string, unknown>;
type DbQuestion = Record<string, unknown>;
type DbReview = Record<string, unknown>;

const bootstrapStatements = [
  `CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, owner TEXT NOT NULL, owner_id TEXT NOT NULL, category TEXT NOT NULL, status TEXT NOT NULL, description TEXT NOT NULL, tags_json TEXT NOT NULL, accent TEXT NOT NULL, updated TEXT NOT NULL, views TEXT NOT NULL, features_json TEXT NOT NULL, demo_url TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects (owner_id)`,
  `CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, author TEXT NOT NULL, initials TEXT NOT NULL, role TEXT NOT NULL, time_label TEXT NOT NULL, text TEXT NOT NULL, answer_author TEXT, answer_initials TEXT, answer_text TEXT, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_project_id ON questions (project_id)`,
  `CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, project TEXT NOT NULL, author TEXT NOT NULL, initials TEXT NOT NULL, role TEXT NOT NULL, rating INTEGER NOT NULL, text TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews (project_id)`,
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
  if (Number(countResult.results[0]?.count || 0) > 0) return db;

  const now = new Date().toISOString();
  await db.batch([
    ...seedProjects.map((project) => db.prepare(`INSERT INTO projects (id, title, owner, owner_id, category, status, description, tags_json, accent, updated, views, features_json, demo_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...project, now)),
    ...seedQuestions.map((question) => db.prepare(`INSERT INTO questions (id, project_id, author, initials, role, time_label, text, answer_author, answer_initials, answer_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...question, now)),
    ...seedReviews.map((review) => db.prepare(`INSERT INTO reviews (id, project_id, project, author, initials, role, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...review, now)),
  ]);
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

export async function createProject(input: { title: string; owner: string; category: string; description: string; demoUrl: string }, user: CurrentUser) {
  const db = await ensureDatabase();
  const id = idFor('p');
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO projects (id, title, owner, owner_id, category, status, description, tags_json, accent, updated, views, features_json, demo_url, created_at) VALUES (?, ?, ?, ?, ?, 'Draft', ?, ?, 'pink', 'Just now', '—', ?, ?, ?)`).bind(
    id,
    input.title,
    input.owner || user.name,
    user.id,
    input.category,
    input.description,
    JSON.stringify(['New', 'JDU', 'Draft']),
    JSON.stringify(['Project story', 'External link', 'Questions + board']),
    input.demoUrl || '',
    now,
  ).run();
  const data = await getPortfolioData();
  return data.projects.find((project) => project.id === id);
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
