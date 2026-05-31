CREATE TABLE `book-notification-subscription` (
	`id_bookinfo` integer NOT NULL,
	`createAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-notification-subscription_id_bookinfo_unique` ON `book-notification-subscription` (`id_bookinfo`);