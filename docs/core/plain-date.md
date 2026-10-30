# PlainDate

`PlainDate` is the immutable, calendar-aware date type used throughout Khorshid. It has no time and no timezone, and it is stored as a Julian Day Number, so dates from different calendars compare and convert exactly. Use it for date math in disabled-date predicates, shortcuts, plugins and headless code.

## Creating dates

```js
import { PlainDate } from 'khorshid/headless'

const nowruz = new PlainDate('jalali', 1405, 1, 1)

PlainDate.today('jalali')       // today, in any calendar (default 'gregorian')
PlainDate.from('2026-03-21')    // a Gregorian ISO string
PlainDate.from(new Date())      // a native Date (its local year, month and day)
PlainDate.from({ year: 1405, month: 1, day: 1, calendar: 'jalali' })
PlainDate.fromJDN(2461121, 'jalali')
```

`PlainDate.from` accepts any `DateInput`: a `PlainDate`, `{ year, month, day, calendar? }` parts, a native `Date`, or a Gregorian ISO string `'YYYY-MM-DD'`. ISO strings are always Gregorian. Parts without a `calendar` are read as Gregorian here; options passed to a picker (`value`, `min`, `goTo()`, …) read them in the picker's active calendar instead. An invalid date throws a `RangeError`.

## Properties and conversion

```js
nowruz.calendar                  // 'jalali'
nowruz.year; nowruz.month; nowruz.day  // 1405, 1, 1
nowruz.jdn                       // 2461121
nowruz.weekday                   // 6  (0 = Sunday … 6 = Saturday)
nowruz.daysInMonth               // 31
nowruz.isLeapYear                // false

nowruz.to('gregorian').toParts() // { year: 2026, month: 3, day: 21 }
nowruz.toISO()                   // '2026-03-21'  (ISO is always Gregorian)
nowruz.toDate()                  // a native Date at local midnight
nowruz.toString()                // 'jalali:1405-01-01'
JSON.stringify(nowruz)           // '"2026-03-21"'
```

## Arithmetic

Every operation returns a new `PlainDate` in the same calendar. Adding months or years clamps the day to the target month's length; days and weeks are exact:

```js
nowruz.add({ months: 6 })  // 1405/07/01
nowruz.add({ days: 40 })   // 1405/02/10
nowruz.add({ weeks: -1 })  // 1404/12/23
nowruz.with({ day: 15 })   // 1405/01/15
nowruz.startOfMonth()      // 1405/01/01
nowruz.endOfMonth()        // 1405/01/31
```

`add` accepts `years`, `months`, `weeks` and `days`, which must be integers.

## Comparison

```js
nowruz.isBefore(other)
nowruz.isAfter(other)
nowruz.equals(other)
nowruz.isBetween(a, b)
nowruz.isSameMonth(other)

PlainDate.compare(a, b) // -1 | 0 | 1, for sorting
```

Comparisons work across calendars, because they compare the Julian Day Number.

## Formatting

```js
import { PlainDate, faIR } from 'khorshid/headless'

const d = new PlainDate('jalali', 1405, 1, 1)
d.format('dddd D MMMM YYYY', faIR) // 'شنبه ۱ فروردین ۱۴۰۵'
```

The date is converted to the locale's calendar first. See [Format Tokens](/api/format-tokens) for the full token list.

## Lower-level building blocks

The calendar systems and the formatting and digit helpers are exported too:

```js
import {
  gregorian, jalali, hijri,    // calendar systems
  registerCalendar,            // replace a built-in system
  formatDate, parseDate, createDateValue,
  toLocaleDigits, toLatinDigits, normalizeDigits, // digit helpers
  faIR,
} from 'khorshid/headless'

jalali.toJDN(1405, 1, 1)       // 2461121
jalali.fromJDN(2461121)        // { year: 1405, month: 1, day: 1 }
jalali.isValid(1403, 12, 30)   // true  (leap year)
gregorian.isLeapYear(2024)     // true

toLocaleDigits('1405', faIR.digits) // '۱۴۰۵'
toLatinDigits('۱۴۰۵')               // '1405'
```

A calendar system implements `toJDN`, `fromJDN`, `daysInMonth`, `isLeapYear` and `isValid`, and its `id` is one of `'jalali'`, `'gregorian'` or `'hijri'`. `registerCalendar` replaces the system registered under that id, which is how an [adjusted Hijri calendar](/guide/calendars-and-locales#umm-al-qura-civil-and-local-adjustments) is installed.

**Related:** [PlainDate API](/core/utilities) · [The Headless Core](/core/) · [Calendars & Locales](/guide/calendars-and-locales) · [Shortcuts & Limits](/guide/shortcuts-and-limits)
