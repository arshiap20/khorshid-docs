# Shortcuts & Limits

Three features shape what a user can pick and how quickly: shortcut chips such as "This month" or "Last 7 days", range length limits (`minDays` / `maxDays`) for bookings and reports, and disabled dates that explain why they cannot be picked. Read this page when a plain calendar is not enough for your booking, reporting or scheduling flow.

## Shortcuts

Turn on the chip row with `shortcuts: true` to get a set that suits the current mode:

```js
createDatePicker('#report', {
  locale: 'fa-IR',
  mode: 'range',
  shortcuts: true,
})
```

<Demo inline mode="range" :options="{ shortcuts: true }" :controls="['locale', 'value']" caption="shortcuts: true in range mode. Switch to a Gregorian locale and 'This month' becomes a Gregorian month." />

### Computed in the active calendar

Every preset runs its arithmetic in the picker's **active calendar**. On a Jalali picker
"This month" is 1–31 Farvardin, not March. Switch the same picker to `en-US-gregorian`
and it becomes 1–30 April. No configuration is needed.

```js
const picker = createDatePicker('#d', { locale: 'fa-IR', mode: 'range', shortcuts: ['thisMonth'] })
picker.core.applyShortcut('thisMonth')
picker.getValue().start.jalali // { year: 1405, month: 1, day: 1 }
picker.getValue().end.jalali   // { year: 1405, month: 1, day: 31 }
```

### The 14 presets

| Preset | Selects |
|---|---|
| `today` · `yesterday` · `tomorrow` | That one day. |
| `thisWeek` · `lastWeek` · `nextWeek` | A whole week, honoring `weekStart` (Saturday for `fa-IR`). |
| `last7Days` · `last30Days` | The 7 / 30 days ending today, today included. |
| `next7Days` | The 7 days starting today. |
| `thisMonth` · `lastMonth` · `nextMonth` | A whole month **in the active calendar**. |
| `thisYear` · `lastYear` | A whole year **in the active calendar** (1 Farvardin – 29/30 Esfand on Jalali). |

What `shortcuts: true` expands to depends on the mode and [unit](./selection-units):

| Mode / unit | Default set |
|---|---|
| `single` | `today`, `yesterday`, `tomorrow` |
| `range` | `today`, `last7Days`, `last30Days`, `thisWeek`, `thisMonth`, `lastMonth`, `thisYear` |
| `multiple` | `today`, `thisWeek` |
| `unit: 'week'` | `thisWeek`, `lastWeek`, `nextWeek` |
| `unit: 'month'` | `thisMonth`, `lastMonth`, `nextMonth` |
| `unit: 'year'` | `thisYear`, `lastYear` |

How a span applies depends on the mode: a range gets both ends; in **single** mode a period
preset applies its first day; in **multiple** mode the span expands into its individual
days (`thisWeek` selects 7 dates).

Labels come from the locale (`labels.shortcuts`): `fa-IR` shows «این ماه»، «۷ روز گذشته»
and so on. A custom locale that leaves them out falls back to English.

### Your own list, your own shortcuts

Pass an array to choose and order the chips. Presets and custom shortcuts mix freely. A
custom shortcut's `value` is anything `setValue` accepts, or a function of the current
context:

```js
createDatePicker('#d', {
  locale: 'fa-IR',
  mode: 'range',
  shortcuts: [
    'today',
    'last7Days',
    { id: 'nowruz', label: 'تعطیلات نوروز', value: { start: '2026-03-21', end: '2026-04-02' } },
    {
      id: 'next3',
      label: '۳ روز آینده',
      // ShortcutContext: { today, calendar, locale, weekStart, mode, unit }
      value: ({ today }) => ({ start: today, end: today.add({ days: 2 }) }),
    },
  ],
})
```

`today` in the context is a [`PlainDate`](/core/plain-date) in the active calendar, so
`today.startOfMonth()`, `today.add({ months: -3 })` and friends all work in Jalali months.

### Active and disabled chips

Each chip knows two things about itself:

- **active**: the current value equals what the shortcut would apply. The chip gets
  `.sdp__shortcut--active` and `aria-pressed="true"`.
- **disabled**: applying it would break a constraint (`min` / `max`, `disabledDates`,
  `minDays` / `maxDays`). The chip renders as a disabled button and applying it does nothing.

```js
createDatePicker('#d', {
  mode: 'range',
  maxDays: 10,
  shortcuts: ['today', 'last7Days', 'last30Days'], // 'last30Days' is disabled: too long
})
```

### Driving shortcuts yourself

The chip row is a renderer over two core methods, which you can also use to put the
shortcuts in your own sidebar or dropdown:

```js
picker.core.getShortcuts()
// → [{ id: 'today', label: 'امروز', active: false, disabled: false }, …]

picker.core.applyShortcut('thisMonth')
```

Applying a shortcut emits `shortcut` first, then `change` with source `'shortcut'`, and closes
the overlay when the value is complete and `autoClose` is on:

```js
picker.on('shortcut', ({ id, value }) => analytics.track('shortcut', id))
picker.on('change', ({ source }) => {
  if (source === 'shortcut') { /* … */ }
})
```

Keys pressed inside the chip row are not treated as grid navigation, so Tab and the arrow
keys behave natively there.

## Range length: `minDays` / `maxDays`

Booking flows need a minimum stay; analytics screens need a maximum window. Both limits
count **calendar days, both ends included**: a range whose start equals its end is 1 day,
and **two hotel nights are 3 days**.

```js
createDatePicker('#stay', {
  mode: 'range',
  months: 2,
  minDays: 3,  // at least two nights
  maxDays: 15, // at most two weeks
})
```

<Demo inline mode="range" :options="{ minDays: 3, maxDays: 8 }" :controls="['value', 'error']" caption="minDays: 3, maxDays: 8. Pick a start: the days too close or too far are disabled until you pick the end." />

While the end is pending, every day that would break the limit is **disabled**, in both
directions (picking an end before the start is allowed). Once the range is complete, the
limits lift again so the user can start over anywhere.

If a too-short or too-long range arrives some other way (typed text, `submitInput`), it
is refused with an `error` event and the start stays selected:

```js
picker.on('error', ({ code }) => {
  if (code === 'range-length') toast('Stays are 2 to 14 nights')
})
```

Shortcuts that would break the limits render disabled (see above).

## Disabled dates with a reason

`disabledDates` accepts plain dates, but each entry can also carry a `reason`. A predicate
can return a string instead of `true`:

```js
createDatePicker('#appointment', {
  locale: 'fa-IR',
  disabledDates: [
    { date: '2026-04-10', reason: 'ظرفیت تکمیل است' },
    '2026-04-11', // disabled, no reason
  ],
})

createDatePicker('#delivery', {
  locale: 'en-US-gregorian',
  disabledDates: (date) => (date.weekday === 5 ? 'Closed on Fridays' : false),
})
```

<Demo inline locale="en-US-gregorian" :options="{ disabledDates: (d) => d.weekday === 5 ? 'Closed on Fridays' : d.day === 13 ? 'Inventory day' : false }" :controls="['value', 'error']" caption="Hover a Friday or the 13th: the reason is the tooltip. Clicking one fires error with the reason." />

The predicate receives a [`PlainDate`](/core/plain-date) and returns `true` or a reason
string to disable, and `false` / `null` / `undefined` to allow.

The reason goes everywhere it is useful:

| Where | What happens |
|---|---|
| Tooltip | The cell's `title` is the reason. |
| Class | The cell gets `.sdp__day--has-reason` (style it however you like). |
| Screen readers | The reason is appended to the cell's accessible name: "Friday 10 April 2026, Closed on Fridays". |
| Render model | `DayCell.disabledReason` for custom UIs. |
| Events | A refused pick (click, typed text) emits `error` with `code: 'disabled'` and `reason`. |

```js
picker.on('error', ({ code, reason }) => {
  if (code === 'disabled' && reason) showHint(reason)
})
```

**Related:** [Selection Modes](./selection-modes) · [Selection Units](./selection-units) · [Natural Input](./natural-input)
