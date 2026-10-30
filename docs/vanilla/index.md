# Vanilla JS

The vanilla layer is the ready-made picker for plain JavaScript: `createDatePicker` binds a picker to an input or mounts an inline calendar, and `createDateField` renders the segmented date field. It needs no framework and no build-time plugin. The React, Vue and Web Component layers reuse its overlays and keyboard handling.

## Installation

```bash
npm install khorshid
```

```js
import { createDatePicker, createDateField } from 'khorshid'
import 'khorshid/styles.css'
```

The `khorshid` entry also re-exports the whole [headless core](/core/), and never pulls React or Vue into your bundle. The same code is published as `@khorshid-js/dom` if you prefer the scoped package.

## Your first picker

Bind a picker to an `<input>`. You get a masked input that opens a popup on desktop and a bottom sheet on small screens:

```js
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

const picker = createDatePicker('#birthday', { locale: 'fa-IR' })

picker.on('change', ({ value }) => {
  if (value.mode === 'single' && value.date) {
    console.log(value.date.iso)       // '2026-03-21'  (Gregorian ISO)
    console.log(value.date.formatted) // '۱۴۰۵/۰۱/۰۱'  (active locale)
  }
})
```

Type in the field, or click it to open the calendar:

<Demo :controls="['value']" placeholder="۱۴۰۵/۰۱/۰۱" caption="A single fa-IR picker with the smart input mask." />

## An inline calendar

Pass an element that is not an `<input>` and the calendar mounts inline, always visible:

```js
createDatePicker(document.querySelector('#calendar'), {
  locale: 'en-US-gregorian',
})
```

The `display` option forces a form regardless of the target: `'inline'`, `'popup'`, `'sheet'` or `'modal'`. See [Options](/api/options#display-is-independent-of-the-target).

<Demo inline locale="en-US-gregorian" :controls="['value']" caption="An always-visible inline calendar." />

## A range across two months

```js
createDatePicker('#stay', {
  locale: 'fa-IR',
  mode: 'range',
  months: 2,
})
```

<Demo inline mode="range" :months="2" :controls="['value']" caption="Range selection with two month panes and hover preview." />

## Events

Listen with `picker.on()`, or pass an `on<Event>` callback with the options:

```js
const picker = createDatePicker('#stay', {
  mode: 'range',
  onRangeComplete: ({ start, end }) => book(start.iso, end.iso),
})

const off = picker.on('change', ({ value, source }) => console.log(value, source))
off() // unsubscribe
```

See [Events](/api/events) for every event and its payload.

## The returned instance

`createDatePicker()` returns a `DatePicker` you can drive from code:

```js
picker.open()
picker.setValue('2026-03-21')
picker.setLocale('en-US')
picker.setTheme('dark')
picker.getValue()
picker.clear()
picker.destroy()
```

`picker.core` is the underlying headless [`PickerCore`](/core/picker-core), and `picker.el` holds the rendered elements. The [DatePicker API](/vanilla/api) lists the full surface.

## Date field

`createDateField` renders the segmented [date field](/guide/date-field), for dates people type rather than browse for:

```js
import { createDateField } from 'khorshid'

const field = createDateField('#birthday', {
  locale: 'fa-IR',
  label: 'تاریخ تولد',
  name: 'birthday',
  onChange: ({ value }) => console.log(value?.iso),
})
```

See the [createDateField API](/vanilla/date-field).

**Related:** [DatePicker API](/vanilla/api) · [Options](/api/options) · [Forms](/guide/forms) · [Web Component](/web-component/)
