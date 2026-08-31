import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { isAuthorized } from "@/lib/admin-auth";

/**
 * One-off: Payload's postgres adapter only auto-creates tables outside
 * production (see @payloadcms/db-postgres's connect.js), so the CMS
 * collections' tables never got created in the real Neon database. This
 * runs the same schema push Payload does in dev, once, against production.
 * Safe here because the target tables don't exist yet — nothing to lose.
 * Delete this route once it's been called successfully.
 */
export async function POST() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const adapter = payload.db as unknown as {
    schema: unknown;
    drizzle: unknown;
    schemaName?: string;
    tablesFilter?: unknown;
    extensions?: { postgis?: boolean };
    requireDrizzleKit: () => { pushSchema: (...args: unknown[]) => Promise<{
      apply: () => Promise<void>;
      warnings: string[];
      hasDataLoss: boolean;
    }> };
  };

  const { pushSchema } = adapter.requireDrizzleKit();
  const { apply, warnings, hasDataLoss } = await pushSchema(
    adapter.schema,
    adapter.drizzle,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter,
    adapter.extensions?.postgis ? ["postgis"] : undefined,
  );

  await apply();

  return NextResponse.json({ ok: true, warnings, hasDataLoss });
}
