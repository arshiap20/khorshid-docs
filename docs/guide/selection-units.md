# Selection Units

`mode` decides how many things a user picks (one, a range, several); `unit` decides what
one pick is: a day, a week, a month or a year. The two are independent, so a range of
months or several weeks is just a combination. Read this page to build week, month and
year pickers.

## The four units

| `unit` | One click selects | Opens on |
|---|---|---|
| `'day'` (default) | a day | the days view |
| `'week'` | the whole week of the clicked day, per `weekStart` | the days view |
| `'month'` | a month | the **months** view |
| `'year'` | a year | the **years** view |

## Week picker

```js
createDatePicker('#week', { locale: 'fa-IR', unit: 'week' })
```

<Demo inline :options="{ unit: 'week' }" :controls="['value', 'form']" caption="unit: 'week'. Hover previews the whole week; a click selects Saturday to Friday (fa-IR)." />

Hovering a day previews its week, and a click selects it. The week follows the locale's
first day (Saturday for `fa-IR`, Sunday for `en-US-gregorian`) or your `weekStart` override.

## Month picker

```js
createDatePicker('#month', { locale: 'fa-IR', unit: 'month' })
```

<Demo inline :options="{ unit: 'month' }" :controls="['value', 'form']" caption="unit: 'month'. The picker opens on the months view and a month click commits." />

The picker opens on the months view and a month click **commits** instead of drilling
down into days. The year in the header still pages through years.

## Year picker

```js
createDatePicker('#year', { locale: 'fa-IR', unit: 'year' })
```

<Demo inline :options="{ unit: 'year' }" :controls="['value', 'form']" caption="unit: 'year'. Twelve years per page; a click commits." />

## What the value looks like

Each selected item is stored as **its period's first day**, and the
[`DateValue`](/api/events#datevalue) gains an `end` with the period's last day. Its
`formatted` text describes the whole period:

```js
const picker = createDatePicker('#month', { locale: 'fa-IR', unit: 'month' })

picker.on('change', ({ value }) => {
  const { date } = value                 // single mode
  date.jalali       // { year: 1405, month: 3, day: 1 }
  date.end.jalali   // { year: 1405, month: 3, day: 31 }
  date.formatted    // 'خرداد ۱۴۰۵'
  picker.core.getFormValue() // '2026-05-22/2026-06-21'
})
```

| Unit | `formatted` (fa-IR) | Form value |
|---|---|---|
| `week` | `۱۴۰۵/۰۱/۱۵ تا ۱۴۰۵/۰۱/۲۱` | `2026-04-04/2026-04-10` |
| `month` | `خرداد ۱۴۰۵` | `2026-05-22/2026-06-21` |
| `year` | `۱۴۰۳` | `2024-03-20/2025-03-20` |

`setValue` (and the initial `value`) snap any day to its period, so you can pass
`'2026-07-19'` to a month picker and get July (or Tir) as a whole.

## Combining with modes

`unit` works with every [mode](./selection-modes):

```js
// a range of months: Ordibehesht → Mordad
createDatePicker('#quarter', { locale: 'fa-IR', unit: 'month', mode: 'range' })

// several independent weeks
createDatePicker('#shifts', { locale: 'fa-IR', unit: 'week', mode: 'multiple' })
```

<Demo inline mode="range" :options="{ unit: 'month' }" :controls="['value']" caption="unit: 'month' + mode: 'range'. The months in between are highlighted." />

A month or week range runs from the first period's first day to the last period's last
day: `اردیبهشت ۱۴۰۵ تا مرداد ۱۴۰۵`. Month and year cells carry `rangeStart`, `rangeEnd`
and `inRange` (`.sdp__month--range-start`, `--in-range`, …) just like day cells.

## Notes

- `min` / `max` still apply. A month or year that lies **entirely** outside them is disabled;
  one that only partly overlaps can be picked.
- [Shortcuts](./shortcuts-and-limits) know the unit: `shortcuts: true` on a month picker
  offers "This month / Last month / Next month".
- On an `<input>`, a non-day unit makes the field read-only: it shows the formatted period
  and opens the picker.
- The unit is fixed at construction; read it with `picker.core.getUnit()`. The panel root
  carries `data-unit` (`day`, `week`, `month` or `year`) for styling.

**Related:** [Selection Modes](./selection-modes) · [Shortcuts & Limits](./shortcuts-and-limits) · [Forms](./forms)
