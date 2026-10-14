# UI Registry

The single index of the design system and screens. **Agents read this
instead of exploring the codebase**, and **must update it** whenever they
add or change a token, component, screen, or approved deviation (see
[`frontend-ui-ux-engineering-rules.md`](../../frontend-ui-ux-engineering-rules.md)).

Keep entries one line each. Paths are repo-relative. Intent and conventions: [`DESIGN.md`](DESIGN.md). Stitch sources: [`stitch-sources.md`](stitch-sources.md).

## Stack & Locations

| Item               | Value |
|--------------------|-------|
| Run                | `npm run dev` **inside this folder** (Vite picks the next free port and prints it; other local projects often hold 5173/5174). Also `npm run build`, `lint` (oxlint), `typecheck`, `test`, `test:watch`. |
| Framework          | Vite 8 + React 19 + TypeScript 7 (strict) |
| Routing            | React Router 8, route table in `src/app/router.tsx` (shared with tests) |
| Forms              | react-hook-form + zod (`@hookform/resolvers`); validate on blur and submit, then on change |
| Styling system     | Tailwind CSS v4 via `@tailwindcss/vite`; tokens in CSS variables; `theme.css` wipes Tailwind's default scales |
| Components         | shadcn-style (cva + clsx), hand-built on the tokens. The shadcn CLI is not initialised on purpose: it would overwrite the token theme. |
| Icon set           | Lucide (`lucide-react`), 20px default |
| Fonts              | Plus Jakarta Sans variable, self-hosted via `@fontsource-variable/plus-jakarta-sans` |
| OTP input          | `input-otp` (one real input drawn as boxes) |
| Tests              | Vitest + Testing Library (jsdom), coverage via `@vitest/coverage-v8`; tests sit beside the code |
| Auth client        | **Stub** in `src/features/auth/auth-client.ts` behind an `AuthClient` interface. Replace with `@neondatabase/auth`; contract in backend `docs/AI/FEATURES/auth-and-profile.md`. Demo triggers are in that file's header. |
| Tokens / type / base | `src/styles/tokens.css`, `typography.css`, `global.css`, `theme.css` (imported by `src/index.css`) |

## Design Decisions

| Decision          | Value |
|-------------------|-------|
| Accent            | Amber `#F3A83B` fill only; dark amber `#845400` for links and focus |
| Ink / canvas      | `#1A1E24` text, slate `#2C3440` for secondary buttons and the logo tile, canvas `#FBF9F5` |
| Radius            | 8 (checkbox) / 16 (cards, banners, photos, code boxes) / full (buttons, inputs, tabs, chips), per the Stitch auth screens |
| Elevation         | Soft `shadow-raised` on inputs, white buttons, tabs and cards (Stitch design); popover and modal for floating things |
| Dark mode         | Not in MVP |
| Breakpoints       | tablet 600, desktop 1024 (`tablet:` / `desktop:`) |
| Imagery           | Two AI-generated Stitch photos in `public/images` as placeholders; replace with licensed photos |
| Scripture         | World English Bible (public domain) in `src/features/auth/scripture.ts` |

## Token Index

Use the semantic names; never `--palette-*` in components. Full values in `tokens.css`.

| Group | Tokens |
|-------|--------|
| Background | `--color-bg-canvas` `-surface` `-subtle` `-muted` `-inverse` `-scrim` `-scrim-photo` |
| Text | `--color-text-primary` `-secondary` `-muted` `-placeholder` `-disabled` `-inverse` `-accent` `-on-accent` |
| Border | `--color-border-subtle` `-control` `-control-hover` |
| Accent | `--color-accent-bg` `-bg-hover` `-bg-active` `-subtle-bg` `-subtle-text` `-border`; `--color-focus-ring` |
| Status | `--color-{success,danger,warning,info}-{bg,border,text}`; `--color-success-icon`, `--color-info-icon`, `--color-danger-solid` |
| Space | `--space-{0,1,2,3,4,5,6,8,10,12,16,20}`; `--page-margin`, `--gutter` |
| Shape | `--round-sm` `-md` `-full`; `--border-width`; `--accent-rule-width`; `--focus-ring-width` `-offset` |
| Elevation | `--elevation-raised` `-popover` `-modal` |
| Control | `--control-h-sm` `-md` `-lg`; `--hit-min`; `--icon-sm` `-md` `-lg` |
| Layout | `--w-form` `--w-reading` `--w-content` `--w-shell`; `--sidebar-w` `--bottom-nav-h` `--topbar-h` |
| Motion | `--motion-duration-{fast,base,slow}`; `--motion-ease-{standard,out}` |
| Z | `--z-{base,dropdown,sticky,overlay,modal,toast}` |
| Type | `--font-family-sans`; `--weight-*`; `--type-{xs..4xl}`; role classes `.text-display` `.text-headline-lg` `.text-headline-md` `.text-title-lg` `.text-title-md` `.text-body-lg` `.text-body-md` `.text-body-sm` `.text-label-lg` `.text-label-md` `.text-label-sm` `.text-caption` `.text-scripture` `.text-scripture-lg` `.scripture-rule` `.prose-lesson` |

Role classes and base rules are in Tailwind layers, so utilities (`text-fg-secondary`) always override them.

## Components

| Component | Path | Variants / notes |
|-----------|------|------------------|
| Button | `src/components/ui/button.tsx` | primary, secondary, outline, ghost, danger; sm/md/lg; `loading` (spinner, aria-busy, blocks repeat submits) |
| Input | `src/components/ui/input.tsx` | white pill + soft shadow, **no border** (owner); focus = amber ring + icon turns dark amber; error = red ring via `aria-invalid`; `startIcon`, `endAdornment` |
| PasswordInput | `src/components/ui/password-input.tsx` | show/hide toggle (44px hit area) |
| FormField, FieldError | `src/components/ui/form-field.tsx` | render-prop wiring label/hint/error/aria; `hideLabel`, `labelAction` |
| Alert | `src/components/ui/alert.tsx` | danger (role=alert), warning, success, info (role=status) |
| Checkbox | `src/components/ui/checkbox.tsx` | native input + drawn box; label may hold links |
| OrDivider | `src/components/ui/or-divider.tsx` | lowercase labelled rule |
| OtpInput | `src/components/ui/otp-input.tsx` | 6 digits, paste and autofill, invalid state |
| Logo, GoogleIcon | `src/components/brand/` | Google fills are brand colours (allowed hex) |
| AuthLayout | `src/features/auth/auth-layout.tsx` | `banner` slot (text over the phone/tablet photo) + desktop photo/verse panel. Sign in: brand line; Create account: verse |
| AuthTabs | `src/features/auth/auth-tabs.tsx` | Sign in / Create account (NavLink) |
| GoogleButton | `src/features/auth/google-button.tsx` | |
| ScriptureCard | `src/features/auth/scripture-card.tsx` | phone/tablet verse under the form |

## Screens

| Screen | Route | Archetype | Based on | Notes |
|--------|-------|-----------|----------|-------|
| Sign in | `/sign-in` | auth | old Stitch `FaithLink Sign In` | built, responsive |
| Create account | `/create-account` | auth | old Stitch `FaithLink Create Account` | built, responsive |
| Verify email | `/verify-email` | auth | Stitch `Auth - Verify email - Mobile` | built; needs a pending email (sessionStorage) else redirects to create account |
| Not found | `*` | error/404 | n/a | also where unbuilt links land |
| App entry | `/` | n/a | n/a | redirects to `/sign-in` (owner) |
| Home placeholder | `/home` | n/a | n/a | **temporary** landing after sign in (see below) |

## Dropped from the Stitch sources, and why

Per the owner's instruction to drop inconsistent and unnecessary content.

| Dropped | Reason |
|---------|--------|
| Header with back arrow, title and profile avatar | A signed-out screen has no profile; replaced by the wordmark |
| "Remember me" | Not in the auth contract (sessions are managed by the provider) |
| Uppercase "OR CONTINUE WITH", "FAITH • FELLOWSHIP • PURPOSE", uppercase verse reference | Sentence case everywhere; the eyebrow was decorative |
| Arrow icon on the submit button | Decorative |
| Per-field red errors plus a banner, "Invalid syntax" tag, "256-bit secure", "Join hundreds of young believers" | Contradicted the single contract error, reveal account state, or were invented claims |
| Garbled "Sign-in" text baked into the sign-in photo | AI artifact; cropped out of the image |
| "Daily Verse" label and the "Together in faith, stronger in purpose" quote (Philippians 1:6) | Verse isn't daily and the quote was not Scripture; real WEB text used |
| "FaithLink Fellowship" chip on the create-account banner | Decorative, and "Fellowship" is off-vocabulary |
| Create-account tabs above the banner | Kept below the banner as on Sign in, so the tabs don't jump when switching |
| Italic, paraphrased banner verse | Scripture is upright (DESIGN.md); WEB text of 1 Timothy 4:12 used |
| 14px text inside inputs | Kept 16px so iOS Safari doesn't zoom on focus |

## Temporary and open items

- `src/pages/home-placeholder-page.tsx` and the `/home` route: replace when the real church home exists. With real sessions, `/` should send signed-in people to home, not sign in.
- `src/features/auth/auth-client.ts` is a stub: replace with the real client. Also unbuilt from the contract: "Last used" tag, session handling, route guards.
- Linked pages not built (land on Not found): `/forgot-password`, `/terms`, `/privacy`.
- **Decision for the owner:** Stitch puts "Continue with Google" below the form (built that way); the backend auth notes recommend above it. Swap the `<GoogleButton />` block if you want the notes' order.
- Inputs have no border (owner decision); the shadow alone separates white fields from the off-white page. The amber focus ring is ~2:1 on the canvas, below the 3:1 of WCAG 1.4.11; the dark-amber icon change backs it up. Check in a real browser.
- Password rule (8+ characters, a number, a symbol) is enforced client-side only; the backend should enforce the same.
- Resend cooldown (30s) is an assumption, not in the backend contract.
- Hero photos are AI-generated placeholders; Scripture translation and licence to be confirmed.
- No browser-level (screenshot / axe) check has been run yet; layout was verified through jsdom tests, build and type checks only.

## Approved Deviations

| Date | Scope | Deviation | Reason | Approved by |
|------|-------|-----------|--------|-------------|
| 2026-10-14 | ECC `web/design-quality.md` | No depth, motion or texture added to satisfy its checklist | Flat, token-disciplined direction; see AGENTS.md precedence | Proposed by agent; awaiting owner confirmation |
