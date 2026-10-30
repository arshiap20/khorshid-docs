# Events

Every picker event, its payload and when it fires. The list is defined once in the core, so every layer exposes all of them and each handler receives the same payload object.

## Four ways to listen

The naming is mechanical: `'range:complete'` becomes `onRangeComplete`, `@range-complete` and `sdp-range-complete`.

```ts
picker.on('range:complete', onDone)                    // vanilla: .on()
createDatePicker('#d', { onRangeComplete: onDone })    // vanilla: an option
<DatePicker onRangeComplete={onDone} />                // React: a prop
<DatePicker @range-complete="onDone" />                // Vue: an emit
el.addEventListener('sdp-range-complete', (e) => onDone(e.detail))  // custom element
```

Every handler takes one argument, the payload object (`onChange` gets `{ value, source }`). On the custom element the payload is `event.detail`.

`on` returns an unsubscribe function. The core also has `once` and `onAny`:

```js
const off = picker.on('change', ({ value, source }) => { /* … */ })
off()

picker.core.onAny((event, payload) => console.log(event, payload))
```

## Event map

| Event | Payload | Fires when |
|---|---|---|
| `change` | `{ value: PickerValue, source: ChangeSource }` | The committed value changes. `source` is `'select'`, `'input'`, `'api'`, `'clear'`, `'time'` or `'shortcut'`. Picking the first end of a fresh range does not fire it. |
| `select` | `{ date: DateValue }` | A day is picked, in any mode, including each end of a range. |
| `clear` | `{ previous: PickerValue }` | The value is cleared. `change` follows. |
| `range:start` | `{ start: DateValue }` | The first end of a range is picked. |
| `range:complete` | `{ start: DateValue, end: DateValue }` | The second end is picked, or typed text or a shortcut sets a whole range. |
| `open` / `close` | `{}` | The picker opens or closes. |
| `view:change` | `{ view: PickerView, previous: PickerView }` | The view switches between `days`, `months` and `years`. |
| `month:change` | `{ year, month, direction: 1 \| -1 \| 0 }` | The displayed month changes, on every path (navigation, `goTo`, `setValue`, keyboard paging). `0` means a jump. |
| `year:change` | `{ year, previous }` | The displayed year changes, on every path. |
| `locale:change` | `{ locale: Locale }` | The locale switches. |
| `calendar:change` | `{ calendar: CalendarId }` | The calendar switches, through `setCalendar` or a locale with another calendar. |
| `time:change` | `{ time: TimeValue }` | The time of day changes (time picker on). |
| `shortcut` | `{ id: string, value: PickerValue }` | A [shortcut](/guide/shortcuts-and-limits) is applied. Its `change` (source `'shortcut'`) follows. |
| `input` | `{ text, complete, valid }` | Every keystroke that goes through the mask, and free text with `naturalInput`. |
| `error` | `{ code, message, input?, reason? }` | A pick, typed text or calendar switch is refused. See [error codes](#error-codes). |

## Names in every layer

| Core event | Callback | Vue emit | Element event |
|---|---|---|---|
| `change` | `onChange` | `change` | `sdp-change` |
| `select` | `onSelect` | `select` | `sdp-select` |
| `clear` | `onClear` | `clear` | `sdp-clear` |
| `range:start` | `onRangeStart` | `range-start` | `sdp-range-start` |
| `range:complete` | `onRangeComplete` | `range-complete` | `sdp-range-complete` |
| `open` | `onOpen` | `open` | `sdp-open` |
| `close` | `onClose` | `close` | `sdp-close` |
| `view:change` | `onViewChange` | `view-change` | `sdp-view-change` |
| `month:change` | `onMonthChange` | `month-change` | `sdp-month-change` |
| `year:change` | `onYearChange` | `year-change` | `sdp-year-change` |
| `locale:change` | `onLocaleChange` | `locale-change` | `sdp-locale-change` |
| `calendar:change` | `onCalendarChange` | `calendar-change` | `sdp-calendar-change` |
| `time:change` | `onTimeChange` | `time-change` | `sdp-time-change` |
| `shortcut` | `onShortcut` | `shortcut` | `sdp-shortcut` |
| `input` | `onInput` | `input` | `sdp-input` |
| `error` | `onError` | `error` | `sdp-error` |
| `open` + `close` | `onOpenChange(open: boolean)` | `open-change` | none |

Vue components also emit `update:modelValue` for `v-model`. The runtime lists are exported as `PICKER_EVENTS`, `EVENT_HANDLER_NAMES`, `EVENT_EMIT_NAMES` and `DATEPICKER_ELEMENT_EVENTS`.

The date field has its own, smaller set of events. See [Date Field](/api/date-field#events).

## Live event log

Interact with this picker and watch every event arrive:

<Demo inline :controls="['events', 'value']" caption="core.onAny() feeding a live log." />

## `PickerValue` by mode

The `value` in a `change` payload is a union keyed by `mode`:

```ts
type ChangeSource = 'select' | 'input' | 'api' | 'clear' | 'time' | 'shortcut'

type PickerValue =
  | { mode: 'single';   date: DateValue | null }
  | { mode: 'range';    start: DateValue | null; end: DateValue | null }
  | { mode: 'multiple'; dates: DateValue[] }
```

`isSingleValue`, `isRangeValue`, `isMultipleValue` and `isPickerValue` narrow it. A literal `mode` on a picker or hook narrows it for you.

## `DateValue`

Every date in a payload is a `DateValue`: the same day in every useful shape, so you never convert anything yourself.

```js
picker.on('change', ({ value }) => {
  // value.date (single mode, fa-IR, Nowruz 1405):
  // {
  //   jalali:    { year: 1405, month: 1, day: 1 },
  //   gregorian: { year: 2026, month: 3, day: 21 },
  //   hijri:     { year: 1447, month: 10, day: 2 },
  //   date:      Date,            // native Date at local midnight
  //   iso:       '2026-03-21',    // Gregorian ISO
  //   jdn:       2461121,         // Julian Day Number
  //   weekday:   6,               // 0 = Sunday … 6 = Saturday
  //   formatted: '۱۴۰۵/۰۱/۰۱',    // active locale and display format
  // }
})
```

| Field | Type | Description |
|---|---|---|
| `jalali` | `DateParts` | Jalali year, month and day. |
| `gregorian` | `DateParts` | Gregorian year, month and day. |
| `hijri` | `DateParts?` | Lunar Hijri parts, whenever the Hijri calendar can represent the date (1300–1600 AH by default). |
| `date` | `Date` | Native `Date` at local midnight. |
| `iso` | `string` | Gregorian `YYYY-MM-DD`. |
| `jdn` | `number` | Julian Day Number. |
| `weekday` | `WeekDay` | `0` = Sunday … `6` = Saturday. |
| `formatted` | `string` | Formatted with the active locale and display format. Includes the time when `time` is on, and describes the whole period for week, month and year units (`'خرداد ۱۴۰۵'`). |
| `time` | `TimeValue?` | `{ hour, minute, second }`, only when the time picker is on. |
| `end` | `DateValue?` | The last day of the period when [`unit`](/guide/selection-units) is `'week'`, `'month'` or `'year'`. The value itself is the first day. |

## Error codes

| Code | Meaning |
|---|---|
| `invalid-input` | Typed or submitted text is not a valid date. |
| `out-of-range` | Typed or submitted text names a date outside `min` / `max`. |
| `disabled` | The date is matched by `disabledDates` (`reason` carries its reason, if any), or a click or `select()` landed outside `min` / `max`. |
| `range-length` | The range would break `minDays` / `maxDays`. |
| `no-locale-variant` | `setCalendar` found no locale with the same language for that calendar. |

`message` is a developer-facing English string. `input` is the refused text, present for typed input.

```js
picker.on('error', ({ code, reason }) => {
  if (code === 'disabled' && reason) showHint(reason)   // 'Fully booked'
  if (code === 'range-length') showHint('2 to 14 nights')
})
```
