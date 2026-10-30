# Theming Tokens

Every `--sdp-*` CSS custom property the stylesheet reads, with its light and dark default. Set one on any ancestor, on `.sdp` itself, inline, or per instance with `vars` / `setVars()`, and it overrides the default. See the [Theming guide](/guide/theming) for how the tokens work.

::: tip Public and private names
The `--sdp-*` names are the public API. The stylesheet reads each one through a private `--_*` twin (`--_accent: var(--sdp-accent, …)`); those names may change.
:::

## Where tokens apply

| Scope | Reads |
|---|---|
| `.sdp`, `.sdp-overlay` | Every token on this page except the date-field ones. |
| `.sdp-field` (the [date field](/api/date-field)) | `--sdp-accent`, `--sdp-on-accent`, `--sdp-accent-strong`, `--sdp-accent-soft`, `--sdp-bg`, `--sdp-surface`, `--sdp-text`, `--sdp-muted`, `--sdp-border`, `--sdp-font`, `--sdp-font-size`, `--sdp-duration`, `--sdp-ease`, and the date-field tokens. |

Dark values apply under `[data-theme="dark"]`, and under `[data-theme="auto"]` when `prefers-color-scheme: dark` matches.

## Colors

| Variable | Light | Dark | Used for |
|---|---|---|---|
| `--sdp-accent` | `#f5b400` | `#facc15` | Selected days, range ends, primary button fills. |
| `--sdp-on-accent` | `#1f1600` | `#1a1400` | Text on an accent fill. |
| `--sdp-accent-strong` | `color-mix(in srgb, var(--sdp-accent) 58%, #000)` | the accent | The accent drawn on the background: the today ring, focus outlines, accent text. Derived, so a custom accent gets one too. |
| `--sdp-accent-soft` | `color-mix(in srgb, var(--sdp-accent) 28%, transparent)` | the same at 20% | In-range and preview fills. |
| `--sdp-bg` | `#fffdf8` | `#18150f` | Panel background. |
| `--sdp-surface` | `#f6f2e9` | `#262119` | Hover and secondary surfaces. |
| `--sdp-text` | `#1c1917` | `#f7f4ee` | Main text. |
| `--sdp-muted` | `#78716c` | `#a8a29e` | Secondary text, outside days. |
| `--sdp-border` | `#e8e2d6` | `#3b3428` | Borders and the sheet handle. |
| `--sdp-holiday` | `#dc2626` | `#f87171` | Holiday dots and the holiday day-number tint (from the [holidays plugin](/guide/holidays)). |
| `--sdp-backdrop` | `rgba(0,0,0,.32)` | `rgba(0,0,0,.55)` | Sheet and modal backdrop. |
| `--sdp-shadow` | `0 12px 40px rgba(28,25,23,.14), 0 2px 8px rgba(28,25,23,.06)` | `0 16px 48px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.35)` | Panel and overlay shadow. |

## Shape and sizing

| Variable | Default | Used for |
|---|---|---|
| `--sdp-radius` | `16px` | Panel corners (the top corners of a sheet). |
| `--sdp-day-radius` | `10px` | Day cell corners. |
| `--sdp-day-gap` | `3px` | Space between day cells. |
| `--sdp-cell-size` | `40px` (`44px` inside a sheet) | Day cell size. |

## Typography

| Variable | Default |
|---|---|
| `--sdp-font` | `system-ui, -apple-system, 'Segoe UI', Roboto, 'Vazirmatn', Tahoma, sans-serif` |
| `--sdp-font-size` | `14px` |

## Motion

| Variable | Default | Paces |
|---|---|---|
| `--sdp-duration` | `200ms` | State changes: hover, colors, press feedback. |
| `--sdp-duration-slow` | `420ms` | Movement: overlays opening, month slides, view zooms, the select pop. Exits run at half of it. |
| `--sdp-ease` | `cubic-bezier(.22, 1, .36, 1)` | A long, soft deceleration for fades and slides. |
| `--sdp-spring` | a damped spring (`linear()`); `cubic-bezier(.34, 1.25, .64, 1)` in older browsers | Things that move into place: popups, the modal, the day pop, press release. |

Animation always respects `prefers-reduced-motion` and `animate: false`, whatever these values are. Keep `--sdp-duration-slow` under one second.

## Layering

| Variable | Default | Used for |
|---|---|---|
| `--sdp-z` | `1000` | Overlay stacking order. The `zIndex` option sets it on each overlay. |

## Date field

Read only by `.sdp-field`.

| Variable | Light | Dark | Used for |
|---|---|---|---|
| `--sdp-danger` | `#dc2626` | `#f87171` | Invalid border, ring and error text. |
| `--sdp-field-height` | `44px` | | Field height. |
| `--sdp-field-radius` | `12px` | | Field corners. |

## Set at runtime

| Variable | Set by | Description |
|---|---|---|
| `--sdp-popup-origin` | `Popup` | The popup's transform origin (for example `top left`), so it grows out of the field. Not meant to be set by hand. |

## Feature classes

Shortcuts, secondary calendars, units and disabled reasons have no tokens of their own; they use the tokens above. For structural tweaks, target their classes: `.sdp__shortcut`, `.sdp__shortcut--active`, `.sdp__day--has-reason`, `.sdp__day-sub`, `.sdp__subtitle`, `.sdp[data-unit]`, `.sdp__day--mark-holiday`. The full list is in the [Theming guide](/guide/theming#class-names).

## Example

```css
:root {
  --sdp-accent: #0ea5e9;
  --sdp-on-accent: #ffffff;
  --sdp-radius: 12px;
  --sdp-cell-size: 44px;
  --sdp-duration: 120ms;
}
```

Per instance, which also reaches portaled overlays (an ancestor rule does not):

```js
createDatePicker('#date', {
  vars: { accent: '#0ea5e9', 'on-accent': '#ffffff', radius: '12px' },
})
```
