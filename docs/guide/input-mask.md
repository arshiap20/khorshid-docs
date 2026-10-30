# Input Mask & Formatting

A picker bound to an `<input>` formats what the user types as they type it, and displays dates with a configurable format. This page covers the smart mask, the format tokens, custom display formats, replacing the mask with your own function, and parsing text outside a picker.

## The smart input mask

In single mode with the default day unit, the bound input gets a smart mask. Type digits without separators, paste Persian numerals, or delete in the middle of the value:

<Demo :controls="['value']" placeholder="۱۴۰۵/۰۱/۰۱" caption="Type ۱۴۰۵۰۱۰۱ — separators appear as you go." />

The mask:

- **Inserts separators** from the format (the numeric tokens `YYYY MM DD M D`; the default is the locale's display format). Type digits only and the `/` appears.
- **Accepts any digits**: Persian (۰–۹), Arabic-Indic (٠–٩) and Latin. The masked text is shown in the locale's digits.
- **Clamps impossible values as you type**: months to 1–12, days to the month's length in the active calendar (Esfand has 30 days in a leap year).
- **Keeps the caret in place** and detects deletions, so editing in the middle of the value works.
- **Never throws**, whatever is typed or pasted.
- **Normalizes on blur** to the formatted value.
- **Commits** when the text is a complete, valid, allowed date (`change` with source `'input'`). A refused date emits `error` and the input gets the `.sdp-input--invalid` class.

In range and multiple modes, and with a week, month or year [unit](./selection-units), the input is read-only: it shows the formatted value and opens the picker on focus. [Natural input](./natural-input) makes the field editable in every mode. Turn the mask off with `inputMask: false`.

## Using the mask on its own

The mask is a pure function. It needs a `Locale` object, not a key:

```js
import { maskDateInput, faIR } from 'khorshid/headless'

const { text, complete, valid } = maskDateInput('14050101', { locale: faIR })
// text: '۱۴۰۵/۰۱/۰۱', complete: true, valid: true
```

Pass `caret` and `previous` (the last masked text) to keep the caret in place and detect deletions. Use `getLocale('fa-IR')` to look a locale up by key.

## Format tokens

Formatting and parsing share one set of tokens. They are used by the `format` option, the locales' display formats and `PlainDate.format()`:

| Token | Meaning | `en-US`, 1405/01/01 | `fa-IR`, 1405/01/01 |
|---|---|---|---|
| `YYYY` | 4-digit year | `1405` | `۱۴۰۵` |
| `YY` | 2-digit year | `05` | `۰۵` |
| `MMMM` | Full month name | `Farvardin` | `فروردین` |
| `MMM` | Short month name | `Far` | `فروردین` |
| `MM` | 2-digit month | `01` | `۰۱` |
| `M` | Month | `1` | `۱` |
| `DD` | 2-digit day | `01` | `۰۱` |
| `D` | Day | `1` | `۱` |
| `dddd` | Full weekday name | `Saturday` | `شنبه` |
| `ddd` | Short weekday name | `Sat` | `شنبه` |
| `dd` | Shortest weekday name | `Sa` | `ش` |
| `[…]` | Literal text | `[Today:] YYYY/MM/DD` | `[امروز] YYYY/MM/DD` |

Digits are rendered in the locale's digit set. Only the numeric tokens (`YYYY MM DD M D`) can be used in a mask pattern. See [Format Tokens](/api/format-tokens) for the full reference.

## Custom display format

```js
createDatePicker('#date', {
  locale: 'fa-IR',
  format: 'dddd D MMMM YYYY', // e.g. شنبه ۱ فروردین ۱۴۰۵
})
```

The format also sets the `formatted` text of every [`DateValue`](/api/events#datevalue) the picker emits.

## Custom mask function

When the format-driven mask cannot express what you need (custom tokens, unusual separators, or different logic altogether), pass a `mask` function. It replaces the built-in mask, receives the raw field text and a resolved `MaskContext`, and returns a `MaskResult`. It runs on every keystroke, so it must never throw.

```js
createDatePicker('#date', {
  locale: 'fa-IR',
  mask: (raw, { locale, format, calendar, caret, previous }) => {
    // ...your masking logic...
    return {
      text,               // what the field shows
      caret,              // caret position within `text`
      parts: { year, month, day }, // the groups filled so far
      complete,           // are all groups filled?
      valid,              // complete, and a real calendar date?
    }
  },
})
```

The result goes through the same commit path as the built-in mask: when it is `complete` and `valid` with real `parts`, the picker selects that date (`change` with `source: 'input'`) and applies `min`, `max` and `disabledDates` as usual. Otherwise the field just shows the new text.

```ts
type MaskFn = (raw: string, context: MaskContext) => MaskResult

interface MaskContext {
  locale: Locale
  format: FormatPattern   // the resolved display format
  calendar: CalendarId    // 'jalali' | 'gregorian' | 'hijri'
  caret: number | null
  previous: string        // the last masked text, to detect deletions
}
```

Leave `mask` out to keep the default smart mask.

## Parsing

`parseDate` accepts any separator (`/`, `-`, `.`, space) and converts Persian and Arabic-Indic digits before parsing. Like the mask, it takes a `Locale` object:

```js
import { parseDate, faIR } from 'khorshid/headless'

parseDate('۱۴۰۵-۰۱-۰۱', { locale: faIR })  // PlainDate (Jalali 1405/01/01)
parseDate('1405.1.1',    { locale: faIR })  // the same date
```

Inside a picker, `picker.core.format()`, `picker.core.parse()` and `picker.core.handleInput()` use the picker's active locale and format for you.

**Related:** [Natural Input](./natural-input) · [Date Field](./date-field) · [Forms](./forms)
