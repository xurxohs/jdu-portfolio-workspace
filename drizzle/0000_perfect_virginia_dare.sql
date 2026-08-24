CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`owner` text NOT NULL,
	`owner_id` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`tags_json` text NOT NULL,
	`accent` text NOT NULL,
	`updated` text NOT NULL,
	`views` text NOT NULL,
	`features_json` text NOT NULL,
	`demo_url` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_projects_status` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `idx_projects_category` ON `projects` (`category`);--> statement-breakpoint
CREATE INDEX `idx_projects_owner_id` ON `projects` (`owner_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`author` text NOT NULL,
	`initials` text NOT NULL,
	`role` text NOT NULL,
	`time_label` text NOT NULL,
	`text` text NOT NULL,
	`answer_author` text,
	`answer_initials` text,
	`answer_text` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_questions_project_id` ON `questions` (`project_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`project` text NOT NULL,
	`author` text NOT NULL,
	`initials` text NOT NULL,
	`role` text NOT NULL,
	`rating` integer NOT NULL,
	`text` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_project_id` ON `reviews` (`project_id`);