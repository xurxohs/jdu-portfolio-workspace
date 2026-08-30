# 001 — Consolidate motion feedback

- **Status**: DONE
- **Commit**: 54dec6e
- **Severity**: MEDIUM
- **Category**: Easing, physicality, accessibility, cohesion
- **Estimated scope**: 1 file, small CSS pass

## Problem

Interactive elements use repeated built-in `.2s ease` transitions and hover movement without pointer gating in `app/globals.css:52`, `app/globals.css:95`, `app/globals.css:115`, and `app/globals.css:230`. Most pressable controls have no `:active` feedback. The reduced-motion rule at `app/globals.css:391` suppresses every transition instead of preserving useful color and opacity feedback.

```css
/* app/globals.css:52 — current */
.sidebar-nav button, .logout-button { transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease; }
```

## Target

Add shared curves in `:root` and use exact, scoped properties:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Pressable controls use `transform: scale(0.97)` with `transition: transform 160ms var(--ease-out)`. Large cards use `scale(0.99)`. Hover-only movement lives inside `@media (hover: hover) and (pointer: fine)`. Reduced motion removes positional movement but preserves short opacity and color feedback.

## Repo conventions to follow

- Shared visual tokens live in `app/globals.css:3`.
- Existing controls already list exact transition properties; extend that convention and replace built-in easing with shared tokens.

## Steps

1. Add the three shared easing tokens to `app/globals.css`.
2. Replace repeated built-in UI easing with the shared curves and 160–220ms durations.
3. Add subtle press feedback to buttons and linked primary actions.
4. Gate hover transforms behind fine-pointer media queries.
5. Replace the blanket reduced-motion override with targeted no-translation/no-scale fallbacks that keep opacity and color feedback.

## Boundaries

- Do NOT add an animation library for hover or press feedback.
- Do NOT animate layout properties.
- Do NOT animate keyboard-initiated navigation.

## Verification

- **Mechanical**: run `npm run lint` and `npm run build`; both must pass.
- **Feel check**: press primary buttons, cards, and compact nav controls. They should respond instantly without visible bounce. Emulate touch and confirm hover lifts do not stick. Enable reduced motion and confirm movement disappears while color feedback remains.
- **Done when**: all pressable surfaces respond on press, hover movement is pointer-gated, and shared easing tokens replace hand-typed curves.
