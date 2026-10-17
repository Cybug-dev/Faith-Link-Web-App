# FaithLink design system

Intent and conventions. **Values live in code**: `src/styles/tokens.css` and `typography.css`. If this file and the CSS disagree, the CSS wins and this file is stale. Component and screen inventory: [`ui-registry.md`](ui-registry.md).

## Direction

Barely warm, almost-white canvas, deep navy ink, one amber accent (orange gradient on primary buttons, white label). Colours follow the owner's onboarding reference as a trial. Amber marks the primary action and the current place; it is never body text. Flat and calm: hierarchy comes from type size, weight and spacing before boxes or shadow. Scripture is the one expressive moment (see Imagery). Many users are teenagers: nothing that pressures or ranks people.

## Color

Use semantic tokens (`--color-*`), never `--palette-*` or hex, in components. Tailwind names come from `theme.css` (`bg-canvas`, `text-fg`, `border-line-control`, `bg-accent`).

| Role | Token | Hex |
|------|-------|-----|
| Canvas / surface | `--color-bg-canvas` / `-surface` | `#FDF9F3` / `#FFFFFF` |
| Text / secondary / muted | `--color-text-primary` / `-secondary` / `-muted` | `#14213D` (navy) / `#4F5864` / `#5F6B78` |
| Accent fill, gradient, label on it | `--color-accent-bg`, `--gradient-accent`, `--color-text-on-accent` | `#F39C2B`, `#DA8826` → `#F39C2B`, white |
| Links, focus ring | `--color-text-accent`, `--color-focus-ring` | `#C27419` (orange; owner removed the dark brown) |
| Dark surface / raised on it / divider on it | `--color-bg-inverse` / `-inverse-raised` / `--color-border-inverse` | `#1A1F28` / `#2A303B` / `#363D4A` (the "night" of the Stitch desktop sidebar and quiz screen) |
| Text on dark / muted on dark | `--color-text-inverse` / `-inverse-muted` | `#FBF9F5` / `#CFC9BD` |
| Control border (3:1) / divider | `--color-border-control` / `-subtle` | `#857F75` / `#E2DED5` |
| Status | `--color-{danger,success,warning,info}-{bg,border,text}` | see tokens.css |

- Amber on canvas is 1.9:1: use it as a fill only, and never as the only signal of focus, selection or state.
- Owner's trial, below WCAG AA: white on the amber button (~2.2:1) and orange links (~3.3:1). Revisit before launch.
- Anything that defines a control (input, checkbox, outlined button) uses the control border, not the divider colour.
- Status is icon + words, never colour alone.
- Light theme only for now. **Dark mode is planned (owner, 2026-10-17):** night (`--palette-night-*`) is its base colour. Navy is for text only; every dark surface uses night.
- **Built for a cheap dark mode:** components reference semantic tokens only (never palette or hex), so dark mode is one `[data-theme='dark']` block in `tokens.css` that re-points the semantic tokens. No component should need its own dark styles. Keep styling simple and light: the app must stay fast because live quizzes will run over WebSockets.
- Decoration (`--color-deco-glow`, `--color-deco-shape`, `--color-bg-glass`) only behind illustrations on showcase screens such as onboarding; never behind form fields or body text.

## Typography

One family, Plus Jakarta Sans (one exception: the handwritten Caveat for the onboarding line "People. Growth. Purpose.", `--font-family-script`, never for UI text); weights 400/600/700; sizes 12 14 16 18 20 24 30 36. Use the role classes in `typography.css` (`text-headline-lg`, `text-body-md`, `text-label-md`, `text-scripture`…) instead of raw sizes. **Sentence case everywhere**: no ALL CAPS labels, no uppercase dividers. Never single out one word of a headline.

## Shape, elevation, spacing, motion

- Radius: 8 (checkbox, small tags), 16 (cards, banners, photos, code boxes), 24 (`--round-lg`, large illustration cards and photos), full (buttons, inputs, chips, tabs, avatars).
- Soft `shadow-raised` on inputs, white buttons, tabs and cards, as in the Stitch auth screens; popover and modal shadows for floating things.
- 4px spacing scale; controls are 36 / 48 / 56px high; touch targets at least 44px.
- Motion explains a change (150 / 200 / 300ms): screen and step switches slide and fade; nothing bouncy, looping or childish. Everything collapses under `prefers-reduced-motion`.
- Breakpoints: tablet 600, desktop 1024 (utilities `tablet:` and `desktop:`; `sm:`/`md:` do not exist on purpose).

## Auth layout

Phone and tablet: wordmark, photo banner, tabs, title, form, "or continue with", Google, verse card, footer link; form width capped at 420px. Desktop (>= 1024px): form column beside a full-height photo panel carrying the verse. Signed-out screens have no app navigation and no avatar. Verify email has no banner or tabs.

## Onboarding layout

Shown once per device, before home. Always exactly one screen tall so Next is visible (illustrations shrink to fit; only the middle scrolls on very short screens). Phone: logo and Skip, a 4-segment progress bar, centred title and body, the illustration filling the rest, then Back and Next (step 1: the arrow on the verse card instead; last step: "Get started"). Desktop (>= 1024px): "Step X of 4", title, body and a feature list on the left, illustration on the right, Back and Next along the bottom. Skip and Get started go to home.

## Imagery and scripture

Photos in `public/images` are AI-generated in Stitch, as placeholders: replace with licensed photography before launch. Text over a photo sits on `--color-bg-scrim-photo` so it stays 4.5:1. Scripture is italic (owner's choice), in quotation marks, regular weight, at most 65 characters wide, with a 4px amber rule (`.scripture-rule`). Translation is King James Version, set in `src/features/auth/scripture.ts`.

## Copy and vocabulary

Plain verbs, sentence case, buttons name the outcome. Errors say what to do and never reveal whether an email has an account. Fixed words: Sign in (not Log in), Create account (not Sign up), Church (not Fellowship/Ministry/Hub), Lesson, Quiz, Activity, Achievement, Verification code (not OTP). Never invent statistics, points, levels, user counts or security claims.

## Backend rules the UI must respect

From `Faith-Link-Backend/docs/AI/FEATURES/auth-and-profile.md`:

- Failed sign-in says exactly: "Wrong email or password. Signed up with Google? Use Continue with Google, or reset your password."
- Sign-up always ends at "Check your email", even for an existing address.
- `EMAIL_NOT_VERIFIED` routes to the verification screen. Codes last 15 minutes and can be resent.
- The notes recommend "Continue with Google" above the email form; the Stitch design (as built) has it below. Owner to decide. A "Last used" tag is in the contract and not built yet.
- There is no points, level or XP system in the API.

## Naming

Tokens: `--{category}-{role}[-{variant}]` (`--palette-*` raw, never used in components; `--color-*`, `--space-*`, `--round-*`, `--elevation-*`, `--type-*`, `--weight-*`, `--motion-*`, `--z-*` semantic). Components: PascalCase nouns, kebab-case files; variants are props, never new components. Routes: kebab-case (`/sign-in`, `/create-account`, `/verify-email`).
