# React API

Reference for the components and hooks of `khorshid/react`. They take the same [options](/api/options) as the vanilla picker, by the same names, so this page covers only what React adds. For usage, see the [React guide](/react/).

## Package

| Import | Same as | Contains |
|---|---|---|
| `khorshid/react` | `@khorshid-js/react` | `DatePicker`, `Calendar`, `DateField`, the hooks, `DatePickerProvider`, and all of `@khorshid-js/core` |
| `khorshid/styles.css` | `@khorshid-js/react/styles.css` | The stylesheet every layer uses |

The package exports `VERSION` (its own) and `CORE_VERSION`.

## Components

| Component | Accepts | Renders |
|---|---|---|
| `<DatePicker>` | `UIOptions`: every option, including display and overlay | A text field plus the panel it opens. The overlays are the ones from `@khorshid-js/dom`. |
| `<Calendar>` | `PanelUIOptions`: no display or overlay options | The always-visible panel. |
| `<DateField>` | `DateFieldUIOptions` | The segmented [date field](/api/date-field). |

Every component also takes one callback prop per core event. See [Events](/api/events#names-in-every-layer).

### `<DatePicker>` and `<Calendar>` {#datepicker-and-calendar}

Props added on top of the options:

| Prop | Type | Description |
|---|---|---|
| `mode` | `PickerMode` | Selection mode. The literal narrows `value` and `onChange`. |
| `value` | `PickerValueInput` | Controlled value. When set (not `undefined`), update it from `onChange`. The value `onChange` hands you can go straight back in. |
| `defaultValue` | `PickerValueInput` | Uncontrolled initial value. |
| `core` | `PickerCore` | Render an existing core instead of creating one. Several components can share one core. |
| `className` | `string` | Extra classes on the panel root (same as `classes.root`). |
| `inputProps` | `InputHTMLAttributes` | `<DatePicker>` only. Attributes spread onto the field's `<input>`. |

A self-managed component creates its core from the props once. After that, `locale`, `mode` and the controlled value stay in sync; other behavior options are read at creation. Presentation options apply on every render.

### `<DateField>` {#datefield}

Props added on top of the [date field options](/api/date-field#behavior-options):

| Prop | Type | Description |
|---|---|---|
| `value` | `DateFieldValueInput` | Controlled value. Echoing `onChange`'s value back is a no-op. |
| `defaultValue` | `DateFieldValueInput` | Uncontrolled initial value, also what a form reset restores. |
| `core` | `DateFieldCore` | Adopt an existing core; it is never destroyed by the component. |
| `className` | `string` | Extra classes on the root (same as `classes.root`). |
| `id` | `string` | The root `id`, also the prefix of the label, description and error ids. |

`locale` and the mutable options (`min`, `max`, `disabledDates`, `required`, `readOnly`, `disabled`, `invalid`, `validate`) update in place. A change to `format`, `time`, `labels` or `placeholderValue` builds a new core and carries the value over.

## Hooks

### `useDatePicker`

```ts
function useDatePicker<M extends PickerMode = 'single'>(
  options?: UseDatePickerOptions<M>
): { core: PickerCore; state: Readonly<PickerState>; value: ValueFor<M>; actions: PickerActions }
```

Creates a core for the component's lifetime and re-renders on every state change. `UseDatePickerOptions` is `PickerOptions` plus `defaultValue`, a controlled `value` and the `on<Event>` callbacks. `locale`, `mode` and `value` are reactive; other options are read once. Pushing a controlled `value` does not echo back through `onChange`.

| Returns | Description |
|---|---|
| `core` | The live `PickerCore`, stable for the component's lifetime. |
| `state` | The current `PickerState`. |
| `value` | The committed value, narrowed by the literal `mode`. |
| `actions` | Bound, stable [`PickerActions`](#pickeractions). |

### Other hooks

| Hook | Signature | Description |
|---|---|---|
| `usePickerState` | `(core: PickerCore) => Readonly<PickerState>` | Track any core's state through `useSyncExternalStore`. SSR-safe. |
| `usePickerEvent` | `(core \| null \| undefined, event, handler) => void` | Subscribe to an event for the component's lifetime. A new inline handler each render does not resubscribe. A missing core is a no-op. |
| `useDateField` | `(options?: UseDateFieldOptions) => { core, state, value, controlled }` | The headless half of `<DateField>`: render `state.segments` yourself. Takes `value`, `defaultValue`, `core` and the `on<Event>` callbacks on top of `DateFieldOptions`. |
| `useDatePickerContext` | `() => UseDatePicker` | The picker from the nearest `<DatePickerProvider>`. Throws outside one. |

`<DatePickerProvider>` takes the `useDatePicker` options and `children`, and publishes one picker to its subtree. Pass `core` to adopt an existing core instead; the provider then never creates or destroys one.

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
