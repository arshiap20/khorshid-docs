# Theming

Every visual value in Khorshid (colors, sizes, radii, motion) is a CSS custom property, and every layer renders against the same stylesheet, `khorshid/styles.css`. Read this page to restyle the picker, theme one instance, switch to dark mode, or target its classes.

## Try it

Pick an accent swatch or switch the theme:

<Demo inline :controls="['accent', 'theme', 'value']" caption="Live theming — accent via the vars API, light/dark/auto via setTheme." />

## How the tokens work

The stylesheet reads every token through a private two-tier indirection
(`--_x: var(--sdp-x, <default>)`), so setting a `--sdp-*` variable on **any ancestor** —
`:root`, a wrapping element, `.sdp` itself, or inline — always overrides the built-in
default:

```css
:root {
  --sdp-accent: #0ea5e9;
  --sdp-on-accent: #ffffff;
  --sdp-radius: 12px;
  --sdp-cell-size: 44px;
}
```

The `--sdp-*` names are the public API; the `--_*` names are private and may change.

Every selector in the stylesheet has the specificity of a single class, so global resets in your page (Tailwind's preflight, Bootstrap Reboot, a VitePress theme) can't strip the picker's styles. A rule of yours that targets a picker class wins without `!important`, as long as it loads after `khorshid/styles.css` or uses one more class (for example `.my-app .sdp__day`).

## Per-instance theming

Popup, sheet and modal overlays are portaled to `document.body` (or to the `container` option), so they do not inherit variables set on the input's ancestors. To theme one picker, use the `vars` option or the `setVars()` method. Both apply the variables inline to the panel and to every mounted overlay:

```js
const picker = createDatePicker('#date', { vars: { accent: '#e11d48', 'on-accent': '#fff' } })

picker.setVars({ '--sdp-radius': '8px' }) // merges with existing vars
picker.setVars({ accent: '' })            // empty string removes one
```

Bare keys get the `--sdp-` prefix automatically, so `{ accent: '#e11d48' }` and
`{ '--sdp-accent': '#e11d48' }` are equivalent.

## Dark mode

The `theme` option sets `data-theme` on the panel and its overlay:

- `'light'` or `'dark'` forces that scheme.
- `'auto'` (the default) follows the operating system through `prefers-color-scheme`.

```js
const picker = createDatePicker('#date', { theme: 'auto' })
picker.setTheme('dark') // switch at runtime
```

A `--sdp-*` variable you set applies in both schemes. To use a different value in dark mode, set it on `[data-theme="dark"]` and, for `'auto'`, on `[data-theme="auto"]` inside `@media (prefers-color-scheme: dark)`; both attributes sit on `.sdp` and `.sdp-overlay`.

## Token reference

A selection of the most-used tokens (full list in the [Theming Tokens](/api/theming-tokens)
reference):

| Variable | Light default | Dark default |
|---|---|---|
| `--sdp-accent` | `#f5b400` | `#facc15` |
| `--sdp-on-accent` | `#1f1600` | `#1a1400` |
| `--sdp-accent-strong` | `color-mix(in srgb, <accent> 58%, #000)` | `<accent>` |
| `--sdp-bg` | `#fffdf8` | `#18150f` |
| `--sdp-surface` | `#f6f2e9` | `#262119` |
| `--sdp-text` | `#1c1917` | `#f7f4ee` |
| `--sdp-muted` | `#78716c` | `#a8a29e` |
| `--sdp-border` | `#e8e2d6` | `#3b3428` |
| `--sdp-radius` | `16px` | — |
| `--sdp-day-radius` | `10px` | — |
| `--sdp-day-gap` | `3px` | — |
| `--sdp-cell-size` | `40px` | — |
| `--sdp-font` | `system-ui, …, 'Vazirmatn', Tahoma, sans-serif` | — |
| `--sdp-duration` | `200ms` | — |
| `--sdp-duration-slow` | `420ms` | — |

The [date field](./date-field) reads the same tokens and adds `--sdp-danger`, `--sdp-field-height` and `--sdp-field-radius`.

## Class names {#class-names}

For structural changes you can target classes. They are stable BEM names with an `sdp` prefix: `.sdp__day--selected`, `.sdp__nav--prev`, and so on. To add your own class names to parts of the panel, use the `classes` option, keyed by slot (`root`, `header`, `title`, `nav`, `grid`, `day`, `weekday`, `footer`, `input`, `overlay`, `sheet`, `popup`):

```js
createDatePicker('#date', { classes: { root: 'my-picker', day: 'my-day' } })
```

These hooks belong to specific features:

| Selector | Feature |
|---|---|
| `.sdp--has-shortcuts`, `.sdp__shortcuts`, `.sdp__shortcut`, `.sdp__shortcut--active` | [Shortcut chips](./shortcuts-and-limits) (`[data-shortcut=id]`, `disabled` when unusable). |
| `.sdp__day--has-reason` | A disabled day that has a [reason](./shortcuts-and-limits#disabled-dates-with-a-reason) (also its `title`). |
| `.sdp--secondary`, `.sdp__day-sub`, `.sdp__day-sub--month-start`, `.sdp__subtitle`, `.sdp__subtitle-part` | [Secondary calendar](./secondary-calendar) labels. |
| `.sdp[data-unit]`, `.sdp__month--range-start`, `--range-end`, `--in-range` (same on `.sdp__year`) | [Selection units](./selection-units). |
| `.sdp-input--invalid` | A field whose typed text was refused (also sets native validity). |
| `.sdp-form-value` | The visually hidden [form field](./forms#the-hidden-field). |

See the package [`CONTRACT.md`](https://github.com/khorshid/khorshid/blob/main/packages/dom/CONTRACT.md) for the complete DOM and CSS contract.

**Related:** [Theming Tokens](/api/theming-tokens) · [Keyboard & Accessibility](./keyboard-a11y) · [Plugins](./plugins)
