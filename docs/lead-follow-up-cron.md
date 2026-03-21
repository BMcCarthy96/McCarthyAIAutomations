# Lead follow-up cron (Vercel)

Automatic booking reminder emails for public consultation leads use:

- **Route:** `GET` or `POST` `/api/cron/lead-follow-up` (Vercel Cron uses **GET**)
- **Auth:** `Authorization: Bearer …` must match **`LEAD_FOLLOW_UP_CRON_SECRET`** or **`CRON_SECRET`** (Vercel injects `CRON_SECRET` automatically for cron invocations)
- **Global switch:** `LEAD_FOLLOW_UP_CRON_ENABLED` must be exactly `true` or the handler returns `{ ok: true, skipped: "disabled" }` and **does not** send mail or touch batch logic.

## Environment variables

| Variable | Role |
|----------|------|
| `LEAD_FOLLOW_UP_CRON_SECRET` | Shared secret for Bearer auth (optional if `CRON_SECRET` is set). |
| `CRON_SECRET` | Vercel’s standard cron secret; value is sent as `Authorization: Bearer …` when Vercel runs the cron. Use this **or** `LEAD_FOLLOW_UP_CRON_SECRET` (at least one required). |
| `LEAD_FOLLOW_UP_CRON_ENABLED` | Set to `true` only when scheduled sending should run. Any other value or unset = disabled (safe no-op). |
| `NEXT_PUBLIC_BOOKING_URL` or `BOOKING_URL` | Required when enabled; otherwise the route returns 400. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, etc. | Same as other emails (see `.env.example`). |

## Vercel schedule

`vercel.json` defines a **daily** cron at **10:00 UTC** (`0 10 * * *`) for `/api/cron/lead-follow-up`. Adjust the schedule in `vercel.json` if you prefer a different time.

## Turning automation on/off safely

1. **Off (default):** Do not set `LEAD_FOLLOW_UP_CRON_ENABLED`, or set it to `false`. Cron still runs but the route exits early with `skipped: "disabled"`.
2. **On:** Set `LEAD_FOLLOW_UP_CRON_ENABLED=true` in Vercel project env, ensure `LEAD_FOLLOW_UP_CRON_SECRET`, booking URL, and Resend are configured.
3. **Manual sends:** Admin → Support → **Send pending follow-ups** is independent of `LEAD_FOLLOW_UP_CRON_ENABLED`.

## Testing while cron is disabled

- Leave `LEAD_FOLLOW_UP_CRON_ENABLED` unset or not `true`.
- Optionally `curl` the route with the secret; expect `{ ok: true, skipped: "disabled" }` and HTTP 200.
- Use the admin button to verify real sends when ready.
