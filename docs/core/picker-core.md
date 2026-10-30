# PickerCore

`createPicker(options?)` returns a `PickerCore`, the headless engine every picker runs on. It holds the state, applies the rules and builds render models, and it never touches the DOM. See [The Headless Core](/core/) for the mental model.

```ts
import { createPicker } from 'khorshid/headless'   // or '@khorshid-js/core'

function createPicker(options?: PickerOptions): PickerCore
```

It takes the [`PickerOptions`](/api/options#pickeroptions) (no presentation options). A UI picker exposes its core as `picker.core`.

## State

| Member | Signature | Description |
|---|---|---|
| `getState` | `() => Readonly<PickerState>` | A snapshot of the current state. |
| `subscribe` | `(listener: (state) => void) => Unsubscribe` | Called after every state change. This is the re-render signal. |

`PickerState`:

| Field | Type | Description |
|---|---|---|
| `view` | `'days' \| 'months' \| 'years'` | The visible view. |
| `viewDate` | `DateParts` | Year and month of the first pane, in the active calendar. `day` is always `1`. |
| `selected` | `PlainDate[]` | The selection: 0 or 1 dates in single mode, 0 to 2 (sorted) in range mode, any number in multiple mode. |
| `hovered` | `PlainDate \| null` | The hovered day, used for the range preview. |
| `focused` | `PlainDate` | The keyboard-focused day. Always a valid date. |
| `open` | `boolean` | Whether the picker is open. |
| `time` | `TimeValue \| null` | The time of day when `time` is on, else `null`. |

## Events

| Member | Signature | Description |
|---|---|---|
| `on` | `(event, handler) => Unsubscribe` | Subscribe to a typed [event](/api/events). |
| `once` | `(event, handler) => Unsubscribe` | Subscribe for one call only. |
| `off` | `(event, handler) => void` | Remove a handler. |
| `onAny` | `(handler: (event, payload) => void) => Unsubscribe` | Listen to every event. |

## Configuration

| Member | Signature | Description |
|---|---|---|
| `getOptions` | `() => Readonly<PickerOptions>` | The options, with `mode`, `months`, `fixedWeeks` and `autoClose` resolved. |
| `getLocale` | `() => Locale` | The active locale. |
| `setLocale` | `(locale: string \| Locale) => void` | Switch locale. Emits `locale:change`, and `calendar:change` when the calendar changes. |
| `getCalendar` | `() => CalendarSystem` | The active calendar system. |
| `setCalendar` | `(calendar: CalendarId) => void` | Switch to a registered locale with the same language and that calendar, preferring the same region (`fa-AF` → `fa-AF-gregorian`). Emits `error` with code `no-locale-variant` when there is none. |
| `getMode` | `() => PickerMode` | The selection mode. |
| `setMode` | `(mode: PickerMode) => void` | Switch mode. Single keeps the first date, range the two earliest; `change` fires when that trims the value. |
| `getUnit` | `() => SelectionUnit` | The [selection unit](/guide/selection-units), fixed at construction. |
| `getSecondaryCalendar` | `() => CalendarId \| null` | The resolved [secondary calendar](/guide/secondary-calendar), or `null` when off. |
| `getPlugin` | `<P>(name: string) => P \| undefined` | The registered plugin with that `name`, for reaching its own API (for example `getPlugin<HolidaysPlugin>('holidays')`). |

## Selection

| Member | Signature | Description |
|---|---|---|
| `select` | `(date: DateInput) => void` | Pick a day as a click would, following the mode: replace (single), start or finish (range), toggle (multiple). A disabled or out-of-range date emits `error` instead. |
| `setValue` | `(value: PickerValueInput) => void` | Replace the whole value. It is not validated against the limits. Emits `change` with source `'api'` when the selection changes. |
| `getValue` | `() => PickerValue` | The current value. |
| `clear` | `() => void` | Clear the value. Emits `clear`, then `change`. |
| `hover` | `(date: DateInput \| null) => void` | Set the hovered day (drives the range preview). |

## Time

Present on every core; they do nothing when `time` is off.

| Member | Signature | Description |
|---|---|---|
| `getTime` | `() => TimeValue \| null` | The current time, or `null` when the time picker is off. |
| `setTime` | `(time: Partial<TimeValue>) => void` | Merge a partial time, clamped and snapped to the steps. Emits `time:change`, and `change` with source `'time'` when a date is selected. |

## Navigation and views

| Member | Signature | Description |
|---|---|---|
| `next` / `prev` | `() => void` | Page the current view: a month in the days view, a year in the months view, 12 years in the years view. |
| `goTo` | `(date: DateInput) => void` | Show the month containing a date and focus it (clamped to `min` and `max`). |
| `goToToday` | `() => void` | `goTo(today())`. Does not select. |
| `setView` | `(view: PickerView) => void` | Switch to `'days'`, `'months'` or `'years'`. |
| `selectMonth` | `(month: number) => void` | Choose a month in the months view and drill down to days. With `unit: 'month'` it commits the pick. |
| `selectYear` | `(year: number) => void` | Choose a year in the years view and drill down to months. With `unit: 'year'` it commits the pick. |

## Open state

The core only keeps the flag; UI layers mount and animate overlays around it.

| Member | Signature | Description |
|---|---|---|
| `open` | `() => void` | Set `open` and emit `open`. |
| `close` | `() => void` | Clear `open` and emit `close`. |
| `toggle` | `() => void` | Open if closed, close if open. |

## Keyboard focus

| Member | Signature | Description |
|---|---|---|
| `focusDate` | `(date: DateInput) => void` | Move focus to a date, revealing its month. |
| `moveFocus` | `(unit: 'day' \| 'week' \| 'month' \| 'year', delta: number) => void` | Move focus by a number of units. |
| `focusWeekEdge` | `(edge: 'start' \| 'end') => void` | Focus the first or last day of the focused week. |
| `selectFocused` | `() => void` | Select the focused day (Enter or Space). |

## Shortcuts

| Member | Signature | Description |
|---|---|---|
| `getShortcuts` | `() => ShortcutItem[]` | The configured [shortcuts](/guide/shortcuts-and-limits), resolved for the current locale and state: `{ id, label, active, disabled }`. |
| `applyShortcut` | `(id: string) => void` | Apply one: set the value (`change` with source `'shortcut'`), reveal it, emit `shortcut`, and close on a complete value when `autoClose` is on. A disabled or unknown id does nothing. |

## Render models

| Member | Signature | Description |
|---|---|---|
| `getGrid` | `(offset?: number) => CalendarGrid` | The days grid of pane `offset` (default `0`). |
| `getTitle` | `(offset?: number) => GridTitle` | The header title for the current view. |
| `getWeekdayLabels` | `() => WeekdayLabel[]` | Weekday headers in display order. |
| `getMonthCells` | `() => MonthCell[]` | The 12 cells of the months view. |
| `getYearCells` | `() => YearCell[]` | The 12 cells of the years view (a page containing `viewDate.year`). |
| `getYearRangeLabel` | `() => string` | The range label of the years view, such as `۱۴۰۰ – ۱۴۱۱`. |
| `isDisabled` | `(date: DateInput) => boolean` | Whether a date is outside `min`/`max` or matched by `disabledDates`. |
| `today` | `() => PlainDate` | Today, in the active calendar. |
| `toDateValue` | `(date: DateInput) => DateValue` | Expand a date into the full [`DateValue`](/api/events#datevalue). |

`CalendarGrid` is `{ year, month, title, weekdays, weeks }`, where `weeks` is rows of 7 `DayCell`s (6 rows with `fixedWeeks`).

`DayCell`:

| Field | Type | Description |
|---|---|---|
| `date` | `PlainDate` | The day. |
| `parts` | `DateParts` | Year, month and day in the active calendar. |
| `iso` | `string` | Gregorian `YYYY-MM-DD`; a stable key. |
| `label` | `string` | The day number in locale digits. |
| `weekday` | `WeekDay` | `0` = Sunday … `6` = Saturday. |
| `today`, `selected`, `focused`, `weekend` | `boolean` | State flags. |
| `rangeStart`, `rangeEnd`, `inRange` | `boolean` | Range and period ends, and the days strictly between. |
| `preview` | `boolean` | Between the range start and the hovered day while the end is picked. |
| `disabled` | `boolean` | Cannot be picked. |
| `disabledReason` | `string?` | Why, when `disabledDates` gave a [reason](/guide/shortcuts-and-limits#disabled-dates-with-a-reason). |
| `outside` | `boolean` | Belongs to the previous or next month. |
| `unsupported` | `boolean?` | The slot falls outside the calendar's supported range. Render it blank. |
| `marks` | `DayMark[]` | Marks from plugins such as holidays; empty when none. |
| `secondary` | `SecondaryDay?` | The same day in the secondary calendar: `{ calendar, parts, label, monthStart, monthLabel, formatted }`. |

The other models:

| Type | Fields |
|---|---|
| `GridTitle` | `month`, `year`, `label` (per `locale.formats.monthHeader`), `secondary?` (the secondary months the pane spans) |
| `WeekdayLabel` | `index`, `long`, `short`, `min`, `weekend` |
| `MonthCell` | `month`, `label`, `shortLabel`, `selected`, `rangeStart`, `rangeEnd`, `inRange`, `current`, `disabled` |
| `YearCell` | `year`, `label`, `selected`, `rangeStart`, `rangeEnd`, `inRange`, `current`, `disabled` |

On a month or year cell, `selected` means "part of the value" with `unit: 'month'` or `'year'`, and "the month or year on display" otherwise. `current` means it contains today.

## Text input and output

| Member | Signature | Description |
|---|---|---|
| `format` | `(date: DateInput, pattern?: FormatPattern) => string` | Format a date in the active locale. The pattern defaults to the display format. |
| `parse` | `(text: string) => PlainDate \| null` | Parse text with the display format. |
| `handleInput` | `(raw: string, caret?: number \| null) => MaskResult` | Run a keystroke through the mask (or the custom `mask`). Emits `input`, and commits a complete, valid, allowed date (`change` with source `'input'`). With `naturalInput`, free text passes through untouched. |
| `submitInput` | `(text: string) => boolean` | Commit text as a field does on Enter or blur: the display format first, then [natural language](/guide/natural-input) with `naturalInput`. In range mode `A تا B`, `A to B` or `A – B` sets both ends. Returns `true` when a value was committed; emits `error` when the text is refused. |
| `getInputValue` | `() => string` | The current value as field text, with the time appended when `time` is on. |
| `getFormValue` | `() => string` | The current value serialized with `toFormValue`. The `formValue` option is a UI option, so the core does not use it. |

## Lifecycle

| Member | Signature | Description |
|---|---|---|
| `destroy` | `() => void` | Run plugin cleanups in reverse order and remove every listener and subscriber. |

## Example

```js
import { createPicker } from 'khorshid/headless'

const picker = createPicker({ locale: 'fa-IR', mode: 'range' })

picker.subscribe(() => render(picker.getGrid()))
picker.on('range:complete', ({ start, end }) => {
  console.log(start.formatted, '→', end.formatted)
})

picker.next()
picker.select({ year: 1405, month: 1, day: 1, calendar: 'jalali' })
```
