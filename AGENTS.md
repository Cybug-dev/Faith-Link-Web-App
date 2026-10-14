# Agent Instructions

## UI / UX work

Before any UI/UX or frontend work, read in this order and stop when you have what the task needs:

1. [`frontend-ui-ux-engineering-rules.md`](frontend-ui-ux-engineering-rules.md): mandatory workflow, STOP rule, component and state rules.
2. [`docs/ui/ui-registry.md`](docs/ui/ui-registry.md): index of tokens, components, and screens. Keep it updated.
3. [`docs/ui/DESIGN.md`](docs/ui/DESIGN.md): design intent, vocabulary, naming, and product rules the UI must respect.
4. [`src/styles/tokens.css`](src/styles/tokens.css) and [`typography.css`](src/styles/typography.css): the only source of values. `theme.css` maps them to Tailwind utilities. Never hardcode a colour, size, radius, shadow, or duration.

Stitch screens used as references are listed in [`docs/ui/stitch-sources.md`](docs/ui/stitch-sources.md). Do not generate or edit Stitch screens unless the owner asks.

## Working agreements

- Run commands from this folder (the parent folder has no `package.json`): `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.
- Do only what was asked. Anything unknown or optional (a library, a design choice, extra screens) is raised as a question or a suggestion with the reason, not decided silently.
- Use the Stitch designs as references, not gospel: drop inconsistent or unnecessary content and record each drop in the registry.
- Backend is not wired yet; the UI talks to the stub in `src/features/auth/auth-client.ts`.

## ECC (Everything Claude Code)

ECC is installed project-locally under `.claude/`:

- `.claude/rules/ecc/{common,typescript,react,web}/`: coding, testing, security, and design rules. `web/` and `react/` load only for matching files.
- `.claude/agents/`: `react-reviewer`, `a11y-architect`, `typescript-reviewer`, `code-reviewer`, `react-build-resolver`, `performance-optimizer`, `security-reviewer`, `e2e-runner`, `tdd-guide`, `planner`, `architect`, `silent-failure-hunter`, `code-simplifier`, `refactor-cleaner`.
- `.claude/skills/`: `frontend-design-direction`, `frontend-a11y`, `accessibility`, `design-system`, `frontend-patterns`, `react-patterns`, `react-performance`, `react-testing`.

ECC rule text calls agents `ecc:planner`, `ecc:code-reviewer`, etc. (plugin namespace). Here they are installed project-locally, so invoke them by bare name (`planner`, `code-reviewer`).

Not installed on purpose: ECC hooks (they execute code; add only with approval) and non-web agents/languages.

**Precedence:** explicit task + product rules, then this repo's UI rules (`frontend-ui-ux-engineering-rules.md`, `docs/ui/DESIGN.md`), then ECC. Known overlap, resolved here so agents don't flip-flop:

- ECC `web/design-quality.md` asks for depth, layering, motion, or texture. FaithLink is deliberately flat: no shadow on resting cards, no decorative motion, no gradients. Meet the "four required qualities" through hierarchy, spacing rhythm, typography, semantic colour, and designed states instead.
- ECC's "avoid a default shadcn look" still applies: shadcn components are restyled to the tokens, never shipped with their defaults.

After any UI change, run `react-reviewer` and `a11y-architect`; run `typescript-reviewer` for non-trivial `.ts`/`.tsx`.
