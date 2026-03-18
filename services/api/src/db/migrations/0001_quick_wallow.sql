ALTER TABLE "pipelines" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pipelines" ADD COLUMN "source_path" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "pipelines_source_path_idx" ON "pipelines" USING btree ("source_path");