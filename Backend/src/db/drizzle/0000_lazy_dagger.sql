CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_table_id" integer NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_url" varchar(255) NOT NULL,
	"platform" integer NOT NULL,
	"tone" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_post_table_id_post_table_id_fk" FOREIGN KEY ("post_table_id") REFERENCES "public"."post_table"("id") ON DELETE cascade ON UPDATE no action;