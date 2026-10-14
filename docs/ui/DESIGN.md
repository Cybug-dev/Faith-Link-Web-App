# FaithLink design system

Intent and conventions. **Values live in code**: `src/styles/tokens.css` and `typography.css`. If this file and the CSS disagree, the CSS wins and this file is stale. Component and screen inventory: [`ui-registry.md`](ui-registry.md).

## Direction

Warm off-white canvas, deep slate ink, one amber accent. Amber marks the primary action and the current place; it is never body text. Flat and calm: hierarchy comes from type size, weight and spacing before boxes or shadow. Scripture is the one expressive moment (see Imagery). Many users are teenagers: nothing that pressures or ranks people.

## Color

Use semantic tokens (`--color-*`), never `--palette-*` or hex, in components. Tailwind names come from `theme.css` (`bg-canvas`, `text-fg`, `border-line-control`, `bg-accent`).

| Role | Token | Hex |
|------|-------|-----|
| Canvas / surface | `--color-bg-canvas` / `-surface` | `#FBF9F5` / `#FFFFFF` |
| Text / secondary / muted | `--color-text-primary` / `-secondary` / `-muted` | `#1A1E24` / `#4F5864` / `#5F6B78` |
| Accent fill, label on it | `--color-accent-bg`, `--color-text-on-accent` | `#F3A83B`, `#1A1E24` |
| Links, focus ring | `--color-text-accent`, `--color-focus-ring` | `#845400` |
| Control border (3:1) / divider | `--color-border-control` / `-subtle` | `#857F75` / `#E2DED5` |
| Status | `--color-{danger,success,warning,info}-{bg,border,text}` | see tokens.css |

- Amber on canvas is 1.9:1: use it as a fill only, and never as the only signal of focus, selection or state.
- Anything that defines a control (input, checkbox, outlined button) uses the control border, not the divider colour.
- Status is icon + words, never colour alone.
- Light theme only for now.

## Typography

One family, Plus Jakarta Sans; weights 400/600/700; sizes 12 14 16 18 20 24 30 36. Use the role classes in `typography.css` (`text-headline-lg`, `text-body-md`, `text-label-md`, `text-scripture`…) instead of raw sizes. **Sentence case everywhere**: no ALL CAPS labels, no uppercase dividers. Never single out one word of a headline.

## Shape, elevation, spacing, motion

- Radius: 8 (checkbox, small tags), 16 (cards, banners, photos, code boxes), full (buttons, inputs, chips, tabs, avatars).
- Soft `shadow-raised` on inputs, white buttons, tabs and cards, as in the Stitch auth screens; popover and modal shadows for floating things.
- 4px spacing scale; controls are 36 / 48 / 56px high; touch targets at least 44px.
- Motion only explains a state change (150 / 200 / 300ms); everything collapses under `prefers-reduced-motion`.
- Breakpoints: tablet 600, desktop 1024 (utilities `tablet:` and `desktop:`; `sm:`/`md:` do not exist on purpose).

## Auth layout

Phone and tablet: wordmark, photo banner, tabs, title, form, "or continue with", Google, verse card, footer link; form width capped at 420px. Desktop (>= 1024px): form column beside a full-height photo panel carrying the verse. Signed-out screens have no app navigation and no avatar. Verify email has no banner or tabs.

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
