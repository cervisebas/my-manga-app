PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_book-chapters-options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_chapter` integer NOT NULL,
	`title` text,
	`date` integer NOT NULL,
	`url` text NOT NULL,
	`language` text,
	`updateAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_book-chapters-options`("id", "id_chapter", "title", "date", "url", "language", "updateAt") SELECT "id", "id_chapter", "title", "date", "url", "language", "updateAt" FROM `book-chapters-options`;--> statement-breakpoint
DROP TABLE `book-chapters-options`;--> statement-breakpoint
ALTER TABLE `__new_book-chapters-options` RENAME TO `book-chapters-options`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_chapter_option` ON `book-chapters-options` (`id_chapter`,`url`);