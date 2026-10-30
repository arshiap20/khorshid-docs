# Calendars & Locales

Khorshid has three calendar systems and nine built-in locales that pair a language with a calendar. This page explains how they fit together, how to switch calendars at runtime, how to adjust the Hijri calendar, and how to register a locale of your own.

## Three calendar systems

Every date converts between the calendars exactly, because the internal representation is the Julian Day Number (JDN): an integer count of days that belongs to no particular calendar.

| Calendar | `CalendarId` | Algorithm | Supported range |
|---|---|---|---|
| Jalali (Persian, Shamsi) | `'jalali'` | jalaali break-table algorithm, matching Iran's official calendar | -61 to 3177 AP |
| Gregorian | `'gregorian'` | Proleptic Gregorian | 20 March 560 to 19 March 3799 CE (the span the Jalali table covers) |
| Hijri (lunar Islamic) | `'hijri'` | Umm al-Qura table by default; a tabular "civil" variant is available | 1300–1600 AH (Umm al-Qura), 1–3000 AH (civil) |

The Gregorian range is bounded by the Jalali one because every [`DateValue`](/api/events#datevalue) carries the date in both calendars. The Umm al-Qura table is checked against ICU for every day from 1900 to 2100.

## Locales

A locale binds a language, a calendar and its conventions: text direction, first day of the week, weekend days, digits, month and weekday names, date formats and UI labels. These nine are built in:

| Key | Language | Calendar | Direction | Week starts | Months |
|---|---|---|---|---|---|
| `fa-IR` | Persian | Jalali | RTL | Saturday | فروردین، اردیبهشت … |
| `en-US` | English | **Jalali** | LTR | Saturday | Farvardin, Ordibehesht … |
| `fa-IR-gregorian` | Persian | Gregorian | RTL | Saturday | ژانویه، فوریه … |
| `en-US-gregorian` | English | Gregorian | LTR | Sunday | January, February … |
| `fa-IR-hijri` | Persian | Hijri | RTL | Saturday | محرم، صفر … |
| `en-US-hijri` | English | Hijri | LTR | Sunday | Muharram, Safar … |
| `fa-AF` | Dari | Jalali | RTL | Saturday | حمل، ثور، جوزا … |
| `fa-AF-gregorian` | Dari | Gregorian | RTL | Saturday | جنوری، فبروری … |
| `ps-AF` | Pashto | Jalali | RTL | Saturday | وری، غویی، غبرگولی … |

Switch between them below. Direction, digits, week start and month names change together:

<Demo inline :controls="['locale', 'value']" caption="One picker, every built-in locale. Change the dropdown above." />

::: tip The `en-US` locale
`en-US` is the Jalali calendar with English transliterated month names: Farvardin, Ordibehesht, Khordad, and so on. It is meant for English-speaking users of the Persian calendar, and it is the reason calendar and language are separate settings.
:::

### Afghanistan: Dari and Pashto

Afghanistan uses the same solar Hijri calendar as Iran, with zodiac month names. `fa-AF` (Dari) and `ps-AF` (Pashto) are Jalali locales with those names, and `fa-AF-gregorian` gives Dari users the Gregorian calendar with Afghan month spellings (جنوری، فبروری، مارچ …):

```js
createDatePicker('#date', { locale: 'fa-AF' })            // 1 Hamal 1405
createDatePicker('#date', { locale: 'ps-AF' })            // 1 Wray 1405
createDatePicker('#date', { locale: 'fa-AF-gregorian' })  // 21 March 2026
```

## Switching the calendar

Calendar variants are separate locales, so month names always match the calendar. `setCalendar()` switches to the variant in the same language and prefers the same region:

```js
const picker = createDatePicker('#date', { locale: 'fa-IR' })
picker.setCalendar('gregorian') // → fa-IR-gregorian
picker.setCalendar('hijri')     // → fa-IR-hijri
picker.setCalendar('jalali')    // → back to fa-IR

const dari = createDatePicker('#date2', { locale: 'fa-AF' })
dari.setCalendar('gregorian')   // → fa-AF-gregorian (not fa-IR-gregorian)
```

When the region has no variant for that calendar, the first registered locale in the same language is used (`fa-AF` with `'hijri'` gives `fa-IR-hijri`). When the language has no variant at all (there is no Gregorian Pashto locale), the picker emits an `error` event with code `'no-locale-variant'` and keeps its current locale. The same lookup is available directly:

```js
import { getLocaleForCalendar } from 'khorshid'

getLocaleForCalendar('fa', 'gregorian', 'fa-AF') // fa-AF-gregorian
getLocaleForCalendar('ps', 'gregorian')          // null
```

## The Hijri calendar

With a Hijri locale the whole picker runs in lunar months: the grid, the header, the input mask, formatting, [shortcuts](./shortcuts-and-limits) ("This month" is Ramadan) and [natural input](./natural-input):

```js
createDatePicker('#date', { locale: 'fa-IR-hijri' })   // ۱۴۴۷/۱۰/۰۱
createDatePicker('#date', { locale: 'en-US-hijri' })   // 10/01/1447
```

<Demo inline locale="fa-IR-hijri" :options="{ secondaryCalendar: true }" :controls="['value']" caption="fa-IR-hijri with secondaryCalendar: true, which pairs Hijri with Jalali for Persian." />

Every [`DateValue`](/api/events#datevalue) carries the Hijri parts, whatever the active calendar, whenever the date is inside the Hijri calendar's range:

```js
picker.on('change', ({ value }) => {
  value.date.jalali    // { year: 1404, month: 12, day: 29 }
  value.date.gregorian // { year: 2026, month: 3,  day: 20 }
  value.date.hijri     // { year: 1447, month: 10, day: 1 }  (1 Shawwal)
})
```

### Umm al-Qura, civil, and local adjustments

The default `'hijri'` calendar is Saudi Arabia's Umm al-Qura calendar, read from an embedded table (1300–1600 AH, about 1882–2174 CE). Dates outside the table are invalid; the calendar does not fall back to arithmetic at its edges.

In many countries a lunar month starts on a local moon sighting, so the observed calendar can differ from the table by a day. Build an adjusted calendar with `createHijriCalendar` and register it in place of the default:

```js
import { createHijriCalendar, registerCalendar } from 'khorshid'

registerCalendar(
  createHijriCalendar({
    adjustments: {
      '1447-09': 29, // this Ramadan has 29 days locally
    },
  }),
)
```

`adjustments` maps `'YYYY-MM'` to `29` or `30`. A month's length decides where every later month starts:

- To move the start of month M one day earlier, shorten month M-1 (30 → 29) and lengthen M (29 → 30).
- To move it one day later, do the opposite.
- Adjusting a single month shifts every month after it.

For a purely arithmetic calendar, `createHijriCalendar({ variant: 'civil' })` gives the tabular Islamic calendar (civil epoch, 11 leap years per 30-year cycle, years 1–3000). It accepts `adjustments` too. Both variants report `id: 'hijri'`.

::: tip Holidays
The [offline Iran holidays provider](./holidays#offline-no-network) computes the religious holidays with a Hijri calendar, so the same adjustments fix both the picker and the holiday marks.
:::

## A second calendar under every day

`secondaryCalendar` shows the Gregorian date under each Jalali day, or any other pairing. See [Secondary Calendar](./secondary-calendar).

## Overriding conventions

Three options override a locale's conventions for one picker without registering a new locale:

| Option | Overrides |
|---|---|
| `weekStart` | The first day of the week, `0` (Sunday) to `6` (Saturday). |
| `weekdays` | The weekday column headers: exactly 7 strings, indexed by weekday (`0` = Sunday), not by display order. |
| `format` | The display format of the input and the `formatted` value. See [Input Mask & Formatting](./input-mask). |

```js
createDatePicker('#date', {
  locale: 'en-US-gregorian',
  weekStart: 1, // Monday
})
```

## Registering a custom locale

Add a locale with `registerLocale`. It must implement the `Locale` type, and the easiest way is to spread a built-in one and change what you need:

```js
import { registerLocale, faIR } from 'khorshid'

registerLocale({
  ...faIR,
  key: 'fa-IR-custom',
  name: 'فارسی (سفارشی)',
  weekStart: 5,     // start the week on Friday
  formats: { ...faIR.formats, display: 'D MMMM YYYY' },
  labels: {
    ...faIR.labels,
    shortcuts: { ...faIR.labels.shortcuts, thisMonth: 'ماه جاری' },
    invalidDate: 'این تاریخ قابل قبول نیست',
  },
})

createDatePicker('#date', { locale: 'fa-IR-custom' })
```

Two labels are optional, so older custom locales keep compiling:

| Label | Used for | Fallback |
|---|---|---|
| `labels.shortcuts` | Chip text of the 14 [shortcut presets](./shortcuts-and-limits#the-14-presets). A partial record is fine. | English |
| `labels.invalidDate` | The field's native validation message (see [Forms](./forms#validation)). | `'Invalid date'` |

A registered locale is used immediately by `setCalendar()` and by the natural-input parser, which reads month names from every registered locale on the active calendar.

List everything currently registered with `getRegisteredLocales()`:

```js
import { getRegisteredLocales } from 'khorshid'

for (const locale of getRegisteredLocales()) {
  console.log(locale.key, locale.name, locale.calendar)
}
```

## Calendar math

The calendar systems are exported for direct calculations. See [PlainDate](/core/plain-date) for the date type built on them:

```js
import { jalali, gregorian, hijri, PlainDate } from 'khorshid'

jalali.isLeapYear(1403)        // true
jalali.daysInMonth(1403, 12)   // 30  (Esfand in a leap year)
gregorian.toJDN(2026, 3, 21)   // 2461121
hijri.daysInMonth(1447, 9)     // 30  (Ramadan 1447, Umm al-Qura)

new PlainDate('gregorian', 2026, 3, 20).to('hijri').toParts()
// { year: 1447, month: 10, day: 1 }
```

**Related:** [Secondary Calendar](./secondary-calendar) · [PlainDate](/core/plain-date) · [Holidays](./holidays)
