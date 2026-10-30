# Web Component

`<khorshid-datepicker>` is the picker as a framework-free Custom Element. Use it in plain HTML, server-rendered pages (Rails, Django, Laravel, Go templates), a CMS, or a framework without its own adapter. This page covers registering the element, its attributes, properties, events, forms and theming.

## How it works

The element wraps [`createDatePicker`](/vanilla/api) and renders into its light DOM, not a shadow root. As a result:

- the standard stylesheet applies, and `--sdp-*` variables work as usual;
- the field it creates for `name` sits inside your `<form>`.

<ElementDemo caption="A real khorshid-datepicker element from the built package: display inline, range mode, shortcuts and a secondary calendar.">
  <khorshid-datepicker display="inline" locale="fa-IR" mode="range" shortcuts secondary-calendar></khorshid-datepicker>
</ElementDemo>

## Install and register

```js
import { defineDatePickerElement } from 'khorshid/element'
import 'khorshid/styles.css'

defineDatePickerElement() // registers <khorshid-datepicker>
```

`defineDatePickerElement(tagName?)` takes an optional tag name, and registering the same name twice does nothing. The module is safe to import during server-side rendering: on the server it neither throws nor registers anything.

::: tip Without a bundler
The scoped `@khorshid-js/element` package ships a self-registering entry, `@khorshid-js/element/define`, whose bundle includes the DOM layer and the core. A plain `<script type="module">` that imports it, plus `@khorshid-js/element/styles.css`, is enough; no build step is needed. That entry also registers `<khorshid-date-field>`.
:::

Then use the element in markup:

```html
<khorshid-datepicker locale="fa-IR" placeholder="۱۴۰۵/۰۱/۰۱"></khorshid-datepicker>

<khorshid-datepicker mode="range" months="2" min-days="2" shortcuts></khorshid-datepicker>

<khorshid-datepicker display="inline" locale="en-US-gregorian" secondary-calendar></khorshid-datepicker>
```

## Attributes

Attributes are the kebab-case [options](/api/options). Booleans follow HTML semantics
(present = on). `="false"` also turns one off, which is how you disable options that
default to on (`show-today="false"`).

| Attribute | Option | Notes |
|---|---|---|
| `locale` | `locale` | Live. |
| `theme` | `theme` | `light` / `dark` / `auto`. Live. |
| `mode` | `mode` | `single` / `range` / `multiple`. Live. |
| `value` | `value` | `2026-03-21`, a range as `start/end`, or a comma list. Live. |
| `unit` | `unit` | `day` / `week` / `month` / `year`. |
| `display` | `display` | `auto`, `inline`, `popup`, `sheet`, `modal`. |
| `min`, `max` | `min`, `max` | ISO dates. |
| `months` | `months` | Panes side by side. |
| `min-days`, `max-days` | `minDays`, `maxDays` | Range length limits. |
| `shortcuts` | `shortcuts` | Boolean, or a comma list of preset ids: `shortcuts="today,thisWeek,thisMonth"`. |
| `secondary-calendar` | `secondaryCalendar` | Boolean, or a calendar id (`hijri`). |
| `natural-input` | `naturalInput` | Boolean. |
| `time` | `time` | Boolean. |
| `name`, `required` | `name`, `required` | Form submission and validation. |
| `readonly` | `readOnly` | Boolean. |
| `disabled` | — | Disables the inner input; the picker never opens. |
| `placeholder` | — | Set on the inner input. Live. |
| `format` | `format` | Display format, e.g. `D MMMM YYYY`. |
| `week-start` | `weekStart` | `0` (Sunday) … `6` (Saturday). |
| `position`, `z-index`, `mobile-breakpoint` | same, camelCase | Overlay placement. `mobile-breakpoint="false"` = never a sheet. |
| `outside-days` | `outsideDays` | `interactive` / `visible` / `hidden`. |
| `confirm` | `confirm` | `true` / `false` / `auto`. |
| `show-today`, `show-clear`, `animate`, `highlight-today`, `year-picker`, `fixed-weeks`, `auto-close`, `input-mask` | same, camelCase | Default on; turn off with `="false"`. |

Unknown attributes and invalid values are ignored. `locale`, `theme`, `mode`, `value` and
`placeholder` apply live; changing any other attribute re-creates the picker and **keeps
the current value**.

## Properties and methods

```js
import { holidaysPlugin } from 'khorshid/holidays'

const el = document.querySelector('khorshid-datepicker')

el.value                  // a PickerValue: { mode: 'single', date: DateValue | null } …
el.value = '2026-03-21'   // anything setValue accepts (ISO, [..], { start, end }, PickerValue)

// JS-only options (functions, objects) merged over the attributes. Assigning re-creates.
el.options = {
  disabledDates: (d) => (d.weekday === 5 ? 'جمعه‌ها تعطیل است' : false),
  shortcuts: [{ id: 'nowruz', label: 'نوروز', value: '2026-03-21' }],
  plugins: [holidaysPlugin({ offline: true })],
}

el.picker   // the underlying DatePicker, or null while disconnected
el.core     // its headless PickerCore
el.open(); el.close(); el.clear()
```

Removing the element destroys the picker (and any open overlay). Re-inserting it builds a
new picker with the same value.

## Events

Every core event is re-dispatched on the element as a `CustomEvent` named `sdp-<event>`
(colons become dashes). It bubbles, is composed, and its `detail` is the core payload.

```js
el.addEventListener('sdp-change', (e) => {
  console.log(e.detail.value, e.detail.source)
})
el.addEventListener('sdp-range-complete', (e) => book(e.detail.start.iso, e.detail.end.iso))
```

| Event | `detail` |
|---|---|
| `sdp-change` | `{ value, source }` |
| `sdp-select` | `{ date }` |
| `sdp-clear` | `{ previous }` |
| `sdp-range-start` / `sdp-range-complete` | `{ start }` / `{ start, end }` |
| `sdp-open` / `sdp-close` | `{}` |
| `sdp-view-change`, `sdp-month-change`, `sdp-year-change` | view / navigation |
| `sdp-locale-change`, `sdp-calendar-change`, `sdp-time-change` | the new locale / calendar / time |
| `sdp-shortcut` | `{ id, value }` |
| `sdp-input`, `sdp-error` | as in [Events](/api/events) |

The prefix exists because the inner `<input>`'s native `change`, `input` and `select` events
also bubble through the element; `sdp-` keeps the two apart. `DATEPICKER_ELEMENT_EVENTS` lists
every name. In TypeScript, `addEventListener('sdp-change', …)` is typed.

## Forms

Because the element renders in light DOM, the hidden field that `name` creates sits inside
your form, and a wrapping `<label>` labels the inner input:

```html
<form action="/book">
  <label>
    تاریخ اقامت
    <khorshid-datepicker name="stay" mode="range" min-days="2" required></khorshid-datepicker>
  </label>
  <button>رزرو</button>
</form>
<!-- submits stay=2026-04-04/2026-04-07 -->
```

Values are serialized as ISO (`2026-04-04`, `start/end` for a range, comma-joined for
multiple). Pass `formValue` through `el.options` for another format. See
[Forms](/guide/forms) for validation and reset behavior.

## Theming

The element uses the same markup and stylesheet as the vanilla picker, so [theming](/guide/theming)
works unchanged:

```css
khorshid-datepicker {
  --sdp-accent: #0d9488;
  --sdp-radius: 12px;
}
```

Popups are portaled to `<body>`, so for per-instance colors on an overlay prefer
`el.options = { vars: { accent: '#0d9488' } }`.

## The date field element

`<khorshid-date-field>` is the segmented [date field](/guide/date-field) as a Custom Element. Register it with `defineDateFieldElement()` from `khorshid/element`; the date field page shows it in use.

**Related:** [Element API](/web-component/api) · [Forms](/guide/forms) · [Theming](/guide/theming) · [React](/react/) · [Vue](/vue/)
