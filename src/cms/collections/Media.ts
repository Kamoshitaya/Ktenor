import type { CollectionConfig } from "payload";

/**
 * Local disk storage until Cloudflare R2 is wired in — fine for editing
 * locally, but Vercel's serverless filesystem is not persistent, so
 * uploads made against the deployed site will not survive. Do not treat
 * this as production-ready for real uploads until the R2 adapter is added.
 */
export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media-uploads",
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
    },
  ],
};
