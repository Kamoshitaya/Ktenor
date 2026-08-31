import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

import { isAuthorized } from "@/lib/admin-auth";

/** Temporary: inspect live DB state and force-revalidate the homepage. Delete after use. */
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "services",
    locale: "sk",
    where: { isAddon: { equals: false } },
    sort: "order",
    limit: 10,
    pagination: false,
  });

  revalidatePath("/sk");
  revalidatePath("/en");

  return NextResponse.json({
    docs: docs.map((d) => ({ name: d.name, includedCount: d.included?.length ?? 0, included: d.included })),
  });
}
