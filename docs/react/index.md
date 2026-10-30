# React

`khorshid/react` is the picker as React components and hooks. It is the same picker with a different renderer, not a separate API: option names, defaults, events and values are defined once in the [core](/core/), and the components render the same `sdp` element tree against the same stylesheet as every other layer.

## Installation

```bash
npm install khorshid
```

```tsx
import { DatePicker, Calendar, DateField, useDatePicker } from 'khorshid/react'
import 'khorshid/styles.css'
```

React 18 or later is required. The same code is published as `@khorshid-js/react` if you prefer the scoped package.

## `<DatePicker>`: a field and the panel it opens

```tsx
<DatePicker
  locale="fa-IR"
  defaultValue="2026-03-21"
  onChange={({ value, source }) => console.log(value, source)}
/>
```

It takes every [option](/api/options) by name (`display`, `readOnly`, `outsideDays`, `time`, `renderDay`, `dayProps`, `classes`, `vars`, …) plus `inputProps` for the bound `<input>`. Its overlays are the ones the vanilla picker uses, so popup positioning, the drag-to-dismiss bottom sheet, the modal, the focus trap and the animations are identical.

## `<Calendar>`: the always-visible panel

```tsx
<Calendar locale="en-US-gregorian" mode="range" months={2} />
```

It accepts only the panel options, so options that cannot take effect on a bare panel do not show up in autocomplete.

## Controlled or uncontrolled

Pass `defaultValue` for an uncontrolled component, or `value` with `onChange` for a controlled one:

```tsx
const [value, setValue] = useState<PickerValueInput>('2026-03-21')

<DatePicker value={value} onChange={({ value }) => setValue(value)} />
```

The value you receive can go straight back in, with no conversion. A literal `mode` narrows both `value` and the `onChange` payload.

## Events

Every core event is a callback prop named `on` plus the event name in PascalCase:

| Core event | React prop |
|---|---|
| `change` | `onChange` |
| `select` | `onSelect` |
| `range:complete` | `onRangeComplete` |
| `view:change` | `onViewChange` |
| `error` | `onError` |
| (open and close) | `onOpenChange` |

```tsx
<DatePicker locale="fa-IR" mode="range" months={2}
            onRangeComplete={({ start, end }) => book(start.iso, end.iso)} />
```

See [Events](/api/events) for the full list and payloads.

## `useDatePicker`: headless

Render the panel yourself and keep the state in Khorshid:

```tsx
const { core, state, value, actions } = useDatePicker({ mode: 'range' })

value.start        // narrowed by the literal mode, no value.mode check needed
actions.goToToday()
```

`locale`, `mode` and a controlled `value` stay in sync; other options are read once. `usePickerState(core)` and `usePickerEvent(core, event, handler)` track any core you already have.

## Sharing one core

Pass `core` and several components render one picker, for example a field and a large inline panel:

```tsx
const { core } = useDatePicker({ mode: 'range' })

<DatePicker core={core} />
<Calendar core={core} months={2} />
```

`<DatePickerProvider>` and `useDatePickerContext()` pass the core down the tree implicitly.

## Date field

`<DateField>` is the segmented [date field](/guide/date-field), with the same option names as `createDateField`:

```tsx
import { DateField } from 'khorshid/react'

export function Birthday() {
  const [value, setValue] = useState(null)
  return (
    <DateField
      locale="fa-IR"
      label="تاریخ تولد"
      value={value}
      onChange={({ value }) => setValue(value)}
    />
  )
}
```

`useDateField` is its headless half: render `state.segments` yourself.

**Related:** [React API](/react/api) · [Options](/api/options) · [Events](/api/events) · [The Headless Core](/core/)
