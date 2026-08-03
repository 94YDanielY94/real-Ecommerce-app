# Fix: Google OAuth users get wrong `session.user.id` (Google ID instead of DB UUID)

## Root Cause

- `auth.ts` `jwt` callback does `token.id = user.id` for both providers.
- For **Google OAuth**, `user.id` is the Google account ID, not the DB `users.id` UUID.
- For **Credentials**, `authorize()` returns the DB UUID — works correctly.
- Result: All DB queries using `user_id: session.user.id` fail for Google users (Add to Cart → 500 FK error, addresses/orders/reviews → 404/500).

## Security Issues Found During Audit

- `/api/checkout` trusts `userId` from the request body (no session check).
- `/api/cart/[id]` DELETE has no auth check at all — anyone can delete any cart item.

## Plan Steps

- [x] Read all auth-related files, routes, and client components
- [x] **`auth.ts`** — Fix Google sign-in to embed DB UUID + profile in session:
  - [x] In `jwt` callback: for `account.provider === "google"`, look up DB user by email and set `token.id`/profile from DB record
  - [x] In `signIn` callback: when existing user found by email but `google_id` is null, link the Google account to the existing credentials account
- [x] **`app/api/checkout/route.ts`** — Security fix:
  - [x] Add `auth()` session check, derive `userId` from `session.user.id` instead of trusting the body
- [x] **`app/api/cart/[id]/route.ts`** — Security fix for DELETE:
  - [x] Add session auth check
  - [x] Verify cart item belongs to the authenticated user via `carts.user_id`
- [x] Verify changes, run build/tests:
  - [x] TypeScript type-check (`tsc --noEmit`) — passed with no errors
  - [x] Credentials user API flow (orders: 401 unauth / 403 non-admin / 200 user+admin) — working
  - [x] Cart DELETE without session → 401 Unauthorized — verified
  - [x] Checkout with forged `userId` in body and no session → 401 Unauthorized — verified
  - [x] Review `auth.ts` — Google provider jwt callback resolves DB UUID; signIn links google_id to existing credentials accounts
  - [ ] Google OAuth browser flow — requires manual browser sign-in to confirm session carries DB UUID (cannot be automated via curl)
