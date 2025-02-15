CREATE TABLE "diet_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" text NOT NULL,
	"meals" json NOT NULL,
	"total_calories" integer
);
--> statement-breakpoint
CREATE TABLE "progress_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" text NOT NULL,
	"weight" integer,
	"measurements" json,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"weight" integer,
	"height" integer,
	"fitness_goal" text,
	"activity_level" text,
	"preferences" json DEFAULT '{}'::json,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan" json NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" text
);
