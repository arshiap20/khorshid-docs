# Getting Started

This page installs Khorshid and helps you pick the layer that fits your stack. Every layer runs the same core, so the options, events and values you learn here work everywhere.

## Installation

::: code-group

```bash [npm]
npm install khorshid
```

```bash [pnpm]
pnpm add khorshid
```

```bash [yarn]
yarn add khorshid
```

:::

One package covers every layer, on subpaths. Importing `khorshid` never pulls React or Vue into your bundle.

## Pick a layer

| Layer | Import | Use it when | Start here |
|---|---|---|---|
| **Core** | `khorshid/headless` | You draw the UI yourself: a design system, canvas, a terminal, a native shell. No DOM. | [Core](/core/) |
| **Vanilla** | `khorshid` | Plain JavaScript, no framework. `createDatePicker` and `createDateField`. | [Vanilla](/vanilla/) |
| **Web Component** | `khorshid/element` | Plain HTML, server-rendered pages, a CMS, or a framework without its own adapter. | [Web Component](/web-component/) |
| **React** | `khorshid/react` | React 18+: components and hooks. | [React](/react/) |
| **Vue** | `khorshid/vue` | Vue 3.4+: components and composables. | [Vue](/vue/) |

Two more subpaths work with every layer:

| Import | What it is |
|---|---|
| `khorshid/styles.css` | The one stylesheet every layer renders against. See [Theming](./theming). |
| `khorshid/holidays` | The official [holidays](./holidays) plugin. |

The same code is also published as scoped packages (`@khorshid-js/core`, `@khorshid-js/dom`, `@khorshid-js/element`, `@khorshid-js/react`, `@khorshid-js/vue`, `@khorshid-js/holidays`) if you prefer to install the layers individually. These docs use the `khorshid` imports.

## One option surface

The same options work in every layer, by the same names:

::: code-group

```js [Vanilla]
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

createDatePicker('#stay', { locale: 'fa-IR', mode: 'range', months: 2 })
```

```html [Web Component]
<khorshid-datepicker locale="fa-IR" mode="range" months="2"></khorshid-datepicker>
```

```tsx [React]
import { DatePicker } from 'khorshid/react'
import 'khorshid/styles.css'

<DatePicker locale="fa-IR" mode="range" months={2} />
```

```vue [Vue]
<script setup>
import { DatePicker } from 'khorshid/vue'
import 'khorshid/styles.css'
</script>

<template>
  <DatePicker locale="fa-IR" mode="range" :months="2" />
</template>
```

```js [Core]
import { createPicker } from 'khorshid/headless'

const core = createPicker({ locale: 'fa-IR', mode: 'range' })
```

:::

<Demo inline mode="range" :months="2" :controls="['value']" caption="The same range picker, whichever layer renders it." />

## Common options

Every option has a default, so you only pass what you want to change. These are the ones most pages need:

| Option | Default | What it does |
|---|---|---|
| `locale` | `'fa-IR'` | Language, calendar, direction, digits and week start. See [Calendars & Locales](./calendars-and-locales). |
| `mode` | `'single'` | `'single'`, `'range'` or `'multiple'`. See [Selection Modes](./selection-modes). |
| `value` | — | The initial value: an ISO string, a `Date`, a list, or `{ start, end }`. |
| `min` / `max` | — | The earliest and latest selectable dates. |
| `display` | `'auto'` | `'auto'`, `'inline'`, `'popup'`, `'sheet'` or `'modal'`. |
| `months` | `1` | Month panes shown side by side. |
| `time` | `false` | Add a time-of-day row. `true` gives 24-hour `HH:mm`; pass `{ use12Hour, showSeconds, minuteStep }` to change it. See [Time](/api/options#time). |
| `theme` | `'auto'` | `'light'`, `'dark'`, or `'auto'` to follow the OS. See [Theming](./theming). |

The [Options reference](/api/options) lists all of them.

## Next steps

- [Calendars & Locales](./calendars-and-locales): Jalali, Gregorian, Hijri and the nine built-in locales.
- [Selection Modes](./selection-modes) and [Selection Units](./selection-units): ranges, multiple dates, week, month and year pickers.
- [Forms](./forms): submit the value with a `<form>`.
- [Date Field](./date-field): a segmented input for dates people type.
- [Playground](/playground): configure a picker interactively and copy the code.
