# Wiring up reviews

The review system is finished — form, storage, moderation, the public page and
the homepage teaser. What remains is provisioning the database and choosing
an admin password. Until both exist, submissions fail honestly (a `502`, the
visitor sees the failure state) rather than pretending to succeed.

Secrets are entered by the owner, never committed. `.env.local` is ignored by
git.

---

## 1. Database — Postgres via Neon

1. Open the project in **vercel.com** → **Storage** tab → **Create Database**
2. Choose **Postgres** (this provisions a Neon database — Vercel's own
   Postgres product now runs on Neon under the hood)
3. Connect it to this project. Vercel injects `DATABASE_URL` automatically —
   nothing to copy by hand
4. That's it for setup. The `reviews` table is created automatically the
   first time the app touches the database (a `CREATE TABLE IF NOT EXISTS`
   runs once per warm server instance) — no migration step to run

For local development, copy the connection string Vercel shows into
`.env.local`:

```
DATABASE_URL=postgres://...
```

---

## 2. Admin password

Pick a password only you know — this is the only thing standing between the
public internet and `/admin/reviews`. Add it in Vercel → Settings →
Environment Variables (all three environments):

```
ADMIN_PASSWORD=choose-a-real-password-here
```

For local testing, add the same line to `.env.local`.

There is no username, no recovery flow, no "forgot password" — if you lose
it, set a new value in Vercel and redeploy.

---

## 3. Redeploy

Environment variables are read at build/runtime. Vercel → Deployments → ⋯ →
**Redeploy** after setting both variables.

---

## 4. How it works day to day

- A visitor leaves a review at `/sk/reviews` or `/en/reviews` — a star
  rating is required, a short line of text is optional
- It lands in the database as **pending** and you get an email (via the same
  Resend setup as the contact form) with a link straight to the admin page
- Open **your-domain.com/admin/reviews**, enter the password
- **Approve** publishes it immediately on the homepage teaser and the
  `/reviews` page. **Reject** keeps it off the site. **Edit** lets you fix a
  typo or shorten it before publishing. **Delete** removes it for good
- **"+ Add a review manually"** on the same page publishes one instantly,
  for a review that came in by email or in person rather than through the
  form

## Behaviour worth knowing

| Situation | What happens |
|---|---|
| Neither `DATABASE_URL` nor `ADMIN_PASSWORD` set | The homepage and `/reviews` show the "be the first" empty state; submissions fail with a clear error; `/admin/reviews` still shows its login form but nothing behind it will load |
| Database set, a submission arrives | Stored as `pending`, invisible on the site until approved. The owner email is best-effort — if it fails to send, the review is still safely stored and visible in the admin list |
| Honeypot filled, or the form completed in under 2 seconds | A plain success response, nothing stored — the same anti-bot approach as the contact form |
| Wrong admin password, repeated | Rate-limited after 10 attempts in 15 minutes |
| Admin session | A signed cookie valid for 7 days, verified without needing its own database row. Logging out just clears it client-side |
