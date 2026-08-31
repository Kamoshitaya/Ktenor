import type { CollectionConfig } from "payload";

export const Faq: CollectionConfig = {
  slug: "faq",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
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
