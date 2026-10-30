# Date Field Options

The options, events and validation codes of the segmented date field. They are the same in every layer: options of [`createDateField`](/vanilla/date-field), props of `<DateField>` in [React](/react/api#datefield) and [Vue](/vue/api#datefield), and attributes of [`<khorshid-date-field>`](/web-component/api#khorshid-date-field). The headless engine is [`DateFieldCore`](/core/date-field-core). For a walkthrough with live examples, see the [Date Field guide](/guide/date-field).

## Behavior options {#behavior-options}

`DateFieldOptions`, shared with the headless core.

| Option | Type | Default | Description |
|---|---|---|---|
| `locale` | `string \| Locale` | `'fa-IR'` | Locale key or object. It sets the calendar, digits and built-in texts. |
| `format` | `FormatPattern` | `locale.formats.display`, plus the time pattern with `time` | Segment order, separators and padding. See [format tokens](/api/format-tokens#where-each-token-works). |
| `value` | `DateFieldValueInput` | none | Initial value: a `DateInput`, a `DateValue`, or `null`. Also what a form reset restores. |
| `placeholderValue` | `DateInput` | today | Where an empty segment starts when stepped with the arrow keys. |
| `min` | `DateInput` | none | Earliest allowed date. |
| `max` | `DateInput` | none | Latest allowed date. |
| `disabledDates` | `DisabledDates` | none | Dates that cannot be entered, in the same form as the picker's option. |
| `time` | `boolean \| TimeOptions` | `false` | Add time segments. `true` = 24-hour `HH:mm`. Time tokens in `format` also turn it on. |
| `required` | `boolean` | `false` | A value is required. Takes part in native form validation. |
| `readOnly` | `boolean` | `false` | Focusable and announced, but not editable. |
| `disabled` | `boolean` | `false` | Not focusable, not editable, not submitted. |
| `invalid` | `boolean` | `false` | Force the invalid state, for example from server-side validation. |
| `validate` | `(value: DateValue) => string \| boolean \| null \| undefined` | none | Extra check for a complete, in-range date. Return a message, or `false` for the generic one, to reject. |
| `labels` | `{ segments?, placeholders?, empty?, messages? }` | built-in English and Persian | Override any built-in text. Messages may use `{min}` and `{max}`. |

## Presentation and form options {#presentation-and-form-options}

`DateFieldUIOptions`.

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color scheme. |
| `vars` | `Record<string, string>` | none | Per-instance CSS variables (`accent` or `--sdp-accent`). See [Theming Tokens](/api/theming-tokens#date-field). |
| `label` | `Node` | none | Visible label tied to the group. Clicking it focuses the first empty segment. |
| `description` | `Node` | none | Helper text under the field, hidden while an error shows. |
| `errorMessage` | `Node \| ((validation) => Node)` | the validation message | What to show while invalid. The function receives the current `DateFieldValidation`, or `null` when only `invalid` forces the state. |
| `prefix` | `Node` | none | Content before the segments, such as an icon. |
| `suffix` | `Node` | none | Content after the segments, such as a button. |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | `'primary'` is bordered with a hairline shadow; `'secondary'` is filled, for use on a surface. |
| `fullWidth` | `boolean` | `false` | Stretch to the container's width. |
| `classes` | `Partial<Record<DateFieldSlotName, string>>` | none | Extra classes per part: `root`, `label`, `group`, `input`, `segment`, `literal`, `prefix`, `suffix`, `description`, `error`. |
| `name` | `string` | none | Submit the value with the surrounding `<form>` under this name. |
| `formValue` | `(value: DateValue \| null) => string` | ISO `YYYY-MM-DD`, plus `THH:mm:ss` with time | Serialize the value for the form. |
| `autoFocus` | `boolean` | `false` | Focus the first segment on mount. |
| `ariaLabel` | `string` | none | Accessible name when there is no visible `label`. |

`Node` is a string or an `HTMLElement` in vanilla (a string is parsed as HTML), a `ReactNode` in React, a `VNodeChild` in Vue.

## Events {#events}

| Event | Callback | Payload | Fires when |
|---|---|---|---|
| `change` | `onChange` | `{ value: DateValue \| null, source: 'input' \| 'api' \| 'clear' }` | The committed value changes; `null` when cleared or no longer usable. |
| `input` | `onInput` | `{ type: DateSegmentType, value: number \| null, text: string, complete: boolean }` | A segment is edited: every keystroke and arrow press. |
| `error` | `onError` | `{ code, message, reason?, input }` | A complete entry is refused. |
| `locale:change` | `onLocaleChange` | `{ locale: Locale }` | The locale switches. |

Vue emits them as `change`, `input`, `error` and `locale-change` (plus `update:modelValue`); the custom element dispatches `sdp-change`, `sdp-input`, `sdp-error` and `sdp-locale-change`.

## Validation codes {#validation-codes}

| Code | When |
|---|---|
| `required` | Empty, once the field has been left or `validate()` ran. |
| `incomplete` | Partly filled, once the field has been left or `validate()` ran. |
| `invalid-input` | Not a real date in the calendar. |
| `out-of-range` | Outside `min` / `max`. |
| `disabled` | Matched by `disabledDates`; `reason` carries its reason. |
| `custom` | `validate` rejected it. |

`required` and `incomplete` never show while someone is still typing. The others show as soon as the entry is complete. The default messages are listed in the [guide](/guide/date-field#validation).
