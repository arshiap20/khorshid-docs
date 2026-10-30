# Selection Modes

The `mode` option decides how many dates a user picks: one, a range, or any number. The mode also decides the shape of the value and which events fire. Read this page to choose a mode and set its initial value.

::: tip Weeks, months and years
`mode` says how many things are picked. To pick a whole week, month or year per click, combine it with [`unit`](./selection-units): a month picker, a week picker, or a range of months.
:::

## Single

The default: one date at a time.

```js
createDatePicker('#date', { locale: 'fa-IR', mode: 'single' })
```

<Demo inline mode="single" :controls="['value']" caption="mode: 'single'" />

The value is `{ mode: 'single', date: DateValue | null }`.

## Range

Pick a start and an end. While the end is pending, the calendar previews the range up to the hovered day, across all month panes.

```js
createDatePicker('#stay', { locale: 'fa-IR', mode: 'range', months: 2 })
```

<Demo inline mode="range" :months="2" :controls="['value']" caption="mode: 'range' with two panes and hover preview." />

The value is `{ mode: 'range', start: DateValue | null, end: DateValue | null }`, with the ends always in order. Two events fire in addition to `change`:

```js
picker.on('range:start', ({ start }) => console.log('start', start.formatted))
picker.on('range:complete', ({ start, end }) => console.log('done', start, end))
```

## Multiple

Click any number of dates to toggle them on and off.

```js
createDatePicker('#days-off', { locale: 'fa-IR', mode: 'multiple' })
```

<Demo inline mode="multiple" :controls="['value']" caption="mode: 'multiple' — click to toggle each date." />

The value is `{ mode: 'multiple', dates: DateValue[] }`.

## Setting an initial value

The `value` option accepts whatever the mode expects:

```js
// single
createDatePicker('#a', { value: '2026-03-21' })

// range
createDatePicker('#b', { mode: 'range', value: { start: '2026-03-21', end: '2026-04-10' } })

// multiple
createDatePicker('#c', { mode: 'multiple', value: ['2026-03-21', '2026-03-28'] })
```

Each date can be any `DateInput`: a Gregorian ISO string, a native `Date`, a [`PlainDate`](/core/plain-date), or `{ year, month, day, calendar? }` parts (read in the picker's calendar when `calendar` is left out). A `PickerValue` from `getValue()` or a `change` event is accepted as well, so values round-trip without conversion.

## Switching modes at runtime

```js
picker.setMode('range')
```

The current selection is kept as far as the new mode can hold it: switching to single keeps the first date, switching to range keeps the first two (in order), and switching to multiple keeps them all. When dates are dropped, `change` fires with source `'api'`.

## Constraints

`min`, `max` and `disabledDates` work the same way in every mode:

```js
createDatePicker('#date', {
  mode: 'range',
  min: '2026-03-21',
  max: '2026-06-21',
  disabledDates: (date) => date.weekday === 5, // every Friday
})
```

`disabledDates` is either a list of dates or a predicate that receives a [`PlainDate`](/core/plain-date) and returns `true` to disable it. A disabled day can also explain why (`{ date, reason }`, or a predicate that returns a string); see [Disabled dates with a reason](./shortcuts-and-limits#disabled-dates-with-a-reason).

Range mode adds `minDays` and `maxDays` to limit the length of the range. [Shortcuts](./shortcuts-and-limits) add one-click chips such as "Last 7 days" in any mode:

```js
createDatePicker('#stay', { mode: 'range', minDays: 3, maxDays: 15, shortcuts: true })
```

**Related:** [Selection Units](./selection-units) · [Shortcuts & Limits](./shortcuts-and-limits) · [Forms](./forms)
