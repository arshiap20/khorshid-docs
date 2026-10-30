# Plugins

A plugin extends a picker without forking it: it can run side effects and decorate day cells with marks that every UI layer renders. Read this page to write your own plugin; the official [holidays plugin](./holidays) is built on the same contract.

## How plugins work

A plugin is a plain object with optional hooks. Pass plugins in the `plugins` option. Each one runs `setup` once against the live picker, and its `decorateDay` runs for every rendered day. The core makes no assumptions about what a plugin does, and a hook that throws is reported and skipped, so one plugin cannot break the picker.

```js
import { createDatePicker } from 'khorshid'

const picker = createDatePicker('#date', {
  locale: 'fa-IR',
  plugins: [myPlugin],
})

picker.core.getPlugin('my-plugin') // reach a plugin's public API later
```

The option is part of the core, so `createPicker` from `khorshid/headless` and the React and Vue components accept it too.

## The contract

```ts
interface PickerPlugin {
  readonly name: string
  /** Called once when the picker is created. */
  setup?(ctx: PluginContext): void
  /** Contribute marks to a day cell. Called for every rendered day, so keep it cheap. */
  decorateDay?(day: DayInfo): DayMark | DayMark[] | null | void
}

interface PluginContext {
  picker: PickerCore              // the live picker
  refresh(): void                 // decorate and re-render again (call after async data arrives)
  onCleanup(fn: () => void): void // run (in reverse order) on destroy()
}

interface DayInfo {
  date: PlainDate
  iso: string        // Gregorian 'YYYY-MM-DD', the stable cross-calendar key
  parts: DateParts   // parts in the active calendar
  weekday: WeekDay
  outside: boolean   // belongs to the previous or next month
}
```

## Day marks

`decorateDay` returns marks: abstract tags with no DOM in them, which UI layers turn into visuals. They appear on `DayCell.marks`, which is always present and empty when nothing decorates the day.

```ts
interface DayMark {
  type: string    // kebab-case category, e.g. 'holiday'
  label?: string  // tooltip and screen-reader text
  source?: string // the plugin's name, filled in by the core
  data?: unknown  // any payload
}
```

`DayInfo.iso` is always the Gregorian ISO date, a key that does not change when the calendar or locale changes. A holiday stored in Gregorian terms therefore lands on the right day of a Jalali grid, and marks stay in place after `setCalendar`.

A minimal plugin that marks the 25th of every month in the active calendar:

```js
const payday = {
  name: 'payday',
  decorateDay: (day) =>
    day.parts.day === 25 ? { type: 'payday', label: 'Payday' } : null,
}

createDatePicker('#date', { locale: 'fa-IR', plugins: [payday] })
```

## Async data and `refresh`

`setup` receives `ctx.refresh()`. Load data whenever you need it (often in `setup`, and again on navigation events), store it, then call `refresh()` to run decoration again and re-render. A factory function keeps the data private to each plugin instance:

```js
function eventsPlugin() {
  let byIso = {}

  return {
    name: 'events',
    setup(ctx) {
      const load = async () => {
        byIso = await fetch('/api/events').then((r) => r.json())
        ctx.refresh() // re-render with the new data
      }
      ctx.onCleanup(ctx.picker.on('month:change', load))
      load()
    },
    decorateDay: (day) =>
      byIso[day.iso] ? { type: 'event', label: byIso[day.iso].title } : null,
  }
}

createDatePicker('#date', { plugins: [eventsPlugin()] })
```

## How marks are rendered

The built-in renderers (vanilla, React and Vue) never special-case a mark type. A decorated cell gets:

- `.sdp__day--marked`, plus one `.sdp__day--mark-<type>` per distinct type (for example `.sdp__day--mark-holiday`);
- a dot strip, `.sdp__day-marks`, with one `.sdp__day-mark.sdp__day-mark--<type>` per mark;
- the mark labels added to the cell's `title` and `aria-label`, so screen readers announce them.

Style your own mark type with CSS alone:

```css
.sdp__day--mark-event .sdp__day-num { color: #7c3aed; }
.sdp__day-mark--event { background: #7c3aed; }
```

## Lifecycle

- **Setup order.** Plugins are set up in the order you list them, against the fully built picker.
- **Cleanup.** `ctx.onCleanup(fn)` callbacks run in reverse order when the picker is destroyed.
- **Isolation.** A hook that throws is reported to the console and skipped; the picker and the other plugins keep working.
- **Retrieval.** `core.getPlugin<T>(name)` returns the registered plugin, typed, so a plugin can expose a public API (see the holidays read API).

**Related:** [Holidays](./holidays) · [The Headless Core](/core/) · [Theming](./theming)
