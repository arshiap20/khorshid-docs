# DatePicker

`createDatePicker(target, options?)` is the one factory of the vanilla picker. It returns a `DatePicker`: the rendered panel, its field and overlay, and the headless core behind them.

```ts
import { createDatePicker } from 'khorshid'   // or '@khorshid-js/dom'
import 'khorshid/styles.css'

function createDatePicker<M extends PickerMode = 'single'>(
  target: string | HTMLElement,
  options?: DatePickerOptions & { mode?: M }
): DatePicker<M>
```

| Parameter | Description |
|---|---|
| `target` | A CSS selector or an element. An `<input>` or `<textarea>` becomes a masked field that opens an overlay; any other element gets an inline panel inside it. [`display`](/api/options#display-is-independent-of-the-target) overrides either default. |
| `options` | `DatePickerOptions`: every [option](/api/options) plus one `on<Event>` callback per [event](/api/events). |

The factory throws when there is no DOM (`document` is undefined) or when the selector matches nothing.

There are no preset factories (`rangePicker`, `inlineCalendar` and the like). `mode` and `display` cover them.

## Typed by mode

A literal `mode` narrows the return type, so `getValue()` needs no `value.mode` check:

```ts
const range = createDatePicker('#stay', { mode: 'range' })
range.getValue().start   // typed as DateValue | null
```

| Type | Equals |
|---|---|
| `SingleDatePicker` | `DatePicker<'single'>` |
| `RangeDatePicker` | `DatePicker<'range'>` |
| `MultipleDatePicker` | `DatePicker<'multiple'>` |
| `DomNode` | `string \| HTMLElement \| null \| void`, what render hooks may return |

## Properties

| Property | Type | Description |
|---|---|---|
| `core` | `PickerCore` | The headless engine. See [PickerCore](/core/picker-core). |
| `el.input` | `HTMLInputElement \| undefined` | The field, when the target was one. |
| `el.panel` | `HTMLElement` | The `.sdp` panel root. |
| `el.overlay` | `HTMLElement \| undefined` | The `.sdp-overlay` root, present only while a popup, sheet or modal is mounted. |

## Methods

| Method | Signature | Description |
|---|---|---|
| `open` | `() => void` | Open the overlay. An inline panel is always open. |
| `close` | `() => void` | Close the overlay. |
| `toggle` | `() => void` | Open if closed, close if open. |
| `getValue` | `() => ValueFor<M>` | The current value, narrowed by the literal `mode`. |
| `setValue` | `(value: PickerValueInput) => void` | Set the value. Emits `change` with source `'api'` when the selection actually changes. |
| `clear` | `() => void` | Clear the value. Emits `clear`, then `change` with source `'clear'`. Does nothing when already empty. |
| `on` | `(event, handler) => Unsubscribe` | Subscribe to an [event](/api/events). Returns an unsubscribe function. |
| `off` | `(event, handler) => void` | Remove a handler. |
| `setTheme` | `(theme: 'light' \| 'dark' \| 'auto') => void` | Switch the color scheme of the panel and overlay. |
| `setLocale` | `(locale: string) => void` | Switch locale by key, and with it the calendar. Emits `locale:change` (and `calendar:change` when the calendar changes). |
| `setCalendar` | `(calendar: CalendarId) => void` | Switch to the same-language locale for that calendar, preferring the same region. Emits `error` with code `no-locale-variant` when there is none. |
| `setMode` | `(mode: PickerMode) => void` | Switch the selection mode. The value is kept where it fits: single keeps the first date, range the two earliest. Emits `change` when that trims the value. |
| `setVars` | `(vars: Record<string, string>) => void` | Merge per-instance CSS variables into the panel and overlay. An empty string removes one. |
| `destroy` | `() => void` | Remove the panel, overlay, form field and every listener, and destroy the core. |

Anything else (navigation, views, render models, shortcuts, `format`, `parse`, `submitInput`, `once`, `onAny`) lives on `picker.core`.

## Example

```js
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

const picker = createDatePicker('#date', { locale: 'fa-IR' })

const off = picker.on('change', ({ value, source }) => console.log(value, source))

picker.setValue('2026-03-21')
picker.setLocale('en-US')
picker.setTheme('dark')
picker.setVars({ accent: '#e11d48' })
picker.core.goToToday()
picker.core.applyShortcut('thisMonth')

off()
picker.destroy()
```

## Form field

With `name` or `required`, the picker adds a visually hidden `input.sdp-form-value` that carries the serialized value, so a surrounding `<form>` submits it. See [Forms](/guide/forms).

```js
const picker = createDatePicker('#stay', { mode: 'range', name: 'stay', required: true })

new FormData(form).get('stay') // '2026-04-04/2026-04-07'
picker.core.getFormValue()     // the same string
```

| Behavior | Detail |
|---|---|
| Placement | After an `<input>` target, inside an inline mount, or after the element an overlay is anchored to. |
| Sync | Updated on every `change`, locale change and time change. |
| `required` | The form is invalid until there is a value (a range needs both ends). On `invalid`, focus moves to the field, or to the grid. |
| Typed text | Refused text marks the field `.sdp-input--invalid` and sets its native validity message to `labels.invalidDate`. |
| `reset` | A form reset restores the `value` option. |
| `destroy()` | Removes the hidden field. |

Prefer markup? [`<khorshid-datepicker>`](/web-component/api) wraps this factory as a Custom Element.

## Lower-level exports

`@khorshid-js/dom` also exports the pieces `createDatePicker` is built from. React and Vue reuse them, so overlays and keyboard handling behave the same in every layer.

| Export | Description |
|---|---|
| `Panel` | The `.sdp` panel renderer, bound to a core. |
| `Popup`, `Sheet`, `Modal` | The overlay shells: positioning, drag-to-dismiss, focus trap, enter and exit animations. |
| `bindInput(input, core, { inputMask?, getPanel? })` | Bind a text field to a core: mask, commit on Enter and blur, open on focus. Returns an unbind function. |
| `bindFormField(core, options)` | Add the hidden `input.sdp-form-value`. Returns an unbind function. |
| `bindKeyboard(core, root)`, `handlePanelKey(event, core, root)` | The panel's keyboard map. See [Keyboard & Accessibility](/guide/keyboard-a11y). |
| `measureTitle`, `glideTitle` | The header title glide between months. |
| `createDateField` | The segmented date input. See [createDateField](/vanilla/date-field). |

`@khorshid-js/dom` (and the `khorshid` package) also re-exports all of `@khorshid-js/core`.
