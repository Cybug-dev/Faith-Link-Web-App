# Agent Instructions

## Start here

1. Read [`docs/progress.md`](docs/progress.md) for current state, next work and open questions. Update it when you finish a task.
2. Follow **Token discipline** below on every task. Edit only what the task asks for. No drive-by refactors or "while I'm here" changes; suggest them instead.

## Token discipline (mandatory)

Every file read costs tokens. Spend them only on what the current change needs.

1. **Locate before you read.** Start from an index ([`docs/ui/ui-registry.md`](docs/ui/ui-registry.md) maps every component and screen to its path), then run a targeted search for the exact symbol, prop, class, route or message text you need to change. Never scan directories or open files "to get a feel".
2. **Read the smallest slice that answers the question.** Use search with a few lines of context, or a line range around the match. Open a whole file only when it is small or the change genuinely touches most of it.
3. **Read once.** Don't re-read a file you already have unless it changed. Don't re-read to "check" an edit that succeeded.
4. **Ask the code a precise question.** "Which class sets the input text size?" means one search for `text-` in `input.tsx`, not reading the component and its parents.
5. **Large or generated files are search-only:** `package-lock.json`, `node_modules/`, build output, coverage, and third-party type definitions.
6. **Quiet commands.** Pipe test, build and lint output through filters that keep failures and summary lines only.
7. **Before reading, name the target:** the file, the symbol and why the task needs it. If you can't, search first.

## UI / UX work

Before any UI/UX or frontend work, read in this order and stop when you have what the task needs:

1. [`frontend-ui-ux-engineering-rules.md`](frontend-ui-ux-engineering-rules.md): mandatory workflow, STOP rule, component and state rules.
2. [`docs/ui/ui-registry.md`](docs/ui/ui-registry.md): index of tokens, components, and screens. Keep it updated.
3. [`docs/ui/DESIGN.md`](docs/ui/DESIGN.md): design intent, vocabulary, naming, and product rules the UI must respect.
4. [`src/styles/tokens.css`](src/styles/tokens.css) and [`typography.css`](src/styles/typography.css): the only source of values. `theme.css` maps them to Tailwind utilities. Never hardcode a colour, size, radius, shadow, or duration.

**Styling (owner's decision):** new screens and features use plain SCSS: one `.scss` file beside each component, imported by it, BEM class names prefixed by the feature (`.onboarding__title`, `.onboarding-quiz__card`), `@use '@/styles/mixins' as *;` for breakpoints and helpers. Not CSS modules. Values still come only from the CSS variables in `tokens.css`. Existing Tailwind screens and the shared `src/components/ui` kit stay on Tailwind; never mix Tailwind utilities and SCSS classes inside one component (passing a class to a shared component's `className` is fine).

**Motion (owner's decision):** smooth, restrained transitions that explain a change (screen switches, step changes). Nothing bouncy, looping or childish, nothing that could lag a slow phone. Use `motion/react` with `LazyMotion` + `domAnimation` and `MotionConfig reducedMotion="user"`, only on lazy-loaded routes; CSS transitions for small state changes.

Stitch screens used as references are listed in [`docs/ui/stitch-sources.md`](docs/ui/stitch-sources.md). Do not generate or edit Stitch screens unless the owner asks.

## Working agreements

- Run commands from this folder (the parent folder has no `package.json`): `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.
- Do only what was asked. Anything unknown or optional (a library, a design choice, extra screens) is raised as a question or a suggestion with the reason, not decided silently.
- **How to ask the owner (owner's preferred format):** answer the question first with a clear recommendation and the reasons, in short sections with headings. Then list what's unclear as a numbered **Questions** list: one decision per item, a short bold label, the options in plain words, and your recommendation. Flag inconsistencies in a design as a numbered list, each with a suggested fix. Plain words, no code in these replies unless asked.
- Use the Stitch designs as references, not gospel: drop inconsistent or unnecessary content and record each drop in the registry.
- Auth runs on Neon Auth through `src/features/auth/auth-client.ts` (pages never import the SDK); tests swap in `src/test/fake-auth-client.ts`.
- Commit messages are concise but clear to a non-developer: a subject `type: what changed` (types: feat, fix, refactor, style, docs, test, chore), imperative, under ~60 characters; then bullet points, one per core change, each a plain full sentence saying what changed and, where useful, why. Use everyday words; technical terms only when there is no plain alternative. Don't squeeze bullets into clipped fragments. No file lists, no step-by-step narration, no restating the diff. Never add a `Co-Authored-By` or any attribution line.

## ECC (Everything Claude Code)

ECC is installed project-locally under `.claude/`:

- `.claude/rules/ecc/{common,typescript,react,web}/`: coding, testing, security, and design rules. `web/` and `react/` load only for matching files.
- `.claude/agents/`: `react-reviewer`, `a11y-architect`, `typescript-reviewer`, `code-reviewer`, `react-build-resolver`, `performance-optimizer`, `security-reviewer`, `e2e-runner`, `tdd-guide`, `planner`, `architect`, `silent-failure-hunter`, `code-simplifier`, `refactor-cleaner`.
- `.claude/skills/`: `frontend-design-direction`, `frontend-a11y`, `accessibility`, `design-system`, `frontend-patterns`, `react-patterns`, `react-performance`, `react-testing`.

ECC rule text calls agents `ecc:planner`, `ecc:code-reviewer`, etc. (plugin namespace). Here they are installed project-locally, so invoke them by bare name (`planner`, `code-reviewer`).

Not installed on purpose: ECC hooks (they execute code; add only with approval) and non-web agents/languages.

**Precedence:** explicit task + product rules, then this repo's UI rules (`frontend-ui-ux-engineering-rules.md`, `docs/ui/DESIGN.md`), then ECC. Known overlap, resolved here so agents don't flip-flop:

- ECC `web/design-quality.md` asks for depth, layering, motion, or texture. FaithLink is calm and restrained: depth comes from the soft `shadow-raised` on inputs, white buttons, tabs and cards (see `DESIGN.md`). Owner-approved since the onboarding design: a warm cream canvas, soft amber glow and tilted shapes behind illustrations (`--color-deco-*`), and restrained transitions (see Motion above). Still no decoration on working screens such as forms, and no looping or bouncing motion.
- ECC's "avoid a default shadcn look" still applies: shadcn components are restyled to the tokens, never shipped with their defaults.

After any UI change, run `react-reviewer` and `a11y-architect`; run `typescript-reviewer` for non-trivial `.ts`/`.tsx`.
