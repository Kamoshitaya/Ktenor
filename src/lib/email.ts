/**
 * Shared Resend sender. Used by the contact form and the reviews system —
 * factored out rather than duplicated so both read the same two env vars the
 * same way and fail the same way when they're missing.
 */
export async function sendEmail(
  payload: Record<string, unknown>,
  logTag: string,
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) {
    console.error(`[${logTag}] Resend not configured: missing RESEND_API_KEY or CONTACT_FROM_EMAIL`);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...payload }),
  });

  // Surface Resend's own explanation (invalid address, unverified domain,
  // etc.) rather than just the fact that something failed.
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[${logTag}] Resend rejected the email`, {
      status: response.status,
      to: payload.to,
      detail,
    });
  }

  return response.ok;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
