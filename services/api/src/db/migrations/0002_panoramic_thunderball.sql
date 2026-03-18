ALTER TABLE "jobs" ADD COLUMN "attempt_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "max_attempts" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "last_attempt_at" timestamp with time zone;