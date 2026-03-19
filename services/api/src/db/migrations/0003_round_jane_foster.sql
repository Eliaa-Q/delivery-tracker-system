ALTER TABLE "drivers" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "rating_average" real DEFAULT 0 NOT NULL;