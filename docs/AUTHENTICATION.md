# RooDeet Authentication — Feature 1

## Purpose

Feature 1 gives a learner a protected RooDeet identity. It authenticates the learner with Supabase Auth, loads only that learner's RooDeet profile, and relies on PostgreSQL Row Level Security (RLS) as the authorization boundary.

## Components

- `src/lib/supabase.ts` — creates the browser Supabase client using the project URL and publishable key.
- `src/features/auth/AuthContext.tsx` — owns session state, sign-in/sign-out actions, auth-event listening, and profile loading.
- `src/features/auth/LoginPage.tsx` — collects email/password and calls `signInWithPassword`.
- `src/features/profile/LearnerProfilePage.tsx` — protected UI shown only after a session exists and the learner profile has loaded.
- `supabase/migrations/001_feature_1_auth_and_learner_profile.sql` — creates profile tables, the new-user trigger, grants, and RLS policies.

## Authentication request flow

```text
Learner enters email + password
        |
        v
LoginPage validates basic input shape
        |
        v
AuthContext calls supabase.auth.signInWithPassword(...)
        |
        v
Supabase Auth verifies the password server-side
        |
        +---- invalid ----> generic login error
        |
        v
Supabase returns a signed-in session (access JWT + refresh token)
        |
        v
supabase-js persists the session in browser storage and refreshes it when needed
        |
        v
AuthContext requests profiles + learner_profiles
        |
        v
supabase-js sends the project publishable key and the user's access token
        |
        v
Supabase API validates the JWT and PostgreSQL evaluates RLS
        |
        +---- auth.uid() does not match row ----> database denies access
        |
        v
Only the learner's own profile rows are returned
        |
        v
LearnerProfilePage renders the authorised data
```

## Credentials and tokens

### Password

The learner's password is submitted to Supabase Auth over HTTPS. RooDeet does not insert the password into its own `profiles` or `learner_profiles` tables and does not log it.

### Publishable key

`VITE_SUPABASE_PUBLISHABLE_KEY` identifies the RooDeet browser application. It is designed for public clients and is not treated as a secret. Security for user data must come from authentication plus RLS, not from hiding this key.

### Access token

After successful sign-in, Supabase Auth provides a short-lived JWT access token identifying the signed-in user. The Supabase client automatically includes the authenticated user's token on database requests. PostgreSQL policies use `auth.uid()` to compare the request identity with the row owner.

### Refresh token

The session also contains a refresh token. `supabase-js` manages session persistence and token refresh for this browser application. Application code should not print, copy, or send either token to analytics/logging systems.

### Secret/server key

A Supabase secret key must never be placed in this React/Vite browser application, committed to GitHub, or exposed to learners. A future trusted backend may use a server-only secret key for administrative operations, but Feature 1 does not need one.

## Authorization rule

The UI is not the security boundary. Hiding another learner's page is not enough. The database policies enforce:

```sql
(select auth.uid()) = id
```

for `profiles`, and:

```sql
(select auth.uid()) = user_id
```

for `learner_profiles`.

Therefore, even if a learner edits browser JavaScript and tries to request another learner's UUID, the database should deny that row.

## Role handling

Feature 1 supports student accounts only. The database trigger always provisions a new user as `student`. It deliberately does **not** trust browser-supplied metadata to create a `teacher` or `admin` role. Privileged roles must be added later through a trusted administrative process.

## Environment setup

Create `.env.local` from `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

Do not commit `.env.local`.

## Security verification before pilot use

1. Create two fictional learner accounts.
2. Sign in as Learner A and verify A can read A's profile.
3. Attempt to query Learner B's UUID while signed in as A; the query must return no accessible B row.
4. Verify an unauthenticated browser cannot select from either profile table.
5. Verify no secret/server key exists in the browser bundle or repository.
6. Use fictional data until the privacy and school pilot process is approved.
