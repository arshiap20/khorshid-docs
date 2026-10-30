# Secondary Calendar

Many users work with two calendars at once: a Jalali date for daily life, a Gregorian one
for a flight or a visa form, a Hijri one for a religious occasion. The `secondaryCalendar`
option prints a second calendar's day number under every day and its months under the title.

## Turning it on

```js
createDatePicker('#date', { locale: 'fa-IR', secondaryCalendar: true })
```

<Demo inline :options="{ secondaryCalendar: true }" :controls="['locale', 'value']" caption="secondaryCalendar: true. Jalali shows Gregorian; switch to a Gregorian locale and it shows Jalali." />

## Choosing the second calendar

| Value | Shows |
|---|---|
| `true` | The natural partner: Jalali ↔ Gregorian. On a Hijri locale: Jalali for Persian/Pashto, Gregorian otherwise. |
| `'gregorian'` · `'jalali'` · `'hijri'` | That calendar. |
| `false` (default) | Nothing. |

Naming the **primary** calendar turns it off. `secondaryCalendar: 'jalali'` on a Jalali
picker shows nothing, so you can pass a fixed value to pickers whose locale changes at
runtime. With `true`, the partner is re-resolved on every locale switch:

```js
const picker = createDatePicker('#d', { locale: 'fa-IR', secondaryCalendar: true })
picker.core.getSecondaryCalendar() // 'gregorian'
picker.setLocale('en-US-gregorian')
picker.core.getSecondaryCalendar() // 'jalali'
```

A Jalali calendar with the Hijri date underneath, for picking around religious occasions:

```js
createDatePicker('#date', { locale: 'fa-IR', secondaryCalendar: 'hijri' })
```

<Demo inline :options="{ secondaryCalendar: 'hijri' }" :controls="['value']" caption="fa-IR with secondaryCalendar: 'hijri'. The subtitle names the lunar months the page spans." />

## What renders

- **Under each day**: the secondary day number, **in the primary locale's digits** (a Persian
  page keeps Persian digits throughout). On the first day of a secondary month, the month's
  short name is shown instead (`آوریل`), so the month boundary is visible at a glance.
- **Under the title**: the secondary months the page spans, e.g. `مارس – آوریل ۲۰۲۶`
  (`رمضان – شوال ۱۴۴۷` for Hijri). With several panes, each gets its own.
- **For screen readers**: the full secondary date is added to each day's accessible name:
  `شنبه ۱۵ فروردین ۱۴۰۵ (۴ آوریل ۲۰۲۶)`.

Secondary month names are written in the primary **language**: a Persian picker shows
`آوریل`, an English one shows `April` or `Farvardin`.

## Classes

| Selector | What |
|---|---|
| `.sdp--secondary` | On the panel root while a secondary calendar is shown. |
| `.sdp__day-sub` | The small secondary label inside each day. |
| `.sdp__day-sub--month-start` | That label on the first day of a secondary month (shows the month name). |
| `.sdp__subtitle` / `.sdp__subtitle-part` | The line under the title / one part per pane. |

```css
.sdp__day-sub { opacity: .6; }
.sdp__day-sub--month-start { color: var(--sdp-accent); font-weight: 600; }
```

## In a custom UI

Headless renderers get the same data on the render models:

```js
const cell = picker.core.getGrid().weeks[2][3]
cell.secondary
// {
//   calendar: 'gregorian',
//   parts: { year: 2026, month: 4, day: 4 },
//   label: '۴',              // in the primary locale's digits
//   monthStart: false,       // true on the 1st of a secondary month
//   monthLabel: 'آوریل',     // short month name, primary language
//   formatted: '۴ آوریل ۲۰۲۶' // for tooltips / aria-label
// }

picker.core.getTitle().secondary // 'مارس – آوریل ۲۰۲۶'
```

`secondaryDayText(cell.secondary)` and `secondaryDayClassName(cell.secondary)` from the core
return exactly what the built-in renderer shows, so React, Vue and custom UIs match it.

**Related:** [Calendars & Locales](./calendars-and-locales) · [Theming](./theming) · [The Headless Core](/core/)
