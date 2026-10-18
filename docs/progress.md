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
- Reset password is now two steps: confirm the emailed code (checked with Neon's checkVerificationOtp), then choose the new password.
- Stricter email rule on sign in, create account and forgot password (src/lib/email-check.ts): no doubled dots or stray symbols, real-looking TLD, and "Did you mean …@gmail.com?" for typos of big providers.
- Checkbox and code boxes restyled to the Stitch "Mobile Auth UI Design" checkbox: soft filled boxes, no border.
- Reset limits (owner): 5 codes per email per day, 3 wrong guesses per code, then the code locks until a new one is sent; Neon TOO_MANY_ATTEMPTS handled. Counted in localStorage (src/features/auth/reset-limits.ts) for now: move to the backend before launch.
- Final reset step now calls the backend (POST /api/auth/password-reset), which also emails "your password was changed" via Resend. Needs VITE_API_BASE_URL set (locally and in Vercel) and the backend deployed.
- Home screen (`/home`), UI only with sample data: built from the Stitch desktop board "FaithLink - Desktop Home Dashboard" (desktop is the source; phone derived from it). New app shell: navy sidebar on desktop, top bar, bottom nav on phones. Sections: Today's focus + streak (a self-advancing carousel on phones and tablets with the next card peeking in, no dots; side by side on desktop), quick actions, upcoming activities, your progress, recent activity, recent achievements. Invented points/XP/levels/ranks dropped (owner chose option A; streak kept as a tally). Plain SCSS with plain class names (owner: no BEM). Shell and home are lazy-loaded (about 6 kB gzipped together). Placeholder page deleted. Photo from Unsplash.
- Onboarding entrance polish: page code and first photo preload at idle while on sign-in (preload-onboarding.ts); staged entrance (header, text, picture, buttons); FadeImage shows a pulsing placeholder then sharpens each photo in, so no blank frames on slow connections.
- Owner direction (2026-10-17): Stitch desktop is the spec, built component by component (AGENTS.md, DESIGN.md). Dark surfaces moved from navy to a new "night" colour (navy kept for text), lightened once at the owner's request; it is the base for dark mode. New collapsible desktop sidebar (starts as icons; opens from the logo or a click on empty space; Stitch items with "Soon" tags; mountain art stand-in + tagline). Shared coming-soon popup for unbuilt features. Phone top bar is now logo, bell and avatar.
- Owner direction (2026-10-18): Stitch "Upcoming Events" (Desktop Home, Collapsed Sidebar) is the base component. Green, blue, purple and teal palettes now use its exact colours (amber and navy unchanged; its brown link colour is never used). Every home card shares one edge, hover, header, "See All →" link, icon tiles and small type steps (phones a step smaller). Upcoming Events and Your Progress rebuilt to match; badges are tinted tiles with coloured hexagons; new Button variants `solid`/`soft` and size `xs` for in-card actions.
- Recent Achievements removed (badges already show in Your Progress); new Trending This Week card (photo tiles + Join a Group banner, Unsplash photos) takes its place. Desktop rows mirror each other: Upcoming Events (wide) | Your Progress, then Recent Activity | Trending (wide). Phones: full-width blocks; trending series as rows. Onboarding back to once per device (temporary every-sign-in switch removed).
- "Page not found" screen removed (owner): any unbuilt or unknown address opens the coming-soon popup and goes back; the popup now wraps every route. Bell, avatar menu, search, Join and View open it too. Phone focus banner row now slides edge to edge.
- Signed-in people opening the site land on home; signed-out on sign in; the app requires sign-in. Onboarding is only for brand-new accounts (after email verification, or a Google account made in the last 30 minutes). Sign in replaces itself in history, so Back from home no longer bounces back to it.
- Branded loading screen (logo, breathing glow, sweep bar) covers the first sign-in check, the wait after Continue with Google until the browser leaves (and the return), and a signed-in person typing /sign-in or /create-account. A failed Google start now shows an error under the button.

## Next

- Next components, one at a time: phone bottom nav plan (match sidebar?), then the home sections against the Stitch desktop board.
- Sidebar art: replace the SVG stand-in if the owner supplies the image.
- Pages linked from the shell and home: Lessons, Quizzes, Activities, Progress, My church, Achievements, Settings; behaviour for the church switcher, bell, avatar menu, search and Join.
- Home: swap sample data for the API (and WebSocket updates); loading skeleton and error state once data is fetched.
- Backend: enforce the same password and name rules (client-side only today; Neon Auth accepts any name).
- Unbuilt linked pages: `/terms`, `/privacy`.
- Sign out (must call `forgetSessionState()`); show an error when Google sign-in cannot start.
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
