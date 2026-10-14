# Stitch sources

Which Stitch screens each built page came from. Stitch is a reference, not the source of truth: build from `src/styles/tokens.css`, and drop anything that is inconsistent or unnecessary (see Dropped in [`ui-registry.md`](ui-registry.md)).

| Page | Stitch project | Screen | Screen ID |
|------|----------------|--------|-----------|
| Sign in | `Mobile Auth UI Design` (`703264712868894387`) | FaithLink Sign In | `0e5e5470549b451d891cb3194486ec47` |
| Create account | same | FaithLink Create Account | `1b5ca199c2f04f16a5ab3bed854d07c4` |
| Verify email | `FaithLink Web App` (`7724872456057735780`) | Auth - Verify email - Mobile | `fa0c2b3be21b4d97bb9f99e06a16e9bd` |

Not used: `FaithLink Sign In - Error State` (`6f9fcbd0…`, per-field errors contradict the banner; the banner pattern was taken instead) and `FaithLink Mobile Login` (`6d451510…`, serif type and wrapped text: inconsistent with the rest).

Desktop layout (split form + photo panel) follows the reference boards in the old project (`image.png` uploads), not a generated screen.

## Using the Stitch MCP (`mcp__stitch__*`)

- Only generate or edit screens when the owner asks. Reading is free.
- `list_screens` returns `{}` for projects made through the API; reach screens by ID with `get_screen`.
- `generate_screen_from_text` often outlives the tool timeout and the ID is lost. Pass `modelId: GEMINI_3_5_FLASH_LITE`; never retry a timeout.
- Every response echoes the whole design system (about 5k tokens).
- The old project's photos are AI-generated and one had garbled fake UI text baked in. Check any image before using it.
