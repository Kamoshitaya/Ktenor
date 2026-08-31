import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { Users } from "./src/cms/collections/Users";
import { Media } from "./src/cms/collections/Media";
import { Services } from "./src/cms/collections/Services";
import { Faq } from "./src/cms/collections/Faq";
import { Work } from "./src/cms/collections/Work";
import { Leads } from "./src/cms/collections/Leads";
import { migrations } from "./src/migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  // Mounted at /cms rather than the default /admin, which is still the
  // bespoke reviews-moderation panel until reviews migrate into Payload.
  routes: {
    admin: "/cms",
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Services, Faq, Work, Leads],
  // Slovak is the default locale everywhere else on the site (proxy.ts falls
  // back to it), so the CMS follows the same convention.
  localization: {
    locales: ["sk", "en"],
    defaultLocale: "sk",
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "src/cms/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
    // In production the adapter never auto-creates tables (by design — see
    // @payloadcms/db-postgres's connect.js), so committed migrations are the
    // only way schema reaches the real database. Bundling them here means
    // they run automatically on deploy instead of needing a manual step.
    prodMigrations: migrations,
  }),
  sharp,
});
