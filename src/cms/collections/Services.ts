import type { CollectionConfig } from "payload";
import { revalidateHomepage } from "@/lib/revalidate-cms";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "priceFrom", "isAddon", "order"],
  },
  hooks: {
    afterChange: [() => revalidateHomepage()],
    afterDelete: [() => revalidateHomepage()],
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
      name: "timeline",
      type: "text",
      localized: true,
      admin: {
        description: "Main packages only, e.g. \"2–5 pracovných dní\". Leave empty for add-ons.",
      },
    },
    {
      name: "note",
      type: "text",
      localized: true,
      admin: {
        description: "Add-ons only, e.g. \"za jazyk\", \"mesačne\". Leave empty for main packages.",
      },
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
