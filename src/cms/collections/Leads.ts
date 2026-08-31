import type { CollectionConfig } from "payload";

const adminOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Submissions land here from the contact form's own server route via the
 * Local API (which bypasses access control), not through Payload's public
 * REST/GraphQL endpoints — those stay closed here so this collection can't
 * become a second, unprotected way to spam the site past the honeypot and
 * rate limit already in /api/contact.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "createdAt"],
  },
  access: {
    create: () => false,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "service", type: "text" },
    { name: "budget", type: "text" },
    { name: "message", type: "textarea" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      name: "source",
      type: "text",
      defaultValue: "contact-form",
      admin: { readOnly: true },
    },
  ],
};
