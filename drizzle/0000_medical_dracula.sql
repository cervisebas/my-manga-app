CREATE TABLE `book-chapter-history` (
	`id_chapter` integer NOT NULL,
	`status` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-chapter-history_id_chapter_unique` ON `book-chapter-history` (`id_chapter`);--> statement-breakpoint
CREATE TABLE `book-chapters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`title` text,
	`chapter_number` integer DEFAULT 0 NOT NULL,
	`language` text,
	`languages` text,
	`availableSpanishLanguage` integer,
	`availableSpanishLATAMLanguage` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_book_chapter` ON `book-chapters` (`id_bookinfo`,`chapter_number`);--> statement-breakpoint
CREATE TABLE `book-chapters-options` (
	`id_chapter` integer NOT NULL,
	`title` text,
	`date` integer NOT NULL,
	`url` text NOT NULL,
	`language` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_chapter_option` ON `book-chapters-options` (`id_chapter`,`url`);--> statement-breakpoint
CREATE TABLE `book-gender-by-book-info` (
	`id_bookinfo` integer NOT NULL,
	`id_bookgender` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_book_gender` ON `book-gender-by-book-info` (`id_bookinfo`,`id_bookgender`);--> statement-breakpoint
CREATE TABLE `book-genders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text,
	`name` text NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `books-info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`path` text NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`altTitles` text,
	`picture` text NOT NULL,
	`stars` numeric,
	`type` text NOT NULL,
	`language` text,
	`languages` text,
	`status` text,
	`description` text,
	`descriptionLang` text,
	`wallpaper` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books-info_url_unique` ON `books-info` (`url`);--> statement-breakpoint
CREATE TABLE `book-staff-by-book-info` (
	`id_bookinfo` integer NOT NULL,
	`id_bookstaff` integer NOT NULL,
	`work_position` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_all` ON `book-staff-by-book-info` (`id_bookinfo`,`id_bookstaff`,`work_position`);--> statement-breakpoint
CREATE TABLE `book-staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`name` text NOT NULL,
	`picture` text,
	`search_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-staff_url_unique` ON `book-staff` (`url`);--> statement-breakpoint
CREATE TABLE `book-user-chapter-book-history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`id_chapter` integer NOT NULL,
	`path_option` text NOT NULL,
	`progress` numeric NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-user-chapter-book-history_id_bookinfo_unique` ON `book-user-chapter-book-history` (`id_bookinfo`);--> statement-breakpoint
CREATE TABLE `book-user-chapter-history-model` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`id_chapter` integer NOT NULL,
	`date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book-user-status-by-book-info` (
	`id_bookinfo` integer NOT NULL,
	`status` text NOT NULL,
	`value` text NOT NULL,
	`marked` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_book_status` ON `book-user-status-by-book-info` (`id_bookinfo`,`status`);