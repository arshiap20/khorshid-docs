# PlainDate and Utilities

Reference for `PlainDate`, the immutable calendar-aware date, and for the helper functions `@khorshid-js/core` exports: calendars, locales, digits, formatting, parsing, values and time. Everything here is DOM-free and available from `khorshid/headless`. For an introduction, see the [PlainDate guide](/core/plain-date).

## `PlainDate`

A date with no time and no timezone. Its canonical form is the Julian Day Number, so dates from different calendars compare and convert without loss.

```ts
new PlainDate(calendar: CalendarId, year: number, month: number, day: number)
```

The constructor throws a `RangeError` when the date does not exist in that calendar.

### Properties {#plaindate-properties}

| Property | Type | Description |
|---|---|---|
| `calendar` | `CalendarId` | `'jalali'`, `'gregorian'` or `'hijri'`. |
| `year`, `month`, `day` | `number` | The date in its calendar; `month` is 1-based. |
| `jdn` | `number` | Julian Day Number. |
| `weekday` | `WeekDay` | `0` = Sunday … `6` = Saturday. |
| `daysInMonth` | `number` | Length of the date's month. |
| `isLeapYear` | `boolean` | Whether the date's year is a leap year. |
| `system` | `CalendarSystem` | The calendar implementation. |

### Static methods {#plaindate-static-methods}

| Method | Signature | Description |
|---|---|---|
| `from` | `(input: DateInput, calendar?: CalendarId) => PlainDate` | Coerce any `DateInput`, converting to `calendar` when given. Parts without a `calendar` and ISO strings are read as Gregorian. Throws on an invalid input. |
| `fromJDN` | `(jdn: number, calendar: CalendarId) => PlainDate` | The date with that Julian Day Number. |
| `today` | `(calendar?: CalendarId) => PlainDate` | Today in the local timezone. The calendar defaults to `'gregorian'`. |
| `compare` | `(a: PlainDate, b: PlainDate) => -1 \| 0 \| 1` | A sort comparator. |

### Methods {#plaindate-methods}

Every method that returns a date returns a new `PlainDate`.

| Method | Signature | Description |
|---|---|---|
| `to` | `(calendar: CalendarId) => PlainDate` | The same day in another calendar. |
| `add` | `({ years?, months?, weeks?, days? }) => PlainDate` | Calendar arithmetic. Years and months clamp the day to the target month (31 Farvardin + 6 months = 30 Mehr); weeks and days are exact. Amounts must be integers, or it throws a `RangeError`. |
| `with` | `(parts: Partial<DateParts>) => PlainDate` | Replace year, month or day; the day is clamped to the month's length. |
| `startOfMonth` / `endOfMonth` | `() => PlainDate` | First / last day of the month. |
| `compare` | `(other: PlainDate) => number` | The difference in days (`this.jdn - other.jdn`). |
| `equals` | `(other: PlainDate) => boolean` | Same absolute day, whatever the calendars. |
| `isBefore` / `isAfter` | `(other: PlainDate) => boolean` | Strict order. |
| `isBetween` | `(start: PlainDate, end: PlainDate) => boolean` | Inclusive on both ends; the ends may come in either order. |
| `isSameMonth` | `(other: PlainDate) => boolean` | In the same month of this date's calendar. |
| `format` | `(pattern: FormatPattern, locale: Locale) => string` | Format with a [pattern](/api/format-tokens), in the locale's calendar. |
| `toDate` | `() => Date` | Native `Date` at local midnight. |
| `toISO` | `() => string` | Gregorian `YYYY-MM-DD`. |
| `toParts` | `() => DateParts` | `{ year, month, day }`. |
| `toString` | `() => string` | `'jalali:1405-01-01'`. |
| `toJSON` | `() => string` | Same as `toISO()`, so `JSON.stringify` gives ISO dates. |

## Calendars

| Export | Description |
|---|---|
| `jalali`, `gregorian`, `hijri` | The built-in `CalendarSystem`s. `hijri` is Umm al-Qura, 1300–1600 AH. |
| `getCalendar(id)` | The registered system for an id. |
| `registerCalendar(system)` | Register a system, replacing the one with the same `id`. |
| `createHijriCalendar({ variant?, adjustments? })` | A Hijri system: `variant` is `'umalqura'` (default) or `'civil'`; `adjustments` overrides month lengths, keyed `'YYYY-MM'` with `29` or `30`. Throws on an unknown variant or a malformed key. |

A `CalendarSystem` implements `id`, `toJDN(year, month, day)`, `fromJDN(jdn)`, `daysInMonth(year, month)`, `isLeapYear(year)` and `isValid(year, month, day)`.

## Locales

| Key | Export | Calendar | Language |
|---|---|---|---|
| `fa-IR` | `faIR` | Jalali | Persian (the default) |
| `fa-IR-gregorian` | `faIRGregorian` | Gregorian | Persian |
| `fa-IR-hijri` | `faIRHijri` | Hijri | Persian |
| `en-US` | `enUS` | Jalali | English |
| `en-US-gregorian` | `enUSGregorian` | Gregorian | English |
| `en-US-hijri` | `enUSHijri` | Hijri | English |
| `fa-AF` | `faAF` | Jalali | Dari |
| `fa-AF-gregorian` | `faAFGregorian` | Gregorian | Dari |
| `ps-AF` | `psAF` | Jalali | Pashto |

| Function | Description |
|---|---|
| `getLocale(key)` | The registered locale for a key. Throws on an unknown key. |
| `registerLocale(locale)` | Register a `Locale` under its `key`. See [registering a custom locale](/guide/calendars-and-locales#registering-a-custom-locale). |
| `getLocaleForCalendar(language, calendar, preferKey?)` | A registered locale with that language and calendar, or `null`. `preferKey` favors the same region. |
| `getRegisteredLocales()` | Every registered locale. |

## Digits

| Function | Description |
|---|---|
| `toLocaleDigits(text, digits)` | Replace ASCII digits with a 10-character digit set, such as `faIR.digits`. |
| `toLatinDigits(text)` | Persian and Arabic-Indic digits to ASCII. |
| `normalizeDigits(text)` | `toLatinDigits`, plus stripping bidi control characters. |

## Formatting and parsing

| Function | Description |
|---|---|
| `formatDate(date, pattern, locale)` | Format a `PlainDate`. |
| `parseDate(text, { locale, format?, calendar? })` | Parse numeric text into a `PlainDate`, or `null`. See [parsing rules](/api/format-tokens#parsing-rules). |
| `parseNaturalDate(text, { locale, today, weekStart? })` | Parse free text such as `فردا` or `next friday`, or `null`. Never throws. |
| `maskDateInput(raw, { locale, format?, calendar?, caret?, previous? })` | Run the smart input mask. Returns a `MaskResult`: `{ text, caret, parts, complete, valid }`. |
| `createDateValue(date, locale, pattern?)` | Build a `DateValue` from a `PlainDate`. |

## Values and forms

| Function | Description |
|---|---|
| `toFormValue(value)` | Serialize a `PickerValue` the way forms submit it: ISO dates, `THH:mm:ss` with time, `start/end` intervals, comma-joined lists, `''` when empty. |
| `isSingleValue`, `isRangeValue`, `isMultipleValue` | Narrow a `PickerValue` by mode. |
| `isPickerValue(value)` | Whether something is a `PickerValue` as `getValue()` returns it. |
| `periodStart(date, unit, weekStart)` / `periodEnd(date, unit, weekStart)` | First / last day of the week, month or year containing a date. |

## Time

| Function | Description |
|---|---|
| `formatTime(time, pattern, digits, meridiem?)` | Format a `TimeValue` with the [time tokens](/api/format-tokens#time-tokens). |
| `normalizeTime(partial)` | Fill and clamp a partial time. |
| `resolveTimeOptions(time)` | `true` or `TimeOptions` to fully resolved options; `null` when off. |
| `snapTime(time, resolved)` | Snap minutes and seconds down to the steps. |
| `stepTime(time, unit, delta, resolved)` | Step one field with wrap-around. |
| `to12Hour(hour)` / `from12Hour(hour12, meridiem)` | Convert between 24-hour and 12-hour forms. |
| `timeEquals(a, b)` | Compare two times. |
| `defaultTimePattern(resolved)` | `'HH:mm'` or `'HH:mm:ss'`. |

## Shortcuts

| Export | Description |
|---|---|
| `defaultShortcutPresets(mode, unit)` | The presets `shortcuts: true` uses. |
| `presetSpan(preset, context)` | The `{ start, end }` a preset covers, in the active calendar. |
| `SHORTCUT_LABELS_EN` | English labels of the presets. |

## For renderer authors

These keep a custom renderer in step with the built-in ones.

| Export | Description |
|---|---|
| `UI_DEFAULTS` | The default value of every UI option. |
| `PICKER_EVENTS`, `EVENT_HANDLER_NAMES`, `EVENT_EMIT_NAMES` | Every event, its callback name and its kebab name. |
| `eventHandlerName(event)`, `eventEmitName(event)` | `'range:complete'` to `'onRangeComplete'` / `'range-complete'`. |
| `bindEventHandlers(core, getHandlers)` | Wire `on<Event>` callbacks (and `onOpenChange`) to a core. Returns an unsubscribe. |
| `splitEventHandlers(props)` | Split a props bag into handlers and options. |
| `REOPEN_SUPPRESS_MS` | How long focus returning to a field after close is ignored (250 ms). |
| `buildPaneModels`, `dayClassName`, `dayLabels`, `periodCellClassName`, `rootClassName`, `shortcutClassName`, `secondaryDayText`, `secondaryDayClassName`, `toVarStyle`, `tracksHover`, `rovingCellIndex`, `dayTabStopKey` | The shared view model: class lists, accessible names and focus rules every layer renders from. |
| `monthTransition`, `viewTransition`, `MOTION_SETTLE_MS` | Which animation a render should play, and the safety timeout for it. |
| `Emitter` | The typed event emitter the cores use. |
| `VERSION` | The core version. |
