import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "priceFrom", "isAddon", "order"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "priceFrom",
      type: "number",
      admin: {
        description: "EUR. Leave empty for \"quoted per project\".",
      },
    },
    {
      name: "included",
      type: "array",
      labels: { singular: "Feature", plural: "Included features" },
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
      name: "isAddon",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "On for add-ons (multilingual, support, etc.), off for the main packages.",
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
