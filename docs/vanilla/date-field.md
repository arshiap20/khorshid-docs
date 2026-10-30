# createDateField

The vanilla segmented date input: `createDateField` and the `DateField` instance it returns. Its options, events and validation codes are shared with every layer and listed in [Date Field Options](/api/date-field). For a walkthrough with live examples, see the [Date Field guide](/guide/date-field).

## Signature {#signature}

```ts
import { createDateField } from 'khorshid'   // or '@khorshid-js/dom'
import 'khorshid/styles.css'

function createDateField(
  target: string | HTMLElement,
  options?: CreateDateFieldOptions
): DateField
```

| Parameter | Description |
|---|---|
| `target` | A CSS selector or an element. The field's `.sdp-field` root is appended inside it. Throws when the selector matches nothing. |
| `options` | `CreateDateFieldOptions`: the [date field options](/api/date-field) plus one `on<Event>` callback per [event](/api/date-field#events). |

The same options, with the same names, are props of `<DateField>` in [React](/react/api#datefield) and [Vue](/vue/api#datefield) and attributes of [`<khorshid-date-field>`](/web-component/api#khorshid-date-field).

## `DateField` instance {#datefield-instance}

| Member | Signature | Description |
|---|---|---|
| `core` | `DateFieldCore` | The headless field. See [DateFieldCore](/core/date-field-core). |
| `el` | `{ root, group, input }` | The `.sdp-field` root, the `.sdp-field__group` box and the `.sdp-field__input` that holds the segments. |
| `getValue` | `() => DateValue \| null` | The committed value; `null` while empty, incomplete or invalid. |
| `setValue` | `(value: DateFieldValueInput) => void` | Set the value. |
| `clear` | `() => void` | Empty every segment. |
| `focus` | `() => void` | Focus the first empty segment, else the first one. |
| `validate` | `() => DateFieldValidation \| null` | Validate now and show the result, including `required` and `incomplete`. |
| `on` / `off` | `(event, handler)` | Subscribe to or remove a handler for an [event](/api/date-field#events). `on` returns an unsubscribe function. |
| `setOptions` | `(options: DateFieldMutableOptions) => void` | Change `min`, `max`, `disabledDates`, `required`, `readOnly`, `disabled`, `invalid` or `validate` in place. |
| `setLocale` | `(locale: string) => void` | Switch locale. A calendar change re-expresses the value in the new calendar. |
| `setCalendar` | `(calendar: CalendarId) => void` | Switch to the same-language locale for that calendar. |
| `setTheme` | `(theme: Theme) => void` | Switch the color scheme. |
| `setVars` | `(vars: Record<string, string>) => void` | Merge per-instance CSS variables. An empty string removes one. |
| `destroy` | `() => void` | Remove the field and its listeners. |
