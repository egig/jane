CREATE TABLE "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" varchar(45) NOT NULL,
	"mode" varchar(20) NOT NULL,
	"keywords" text NOT NULL,
	"target_name" varchar(12),
	"status" varchar(30) NOT NULL,
	"model" varchar(50),
	"names" jsonb,
	"error_code" varchar(50),
	"cached" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_generations_created_at" ON "generations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_generations_ip" ON "generations" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "idx_generations_status" ON "generations" USING btree ("status");