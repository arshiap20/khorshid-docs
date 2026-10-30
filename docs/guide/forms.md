# Forms

A picker can take part in a plain HTML `<form>`: give it a `name` and its value is submitted with the form, `required` blocks submission until a date is chosen, and a form reset restores the initial value. Read this page when the picker sits inside a form that posts to a server or that you read with `FormData`.

## Basic usage

```html
<form action="/book" method="post">
  <input id="checkin" placeholder="تاریخ ورود" />
  <button>رزرو</button>
</form>
```

```js
import { createDatePicker } from 'khorshid'

createDatePicker('#checkin', {
  locale: 'fa-IR',
  name: 'checkin',
  required: true,
})
// submits: checkin=2026-04-04
```

You do not need to add or sync a hidden input yourself.

## What gets submitted

The user sees Jalali dates; your backend receives ISO dates. The default serializer, `toFormValue`, does not depend on the calendar the user saw:

| Value | Submitted as |
|---|---|
| A single date | `2026-04-04` |
| A date with the [time picker](/api/options#time) | `2026-04-04T09:05:00` |
| A range | `2026-04-01/2026-04-03` (an ISO 8601 interval); empty until both ends are picked |
| Multiple dates | `2026-04-01,2026-04-03` |
| A [week, month or year](./selection-units) pick | Its span as an interval: `2026-05-22/2026-06-21` |
| Several week picks | Intervals, comma-joined: `2026-04-04/2026-04-10,2026-04-11/2026-04-17` |
| Nothing | `''`, so `required` blocks the submit |

For another shape, pass `formValue`, a function of the [`PickerValue`](/api/events#pickervalue-by-mode):

```js
createDatePicker('#stay', {
  mode: 'range',
  name: 'stay',
  // e.g. Jalali text for a legacy backend
  formValue: (value) =>
    value.start && value.end ? `${value.start.formatted}|${value.end.formatted}` : '',
})
```

`toFormValue` is exported, and `picker.core.getFormValue()` returns the current serialized value. Both are useful for `fetch` bodies and tests:

```js
import { toFormValue } from 'khorshid'

toFormValue(picker.getValue())   // same as picker.core.getFormValue()
```

## The hidden field

When `name` or `required` is set, the picker adds one `input.sdp-form-value` to the DOM:

- It holds `formValue(value)` and updates on every value change, locale change and time change.
- It is a visually hidden **text** input, not `type="hidden"`, because browsers skip hidden inputs during constraint validation. It has `tabindex="-1"` and `aria-hidden="true"`, so keyboard and screen-reader users never reach it.
- It is placed right after an `<input>` target, inside the element of an inline calendar, or after the anchor of an overlay opened from a plain element. In each case it ends up inside your `<form>`.
- `destroy()` removes it.

## Validation

- **`required`**: the form is invalid until there is a value; for a range, both ends. When the browser blocks the submit, focus moves to the picker's field (or to the calendar grid of an inline picker).
- **Typed text**: if the bound input holds text that was refused (an impossible date, an out-of-range or disabled one, or a [natural input](./natural-input) phrase that could not be read), the input's native validity is set to the locale's `labels.invalidDate` and it gets the `.sdp-input--invalid` class. The browser's own validation message then appears in the user's language (`تاریخ معتبر نیست` or `Invalid date`).

```js
form.checkValidity() // false while required and empty, or while the text is invalid
```

## Reset

A form reset restores the picker's initial `value` (the `value` option it was created with), and the visible input follows:

```js
createDatePicker('#d', { name: 'd', value: '2026-04-04' })
// the user picks 2026-06-01 … form.reset() → back to 2026-04-04
```

## A full example

<Demo mode="range" :options="{ name: 'stay', required: true, minDays: 2 }" placeholder="ورود تا خروج" :controls="['value', 'form']" caption="name: 'stay', required, minDays: 2. 'Form value' is exactly what the form would submit." />

```html
<form id="booking">
  <label>
    Stay
    <input id="stay" />
  </label>
  <button>Book</button>
  <button type="reset">Reset</button>
</form>

<script type="module">
  import { createDatePicker } from 'khorshid'

  createDatePicker('#stay', {
    locale: 'fa-IR',
    mode: 'range',
    months: 2,
    minDays: 2,
    name: 'stay',
    required: true,
  })

  document.querySelector('#booking').addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    data.get('stay') // '2026-04-04/2026-04-07'
  })
</script>
```

::: tip Web Component
`<khorshid-datepicker name="stay" required>` does the same in markup. See [Web Component](/web-component/#forms).
:::

**Related:** [Date Field](./date-field) · [Natural Input](./natural-input) · [Shortcuts & Limits](./shortcuts-and-limits)
