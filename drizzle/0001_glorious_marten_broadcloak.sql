CREATE TABLE `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`contact` text NOT NULL,
	`name` text NOT NULL,
	`user_id` text,
	`created_at` text NOT NULL
);
