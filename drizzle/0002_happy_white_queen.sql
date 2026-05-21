CREATE TABLE `book-chapter-images` (
	`chapter_option` text NOT NULL,
	`images` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chapter_option_images` ON `book-chapter-images` (`chapter_option`);