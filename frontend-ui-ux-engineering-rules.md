# Frontend UI/UX Engineering Rules

**Audience:** any AI agent (Claude Code, Codex, Cursor, Copilot, etc.)
designing, building, or changing UI in this repo.

**Status:** mandatory. These rules supplement ECC and project rules; on a
conflict, project-specific instructions win, then this file.

**Goal:** every screen looks and behaves like part of one deliberately
designed product — modern, consistent, accessible, and never generic or
"AI-generated" — and agents get there without wasting tokens.

---

## 0. How to Use This File

1. Read this file once at the start of any UI task.
2. Read [`docs/ui/ui-registry.md`](docs/ui/ui-registry.md) next. It is the
   index of tokens, components, and screens. Use it instead of exploring
   the codebase.
3. Follow §1 (workflow) → §2 (sources and STOP rule) before writing code.
4. Update the registry before handing off (§12).

---

## 1. Token-Conscious Workflow

Read only what the task needs.

- **Registry first.** Find components, tokens, and similar screens via
  `docs/ui/ui-registry.md`. Do not list or walk the directory tree to
  discover them.
- **Search, don't browse.** Use targeted Glob/Grep with concrete terms
  (component name, token name, route path, CSS class, prop name). Prefer
  `files_with_matches` first, then open only the hits that matter.
- **Read narrowly.** Read the relevant line range of a file, not the whole
  file, when you already know what you need (a function, a variant map, a
  token block). Read a whole file only when you are about to edit it.
- **Never read:** `node_modules/`, `dist/`, `build/`, `.next/`,
  `coverage/`, lockfiles, minified or generated files, source maps, large
  images/fonts, or vendored code.
- **Stop when you have the answer.** Do not keep exploring "for context".
  Do not re-read a file you have already read this session unless it
  changed.
- **Escalate search gradually.** Exact name → partial name/glob → broader
  pattern. Use a sub-agent or wide search only after two targeted searches
  fail.
- **Reference images:** inspect the image once, write down the decisions
  that matter (layout, hierarchy, tokens, components), and work from those
  notes. Don't reload it repeatedly.
- **Keep output lean.** Don't paste large files into responses, don't
  restate this document, don't write design essays.

---

## 2. Sources of Truth & the STOP Rule

### Priority order

1. Explicit task requirements, product rules, and real API contracts.
2. **Existing shipped UI and design tokens** (what users already see).
3. The primary reference/template (image, Figma, mockup), if supplied.
4. Inspiration references, if supplied.
5. This guide's visual principles.

**Primary reference:** keep its visual identity, hierarchy, spacing rhythm,
component character, and interaction patterns. Don't copy unrelated
content, and don't force a screen into a layout that doesn't fit its
purpose.

**Inspiration reference:** borrow only the requested qualities (hierarchy,
composition, navigation, density, card treatment, interactions). Never copy
its brand, exact colors, logos, text, or imagery unless explicitly asked.
Blend it into this product's design language.

### STOP rule — reference vs. existing UI

Before coding, compare the reference with the existing UI on:
color palette, typography (family/scale/weights), spacing rhythm, radius,
elevation/shadows, component style (buttons, inputs, cards), navigation
pattern, and page layout shell.

If they **materially differ**, **stop. Write no UI code.** Report it:

```md
UI CONFLICT — reference does not match existing UI

| Aspect      | Existing UI          | Reference            | Affects              |
|-------------|----------------------|----------------------|----------------------|
| Primary     | #1F4E79 (blue)       | #7C3AED (violet)     | All buttons, links   |
| Card radius | 8px                  | 20px                 | Cards, modals        |

Options:
A. Follow existing UI (reference used for layout only)  ← recommended if …
B. Adopt the reference everywhere (design migration: tokens + N screens)
C. Scoped exception for this screen only (recorded in the registry)

Which should I do?
```

- Never silently blend two visual systems.
- Minor differences (a reference image's slightly different pixel spacing,
  for example) aren't conflicts. Snap to the existing tokens and mention
  it in the handoff.
- The same rule applies when **requirements contradict existing UX**
  (different navigation model, different flow for the same action). Stop
  and ask.
- Approved exceptions go in the registry's _Deviations_ log.

---

## 3. Building Screens That Weren't Provided

When a needed screen, state, or flow has no design:

1. **Classify it** by archetype: list/index, detail, create/edit form,
   settings, dashboard/overview, auth, onboarding, search/results, empty,
   error/404, confirmation/success.
2. **Find the closest existing screen** of that archetype in the registry's
   screen inventory, or failing that, the closest screen in the reference.
3. **Inherit its skeleton:** layout shell, page header pattern, content
   width, grid, spacing, section rhythm, action placement, and the
   components it uses.
4. **Map the new content** into that skeleton. Primary action placement and
   the order of information must match sibling screens.
5. **Cover every state** (§9) using the existing EmptyState/ErrorState/
   Skeleton components.
6. **Only invent a pattern if none fits.** Keep it built from existing
   components and tokens, and list it under "New patterns" in the handoff.
7. **Register the screen** in `docs/ui/ui-registry.md` with its archetype and
   the screen it was based on.

If no UI and no reference exist yet, derive the design from the user
journey, data shape, and content priority. Establish tokens and core
components first (§4–§5), then build. Record the decisions in the registry
so later screens follow them.

---

## 4. Reusable Component System (Mandatory)

All UI is composed from shared components. Feature code must not re-style
raw elements.

### Core set

Build these (or wrap the chosen UI library's equivalents) before or as
they're first needed:

| Group      | Components |
|------------|------------|
| Actions    | Button (primary/secondary/ghost/danger; sm/md/lg; loading, icon slots), IconButton, Link |
| Form       | FormField (label + hint + error wrapper), Input, Textarea, Select, Combobox, Checkbox, Radio/RadioGroup, Switch, DatePicker, FileUpload |
| Overlays   | Modal/Dialog, ConfirmDialog, Drawer/Sheet, Popover, Dropdown/Menu, Tooltip |
| Feedback   | Toast, Alert/Banner, Spinner, Skeleton, ProgressBar, EmptyState, ErrorState |
| Display    | Card, Badge/Tag, Avatar (+ group), Divider, List/ListItem, Table, Stat (only for real data) |
| Navigation | AppShell/Layout, PageHeader, Navbar/Sidebar, Tabs, Breadcrumbs, Pagination |

### Rules

- **Check before creating.** Look in the registry, then grep. If a
  component exists, use it.
- **Extend, don't fork.** Need something new? Add a variant or prop to the
  existing component. Never copy it into a near-duplicate
  (`PrimaryButton2`, `ModalNew`).
- **No one-offs in features.** No ad-hoc styled `<button>`, `<input>`,
  `<select>`, or hand-rolled modals/popups/dropdowns in feature or page
  code.
- **Complete states.** Each interactive component covers default, hover,
  focus-visible, active, disabled, loading, and (for inputs) error and
  read-only.
- **Tokens only.** Components reference design tokens and have no raw hex
  or px values.
- **Accessible by default.** Correct roles, labels, keyboard support, and
  focus management are built into the component, not the caller.
- **Small API.** Typed props, sensible defaults, `className`/slot escape
  hatch only where truly needed.
- **Register it.** Add new components and variants to the registry
  (name, path, variants, notes).

---

## 5. Design Tokens & Visual Language

Use existing tokens. If none exist, define this minimal set first (CSS
custom properties or the project's theme system):

- **Color:** a neutral scale (≈50–950); **one** primary accent (+ hover/
  active); semantic success, warning, danger, info; surface, border, and
  text levels (primary, secondary, muted, inverse). Define both light and
  dark if dark mode is in scope.
- **Typography:** one scale (e.g. 12/14/16/18/20/24/30/36), 2–3 weights,
  defined line-heights. At most two families (heading + body), or one
  family used with a strong scale.
- **Spacing:** a 4px-based scale (4, 8, 12, 16, 24, 32, 48, 64…). All
  margins, padding, and gaps come from it.
- **Radius:** no more than 3 values (e.g. sm for inputs/badges, md for
  cards/buttons, full for pills/avatars).
- **Elevation:** no more than 3 shadow levels, used only for things that
  actually float (menus, popovers, modals).
- **Motion:** durations (fast ≈150ms, base ≈200ms, slow ≈300ms) + one or
  two easing curves.
- **Layout:** content max-widths, breakpoints, z-index layers (dropdown,
  sticky, overlay, modal, toast).

Feature code never uses magic values. If a value is missing, add a token
with a clear reason rather than hardcoding it.

---

## 6. Avoiding the "AI-Generated" Look

### Don't

- Use default purple/indigo/blue gradients, neon glows, glassmorphism,
  floating blobs, or mesh backgrounds as decoration.
- Use emoji as icons, or put a decorative icon on every heading, card, and
  bullet.
- Default to the template layout: a centered hero, then three identical
  feature cards, then a CTA band.
- Use the same large radius and heavy shadow on everything
  (`rounded-2xl shadow-xl` everywhere).
- Center everything, use oversized buttons, or leave huge empty padding
  with no purpose.
- Write generic copy such as "Unlock your potential", "Seamless
  experience", "Elevate your journey", or "Welcome back! 👋". Never use
  lorem ipsum.
- Invent stats, charts, testimonials, ratings, user counts, or activity.
- Animate for decoration (bouncing, floating, or gradient-shifting
  elements).
- Mix icon sets, or mix outlined and filled icons arbitrarily.

### Do

- Build **clear hierarchy**: one obvious primary action per view, a
  visible difference between primary, secondary, and tertiary content,
  and type size and weight doing most of the work.
- Use **left-aligned, content-first layouts** with purposeful asymmetry
  where it helps scanning. Pick density to suit the task (data screens are
  denser; reading screens get more air).
- **Restrain color:** neutrals carry the UI, the accent marks actions and
  state, and semantic colors are used only for their meaning.
- Write **specific microcopy** in the product's voice. Labels say what
  happens ("Save prayer request", not "Submit"). Errors say what to do
  next.
- Show **real data shapes**: realistic name lengths, empty and very long
  values, real images or neutral placeholders that are clearly marked.
- Use **one icon set** at consistent sizes and stroke, and only where an
  icon aids recognition.
- Give the product **subtle character** through typography, one accent,
  and a considered detail or two, not through decoration.

**Self-check before finishing:** "If I removed the logo, could this screen
belong to any random SaaS template?" If yes, revise the hierarchy, copy,
and composition.

---

## 7. UX Behavior Consistency

The same situation always gets the same pattern across the app.

| Situation                         | Pattern |
|-----------------------------------|---------|
| Field validation error            | Inline under the field via FormField; validate on blur and submit, not every keystroke |
| Form-level / server error         | Alert at the top of the form; keep the user's input |
| Background action result          | Toast (auto-dismiss success; errors persist or offer retry) |
| Destructive action                | ConfirmDialog naming the object and consequence; danger button; offer undo where feasible |
| Page/section loading              | Skeleton matching the final layout |
| Button-triggered async action     | Spinner inside the button + disabled to prevent double submit |
| No data yet                       | EmptyState: what this is, why it's empty, primary next action |
| Failed load                       | ErrorState with a plain explanation and Retry |
| Unsaved changes on navigation     | Confirm before discarding |

Also:

- **Overlays** trap focus, close on Esc and on backdrop click (unless the
  task is destructive or long), return focus to the trigger, and lock
  background scroll. Popovers and menus never get clipped by the
  viewport.
- **Navigation:** the active state is always visible, back behavior is
  predictable, and deep links work. Primary navigation keeps the same
  place and order on every screen.
- **Motion** uses the motion tokens (≈150–250ms) and only shows a state
  change (open/close, enter/exit, feedback). Respect
  `prefers-reduced-motion`.
- **Optimistic updates** only where rollback is handled and visible.

---

## 8. Responsive & Accessible

- Design **mobile-first** unless the project says otherwise. Verify
  narrow phones (~360px), tablets (~768px), laptops (~1280px), and wide
  screens.
- Use fluid layouts (`minmax`, `clamp`, flex/grid, max-widths). Add
  breakpoints where the content breaks, not by device name.
- Prevent horizontal overflow, clipped controls, overlapping content, and
  unreadable text. Test long strings and real data.
- Adapt structure instead of shrinking it: columns stack, tables become
  cards or scroll containers, and navigation collapses accessibly.
- Touch targets are at least ~44×44px. Never rely on hover alone.
- Use semantic HTML, labelled inputs, full keyboard access, a visible
  `:focus-visible` style, WCAG AA contrast, meaningful accessible names,
  and live regions for async status. Use ARIA only when native HTML can't
  do the job.

---

## 9. States & Data in the UI

- Every data-driven view defines: loading, success, empty, error (+ retry),
  and relevant mutation states (submitting, success, failure,
  permission-denied).
- Map real API fields. Never invent fields, business rules, or success
  states. Handle null, missing, long, and unexpected values gracefully.
- Never show secrets, stack traces, or raw server errors. Translate them
  into actionable messages.
- UI visibility isn't authorization. Handle `401`/`403`, validation
  errors, rate limits, and network failures the way the project already
  does.
- Keep server state, UI state, and form state separate, using the
  project's existing data-fetching and form patterns.
- Comment the **why** behind non-obvious logic, business rules, and tricky
  responsive or styling decisions. Don't comment what the code already
  says.

---

## 10. Stack Notes — React + TypeScript (when used)

- Write function components with explicit, small prop types. Separate UI
  from domain logic and data access.
- No `any`, unsafe casts, giant components, or deeply nested conditionals.
  Don't use effects to compute values that can be derived.
- Use `useMemo`/`useCallback` only when there's a measured or obvious need.
- Follow the existing folder structure, naming, imports, lint, and format
  rules. Don't introduce competing conventions.
- Keep API URLs, routes, and role values in shared constants, not
  scattered strings.

---

## 11. Dependencies

- Prefer existing packages and native platform features.
- Before adding a UI library, icon set, animation lib, or any package,
  state its purpose, size/overlap, and alternatives, then get approval
  unless that class of change is pre-authorized.
- Never silently swap the styling system, component library, router,
  state management, or build tooling.

---

## 12. Quality Gates & Definition of Done

Run what's available and report results honestly. Never claim a check
passed if it wasn't run.

- [ ] Type check, lint (ESLint/Stylelint if configured), and the build pass.
- [ ] Relevant unit, component, and integration tests pass.
- [ ] Checked at mobile, tablet, and desktop widths: no overflow, hierarchy
      holds, interactions work.
- [ ] Keyboard, focus, labels, and contrast verified.
- [ ] Loading, empty, error, validation, success, and permission states
      verified where they apply.
- [ ] **Consistency:** compared side by side with a sibling screen or the
      reference. Same shell, spacing, components, and patterns.
- [ ] **No one-offs:** every UI element comes from a shared component or
      was added to the component set.
- [ ] **No magic values:** only tokens are used.
- [ ] **Anti-AI self-check** (§6) passed.
- [ ] **Registry updated** with new or changed components, tokens,
      screens, and approved deviations.
- [ ] Only relevant files changed. Docs and config updated if they became
      stale.

If a check can't run, say which one and why.

---

## 13. Handoff Format

Keep it short:

```md
**Changed:** <screens/components, one line each>
**Reused:** <existing components used>
**Added:** <new components/variants/tokens — registered: yes/no>
**New patterns / deviations:** <none | list, with reason>
**Conflicts flagged:** <none | summary + decision>
**Checks run:** <command → result>; **not run:** <which + why>
**Risks / follow-ups:** <short list>
```

For multi-stage work, finish and verify one coherent feature boundary
before starting the next.
