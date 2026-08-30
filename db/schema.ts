import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  owner: text('owner').notNull(),
  ownerId: text('owner_id').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  description: text('description').notNull(),
  tagsJson: text('tags_json').notNull(),
  accent: text('accent').notNull(),
  updated: text('updated').notNull(),
  views: text('views').notNull(),
  featuresJson: text('features_json').notNull(),
  demoUrl: text('demo_url').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  statusIdx: index('idx_projects_status').on(table.status),
  categoryIdx: index('idx_projects_category').on(table.category),
  ownerIdx: index('idx_projects_owner_id').on(table.ownerId),
}));

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  author: text('author').notNull(),
  initials: text('initials').notNull(),
  role: text('role').notNull(),
  timeLabel: text('time_label').notNull(),
  text: text('text').notNull(),
  answerAuthor: text('answer_author'),
  answerInitials: text('answer_initials'),
  answerText: text('answer_text'),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  projectIdx: index('idx_questions_project_id').on(table.projectId),
}));

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  project: text('project').notNull(),
  author: text('author').notNull(),
  initials: text('initials').notNull(),
  role: text('role').notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  projectIdx: index('idx_reviews_project_id').on(table.projectId),
}));

export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey(),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  role: text('role').notNull(),
  track: text('track').notNull(),
  bio: text('bio').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const boardItems = sqliteTable('board_items', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  columnKey: text('column_key').notNull(),
  title: text('title').notNull(),
  detail: text('detail').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  projectIdx: index('idx_board_items_project_id').on(table.projectId),
}));
