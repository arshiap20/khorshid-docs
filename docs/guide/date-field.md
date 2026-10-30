# Date Field

A **date field** is a segmented date input. Year, month and day (and, optionally,
hour, minute, second and AM/PM) are each their own little spinbutton. You type digits
into them, step them with the arrow keys, and move between them with ← / →. There's no
free text to parse and no popup to open, so nothing ambiguous can be typed. It works with
every Khorshid calendar and locale.

<FieldDemo :options="{ label: 'تاریخ تولد', description: 'سال، ماه و روز را وارد کنید' }" />

Use it when the date is usually **known** (a birthday, a document date, a deadline typed
off paper). Use the [date picker](./getting-started) when people need to **browse** for a date.

## Usage

::: code-group

```js [Vanilla]
import { createDateField } from 'khorshid'
import 'khorshid/styles.css'

const field = createDateField('#birthday', {
  locale: 'fa-IR',
  label: 'تاریخ تولد',
  name: 'birthday',
  onChange: ({ value }) => console.log(value?.iso),
})
```

```tsx [React]
import { DateField } from 'khorshid/react'
import 'khorshid/styles.css'

export function Birthday() {
  const [value, setValue] = useState(null)
  return (
    <DateField
      locale="fa-IR"
      label="تاریخ تولد"
      value={value}
      onChange={({ value }) => setValue(value)}
    />
  )
}
```

```vue [Vue]
<script setup>
import { ref } from 'vue'
import { DateField } from 'khorshid/vue'
import 'khorshid/styles.css'

const value = ref(null)
</script>

<template>
  <DateField v-model="value" locale="fa-IR" label="تاریخ تولد" />
</template>
```

```html [Custom element]
<script type="module">
  import { defineDateFieldElement } from 'khorshid/element'
  defineDateFieldElement()
</script>

<khorshid-date-field locale="fa-IR" label="تاریخ تولد" name="birthday"></khorshid-date-field>
```

:::

Every layer takes the **same options with the same names**. React and Vue accept them as
props, the custom element as kebab-case attributes.

## Anatomy

```
.sdp-field
  .sdp-field__label          label
  .sdp-field__group          role=group — the box
    .sdp-field__prefix       prefix
    .sdp-field__input        the segments (always left-to-right)
      .sdp-field__segment    role=spinbutton, one per part
      .sdp-field__literal    separators
    .sdp-field__suffix       suffix
  .sdp-field__description    description (hidden while invalid)
  .sdp-field__error          the validation message
```

## Typing and keys

| Key | Does |
|---|---|
| Digits (any script: `1`, `۱`, `١`) | Type into the segment. It moves on by itself once no further digit could fit, so `4` in a month jumps to the day, while `1` waits for a possible `12`. |
| `/` `-` `.` `:` space | Finish the current segment early (`3/` → day 3) |
| ↑ / ↓ | Step ±1 and wrap. An empty segment starts at `placeholderValue` (default: today). |
| PageUp / PageDown | Bigger steps (year ±5, month ±2, day ±7, minute ±15) |
| Home / End | The segment's minimum / maximum |
| ← / → | Previous / next segment |
| Backspace / Delete | Delete a digit. On an empty segment, go back one. |
| `a` / `p` (`ق` / `ب`) | AM / PM |

On phones the segments bring up the numeric keyboard. Pasting `1403/05/12` fills every
segment.

The **value only commits when an entry finishes**. Typing a year never commits the
years 1, 14 and 140 on the way to 1403. A month you leave at `1` commits when focus moves
on.

## Format: order, padding, names

The segment order comes from the format, which defaults to the locale's: `YYYY/MM/DD`
for Persian, `MM/DD/YYYY` for `en-US-gregorian`. Pass your own:

```js
createDateField(el, { locale: 'en-US-gregorian', format: 'D MMMM YYYY' })  // 5 March 2024
createDateField(el, { locale: 'fa-IR', format: 'YYYY/MM' })                // month + year; day = 1
```

| Tokens | Segment |
|---|---|
| `YYYY` (`YY`) | year |
| `MM` / `M` | month, padded / unpadded |
| `MMMM` / `MMM` | month, shown by name |
| `DD` / `D` | day |
| `HH` `H` / `hh` `h` | hour, 24h / 12h |
| `mm` `m`, `ss` `s` | minute, second |
| `A` / `a` | AM/PM |
| `[text]` | literal text |

Weekday tokens are dropped, since a weekday is derived and never typed. A format without a
day (or month) fills in 1.

## Time

```js
createDateField(el, { time: true })                                      // + HH:mm
createDateField(el, { time: { use12Hour: true, showSeconds: true } })    // + hh:mm:ss AM
createDateField(el, { time: { minuteStep: 15 } })                        // ↑/↓ by 15 min
```

The value then carries `time`, and the form value becomes `YYYY-MM-DDTHH:mm:ss`. Time
tokens in `format` turn time on by themselves.

## Validation

```js
createDateField(el, {
  required: true,
  min: '2024-01-01',
  max: { year: 1404, month: 12, day: 29, calendar: 'jalali' },
  disabledDates: [{ date: '2024-03-20', reason: 'Nowruz — closed' }],
  validate: (value) => value.weekday === 5 ? 'Not on Fridays' : true,
})
```

<FieldDemo :options="{ label: 'Appointment', required: true, min: '2024-01-01', max: '2030-12-31', locale: 'en-US-gregorian', validate: (v) => v.weekday === 5 ? 'Not on Fridays' : true }" />

| Code | When | Default message (en / fa) |
|---|---|---|
| `required` | empty, after leaving the field | Please enter a date. / لطفاً تاریخ را وارد کنید. |
| `incomplete` | partly filled, after leaving | Please enter a complete date. / تاریخ کامل نیست. |
| `out-of-range` | outside `min`/`max` | Date must be between {min} and {max}. / تاریخ باید بین … باشد. |
| `disabled` | matches `disabledDates` | the reason, else "This date is unavailable." |
| `invalid-input` | not a real date in the calendar | Invalid date. |
| `custom` | `validate` rejected it | your message |

`required` and `incomplete` never show while someone is still typing. They appear when
focus leaves the field or when you call `validate()`, for example on submit. The other
problems show as soon as the entry is complete. While a field is invalid, `getValue()` is
`null`, the error replaces the description, and the form field carries the message as its
custom validity, so a native `<form>` will not submit it.

Use `errorMessage` to show your own text (a string, a node, or a function of the
validation), `invalid: true` to force the state (for example from the server), and
`labels.messages` to reword the built-ins.

## Forms

With `name`, the field submits a calendar-neutral ISO value: `2024-08-02`, or
`2024-08-02T09:30:00` with time. A Jalali UI and a Gregorian backend need no conversion.
`required` takes part in native validation, and a form `reset` restores the initial value.
Use `formValue` to change the serialization.

## Look

| Option | |
|---|---|
| `variant` | `'primary'` (default: bordered, hairline shadow) or `'secondary'` (filled, for use on a surface) |
| `fullWidth` | stretch to the container |
| `prefix` / `suffix` | icons or buttons inside the box. A suffix button keeps its own clicks. |
| `label`, `description`, `ariaLabel` | texts. `ariaLabel` names the field when there is no visible label. |
| `theme`, `vars`, `classes` | like the picker: `'light' \| 'dark' \| 'auto'`, per-instance `--sdp-*` tokens, extra classes per part |

The field uses the picker's tokens (`--sdp-accent`, `--sdp-bg`, `--sdp-border`, …) and adds
`--sdp-danger`, `--sdp-field-height` (44px) and `--sdp-field-radius` (12px). State is
exposed as data attributes for your own CSS: `data-invalid`, `data-disabled`,
`data-readonly`, `data-required`, `data-empty`, `data-focus-within`, and
`data-placeholder` on empty segments.

```css
.sdp-field { --sdp-field-radius: 999px; --sdp-accent: #0d9488; }
.sdp-field[data-invalid] .sdp-field__label { color: var(--sdp-danger); }
```

## Options

Everything in the table is shared by every layer.

| Option | Type | Default |
|---|---|---|
| `locale` | `string \| Locale` | `'fa-IR'` |
| `format` | `string` | the locale's display format |
| `value` | date, ISO string, `Date`, `DateValue`, `null` | — |
| `placeholderValue` | date | today |
| `min`, `max` | date | — |
| `disabledDates` | list or predicate | — |
| `time` | `boolean \| TimeOptions` | `false` |
| `required`, `readOnly`, `disabled`, `invalid` | `boolean` | `false` |
| `validate` | `(value) => string \| boolean \| null` | — |
| `labels` | `{ segments, placeholders, empty, messages }` overrides | built-in fa/en |
| `label`, `description`, `errorMessage`, `prefix`, `suffix` | node | — |
| `variant` | `'primary' \| 'secondary'` | `'primary'` |
| `fullWidth`, `autoFocus` | `boolean` | `false` |
| `name`, `formValue` | form field | — |
| `theme`, `vars`, `classes`, `ariaLabel` | | |

Events, as `on<Event>` callbacks / props, Vue emits (`locale-change`), or element
events (`sdp-change`):

| Event | Payload |
|---|---|
| `change` | `{ value: DateValue \| null, source: 'input' \| 'api' \| 'clear' }` |
| `input` | `{ type, value, text, complete }`, fired on every keystroke or arrow |
| `error` | `{ code, message, reason?, input }`, fired when a complete entry is refused |
| `locale:change` | `{ locale }` |

## Headless

The engine behind all of it is DOM-free and lives in `@khorshid-js/core`
(`khorshid/headless`). Render `getState().segments` however you like, and forward keys:

```js
import { createDateFieldCore, dateFieldKeyAction, segmentAttributes } from 'khorshid/headless'

const field = createDateFieldCore({ locale: 'fa-IR' })
field.subscribe((state) => render(state.segments))   // { type, text, value, min, max, … }

// on keydown in a segment:
const { handled, move } = dateFieldKeyAction(field, 'month', event)
if (handled) event.preventDefault()   // then focus the 'next' / 'prev' segment
```

`segmentAttributes(segment, state)` gives the ARIA attributes for a spinbutton. Actions:
`typeText`, `backspace`, `increment`, `decrement`, `setSegment`, `focusSegment`, `blur`,
`setValue`, `clear`, `validate`, `setLocale`, `setCalendar`, and `setOptions` (constraints
and flags).
