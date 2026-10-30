# The Headless Core

The headless core is the engine behind every Khorshid UI: it has no DOM code and no runtime dependencies. Build on it directly when the ready-made picker is not what you need, for example for canvas, a terminal, a native shell or your own design system.

## Installation

```bash
npm install khorshid
```

```js
import { createPicker, createDateFieldCore, PlainDate } from 'khorshid/headless'
```

`khorshid/headless` has no DOM APIs, so it also runs on the server, in workers and in native shells. The same code is published as `@khorshid-js/core` if you prefer the scoped package.

## The model

`createPicker(options)` from `khorshid/headless` returns a `PickerCore`: state, a re-render signal, typed events and derived render models. A UI is a render loop that maps those models to elements.

```js
import { createPicker } from 'khorshid/headless'

const picker = createPicker({ locale: 'fa-IR', mode: 'single' })

function render() {
  const grid = picker.getGrid() // CalendarGrid for pane 0

  header.textContent = grid.title.label     // e.g. 'فروردین ۱۴۰۵'
  renderWeekdayRow(grid.weekdays)           // { min, short, long, weekend }

  for (const week of grid.weeks) {          // DayCell[][], rows of 7
    for (const cell of week) {
      // cell.label is already in locale digits, and every flag is precomputed:
      // today, selected, rangeStart, rangeEnd, inRange, preview,
      // disabled, outside, weekend, focused
      const el = renderDay(cell)
      el.onclick = () => picker.select(cell.date)
      el.onmouseenter = () => picker.hover(cell.date)
    }
  }
}

const unsubscribe = picker.subscribe(render) // called after every state change
render()

prevButton.onclick = () => picker.prev()
nextButton.onclick = () => picker.next()

picker.on('change', ({ value, source }) => console.log(value, source))
```

The built-in vanilla, React and Vue renderers are built the same way. Every flag a cell needs (`selected`, `inRange`, `disabled`, `today`, `focused`, …) comes precomputed from the core, so the renderer never does date math. Call `picker.destroy()` when the UI goes away.

## Framework adapters

The same loop works in any framework. In React:

```jsx
const picker = useMemo(() => createPicker(options), [])
const state = useSyncExternalStore(picker.subscribe, picker.getState)
// map picker.getGrid() to components; call picker.select(cell.date) on click
```

In Vue, mirror `subscribe` into a `shallowRef` and unsubscribe in `onScopeDispose`. You rarely need to write this yourself: `khorshid/react` and `khorshid/vue` ship `useDatePicker`, which does exactly this. See [React](/react/) and [Vue](/vue/).

## Render models

| Method | Returns |
|---|---|
| `getGrid()` | `CalendarGrid` for pane 0: `title`, `weekdays`, `weeks: DayCell[][]` |
| `getGrid(n)` | The `n`-th pane when `months > 1` |
| `getTitle(n?)` | The header title for the current view |
| `getWeekdayLabels()` | The seven weekday headers, in display order |
| `getMonthCells()` | Cells for the months view |
| `getYearCells()` | Cells for the years view (a page of 12 years) |
| `getYearRangeLabel()` | The label of that page, e.g. `۱۴۰۴ – ۱۴۱۵` |
| `getShortcuts()` | The [shortcut](/guide/shortcuts-and-limits) chips, resolved for the current state |

## Navigation and views

```js
picker.next(); picker.prev()                   // page the current view
picker.goTo({ year: 1405, month: 7, day: 1 })  // jump to a date (parts are read in the active calendar)
picker.goToToday()
picker.setView('months')                       // 'days' | 'months' | 'years'
picker.selectMonth(7); picker.selectYear(1405)
```

## Keyboard helpers

The core owns focus logic, so every UI gets the same keyboard behavior:

```js
picker.focusDate(date)
picker.moveFocus('day', 1)    // 'day' | 'week' | 'month' | 'year', ±n
picker.focusWeekEdge('start') // 'start' | 'end'
picker.selectFocused()
```

## Text input and output

```js
picker.format(date)        // a string in the active locale and format
picker.parse(text)         // PlainDate | null
picker.handleInput(text)   // run the input mask and commit a complete date
picker.submitInput(text)   // commit free text on Enter/blur (see Natural Input)
picker.getInputValue()     // the current value formatted for a text field
picker.getFormValue()      // the current value serialized for a form
picker.toDateValue(date)   // expand any date into the full DateValue payload
```

## Subscriptions and events

- **`subscribe(fn)`** is a low-level re-render signal. It fires after every state change and returns an unsubscribe function. Use it to drive your render loop.
- **`on(event, handler)`**, `once` and `onAny` are typed [events](/api/events) such as `change`, `select` and `range:complete`. Use them for side effects like analytics or form wiring.

The [PickerCore API](/core/picker-core) lists the complete surface.

**Related:** [PlainDate](/core/plain-date) · [Plugins](/guide/plugins) · [React](/react/) · [Vue](/vue/)
