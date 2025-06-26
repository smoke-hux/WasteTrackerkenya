CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"pickup_request_id" integer NOT NULL,
	"collector_id" integer NOT NULL,
	"resident_id" integer NOT NULL,
	"waste_types" text[] NOT NULL,
	"weight" numeric(8, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"rating" integer,
	"feedback" text,
	"co2_saved" numeric(8, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "illegal_dumping_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" integer NOT NULL,
	"location" text NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"description" text NOT NULL,
	"waste_type" varchar(50) NOT NULL,
	"urgency" varchar(20) NOT NULL,
	"photo_url" text,
	"status" varchar(20) DEFAULT 'reported' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pickup_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"resident_id" integer NOT NULL,
	"collector_id" integer,
	"location" text NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"waste_types" text[] NOT NULL,
	"estimated_weight" numeric(8, 2) NOT NULL,
	"actual_weight" numeric(8, 2),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"scheduled_time" timestamp,
	"total_price" numeric(10, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" varchar(20) NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"location" text,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waste_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"period" varchar(20) NOT NULL,
	"period_date" timestamp NOT NULL,
	"organic_weight" numeric(8, 2) DEFAULT '0',
	"plastic_weight" numeric(8, 2) DEFAULT '0',
	"paper_weight" numeric(8, 2) DEFAULT '0',
	"metal_weight" numeric(8, 2) DEFAULT '0',
	"glass_weight" numeric(8, 2) DEFAULT '0',
	"electronic_weight" numeric(8, 2) DEFAULT '0',
	"total_weight" numeric(8, 2) DEFAULT '0',
	"total_earnings" numeric(10, 2) DEFAULT '0',
	"co2_saved" numeric(8, 2) DEFAULT '0',
	"recycling_rate" numeric(5, 2) DEFAULT '0'
);
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_collector_id_users_id_fk" FOREIGN KEY ("collector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_resident_id_users_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "illegal_dumping_reports" ADD CONSTRAINT "illegal_dumping_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_resident_id_users_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_collector_id_users_id_fk" FOREIGN KEY ("collector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_metrics" ADD CONSTRAINT "waste_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;