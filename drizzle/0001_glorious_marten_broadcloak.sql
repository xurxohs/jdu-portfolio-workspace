CREATE TABLE `board_items` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`column_key` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_board_items_project_id` ON `board_items` (`project_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`handle` text NOT NULL,
	`role` text NOT NULL,
	`track` text NOT NULL,
	`bio` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`contact` text NOT NULL,
	`name` text NOT NULL,
	`user_id` text,
	`created_at` text NOT NULL
);
