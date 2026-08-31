import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_included" CASCADE;
  DROP TABLE "services_included_locales" CASCADE;
  ALTER TABLE "services_locales" ADD COLUMN "timeline" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "note" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_included_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "services_included" ADD CONSTRAINT "services_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_included_locales" ADD CONSTRAINT "services_included_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_included"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_included_order_idx" ON "services_included" USING btree ("_order");
  CREATE INDEX "services_included_parent_id_idx" ON "services_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_included_locales_locale_parent_id_unique" ON "services_included_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services_locales" DROP COLUMN "timeline";
  ALTER TABLE "services_locales" DROP COLUMN "note";`)
}
