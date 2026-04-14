ALTER TABLE `book-chapter-history` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-chapters` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-chapters-options` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-gender-by-book-info` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-genders` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `books-info` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-staff-by-book-info` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-staff` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-user-chapter-book-history` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-user-chapter-history-model` ADD `updateAt` integer;--> statement-breakpoint
ALTER TABLE `book-user-status-by-book-info` ADD `updateAt` integer;