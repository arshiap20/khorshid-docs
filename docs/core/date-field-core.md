# DateFieldCore

The DOM-free engine of the segmented date field, and the helpers every layer renders it with. It takes the [behavior options](/api/date-field#behavior-options) and emits the [date field events](/api/date-field#events). For the rendered field, see [`createDateField`](/vanilla/date-field) or the `<DateField>` components.

## `createDateFieldCore` {#createdatefieldcore}

`createDateFieldCore(options?: DateFieldOptions)` from `khorshid/headless` returns the DOM-free field every layer renders.

| Member | Signature | Description |
|---|---|---|
| `getState` | `() => Readonly<DateFieldState>` | The current state (a stable snapshot until the next change). |
| `subscribe` | `(listener) => Unsubscribe` | Called after every state change. |
| `on` / `once` / `off` / `onAny` | | Event subscription, as on the picker core. |
| `getOptions` | `() => Readonly<DateFieldOptions>` | The options. |
| `setOptions` | `(options: DateFieldMutableOptions) => void` | Update constraints and flags, and re-validate. |
| `getLocale` / `setLocale` | | Read or switch the locale. |
| `getCalendar` / `setCalendar` | | Read the calendar system, or switch to the same-language locale for a calendar. |
| `getValue` / `setValue` / `clear` | | Read, set or clear the value. |
| `focusSegment` | `(type: DateSegmentType \| null) => void` | Mark the segment being edited (call it on focus). Finishes an entry in progress elsewhere. |
| `blur` | `() => void` | The field lost focus: finish the entry and surface `required` / `incomplete`. |
| `increment` / `decrement` | `(type, amount?) => void` | Step a segment, wrapping. An empty segment starts at `placeholderValue`. |
| `setSegment` | `(type, value: number \| null) => void` | Set or clear one segment. |
| `typeText` | `(type, text: string) => boolean` | Type digits (any script), `a`/`p` (or `ق`/`ب`) for AM/PM, or a separator. Returns `true` when focus should move to the next segment. |
| `backspace` | `(type) => boolean` | Delete the last digit. Returns `true` when the segment was already empty, so focus should move back. |
| `validate` | `() => DateFieldValidation \| null` | Validate now, including `required` and `incomplete`. |
| `getText` | `() => string` | The whole field as text, with placeholders for empty segments. |
| `getFormValue` | `() => string` | The value serialized for a form, `''` when empty. |
| `destroy` | `() => void` | Remove every listener. |

`DateFieldState`:

| Field | Type | Description |
|---|---|---|
| `segments` | `DateSegment[]` | Every segment and separator, in display order. |
| `value` | `DateValue \| null` | The committed value. |
| `complete` / `empty` | `boolean` | Every / no editable segment has a value. |
| `active` | `DateSegmentType \| null` | The segment being edited. |
| `validation` | `DateFieldValidation \| null` | Why the entry is unusable: `{ code, message, reason? }`. |
| `invalid` | `boolean` | `validation` is set, or `invalid` forces it. |
| `disabled`, `readOnly`, `required` | `boolean` | The current flags. |

`DateSegment`:

| Field | Type | Description |
|---|---|---|
| `type` | `DateSegmentType \| 'literal'` | `year`, `month`, `day`, `hour`, `minute`, `second`, `dayPeriod`, or `literal` for separators. |
| `value` | `number \| null` | The number, `null` while empty. `hour` is 1–12 on a 12-hour clock, with `dayPeriod` `0` (AM) or `1` (PM). |
| `text` | `string` | What to render: the value in locale digits, the digits typed so far, the placeholder, or the literal text. |
| `placeholder` | `string` | Shown while empty. |
| `isPlaceholder` | `boolean` | The segment is empty. |
| `isEditable` | `boolean` | `false` for literals. |
| `min`, `max` | `number` | Bounds; the day's maximum follows the month and year entered so far. |
| `label` | `string` | Accessible name, such as `'Month'` or `'ماه'`. |
| `valueText` | `string` | `aria-valuetext`, such as `'3 – Khordad'`. |

## Rendering helpers {#rendering-helpers}

The shared helpers every layer renders from, exported by `khorshid/headless`:

| Export | Description |
|---|---|
| `segmentAttributes(segment, state)` | ARIA and data attributes of a segment (`role="spinbutton"`, `aria-valuenow`, …). |
| `dateFieldRootAttributes(state, { variant?, fullWidth?, extra? })` | Class and `data-*` state attributes of the root. |
| `dateFieldKeyAction(core, type, event)` | Apply a key press to a segment. Returns `{ handled, move }`, where `move` is `'next'`, `'prev'`, `'first'`, `'last'` or `null`. |
| `adjacentSegment(state, type, 1 \| -1)` | The next or previous editable segment. |
| `dateFieldErrorText(state)` | The current validation message, or `''`. |
| `FIELD_PAGE_STEPS` | PageUp / PageDown step per segment: year 5, month 2, day 7, hour 2, minute and second 15. |
| `DATE_FIELD_DEFAULTS` | The default `theme`, `variant`, `fullWidth`, `readOnly`, `disabled`, `required` and `autoFocus`. |
| `DATE_FIELD_EVENTS`, `bindDateFieldHandlers`, `splitDateFieldHandlers` | The event list and the helpers that wire `on<Event>` callbacks. |
