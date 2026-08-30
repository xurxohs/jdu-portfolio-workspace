# 002 — Make drawers spatial and interruptible

- **Status**: DONE
- **Commit**: 54dec6e
- **Severity**: HIGH
- **Category**: Spatial consistency, interruptibility, accessibility
- **Estimated scope**: 2 files, moderate UI state change

## Problem

The project and add-project drawers are conditionally mounted at `app/page.tsx:644` and `app/page.tsx:646` with no entry or exit state. The backdrop and panel therefore teleport on and disappear instantly. Escape does not close the drawer and page scrolling remains active underneath it.

```tsx
// app/page.tsx:644 — current
{selected && <div className="drawer-backdrop">...</div>}
```

## Target

Drawers enter from and exit to the right, matching their screen position. Entry uses `280ms var(--ease-drawer)`; exit uses `180ms var(--ease-out)`. The backdrop fades with opacity only. Closing state stays mounted until the exit transition completes. Escape and backdrop click close the active drawer, and background scrolling is locked while one is open.

```css
.project-drawer,
.add-drawer {
  transform: translateX(0);
  transition: transform 280ms var(--ease-drawer), opacity 180ms var(--ease-out);
}
```

## Repo conventions to follow

- Drawer state lives in the client component `app/page.tsx`.
- Visual styling and responsive rules live in `app/globals.css`.
- Use the easing tokens introduced by plan 001.

## Steps

1. Add one explicit closing state and a short close timer so exit motion can finish before unmount.
2. Route close buttons, backdrop clicks, and Escape through the same close helpers.
3. Lock body scrolling while either drawer is open and restore the previous value on cleanup.
4. Add right-edge entry/exit transforms and backdrop opacity transitions.
5. Add reduced-motion and reduced-transparency fallbacks.

## Boundaries

- Do NOT add drag/swipe gestures in this pass.
- Do NOT animate width, height, padding, or position.
- Do NOT change project or form data behavior.

## Verification

- **Mechanical**: run `npm run lint` and `npm run build`; both must pass.
- **Feel check**: open and close each drawer via button, backdrop, close control, and Escape. Spam open/close and confirm there is no jump. In DevTools at 10% playback, confirm the panel and scrim start together and exit toward the right. With reduced motion enabled, confirm the slide becomes a short fade.
- **Done when**: both drawers have symmetric spatial paths, remain responsive during transitions, close by Escape, and leave no body-scroll lock behind.
