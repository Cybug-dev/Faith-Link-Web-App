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
| Forms              | react-hook-form + zod (`@hookform/resolvers`); validate on submit only (no warnings on leaving a field), then on change |
| Styling system     | Tailwind CSS v4 via `@tailwindcss/vite` for the auth screens and the `ui` kit; **plain SCSS** (`sass-embedded`, one file per component) for new screens from onboarding on (owner). Class names: plain kebab-case nested under the component's root class, **no BEM** from the home screen on (owner); onboarding keeps its older BEM names. Both read the CSS variables in `tokens.css`; `theme.css` wipes Tailwind's default scales; SCSS helpers in `src/styles/_mixins.scss` |
| Motion             | `motion` (`motion/react`, LazyMotion + domAnimation) on lazy-loaded routes only (onboarding); reduced motion respected |
| Components         | shadcn-style (cva + clsx), hand-built on the tokens. The shadcn CLI is not initialised on purpose: it would overwrite the token theme. |
| Icon set           | Lucide (`lucide-react`), 20px default |
| Fonts              | Plus Jakarta Sans variable, self-hosted via `@fontsource-variable/plus-jakarta-sans`; Caveat variable (`@fontsource-variable/caveat`) for one onboarding line, loaded only there |
| OTP input          | `input-otp` (one real input drawn as boxes) |
| Tests              | Vitest + Testing Library (jsdom), coverage via `@vitest/coverage-v8`; tests sit beside the code |
| Auth client        | **Stub** in `src/features/auth/auth-client.ts` behind an `AuthClient` interface. Replace with `@neondatabase/auth`; contract in backend `docs/AI/FEATURES/auth-and-profile.md`. Demo triggers are in that file's header. |
| Tokens / type / base | `src/styles/tokens.css`, `typography.css`, `global.css`, `theme.css` (imported by `src/index.css`) |

## Design Decisions

| Decision          | Value |
|-------------------|-------|
| Accent            | Amber `#F39C2B`; primary buttons use `--gradient-accent` with white text; orange `#C27419` for links and focus (no brown anywhere, owner) |
| Ink / canvas      | Navy `#1B2B5A` text only; every dark surface (sidebar, logo tile, focus/streak/quiz cards, secondary button) is night `#1A1F28` with `#2A303B` raised, from the Stitch desktop sidebar and quiz screen (owner, 2026-10-17). Canvas `#FDF9F3` (almost white, app-wide) |
| Radius            | 4 (checkbox) / 8 (small tags) / 12 (`--round-tile`: date, icon and badge tiles, small in-card buttons) / 16 (cards, banners, photos, code boxes) / 24 (large illustration cards and photos) / full (buttons, inputs, tabs, chips) |
| Elevation         | Cards: 1px `--color-border-card` + faint `--elevation-card` (base component, owner 2026-10-18); soft `shadow-raised` on inputs, white buttons, tabs and on card hover; popover and modal for floating things |
| Base component    | Stitch "Upcoming Events" (`FaithLink - Desktop Home (Collapsed Sidebar)`, `c915d3b7f242443dad4209c947f29ad1`), owner 2026-10-18. Every card copies its edge, hover (`card-hover` mixin: amber edge, warm fill, raised shadow), type steps (`type-card-title` 14→16, `type-body-sm` 12→14, `type-caption` 10→12, `type-micro` 10; phones get the smaller step) and tones. Green, blue, purple and teal palettes were replaced with its values; amber and navy kept. Its brown amber-800 link colour is never used (owner): links stay `--color-text-accent`. One link style everywhere: `SectionLink` ("See All" + lucide ArrowRight) |
| Dark mode         | Planned (owner). Night is its base; components use semantic tokens only so dark mode is one token block in `tokens.css`, no per-component restyling |
| Breakpoints       | tablet 600, desktop 1024 (`tablet:` / `desktop:`) |
| Imagery           | AI-generated Stitch photos as placeholders: two auth photos in `public/images`, 13 onboarding WebPs in `public/images/onboarding` (sized per use); replace with licensed photos |
| Scripture         | King James Version (owner's choice; public domain outside the UK) in `src/features/auth/scripture.ts`; verses italic with quotation marks |

## Token Index

Use the semantic names; never `--palette-*` in components. Full values in `tokens.css`.

| Group | Tokens |
|-------|--------|
| Background | `--color-bg-canvas` `-surface` `-subtle` `-muted` `-inverse` `-inverse-raised` `-scrim` `-scrim-photo` `-glass`; decorative only: `--color-deco-glow` `--color-deco-shape` |
| Text | `--color-text-primary` `-secondary` `-muted` `-placeholder` `-disabled` `-inverse` `-accent` `-on-accent` |
| Border | `--color-border-subtle` `-control` `-control-hover`; cards: `--color-border-card` `-row` `-soft`; `--color-bg-row-hover` `--color-bg-soft` `-soft-hover` |
| Tones | `--color-tone-{amber,green,blue,purple,teal}-{bg,border,solid}`, `-dot` (amber, green, blue, purple), `-text` (amber, green, blue); `--gradient-date-accent` `-quiet` |
| Accent | `--color-accent-bg` `-bg-hover` `-bg-active` `-subtle-bg` `-subtle-text` `-border`; `--color-focus-ring` |
| Status | `--color-{success,danger,warning,info}-{bg,border,text}`; `--color-success-icon`, `--color-info-icon`, `--color-danger-solid`, `--color-danger-strong-bg` (Stitch error-container, danger Alert) |
| Space | `--space-{0,1,2,3,4,5,6,8,10,12,16,20}`; `--page-margin`, `--gutter` |
| Shape | `--round-xs` `-sm` `-tile` `-md` `-lg` `-full`; `--border-width`; `--accent-rule-width`; `--focus-ring-width` `-offset` |
| Elevation | `--elevation-card` `-raised` `-popover` `-modal`; `--blur-glass` |
| Control | `--control-h-sm` `-md` `-lg`; `--hit-min`; `--icon-sm` `-md` `-lg` |
| Layout | `--w-form` `--w-reading` `--w-content` `--w-shell`; `--sidebar-w` `--bottom-nav-h` `--topbar-h` |
| Motion | `--motion-duration-{fast,base,slow}`; `--motion-ease-{standard,out}` |
| Z | `--z-{base,dropdown,sticky,overlay,modal,toast}` |
| Type | `--font-family-sans` `--font-family-script`; `--weight-*`; `--type-{2xs..4xl}`; role classes `.text-display` `.text-headline-lg` `.text-headline-md` `.text-title-lg` `.text-title-md` `.text-body-lg` `.text-body-md` `.text-body-sm` `.text-label-lg` `.text-label-md` `.text-label-sm` `.text-caption` `.text-scripture` `.text-scripture-lg` `.scripture-rule` `.prose-lesson` |

Role classes and base rules are in Tailwind layers, so utilities (`text-fg-secondary`) always override them.

## Components

| Component | Path | Variants / notes |
|-----------|------|------------------|
| Button | `src/components/ui/button.tsx` (+ `button-variants.ts`, also used to style router Links as buttons) | primary (amber gradient, white text), secondary, outline, surface, ghost, text (plain ink, e.g. Skip), danger, solid (flat amber, ink text: in-card Join), soft (warm grey + hairline: in-card View); xs (32px, 12px corners, in-card rows)/sm/md/lg/icon (round 48px, needs aria-label); `loading` (spinner, aria-busy, blocks repeat submits) |
| Input | `src/components/ui/input.tsx` | 52px white pill + soft shadow, **no border** (owner); 14px text, 16px on iOS (stops Safari zoom, `global.css`); focus = amber ring + icon turns dark amber; error = red ring via `aria-invalid`; `startIcon`, `endAdornment` |
| PasswordInput | `src/components/ui/password-input.tsx` | show/hide toggle (44px hit area); icon shows state: slashed eye = hidden, open eye = visible |
| FormField, FieldError | `src/components/ui/form-field.tsx` | render-prop wiring label/hint/error/aria; `hideLabel`, `labelAction` |
| Alert | `src/components/ui/alert.tsx` | danger (role=alert; Stitch error banner: borderless pink, filled icon, red title, 14px text), warning, success, info (role=status) |
| Checkbox | `src/components/ui/checkbox.tsx` | native input + drawn 20px soft filled box, no border (Stitch "Mobile Auth UI Design" sign-in); checked = amber + check; label may hold links |
| OrDivider | `src/components/ui/or-divider.tsx` | lowercase labelled rule |
| OtpInput | `src/components/ui/otp-input.tsx` | 6 digits, paste and autofill; soft filled boxes, no border (matches Checkbox); active box light amber, invalid boxes red tint |
| Logo, CrossMark, GoogleIcon | `src/components/brand/` | Logo `mark="tile"` (default, favicon) or `"cross"` (bare amber cross from the onboarding design; owner comparing the two, onboarding and the sidebar use cross); `tone="inverse"` for dark surfaces. Google fills are brand colours (allowed hex) |
| AppShell | `src/features/app-shell/app-shell.tsx` + `.scss` | signed-in layout, lazy-loaded, wraps the ComingSoonProvider. Phone/tablet: top bar (logo, bell, avatar) + fixed bottom nav (5 items, `PRIMARY_NAV`). Desktop: Sidebar, top bar with search, bell, avatar + name + role. Viewer in `sample-viewer.ts` (sample) |
| Sidebar, SidebarArt | `src/features/app-shell/sidebar.tsx` + `.scss`, `sidebar-art.tsx` | desktop only, night background. Starts collapsed (76px, icons, title tooltips); opens to 256px from the logo button (cross swaps to an "open" icon on hover) or a click on empty space; closes from the button at the top; width + fade transition, off under reduced motion. Items (`SIDEBAR_NAV`): Home, Bible Lessons, Quizzes, Live Games, Groups, Events, Leaderboard, Messages, Settings; unbuilt ones carry a "Soon" tag and open the coming-soon popup. Foot: inline-SVG mountains with amber rim and star + "Faith, Community, Impact" (stand-in until the owner supplies the image) |
| ComingSoonProvider, useComingSoon, UnbuiltRoute | `src/components/coming-soon/` | wraps every route (router root), so auth screens use it too; UnbuiltRoute is the catch-all route. One shared native `<dialog>` popup: "{Feature} is coming soon", one line, "Got it"; Escape/backdrop close it. Call `useComingSoon()(name)` from any unbuilt button |
| HomeSection | `src/features/home/home-section.tsx` + `.scss` | heading above loose content (Quick Actions) with the shared SectionLink |
| CardHead, SectionLink, BadgeList | `src/features/home/card-head.tsx`, `section-link.tsx`, `badge-list.tsx` (+ `.scss`) | CardHead: heading row inside every home card (optional amber icon tile, title, subtitle, SectionLink, optional divider). SectionLink: the one "See All →" (Link or button). BadgeList: tinted tile + coloured hexagon + white icon, used by Your Progress |
| FocusBanner, stat icons | `src/features/home/focus-banner.tsx` + `.scss`, `stat-icons.tsx` + `.scss` | full-width "Today's Focus" hero from the owner's reference images (not Stitch). One DOM, three states by hero width (CSS container queries): >= 62rem = one photo card, frosted welcome panel inside on the right; 37.5–62rem = panel inside, underneath the lesson, full width; < 37.5rem (phones) = panel out as its own card with its own photo in a swipeable row (8px gap, a sliver peeking), row runs under the page margin to both screen edges so cards slide from the edge (owner), compact cards (min 216px on phones, 240px inside the card); banner text 12–16px on phones, up to 20px wider, no auto-scroll. Lesson: amber tag, title, italic verse with amber rule, "Continue Learning". Panel: "Welcome back, {name}!", script verse, Day Streak / Points / Level tiles with live CSS icons (flickering flame with glow, floating glowing star, bars growing smallest-first), tiles lift on hover; motion off under reduced motion |
| QuickActions | `src/features/home/quick-actions.tsx` + `.scss` | owner's reference: "Quick Actions", shared card + hover (2×2 on phones, 4 across from 600px) with a 40px tinted icon square: Continue Learning (purple, book), Join a Live Quiz (green, game pad), My Church (amber, people), View Leaderboard (blue, bar chart); "See All →" and every card open the coming-soon popup (pages not built); title turns accent on hover. Tokens `--color-tile-*` |
| TrendingCard | `src/features/home/trending-card.tsx` + `.scss` | owner's reference: "Trending This Week", three Unsplash photo tiles (title, kind · lessons) and a dark "Join a Group" photo banner (scrim, amber people icon, chevron that nudges right on hover); all open the coming-soon popup. Phones: each series is a full-width row (photo left, text right); from 600px three tiles across. Desktop: home grid is three equal tracks, row one Upcoming (2) | Progress (1), row two the mirror, Recent Activity (1) | Trending (2) (owner) |
| UpcomingActivities, ProgressCard, RecentActivity | `src/features/home/` | each with its own `.scss`, all on the `card` mixin; Upcoming Events is the base component (date tile amber/quiet, tone chip, time · place, Join `solid` / View `soft` buttons); Your Progress = blue ring, tone-dot tallies, Recent Badges; empty states written; data shapes in `home-sample-data.ts` (sample, replace with API) |
| OnboardingPage | `src/features/onboarding/onboarding-page.tsx` + `onboarding.scss` | steps from `onboarding-steps.ts`; keyboard (arrows, Enter), swipe (`src/lib/use-swipe.ts`), slide/fade with Motion |
| Route guards, RedirectIfSignedIn | `src/app/route-guards.ts`, `src/app/redirect-if-signed-in.tsx`, session check `src/features/auth/session.ts` | owner, 2026-10-18: `/` goes to home when signed in, sign in otherwise; the app needs sign-in; sign in / create account move a signed-in person to home (not while they're using the form); onboarding only for brand-new accounts (after email verification, or a Google account made in the last 30 min that hasn't seen it here). Session asked once per page load; failures and hangs (8s) are not remembered |
| FadeImage | `src/features/onboarding/fade-image.tsx` | img with a pulsing placeholder until loaded, then blur-in; `alt` required |
| Step visuals | `src/features/onboarding/visuals/` | HeroVisual (photo + verse card), LessonsVisual, QuizVisual, CommunityVisual; each with its own `.scss`; photos in `onboarding-images.ts` |
| AuthLayout | `src/features/auth/auth-layout.tsx` | `banner` slot (text over the phone/tablet photo) + desktop photo/verse panel, sticky at viewport height; per-photo crop in `authImages`. Sign in: brand line; Create account: verse |
| AuthTabs | `src/features/auth/auth-tabs.tsx` | Sign in / Create account (NavLink); active pill slides on switch (view transition) |
| SignInBanner, CreateAccountBanner | `src/features/auth/auth-banners.tsx` | text over the photo banner, per Stitch |
| GoogleButton | `src/features/auth/google-button.tsx` | |
| ScriptureCard | `src/features/auth/scripture-card.tsx` | phone/tablet verse under the form |

## Screens

| Screen | Route | Archetype | Based on | Notes |
|--------|-------|-----------|----------|-------|
| Sign in | `/sign-in` | auth | old Stitch `FaithLink Sign In`; error box, field messages and Remember me row from Stitch `FaithLink Sign In - Error State` | built, responsive; Remember me on by default |
| Create account | `/create-account` | auth | old Stitch `FaithLink Create Account` | built, responsive; "Confirm password" appears (focused) after the first valid-password submit |
| Verify email | `/verify-email` | auth | Stitch `Auth - Verify email - Mobile` | built; needs a pending email (sessionStorage) else redirects to create account |
| Forgot password | `/forgot-password` | auth | Verify email skeleton (no Stitch design) | built; email field, sends a reset code, never reveals whether the email has an account |
| Reset password | `/reset-password` | auth | Verify email skeleton + Create account password fields (no Stitch design) | built; two steps: code first (checked with the server), then new password + confirm, then back to sign in; a code rejected at the end sends the person back to the code step |
| Unbuilt address | `*` | `UnbuiltRoute` (`src/components/coming-soon/unbuilt-route.tsx`) | n/a | no "page not found" screen (owner, 2026-10-18): opens the coming-soon popup and goes back (or to the start if typed directly) |
| App entry | `/` | n/a | n/a | redirects to `/sign-in` (owner) |
| Home | `/home` | dashboard/overview | Stitch `FaithLink - Desktop Home Dashboard` (desktop is the source; phone derived from it) | UI only, sample data; inside AppShell, behind the sign-in guard (requireSignedInApp), lazy-loaded. Phone: same sections stacked, focus + streak cards in the HeroCarousel |
| Onboarding | `/onboarding` | onboarding | owner's 4-step image (mobile + desktop boards) | built, responsive, lazy-loaded; new accounts only (see Route guards); Skip / Get started go to home |

## Dropped from the Stitch sources, and why

Per the owner's instruction to drop inconsistent and unnecessary content.

| Dropped | Reason |
|---------|--------|
| Header with back arrow, title and profile avatar | A signed-out screen has no profile; replaced by the wordmark |
| Error State: red bar beside the field, ⊗ icon inside it | Owner: only the message below the field, plus the "Invalid syntax" tag (email format errors only, once the field is in error) |
| Error State banner shadow | DESIGN.md keeps shadows to inputs, white buttons, tabs and cards |
| Error State: "Password does not match our records for this account" | Confirms the email has an account; replaced by "Check your email and password, then try again." |
| Error State: "256-bit secure" | Not a claim we can verify; replaced by "Encrypted sign-in" (HTTPS) |
| Old sign-in error line "Signed up with Google? Use Continue with Google" | Owner: sign-in error must match Stitch exactly |
| "Remember me" | Not in the auth contract (sessions are managed by the provider) |
| Uppercase "OR CONTINUE WITH" | Sentence case outside the photo banner |
| Arrow icon on the submit button | Decorative |
| Per-field red errors plus a banner, "Invalid syntax" tag, "256-bit secure", "Join hundreds of young believers" | Contradicted the single contract error, reveal account state, or were invented claims |
| Garbled "Sign-in" text baked into the sign-in photo | AI artifact; cropped out of the image |
| "Daily Verse" label and the "Together in faith, stronger in purpose" quote (Philippians 1:6) | Verse isn't daily and the quote was not Scripture; real KJV text used |
| Create-account tabs above the banner | Kept below the banner as on Sign in, so the tabs don't jump when switching |
| Paraphrased (NIV-style) banner verse | KJV text of 1 Timothy 4:12 used, shortened with an ellipsis as Stitch does |
| 14px text inside inputs | Kept 16px so iOS Safari doesn't zoom on focus |
| Onboarding: Title Case headings and full stops ("Learn and Grow in Your Faith.") | Sentence case, no full stop, same on phone and desktop |
| Onboarding: different progress styles and the desktop-only "Step X of 4" | Phone's 4-segment bar everywhere; "Step X of 4" kept as the desktop eyebrow (owner) |
| Onboarding: phone step 3 leaderboard and badge row | Owner chose the desktop quiz-question card for every size |
| Onboarding: "1.2k players" | Invented user count; the player faces stay (owner) |
| Onboarding: two wordings of the step 2 text; dark verse card on the phone photo | One text (the phone's) and one light frosted verse card on every size, for consistency |
| Onboarding: NIV Matthew 18:20 | KJV text, as everywhere else |
| Onboarding: phone home-indicator bar | Device chrome, not app UI |
| Onboarding: "Mateo (26)" caption baked into a Stitch portrait | AI artifact; cropped out |
| Home: XP, points ("1,280 Pts", "+120 today", "+50 Grace XP"), levels ("Lvl 14", "Tier II Disciple"), league rank ("Top 8%", "Rank #14"), daily quest, "Claim grace" | DESIGN.md: no points, levels or ranks in the API; nothing that ranks people (owner chose option A) |
| Home: "72% overall" ring | Invented score; replaced by progress through the current lesson series ("4 of 7 lessons") |
| Home: "342 youth studying right now", "Listen (3:45)" | Invented user count; no audio in the product |
| Home: (sidebar items reversed 2026-10-17, now "Soon")  "View leaderboard" and "Join a live quiz" quick actions | Not in the product (no live quizzes, no ranking); Events is "Activities" (fixed vocabulary); quick actions now Take a quiz and Achievements |
| Home: "FaithLink Fellowship" sidebar card | "Fellowship" is not our word for church. Tagline "Faith, Community, Impact" restored under the sidebar art (owner, 2026-10-17) |
| Home: "Devotional reflection" and "Activities: 3 new" cards | Second verse duplicates Today's focus; activities card duplicates Upcoming activities |
| Home: "Keep growing. Keep connecting. God has great plans for you.", "On fire", emoji (👋 🔥 📖 ⚡ 🏆) | Marketing slogan and emoji icons (UI rules §6); replaced by specific copy and Lucide icons |
| Home: "Youth Member" role, red notification dot on some phone boards, carousel dots | Roles are Member/Leader/Pastor/Admin; amber dot everywhere (red is for errors); owner asked for no dots (next card peeks instead) |
| Home: AI-generated Stitch photos and a photo avatar | Unsplash photo (friends at sunrise) for Today's focus; initials avatar |

## Temporary and open items

- Home is UI only: `home-sample-data.ts` and `sample-viewer.ts` hold sample data to replace with the API (and WebSocket updates). With real sessions, `/` should send signed-in people to home, not sign in.
- Unbuilt pages linked from the shell and home (open the coming-soon popup): `/lessons`, `/quizzes`, `/activities`, `/progress`, `/church`, `/achievements`, `/settings`. Bell, avatar menu, search (Enter), Join and View open the coming-soon popup.
- Home's Today's focus photo is hot-linked from Unsplash (`images.unsplash.com`); check the licence/credit wording and whether to self-host before launch.
- `src/features/auth/auth-client.ts` now calls Neon Auth; tests use `src/test/fake-auth-client.ts`. Still unbuilt from the contract: "Last used" tag, session handling, route guards.
- Linked pages not built (open the coming-soon popup): `/terms`, `/privacy`.
- **Decision for the owner:** Stitch puts "Continue with Google" below the form (built that way); the backend auth notes recommend above it. Swap the `<GoogleButton />` block if you want the notes' order.
- Inputs have no border (owner decision); the shadow alone separates white fields from the off-white page. The amber focus ring is ~2:1 on the canvas, below the 3:1 of WCAG 1.4.11; the dark-amber icon change backs it up. Check in a real browser.
- Password rule (8+ characters, a number, a symbol) is enforced client-side only; the backend should enforce the same.
- Resend cooldown (30s) is an assumption, not in the backend contract.
- Hero photos are AI-generated placeholders; Scripture translation and licence to be confirmed.
- No browser-level (screenshot / axe) check has been run yet; layout was verified through jsdom tests, build and type checks only.

## Approved Deviations

| Date | Scope | Deviation | Reason | Approved by |
|------|-------|-----------|--------|-------------|
| 2026-10-14 | Auth photo banners (`auth-banners.tsx`) | Rendered as Stitch: uppercase eyebrow and verse reference (white on create account), italic verse, "FaithLink Fellowship" tag; one size smaller on phone. Desktop panel verse also italic, in quotation marks, with an amber quote icon | Owner asked for the banners exactly as Stitch | Owner |
| 2026-10-14 | Motion | Screen changes use view transitions (content fade/rise, sliding tab pill); off under reduced motion | Owner asked for smooth, not static, switching | Owner |
| 2026-10-14 | ECC `web/design-quality.md` | No depth, motion or texture added to satisfy its checklist | Flat, token-disciplined direction; see AGENTS.md precedence | Proposed by agent; awaiting owner confirmation |
| 2026-10-15 | Whole app | Colour trial from the onboarding reference: canvas `#FDF9F3`, navy ink, amber gradient buttons with white text, orange links/focus (brown removed) | Owner: "adapt to the whole coloring of the image" to see how it looks. White on amber and orange links are below WCAG AA | Owner |
| 2026-10-15 | Onboarding | Step 4 photo grid: staggered columns tilted in 3D (concave panel) on every size; phone step 1 photo full-bleed with a warm frosted verse card, verse upright | Owner: match the reference exactly | Owner |
| 2026-10-15 | Onboarding | Soft amber glow, tilted shapes, frosted verse card, 24px radius, Caveat script line, illustrative "+100 pts" | Owner's onboarding design (UI rules §6 bans glassmorphism/blobs and DESIGN.md bans invented points) | Owner |
| 2026-10-15 | New screens | Plain SCSS instead of Tailwind; Motion library for step transitions | Owner finds Tailwind hard to read; wants smooth but light transitions | Owner |
| 2026-10-17 | Whole app | Stitch is the spec: the desktop board is the source of truth, phone derived from it, built component by component. Dark surfaces moved from navy to night; navy kept for text | Owner | Owner |
| 2026-10-17 | Sidebar | Collapsible, ChatGPT-style; Live Games, Groups, Events, Leaderboard, Messages and the "Faith, Community, Impact" tagline restored (earlier drops reversed) as "Soon" items; church card removed; three dots under the tagline dropped (no meaning) | Owner: keep as designed, mark unbuilt features | Owner |
| 2026-10-17 | Phone top bar | Logo, bell and avatar only; church switcher removed | Owner | Owner |
| 2026-10-17 | Home greeting | 3D waving hand (`public/images/waving-hand.png`, Microsoft Fluent Emoji, MIT licence, resized to 64px, 5.7 kB) with a CSS wave; 20px title and 12px line on phones; bell and avatar 28px on phones, 36px bell + 32px avatar in a white name pill on desktop | Owner: real-looking wave, lightweight; small header icons | Owner |
| 2026-10-17 | Home focus banner | Built from the owner's two reference images instead of Stitch; points and level shown as designed; yellow replaced by brand amber | Owner | Owner |
| 2026-10-17 | App shell / home | Skip-to-content link removed; home content fills the full width on desktop (no 1120px cap); phone page margin 12px | Owner | Owner |
