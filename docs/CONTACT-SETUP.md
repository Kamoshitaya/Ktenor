# Wiring up the enquiry form

The form and the endpoint are finished. What remains is giving them a
destination. Email (section 1) is enough on its own — the spreadsheet
(section 2) is an optional second copy, not a requirement. Until at least one
is configured the endpoint answers `502` and the visitor is told plainly that
sending failed — it never pretends.

Secrets are entered by the owner, never committed. `.env.local` is ignored by
git.

---

## 1. Email — Resend

1. Create an account at resend.com
2. **Domains → Add Domain → `ktenor.online`**
3. Resend shows DNS records to add at Namecheap. Add them exactly as shown.

   One caution: the domain already carries an SPF record from Namecheap's email
   forwarding (`v=spf1 include:spf.efwd.registrar-servers.com ~all`). A domain
   may only have **one** SPF record — a second one invalidates both and mail
   starts landing in spam. If Resend asks for an SPF record on the root, either
   merge the two includes into a single record, or accept Resend's subdomain
   option (`send.ktenor.online`), which sidesteps the clash entirely.

4. Wait for verification, then **API Keys → Create**, permission *Sending access*
5. Add to Vercel → Settings → Environment Variables (all three environments):

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_FROM_EMAIL=Ktenor <hello@ktenor.online>
CONTACT_TO_EMAIL=ktenorstudio@gmail.com
```

`CONTACT_FROM_EMAIL` must be on the verified domain. `CONTACT_TO_EMAIL` is
optional — without it the address in `src/lib/site.ts` is used.

---

## 2. Spreadsheet — Google Sheets (optional)

Skip this section entirely if email alone is enough. Nothing else in this
document depends on it.

1. Create a spreadsheet. First row, exactly these headers:

```
Received | Name | Email | Phone | Service | Budget | Timeline | Message | Language
```

2. **Extensions → Apps Script**, replace everything with the script below
3. Change `SECRET` to a long random string of your own
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the web app URL
6. Add to Vercel:

```
SHEET_WEBHOOK_URL=https://script.google.com/macros/s/..../exec
SHEET_WEBHOOK_SECRET=the same string as in the script
```

"Anyone" is required because Vercel calls it without a Google session. The
shared secret is what actually guards it: a request without the right secret is
rejected, so knowing the URL alone is not enough to write a row.

```javascript
const SECRET = 'change-me-to-a-long-random-string';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) {
      return ContentService.createTextOutput('forbidden');
    }

    SpreadsheetApp.getActiveSheet().appendRow([
      data.receivedAt || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.budget || '',
      data.timeline || '',
      data.message || '',
      data.locale || '',
    ]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  }
}
```

---

## 3. Redeploy

Environment variables are read at build time. Vercel → Deployments → ⋯ →
**Redeploy**. Nothing changes until this is done.

---

## 4. Check it works

Submit the form on the live site with a real address. Expect:

- the success panel under the button
- an email in the inbox, with **Reply** already addressed to the sender
- a confirmation in the sender's inbox
- a new row in the spreadsheet, if that step was set up

If a configured destination stays silent, check the Vercel function logs for
`/api/contact` to see what it reported.

---

## Behaviour worth knowing

| Situation | What happens |
|---|---|
| Neither destination configured | `502`, visitor sees the failure state |
| Only email configured, and it works | Success — this is the normal case |
| Both configured, one fails | Success — the enquiry survived through the other |
| Auto-reply fails | Success. It is secondary and never surfaces as an error |
| Honeypot filled, or form completed in under 2.5s | Plain `200`, nothing delivered |
| More than 5 attempts from one IP in 10 minutes | `429`, visitor is asked to wait or contact directly |

The rate limit lives in memory, so it is per serverless instance and resets on a
cold start. It exists to blunt a crude flood; the honeypot and timing checks do
the real filtering. Anything stronger would mean adding infrastructure this site
does not need.
