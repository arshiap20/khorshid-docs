# Options

Every option, its type, its default and what it does. The same names and defaults apply to `createDatePicker`, the React and Vue components, and `<khorshid-datepicker>` (as kebab-case attributes).

## Option layers {#pickeroptions}

The options are defined once in `@khorshid-js/core`, in three nested interfaces. Defaults come from one table, `UI_DEFAULTS`, so no layer can disagree with another.

| Interface | Adds | Accepted by |
|---|---|---|
| `PickerOptions` | Behavior: locale, mode, value, limits, shortcuts, input text, time, plugins | `createPicker()` (headless), and everything below |
| `PanelUIOptions` | Presentation of the panel, and forms | `<Calendar>` (React, Vue), and everything below |
| `UIOptions` | How and where the picker opens | `createDatePicker()`, `<DatePicker>` (React, Vue), `<khorshid-datepicker>` |

`DatePickerOptions` (vanilla) is `UIOptions` plus one `on<Event>` callback per event. The sections below say which interface each option belongs to.

::: info `DateInput`
Anything date-like: a `PlainDate`, `{ year, month, day, calendar? }` parts, a native `Date` (read as local year, month and day), or a Gregorian ISO string `'YYYY-MM-DD'`. Parts without a `calendar` are read in the picker's active calendar.
:::

## Core

`PickerOptions`.

| Option | Type | Default | Description |
|---|---|---|---|
| `locale` | `string \| Locale` | `'fa-IR'` | Locale key or object. It sets the language, the calendar, the direction and the digits. See [Calendars & Locales](/guide/calendars-and-locales). |
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode. A literal `mode` narrows the value type. |
| `value` | `PickerValueInput` | none | Initial value: a date, an array of dates, `{ start, end }`, or a `PickerValue` from `getValue()`. |
| `months` | `number` | `1` | Month panes shown side by side. |
| `fixedWeeks` | `boolean` | `true` | Always render 6 week rows, so the panel height does not jump. |
| `weekStart` | `WeekDay` (`0`–`6`) | the locale's | First day of the week (`0` = Sunday … `6` = Saturday). |
| `weekdays` | `string[]` (7 items) | the locale's | Weekday column labels, indexed by weekday (`0` = Sunday), not by display order. |
| `secondaryCalendar` | `boolean \| CalendarId` | off | Show a second calendar's day under each day and its months under the title. `true` picks the natural partner (Jalali and Gregorian pair up; Hijri pairs with Jalali in Persian and Pashto, else Gregorian). See [Secondary Calendar](/guide/secondary-calendar). |
| `autoClose` | `boolean` | `true` | Close after a completed pick: on select in single mode, on the range end in range mode. Multiple mode never closes on its own. |
| `plugins` | `PickerPlugin[]` | none | Plugins such as [holidays](/guide/holidays), set up in order and torn down on `destroy()`. See [Plugins](/guide/plugins). |

## Selection and limits

`PickerOptions`.

| Option | Type | Default | Description |
|---|---|---|---|
| `unit` | `'day' \| 'week' \| 'month' \| 'year'` | `'day'` | What one pick selects. A value stores the period's first day, and `DateValue.end` holds the last. `'month'` and `'year'` open on the months or years view. Fixed at construction. See [Selection Units](/guide/selection-units). |
| `min` | `DateInput` | none | Earliest selectable date. |
| `max` | `DateInput` | none | Latest selectable date. |
| `disabledDates` | `DisabledDates` | none | Dates that cannot be picked: a list of dates or `{ date, reason }` entries, or a predicate `(date: PlainDate) => boolean \| string \| null \| undefined`. A reason becomes the day's tooltip, joins its accessible name, and rides on `error.reason`. See [disabled dates with a reason](/guide/shortcuts-and-limits#disabled-dates-with-a-reason). |
| `minDays` | `number` | none | Range mode: the shortest range in days, counting both ends (two hotel nights = 3). Days that would break it are disabled while the end is picked. |
| `maxDays` | `number` | none | Range mode: the longest range in days, counting both ends. |
| `shortcuts` | `boolean \| (ShortcutPreset \| Shortcut)[]` | off | A row of quick-pick chips. `true` picks a set that fits the mode and unit. See [Shortcuts](/guide/shortcuts-and-limits). |

With `shortcuts: true` you get:

| Mode / unit | Presets |
|---|---|
| single | `today`, `yesterday`, `tomorrow` |
| range | `today`, `last7Days`, `last30Days`, `thisWeek`, `thisMonth`, `lastMonth`, `thisYear` |
| multiple | `today`, `thisWeek` |
| `unit: 'week'` | `thisWeek`, `lastWeek`, `nextWeek` |
| `unit: 'month'` | `thisMonth`, `lastMonth`, `nextMonth` |
| `unit: 'year'` | `thisYear`, `lastYear` |

```ts
type ShortcutPreset =
  | 'today' | 'yesterday' | 'tomorrow'
  | 'thisWeek' | 'lastWeek' | 'nextWeek'
  | 'last7Days' | 'last30Days' | 'next7Days'
  | 'thisMonth' | 'lastMonth' | 'nextMonth'
  | 'thisYear' | 'lastYear'

interface Shortcut {
  id: string          // the `shortcut` event payload and data-shortcut
  label: string
  value: PickerValueInput | ((ctx: ShortcutContext) => PickerValueInput)
}

interface ShortcutContext {
  today: PlainDate    // in the active calendar
  calendar: CalendarId
  locale: Locale
  weekStart: WeekDay
  mode: PickerMode
  unit: SelectionUnit
}
```

## Input and text

`format`, `mask` and `naturalInput` are `PickerOptions`; `inputMask` is a `UIOptions` option.

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `FormatPattern` | `locale.formats.display` | Display format of values and of the field. Date tokens only; see [Format Tokens](/api/format-tokens). |
| `mask` | `MaskFn` | the built-in smart mask | Replace the input mask entirely. See [custom mask function](/guide/input-mask#custom-mask-function). |
| `naturalInput` | `boolean` | `false` | Accept free text such as `فردا`, `next friday` or `+2w`, committed on Enter or blur. With `unit: 'day'` the field stays editable in every mode. See [Natural Input](/guide/natural-input). |
| `inputMask` | `boolean` | `true` | The smart mask on the bound field. Applies in single mode with `unit: 'day'`; in other modes the field is read-only text unless `naturalInput` is on. |

## Time

`PickerOptions`.

| Option | Type | Default | Description |
|---|---|---|---|
| `time` | `boolean \| TimeOptions` | off | Add a time-of-day picker. `true` means a 24-hour `HH:mm` clock. The selected date's `DateValue.time` carries the time, and the field shows it after the date. |

`TimeOptions`:

| Field | Type | Default | Description |
|---|---|---|---|
| `minuteStep` | `number` | `1` | Minute granularity for stepping and snapping. |
| `secondStep` | `number` | `1` | Second granularity. |
| `showSeconds` | `boolean` | `false` | Show a seconds field. |
| `use12Hour` | `boolean` | `false` | 12-hour clock with an AM/PM toggle. |
| `defaultTime` | `Partial<TimeValue>` | `00:00:00` | Time applied to a freshly picked date. |

## Panel presentation

`PanelUIOptions`. A bare `<Calendar>` accepts all of these.

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color scheme. `'auto'` follows `prefers-color-scheme`. |
| `vars` | `Record<string, string>` | none | Per-instance CSS variables. Bare keys get the `--sdp-` prefix (`accent` → `--sdp-accent`). Applied to the panel and to every overlay. See [Theming Tokens](/api/theming-tokens). |
| `readOnly` | `boolean` | `false` | Show the value but refuse user changes. The field is not editable and never opens; an inline panel is inert. |
| `animate` | `boolean` | `true` | Animations. `prefers-reduced-motion` always wins. |
| `showToday` | `boolean` | `true` | Footer button that jumps to today (it does not select it). |
| `showClear` | `boolean` | `true` | Footer button that clears the value. |
| `confirm` | `boolean \| 'auto'` | `'auto'` | Footer button that closes the picker. `'auto'` shows it only when the panel is a sheet or a modal, re-checked when the breakpoint is crossed. |
| `outsideDays` | `'interactive' \| 'visible' \| 'hidden'` | `'interactive'` | Days of the previous and next month: selectable, greyed and inert, or blank. |
| `highlightToday` | `boolean` | `true` | Ring today's cell. With `false` the `--today` class stays; only the built-in ring goes. |
| `yearPicker` | `boolean` | `true` | Make the header year a button that opens the years view. With `false` it is plain text. |
| `classes` | `Partial<Record<SlotName, string>>` | none | Extra class names per part. |
| `renderDay` | `(cell: DayCell) => Node` | none | Replace a day cell's content. Return nothing to keep the default. |
| `renderWeekday` | `(label: WeekdayLabel) => Node` | none | Replace a weekday header's content. To change only the text, use `weekdays`. |
| `renderFooter` | `(ctx: FooterContext) => Node` | none | Custom content below the footer buttons (`.sdp__note`). `ctx` is `{ value, view }`. |
| `dayProps` | `(cell: DayCell) => DayProps \| null \| void` | none | Per-day `className`, `title` and `attrs`. Styling only; disable days with `disabledDates`. |
| `icons` | `{ prev?, next? }` | chevrons | Navigation icons: a node, or `(dir: 'prev' \| 'next') => node`. |

`Node` is what the layer renders: a string or an `HTMLElement` in vanilla, a `ReactNode` in React, a `VNodeChild` in Vue. In vanilla, a string from `renderDay` or `renderWeekday` is set as text, while a string from `renderFooter` or `icons` is parsed as HTML.

`SlotName` is one of `root`, `header`, `title`, `nav`, `grid`, `day`, `weekday`, `footer`, `input`, `overlay`, `sheet`, `popup`.

## Display and overlay

`UIOptions`. These describe opening, so `<Calendar>` does not take them.

| Option | Type | Default | Description |
|---|---|---|---|
| `display` | `'auto' \| 'inline' \| 'popup' \| 'sheet' \| 'modal'` | `'auto'` | The form the picker takes. See the table below. |
| `mobileBreakpoint` | `number \| false` | `640` | Width in px at or below which `display: 'auto'` becomes a bottom sheet. `false` = never. |
| `position` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'auto'` | Popup placement. `'auto'` flips and shifts to stay in the viewport. |
| `container` | `HTMLElement` | `document.body` | Where the overlay is portaled. |
| `zIndex` | `number` | `1000` | Stacking order of the overlay. |

### `display` is independent of the target

| Value | On an `<input>` | On any other element |
|---|---|---|
| `'auto'` (default) | Popup, or a bottom sheet at or below `mobileBreakpoint` | Inline panel |
| `'inline'` | The field stays, with an always-open panel after it | Inline panel |
| `'popup'` / `'sheet'` / `'modal'` | That overlay | That overlay, anchored to the element and toggled by clicking it |

::: info `mode` vs `display`
`mode` is the kind of selection (`single`, `range`, `multiple`). `display` is the form the picker takes. They are independent.
:::

## Forms

`PanelUIOptions`. See [Forms](/guide/forms).

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | none | Submit the value with the surrounding `<form>` under this name. Adds a hidden `input.sdp-form-value`. |
| `required` | `boolean` | `false` | Native constraint validation: the form will not submit until a value is chosen (a range needs both ends). |
| `formValue` | `(value: PickerValue) => string` | `toFormValue` | Serialize the value for the form. The default gives ISO `YYYY-MM-DD` (plus `THH:mm:ss` with time), a range as `start/end`, multiple dates comma-joined, and week, month or year picks as intervals. |

## Events as options

Every option bag also takes one callback per [event](/api/events), named `on` plus the event in PascalCase. Each receives the event's payload object.

| Callback | Event |
|---|---|
| `onChange` | `change` |
| `onSelect` | `select` |
| `onClear` | `clear` |
| `onRangeStart` | `range:start` |
| `onRangeComplete` | `range:complete` |
| `onOpen` / `onClose` | `open` / `close` |
| `onOpenChange` | `open` and `close` merged; receives `true` or `false` |
| `onViewChange` | `view:change` |
| `onMonthChange` | `month:change` |
| `onYearChange` | `year:change` |
| `onLocaleChange` | `locale:change` |
| `onCalendarChange` | `calendar:change` |
| `onTimeChange` | `time:change` |
| `onShortcut` | `shortcut` |
| `onInput` | `input` |
| `onError` | `error` |

## Example

```js
createDatePicker('#stay', {
  // Core, selection
  locale: 'fa-IR',
  mode: 'range',
  months: 2,
  min: '2026-03-21',
  disabledDates: (date) => (date.weekday === 5 ? 'جمعه‌ها تعطیل است' : false),
  minDays: 2,
  shortcuts: true,
  secondaryCalendar: true,
  format: 'D MMMM YYYY',

  // Presentation, display, forms
  vars: { accent: '#0d9488', radius: '12px' },
  position: 'bottom-start',
  name: 'stay',
  required: true,

  // Events
  onRangeComplete: ({ start, end }) => console.log(start.iso, end.iso),
})
```
