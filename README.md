# PADYAKWATTS — v3 (TypeScript · React · Next.js · Tailwind + custom CSS)

This is a full rebuild of the original PHP/JS/CSS app (v1) as a modern
Next.js 14 App Router project, written in TypeScript. Every page, form,
and behavior from the PHP version has a direct equivalent here — nothing
was turned into a "demo": signup, login, sessions, the dashboard with its
three tabs, reporting issues, profile editing, and account deletion all
actually work.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for layout/utility classes, combined with a hand-written
  `globals.css` for the brand-specific pieces (gradients, glassy cards,
  the `enhanced-input`/`enhanced-submit` form controls, the energy orb,
  animations) ported straight from the original's `style.css` / `login.css`
  / `signup.css`.
- **Chart.js** (`react-chartjs-2`) for the weekly energy graph, replacing
  the vanilla Chart.js `<script>` setup in `tabs/energy.php`.
- **bcryptjs** for password hashing, **jose** for signed session cookies.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit SESSION_SECRET
npm run dev
```

Visit `http://localhost:3000`. A demo account is auto-created the first
time the app runs:

- **Email:** `demo@padyakwatts.ph`
- **Password:** `Demo@123`

## How the PHP logic maps to this project

| Original (v1)                     | Here                                                    |
|------------------------------------|----------------------------------------------------------|
| `index.php`                        | `src/app/page.tsx`                                       |
| `login.php`                        | `src/app/login/page.tsx` + `src/app/api/auth/login`      |
| `signup.php`                       | `src/app/signup/page.tsx` + `src/app/api/auth/signup`    |
| `forgot_password.php`              | `src/app/forgot-password/page.tsx` + its API route       |
| `dashboard.php`                    | `src/app/dashboard/page.tsx`                              |
| `tabs/energy.php`                  | `src/components/dashboard/EnergyTab.tsx`                  |
| `tabs/report.php`                  | `src/components/dashboard/ReportTab.tsx` + `/api/reports` |
| `tabs/profile.php`                 | `src/components/dashboard/ProfileTab.tsx` + `/api/profile/update` |
| `delete_account.php` / `goodbye.php` | `src/app/delete-account`, `src/app/goodbye`, `/api/account/delete` |
| `logout.php`                       | `LogoutButton.tsx` + `/api/auth/logout`                  |
| `config/database.php` + raw SQL    | `src/lib/db.ts`                                           |
| PHP `$_SESSION`                    | `src/lib/session.ts` (signed, httpOnly JWT cookie)        |

## About the database layer

The original app talked to **MySQL**. This environment couldn't reach a
MySQL server, so `src/lib/db.ts` persists to a JSON file
(`data/db.json`) instead — but every function in that file
(`getUserByEmail`, `createUser`, `listRecentSessions`, ...) is written
with a comment showing the exact SQL query it replaces, and the schema
(`src/types/index.ts`) mirrors the original `users` / `sessions` /
`stations` / `reports` tables field-for-field.

**To connect this to real MySQL:**

1. `npm install mysql2`
2. Create a connection pool (e.g. in `src/lib/mysql.ts`) using the same
   host/user/password/database you used in `config/database.php`.
3. In `src/lib/db.ts`, replace the body of each exported function with
   the SQL query noted in its comment, run through the pool, instead of
   the JSON file read/write. Nothing outside `db.ts` needs to change —
   every page and API route only calls these exported functions.

## Notes

- Passwords are hashed with bcrypt (`bcryptjs`), matching the original's
  `password_hash()`/`password_verify()` approach.
- Sessions are httpOnly, signed JWT cookies (7 days, or 30 days with
  "Remember me") — set `SESSION_SECRET` in `.env.local` for production.
- The soft-delete behavior from `delete_account.php` (`is_active = 0`,
  cascading delete of sessions/reports) is preserved in `softDeleteUser()`.
