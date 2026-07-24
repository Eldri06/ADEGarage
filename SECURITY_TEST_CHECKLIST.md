# Security Test Checklist

Use only instructor-authorized accounts, environments, and targets.

## Railway production variables

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://adegarage-production.up.railway.app`
- `SESSION_DRIVER=database`
- `SESSION_LIFETIME=60`
- `SESSION_EXPIRE_ON_CLOSE=true`
- `SESSION_SECURE_COOKIE=true`
- `SESSION_SAME_SITE=lax`

After setting variables, run the `sessions` migration and redeploy. Confirm an application error returns a generic production error page rather than a stack trace.

## Authorization and sessions

- [ ] An unauthenticated request to every protected page/API redirects or returns `401`.
- [ ] A normal user receives `403` from every `/api/admin/...` route, including routes with an altered ID.
- [ ] Changing an order, profile, cart, or message ID never exposes or changes another user's data.
- [ ] Logout invalidates the session; protected pages no longer work afterward.
- [ ] Refreshing or opening a new tab preserves a valid session until its idle timeout.

## Authentication and input handling

- [ ] Repeated incorrect login, signup-code, OAuth-email-code, and password-reset requests return `429`.
- [ ] Message and profile text containing HTML/JavaScript is displayed as text and does not execute.
- [ ] Image uploads reject oversized files and non-JPEG/PNG/GIF/WebP content.

## Deployment hygiene

- [ ] No `.env`, service-role key, mail key, or database password is committed or sent to the browser.
- [ ] Rotate any secret that was previously shared in commits, logs, screenshots, or chat.
- [ ] Enable Supabase RLS for every client-accessible table and storage bucket; keep the service-role key server-only.
- [ ] Confirm response headers include `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.
