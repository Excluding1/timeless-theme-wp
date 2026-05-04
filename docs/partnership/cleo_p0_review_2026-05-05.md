# Cleo P0 fix peer-review

## Per-edit verdict

A. Webhook-fail fix: APPROVED  
No fake success on real webhook failure: failure returns before `setDone(true)` and does not clear storage. Try again clears `submitError` and reruns `handleSubmit`. Error UI is visible enough. Caveat: localStorage only persists contact fields, not full quote/photos, so reload recovery is still partial.

B. Mobile stub gating: APPROVED  
`ENABLE_MOBILE_HANDOFF = false` prevents the CTA from rendering. Modal is dead through normal UI. I’d still gate `{showMobileModal && ...}` as `{ENABLE_MOBILE_HANDOFF && showMobileModal && ...}` to make the invariant explicit. No unused-state lint from this diff because the state is still referenced.

C. Placeholder removal: APPROVED  
No `PLACEHOLDER_*` hits remain. Service cards now use concrete image paths; no placeholder fallback was left dangling.

D. Floor card copy: NEEDS-REVISION  
The area card copy is better, but the P0 copy problem is not fully fixed. Remaining bad/overbroad copy:

- `PHOTO_PROMPTS.walls`: “cracked or broken tiles”
- `PHOTO_PROMPTS.floor`: “cracked or broken tiles”
- full bathroom floor prompt: “any cracked tiles”
- wall/floor chip services: “fix any chipped or cracked tiles”

That still reads like tile crack/broken-tile repair, not “surface chips / small cracks / no tile replacement.” Walls has the same issue through service option copy even if the wall area card itself is neutral.

E. Side effects: ANY FOUND  
`submitError.canRetry` is set but never read. Harmless, but dead shape.  
Mobile modal stub remains in the bundle with fake QR/SMS content. Not user-reachable now, but should be flag-gated at the modal too.  
Could not run lint: `eslint` is not installed in this workspace (`sh: eslint: command not found`).

F. What's missing: ANY ITEMS  
Copy sweep is incomplete. Replace “broken tiles,” “cracked tiles,” and “chipped or cracked tiles” with language like “surface chips or small cracks, filled and colour-matched; no tile replacement” where space permits.

## Suggested follow-ups

Fix the remaining tile-repair copy in photo prompts and wall/floor chip service options. Gate the modal block with `ENABLE_MOBILE_HANDOFF` too. Drop `canRetry` unless it will drive UI.

## Ready to ship?

NO. Webhook P0 is fixed, but the tile-replacement promise is still leaking through nearby copy.

— Cleo
