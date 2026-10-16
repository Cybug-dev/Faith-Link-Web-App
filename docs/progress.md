# Progress

Current state of the project, so any agent can pick up where the last one stopped. Keep entries one line each. Update at the end of every task: move finished work to **Done**, add new work to **Next**, add or resolve **Open questions**.

UI inventory (tokens, components, screens, drops) lives in [`ui/ui-registry.md`](ui/ui-registry.md); don't duplicate it here.

## Done

- Token system, typography and Tailwind v4 theme (`src/styles/`).
- UI kit: Button, Input, PasswordInput, FormField, Alert, Checkbox, OrDivider, OtpInput, Logo, GoogleIcon.
- Auth screens, responsive: Sign in, Create account, Verify email (stub auth client).
- Not found page; temporary home placeholder at `/`.
- Tests beside the code for Button, FormField, lib helpers and all three auth pages.
- ECC rules, agents and skills installed under `.claude/`; precedence set in `AGENTS.md`.
- Owner decision: keep the soft `shadow-raised` on inputs, white buttons, tabs and cards (`AGENTS.md` now matches `DESIGN.md`).
- Root `AGENTS.md` / `CLAUDE.md` added so agents opened on the parent folder are routed to the right project.
- Commit message convention added to `AGENTS.md`.
- Auth refinements from Stitch "Mobile Auth UI Design" › Create Account: borderless inputs (amber focus ring), smaller labels/hints/terms/subtitle/footer, per-page banner (Sign in: brand line; Create account: verse), Stitch password hint, password now needs a number and symbol.
- `/` opens sign in; temporary home moved to `/home`.
- Photo banners rendered as Stitch (smaller on phone); smooth screen switches with a sliding tab pill.
- Scripture switched to KJV; verses italic with quotation marks everywhere (desktop panel adds a quote icon).
- Local backend link: Vite pinned to port 5173 (backend CORS allows only that origin); `.env.example` / `.env.local` hold `VITE_API_BASE_URL` (local API `http://localhost:8787`, run `npm run dev` in the backend) and `VITE_NEON_AUTH_URL`. Not yet used by code.
- Sign in matches Stitch "Error State": "Authentication failed" box with Reset password link, Remember me (session kept ~7 days, else ends when the browser closes), "Encrypted sign-in" note, 12px helper text. Full name now needs a first and last name (each 2+ letters), letters only, with single spaces, hyphens or apostrophes. Email format errors also show Stitch's "Invalid syntax" tag once the field is in error.
- Real auth: `auth-client.ts` uses Neon Auth (`@neondatabase/auth`) for sign up, email code, sign in, Google and password reset; tests use an offline fake. New screens: Forgot password, Reset password (code + new password).
- Owner change: forms now check each field live as it is typed. Messages are neutral guidance while typing, and turn red only after leaving the field or submitting. Verify email still checks on submit (a code is typed digit by digit). Desktop photo panel pinned to screen height (no more zoom/over-crop); inputs 52px with 14px text; confirm-password step on create account; eye icon shows state.
- Onboarding (`/onboarding`), from the owner's 4-step design: shown once per device before home (every sign-in path goes through it), Skip and Get started go to home, Back/Next buttons, arrow keys and Enter, swipe on phones, smooth slide-and-fade with Motion (lazy-loaded). Built in plain SCSS (owner's new styling choice for new screens). Photos generated in Stitch. App canvas changed to light amber everywhere. Logo has a bare-cross option, used on onboarding for comparison.
- `AGENTS.md`: owner's preferred way of asking questions, SCSS and motion conventions.
- Onboarding pass 2 (owner feedback): colour trial from the reference app-wide (navy ink, amber gradient buttons with white text, almost-white canvas, brown removed), layered amber panels and confetti behind every illustration, full-bleed step 1 photo with warm frosted verse card, 3D staggered photo grid on step 4 for every size, bigger progress bar under the header, longer step text, every step fits one screen (Next always visible, no desktop scrollbar).
- Owner kept the colour trial. Navy made visibly blue (#1B2B5A); step 4 outline icons, padded chips, slanted tagline. vercel.json rewrite fixes 404 on refresh/deep links.
- TEMPORARY: onboarding shows after every sign-in (SHOW_ONBOARDING_EVERY_SIGN_IN in onboarding-storage.ts); set to false to restore once per device.
- Reset password is now two steps: confirm the emailed code (checked with Neon's checkVerificationOtp), then choose the new password.
- Stricter email rule on sign in, create account and forgot password (src/lib/email-check.ts): no doubled dots or stray symbols, real-looking TLD, and "Did you mean …@gmail.com?" for typos of big providers.
- Checkbox and code boxes restyled to the Stitch "Mobile Auth UI Design" checkbox: soft filled boxes, no border.
- Reset limits (owner): 5 codes per email per day, 3 wrong guesses per code, then the code locks until a new one is sent; Neon TOO_MANY_ATTEMPTS handled. Counted in localStorage (src/features/auth/reset-limits.ts) for now: move to the backend before launch.
- Final reset step now calls the backend (POST /api/auth/password-reset), which also emails "your password was changed" via Resend. Needs VITE_API_BASE_URL set (locally and in Vercel) and the backend deployed.

## Next

- More UI refinements (owner to specify).
- Backend: enforce the same password and name rules (client-side only today; Neon Auth accepts any name).
- Unbuilt linked pages: `/terms`, `/privacy`.
- Session handling and route guards (`/home` does not check sign-in yet); show an error when Google sign-in cannot start.
- Set `VITE_NEON_AUTH_URL` and `VITE_API_BASE_URL` in Vercel, then redeploy.
- First browser-level check (screenshot + axe); so far only jsdom tests, build and typecheck.

## Open questions (owner to decide)

- **Logo:** keep the slate tile mark (auth screens) or switch everywhere to the bare amber cross (onboarding)?
- **Onboarding copy vs product rules:** step 3 says "earn points" and "Leaderboards and friendly competition", but the API has no points system and DESIGN.md says nothing should rank people (many users are teens). Keep, or reword?
- **Onboarding photos:** AI placeholders from Stitch (one has a "Kindness in action" sign in the scene); replace with licensed photos before launch.

- **Google button position:** below the form (Stitch, as built) or above it (backend auth notes)?
- **ECC design-quality deviation:** proposed by an agent, awaiting your confirmation (registry, Approved Deviations).
- **Input focus contrast:** the amber focus ring is ~2:1 (WCAG wants 3:1). Keep it, or use a darker amber ring?
- **Resend cooldown:** 30s is assumed, not in the backend contract.
- **Content:** hero photos are AI placeholders. KJV chosen; if the app will serve UK users, confirm its Crown patent terms.
