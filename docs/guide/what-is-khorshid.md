# What is Khorshid?

Khorshid (Persian for *sun*, خورشید; the Jalali calendar is a solar one) is a date picker that supports the Jalali, Gregorian and Hijri calendars equally. This page explains how it is put together and what it can do, so you can decide whether it fits your project.

## Design

Khorshid separates the logic from the rendering. Calendar math, locales, selection state, formatting, parsing and the input mask live in a headless core that has no runtime dependencies and never touches the DOM. A vanilla-JS UI is built on that core, and the React, Vue and Web Component layers are thin renderers over the same core. Option names, defaults, events and values are defined once, so they behave the same in every layer.

## What you install

Everything ships in one package, `khorshid`, split into subpaths:

| Import | What it is |
|---|---|
| `khorshid` | The vanilla picker (`createDatePicker`), the [date field](./date-field) (`createDateField`) and the whole headless core. |
| `khorshid/headless` | The [headless core](/core/) on its own: calendars, locales, the picker state machine, formatting, parsing, the input mask. No DOM APIs. |
| `khorshid/react` | [React](/react/) hooks and components. |
| `khorshid/vue` | [Vue 3](/vue/) composables and components. |
| `khorshid/element` | `<khorshid-datepicker>` and `<khorshid-date-field>`, framework-free [Web Components](/web-component/). |
| `khorshid/holidays` | The official [holidays](./holidays) plugin (online or offline). |
| `khorshid/styles.css` | The one stylesheet every layer renders against. |

## Why not `Intl`?

`Intl.DateTimeFormat` can format a Persian date, but it cannot help a user pick one. It has no month grid, no leap-year-aware day clamping, no range selection, no input mask that reads Persian digits, and no conversion you can drive a UI from. Khorshid computes all of that once and hands it to your renderer as plain data.

## Features

- **Three calendars**: Jalali (the break-table algorithm that matches Iran's official calendar), Gregorian, and lunar Hijri (Umm al-Qura, or the tabular calendar, with local adjustments). Dates convert between them exactly through Julian Day Numbers.
- **Nine built-in [locales](./calendars-and-locales)**, including Dari and Pashto, and `en-US`: the Jalali calendar with English transliterated month names (Farvardin, Ordibehesht, …).
- **Single, range and multiple [selection](./selection-modes)**, with a hover preview for ranges, plus [week, month and year pickers](./selection-units).
- **[Shortcuts](./shortcuts-and-limits)** computed in the active calendar ("This month" is Farvardin on a Jalali picker), range length limits, and disabled days that explain why.
- **[Natural input](./natural-input)**: `فردا`, `۳ روز بعد`, `next friday`.
- **[A second calendar](./secondary-calendar)** under every day.
- **[Native forms](./forms)**: `name`, `required`, ISO values, reset.
- **A [smart input mask](./input-mask)** that reads Persian (۰–۹), Arabic-Indic (٠–٩) and Latin digits, clamps impossible values and keeps the caret in place.
- **A segmented [date field](./date-field)** for dates people type rather than browse for.
- **Responsive overlays**: an anchored popup on desktop, a drag-to-dismiss bottom sheet on small screens, or a modal.
- **Light, dark and auto [themes](./theming)**, with every visual value exposed as a CSS variable.
- **RTL from the locale**: direction, arrow keys and range edges follow the active locale. See [Keyboard & Accessibility](./keyboard-a11y).

**Next:** [Getting Started](./getting-started) · [React](/react/) · [Vue](/vue/) · [Calendars & Locales](./calendars-and-locales)
