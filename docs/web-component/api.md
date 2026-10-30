# Custom Elements

Reference for `<khorshid-datepicker>` and `<khorshid-date-field>`: their attributes, properties, methods and events. Both render into their light DOM, so the standard stylesheet and `--sdp-*` tokens apply and their form fields join the surrounding `<form>`. For usage, see the [Web Component guide](/web-component/).

## Registering

```js
import { defineDatePickerElement, defineDateFieldElement } from 'khorshid/element'
import 'khorshid/styles.css'

defineDatePickerElement()   // <khorshid-datepicker>
defineDateFieldElement()    // <khorshid-date-field>
```

| Export | Description |
|---|---|
| `defineDatePickerElement(tagName?)` | Register the picker element, by default as `khorshid-datepicker`. |
| `defineDateFieldElement(tagName?)` | Register the date field element, by default as `khorshid-date-field`. |
| `@khorshid-js/element/define` | Side-effect import that registers both. |

Registering a tag that already exists does nothing, and a second tag name registers a subclass. On the server (no `customElements`) both functions do nothing, and importing the module never throws.

## `<khorshid-datepicker>` {#khorshid-datepicker}

Wraps [`createDatePicker`](/vanilla/api). It renders an `<input class="sdp-element__input">`, or with `display="inline"` a `<div class="sdp-element__mount">` holding the panel.

### Attributes {#datepicker-attributes}

Attributes are the kebab-case [options](/api/options). A boolean is on when present; `="false"` turns it off, which is how you disable options that default to on. Unknown attributes and invalid values are ignored.

| Attribute | Option | Values |
|---|---|---|
| `locale` | `locale` | A locale key. Live. |
| `theme` | `theme` | `light`, `dark`, `auto`. Live. |
| `mode` | `mode` | `single`, `range`, `multiple`. Live. |
| `value` | `value` | `2026-03-21`; a range as `start/end` (either side may be empty); a comma list for multiple. Live. |
| `placeholder` | none | Set on the inner input. Live. |
| `disabled` | none | Disables the inner input and makes the picker read-only; it never opens. |
| `unit` | `unit` | `day`, `week`, `month`, `year`. |
| `display` | `display` | `auto`, `inline`, `popup`, `sheet`, `modal`. |
| `min`, `max` | `min`, `max` | ISO dates. |
| `months` | `months` | A number. |
| `min-days`, `max-days` | `minDays`, `maxDays` | Numbers. |
| `shortcuts` | `shortcuts` | Boolean, or a comma list of preset ids such as `today,thisWeek,thisMonth`. |
| `secondary-calendar` | `secondaryCalendar` | Boolean, or a calendar id (`jalali`, `gregorian`, `hijri`). |
| `natural-input` | `naturalInput` | Boolean. |
| `time` | `time` | Boolean (a 24-hour `HH:mm` clock). Pass `TimeOptions` through `options`. |
| `format` | `format` | A [format pattern](/api/format-tokens). |
| `week-start` | `weekStart` | `0` (Sunday) … `6` (Saturday). |
| `name`, `required` | `name`, `required` | Form name, and boolean. |
| `readonly` | `readOnly` | Boolean. |
| `position` | `position` | `auto`, `bottom-start`, `bottom-end`, `top-start`, `top-end`. |
| `z-index` | `zIndex` | A number. |
| `mobile-breakpoint` | `mobileBreakpoint` | A number, or `false` for never. |
| `outside-days` | `outsideDays` | `interactive`, `visible`, `hidden`. |
| `confirm` | `confirm` | `true`, `false`, `auto`. |
| `show-today`, `show-clear`, `animate`, `highlight-today`, `year-picker`, `fixed-weeks`, `auto-close`, `input-mask` | the camelCase option | Booleans that default to on. |

`locale`, `theme`, `mode`, `value` and `placeholder` apply in place. Changing any other attribute re-creates the picker and keeps the current value.

### Properties and methods {#datepicker-properties}

| Member | Type | Description |
|---|---|---|
| `value` | `PickerValue` (get), `PickerValueInput` (set) | The current value. It can be read and set before the element is connected. |
| `options` | `DatePickerOptions` | JS-only options merged over the attributes: functions (`disabledDates`, `renderDay`, `formValue`, `on<Event>`), objects (`vars`, `plugins`, custom `shortcuts`). Assigning re-creates the picker and keeps the value. |
| `picker` | `DatePicker \| null` | The underlying [`DatePicker`](/vanilla/api), or `null` while disconnected. |
| `core` | `PickerCore \| null` | Its [`PickerCore`](/core/picker-core), or `null` while disconnected. |
| `open()` | `() => void` | Open the picker. Does nothing while `disabled`. |
| `close()` | `() => void` | Close the picker. |
| `clear()` | `() => void` | Clear the value. |

Removing the element destroys the picker; inserting it again builds a new one with the same value.

### Events {#datepicker-events}

Every core event is dispatched as a `CustomEvent` named `sdp-` plus the event name, with the colon replaced by a dash: `sdp-change`, `sdp-range-complete`, `sdp-view-change`, and so on (the full list is in [Events](/api/events#names-in-every-layer)). They bubble, are composed, and carry the core payload in `detail`. `DATEPICKER_ELEMENT_EVENTS` lists every name, and `addEventListener` is typed for them.

The prefix keeps them apart from the inner input's native `change`, `input` and `select` events, which also bubble through the host.

## `<khorshid-date-field>` {#khorshid-date-field}

Wraps [`createDateField`](/api/date-field) and renders the `.sdp-field` tree inside the element.

### Attributes {#date-field-attributes}

| Attribute | Option | Values |
|---|---|---|
| `locale` | `locale` | A locale key. Live. |
| `theme` | `theme` | `light`, `dark`, `auto`. Live. |
| `value` | `value` | An ISO date (`2026-03-21`) or date-time (`2026-03-21T14:30`, `2026-03-21T14:30:15`). Anything else means empty. Live, and also the value a form reset restores. |
| `min`, `max` | `min`, `max` | ISO dates; invalid ones are ignored. Live. |
| `required`, `readonly`, `disabled`, `invalid` | `required`, `readOnly`, `disabled`, `invalid` | Booleans. Live. |
| `format` | `format` | A [format pattern](/api/format-tokens#where-each-token-works). |
| `placeholder-value` | `placeholderValue` | An ISO date. |
| `time` | `time` | Present, `true`, `24` or `24h` for a 24-hour clock; `12` or `12h` for 12-hour with AM/PM; `false` for off. |
| `time-seconds` | `time.showSeconds` | Boolean; only while `time` is on. |
| `minute-step` | `time.minuteStep` | A whole number from 1; only while `time` is on. |
| `name` | `name` | Form field name. |
| `label`, `description`, `error-message` | `label`, `description`, `errorMessage` | Text, rendered as text and never parsed as HTML. |
| `variant` | `variant` | `primary`, `secondary`. |
| `full-width` | `fullWidth` | Boolean. |
| `aria-label` | `ariaLabel` | Accessible name when there is no label. |
| `auto-focus` | `autoFocus` | Boolean; applies only when the element is inserted. |

The live attributes apply in place. Changing any other attribute re-creates the field and keeps its value, and its focus when a segment had it.

### Properties and methods {#date-field-properties}

| Member | Type | Description |
|---|---|---|
| `value` | `DateValue \| null` (get), `DateFieldValueInput` (set) | The committed value; `null` while empty, incomplete or invalid. |
| `options` | `CreateDateFieldOptions` | JS-only options merged over the attributes: `validate`, `disabledDates`, `formValue`, `on<Event>`, `labels`, `vars`, `classes`, nodes for `prefix`, `suffix` or an HTML `label`. Assigning re-creates the field and keeps the value. |
| `field` | `DateField \| null` | The underlying [`DateField`](/vanilla/date-field#datefield-instance), or `null` while disconnected. |
| `core` | `DateFieldCore \| null` | Its core, or `null` while disconnected. |
| `focus()` | `() => void` | Focus the first empty segment, else the first one. |
| `validate()` | `() => DateFieldValidation \| null` | Validate now, including `required` and `incomplete`. `null` while disconnected. |
| `clear()` | `() => void` | Clear the value. |

### Events {#date-field-events}

| Event | `detail` |
|---|---|
| `sdp-change` | `{ value, source }` |
| `sdp-input` | `{ type, value, text, complete }` |
| `sdp-error` | `{ code, message, reason?, input }` |
| `sdp-locale-change` | `{ locale }` |

`DATE_FIELD_ELEMENT_EVENTS` lists them. The prefix keeps them apart from the native `input` events of the editable segments.

## Other exports

| Export | Description |
|---|---|
| `KhorshidDatePickerElement`, `KhorshidDateFieldElement` | The element classes, for subclassing or `instanceof` checks. |
| `parseValueAttribute(raw)` | How the picker reads its `value` attribute into a `PickerValueInput`. |
| `parseDateFieldValueAttribute(raw)` | How the date field reads its `value` attribute: the ISO string, or `null`. |
| `ElementEventName`, `KhorshidDatePickerEventMap`, `DateFieldElementEventName`, `KhorshidDateFieldEventMap` | Types of the event names and `CustomEvent`s. |
