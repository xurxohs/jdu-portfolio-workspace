# 003 — Replace the hand-built toast with Sonner

- **Status**: DONE
- **Commit**: 54dec6e
- **Severity**: MEDIUM
- **Category**: Interruptibility, component quality, feedback
- **Estimated scope**: 3 files plus one dependency

## Problem

The notification system is hand-built from a string state at `app/page.tsx:492`, a timer at `app/page.tsx:535`, and conditional markup at `app/page.tsx:647`. Rapid messages overwrite one another, timers are not coordinated, backend saves do not expose a loading state, and the toast has no proper exit motion.

```tsx
// app/page.tsx:535 — current
function notify(message: string) {
  setToast(message);
  window.setTimeout(() => setToast(''), 3600);
}
```

## Target

Install Sonner, mount one `<Toaster />` in `app/layout.tsx`, call `toast()` from the client page, and use `toast.promise()` for project/question/review writes. Keep simple informational notices as `toast.info()`. Use one design-system class and preserve Sonner's stacking, pause, dismissal, and swipe behavior.

## Repo conventions to follow

- Global app providers/components mount in `app/layout.tsx`.
- Event handlers live in the existing client page.
- Global styling lives in `app/globals.css`.

## Steps

1. Add `sonner` to the existing npm project.
2. Mount exactly one `<Toaster />` in the root layout.
3. Remove the local toast string state, timer, and conditional toast markup.
4. Replace simple notices with `toast.info()` and backend writes with `toast.promise()` using clear loading, success, and error copy.
5. Style the toast shell through `toastOptions.classNames`, using `!important` only where Sonner's injected styles require it.

## Boundaries

- Do NOT mount more than one Toaster.
- Do NOT call `toast()` from server routes.
- Do NOT change API contracts or persistence logic.

## Verification

- **Mechanical**: run `npm run lint` and `npm run build`; both must pass.
- **Feel check**: trigger informational, success, and error notifications. Rapidly trigger two notices and confirm they stack without resetting. Submit a backend form and confirm loading updates into success or error in place. Check swipe dismissal on touch and reduced motion.
- **Done when**: no custom toast state remains, backend actions expose progress, and notifications stack and dismiss predictably.
