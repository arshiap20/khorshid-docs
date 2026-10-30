# Vue API

Reference for the components and composables of `khorshid/vue`. They take the same [options](/api/options) as the vanilla picker, by the same names, so this page covers only what Vue adds. For usage, see the [Vue guide](/vue/).

## Package

| Import | Same as | Contains |
|---|---|---|
| `khorshid/vue` | `@khorshid-js/vue` | `DatePicker`, `Calendar`, `DateField`, the composables, `provideDatePicker`, the prop tables, and all of `@khorshid-js/core` |
| `khorshid/styles.css` | `@khorshid-js/vue/styles.css` | The stylesheet every layer uses |

The package exports `VERSION` (its own) and `CORE_VERSION`.

## Components

| Component | Accepts | Renders |
|---|---|---|
| `<DatePicker>` | `UIOptions`: every option, including display and overlay | A text field plus the panel it opens. The overlays are the ones from `@khorshid-js/dom`. |
| `<Calendar>` | `PanelUIOptions`: no display or overlay options | The always-visible panel. |
| `<DateField>` | `DateFieldUIOptions` | The segmented [date field](/api/date-field). |

Every component also emits one event per core event. See [Events](/api/events#names-in-every-layer).

### `<DatePicker>` and `<Calendar>` {#datepicker-and-calendar}

Props added on top of the options:

| Prop | Type | Description |
|---|---|---|
| `mode` | `PickerMode` | Selection mode. |
| `modelValue` | `PickerValueInput` | The `v-model` value. Updated through `update:modelValue` with a `PickerValue`. |
| `defaultValue` | `PickerValueInput` | Uncontrolled initial value. |
| `core` | `PickerCore` | Render an existing core instead of creating one. Several components can share one core. |
| `inputProps` | `Record<string, unknown>` | `<DatePicker>` only. Attributes spread onto the field's `<input>`. |

Scoped slots, the template form of the render options:

| Slot | Props | Same as |
|---|---|---|
| `day` | `{ cell: DayCell }` | `renderDay` |
| `weekday` | `{ label: WeekdayLabel }` | `renderWeekday` |
| `footer` | `{ value, view }` | `renderFooter` |

When both are given, the render prop wins over the slot.

A self-managed component creates its core from the props once. After that, `locale`, `mode` and the controlled value stay in sync; other behavior options are read at creation. Presentation options apply on every render.

There is no `mask` prop. For a custom mask, create the core with `useDatePicker({ mask })` and pass it as `core`.

### `<DateField>` {#datefield}

Props added on top of the [date field options](/api/date-field#behavior-options):

| Prop | Type | Description |
|---|---|---|
| `modelValue` | `DateFieldValueInput` | The `v-model` value. Updated with a `DateValue \| null`. |
| `value` | `DateFieldValueInput` | Uncontrolled initial value (as in vanilla). |

`locale` and the mutable options (`min`, `max`, `disabledDates`, `required`, `readOnly`, `disabled`, `invalid`, `validate`) update in place. `format`, `time`, `labels` and `placeholderValue` are read once.

Slots `label`, `description`, `prefix`, `suffix` and `error` (`{ validation }`) replace the same-named props, and win over them. Through a template ref, `<DateField>` exposes `core`, `focus()`, `validate()` and `clear()`.

## Composables

### `useDatePicker`

```ts
function useDatePicker<M extends PickerMode = 'single'>(
  options?: UseDatePickerOptions<M>
): { core: PickerCore; state: Ref<PickerState>; value: ComputedRef<ValueFor<M>>; actions: PickerActions }
```

Creates a core for the current scope and destroys it on scope dispose. `locale`, `mode` and the controlled `value` accept plain values, refs or getters and stay in sync; other options are read once.

### Other composables

| Composable | Signature | Description |
|---|---|---|
| `usePickerState` | `(core: PickerCore) => Ref<PickerState>` | Track any core's state as a `shallowRef`. |
| `usePickerEvent` | `(core \| null \| undefined, event, handler) => void` | Subscribe for the current scope. A missing core is a no-op. |
| `useDateField` | `(options?: UseDateFieldOptions) => { core, state, value }` | The headless half of `<DateField>`. `locale`, `value`, `min`, `max`, `required`, `readOnly`, `disabled` and `invalid` take values, refs or getters; `disabledDates` and `validate` take values or refs. `format`, `time`, `labels` and `placeholderValue` are read once. |
| `provideDatePicker` | `(options?: { core?, ...UseDatePickerOptions }) => UseDatePicker` | Create (or adopt with `core`) a picker and provide it to descendants. |
| `useDatePickerContext` | `() => UseDatePicker` | Inject the picker from the nearest `provideDatePicker`. Throws when there is none. |

Also exported: `datePickerKey` (the injection key), `sameFieldValue` (whether a date-field input equals a value), and the prop and emit tables `panelProps`, `fieldProps`, `pickerEmits`, `dateFieldProps` and `dateFieldEmits`, for wrapping the components in your own.

## `PickerActions`

The bound action methods `useDatePicker` returns. Each calls the core method of the same name; see [PickerCore](/core/picker-core).

| Group | Actions |
|---|---|
| Value | `select`, `setValue`, `clear`, `hover` |
| Open state | `open`, `close`, `toggle` |
| Navigation | `next`, `prev`, `goTo`, `goToToday`, `setView`, `selectMonth`, `selectYear` |
| Time | `setTime` |
| Configuration | `setLocale`, `setCalendar`, `setMode` |
| Keyboard focus | `focusDate`, `moveFocus`, `selectFocused` |

## Value types

Vue's runtime props cannot carry the mode generic, so a component's `change` and `update:modelValue` payloads carry the full `PickerValue` union. Narrow with `isRangeValue` and the other guards, or use `useDatePicker`, whose `value` is narrowed.
