import type { CollectionConfig } from "payload";
import { revalidateHomepage } from "@/lib/revalidate-cms";

export const Faq: CollectionConfig = {
  slug: "faq",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
  },
  hooks: {
    afterChange: [() => revalidateHomepage()],
    afterDelete: [() => revalidateHomepage()],
  },
  fields: [
    {
      name: "question",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "answer",
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers show first.",
      },
    },
  ],
};
