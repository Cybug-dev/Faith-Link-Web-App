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
- Real auth: `auth-client.ts` uses Neon Auth (`@neondatabase/auth`) for sign up, email code, sign in, Google and password reset; tests use an offline fake. New screens: Forgot password, Reset password (code + new password).
- Forms validate on submit only; desktop photo panel pinned to screen height (no more zoom/over-crop); inputs 52px with 14px text; confirm-password step on create account; eye icon shows state.

## Next

- More UI refinements (owner to specify).
- Backend: enforce the same password rule (number + symbol).
- Unbuilt linked pages: `/terms`, `/privacy`.
- Session handling and route guards (`/home` does not check sign-in yet); show an error when Google sign-in cannot start.
- Set `VITE_NEON_AUTH_URL` and `VITE_API_BASE_URL` in Vercel, then redeploy.
- First browser-level check (screenshot + axe); so far only jsdom tests, build and typecheck.

## Open questions (owner to decide)

- **Google button position:** below the form (Stitch, as built) or above it (backend auth notes)?
- **ECC design-quality deviation:** proposed by an agent, awaiting your confirmation (registry, Approved Deviations).
- **Input focus contrast:** the amber focus ring is ~2:1 (WCAG wants 3:1). Keep it, or use a darker amber ring?
- **Resend cooldown:** 30s is assumed, not in the backend contract.
- **Content:** hero photos are AI placeholders. KJV chosen; if the app will serve UK users, confirm its Crown patent terms.
