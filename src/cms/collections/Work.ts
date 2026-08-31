import type { CollectionConfig } from "payload";

export const Work: CollectionConfig = {
  slug: "work",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "published", "order"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "url",
      type: "text",
      admin: {
        description: "Link to the live project or case study, if there is one.",
      },
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Off keeps it out of the public Work section while you prepare it.",
      },
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
