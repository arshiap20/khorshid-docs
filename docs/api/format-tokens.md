# Format Tokens

The token vocabulary behind the `format` option, locale formats, `PlainDate.format()` and the date field. Names and digits come from the locale, so one pattern works in every language and calendar.

## Date tokens

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
| `[…]` | Literal text, copied as is | `[Nowruz] YYYY` → `Nowruz 1405` | `[نوروز] YYYY` → `نوروز ۱۴۰۵` |

Both locales above use the Jalali calendar; `en-US` is Jalali with English labels. Any text that is not a token is copied too, but put words in brackets so their letters are never read as tokens.

## Time tokens

The date field's `format` and the `formatTime` helper also read time tokens. The picker's own time text is fixed: `HH:mm`, `HH:mm:ss`, `hh:mm A` or `hh:mm:ss A`, depending on `TimeOptions`.

| Token | Meaning | Example |
|---|---|---|
| `HH` / `H` | Hour, 0–23, padded / unpadded | `09` / `9` |
| `hh` / `h` | Hour, 1–12, padded / unpadded | `09` / `9` |
| `mm` / `m` | Minute, padded / unpadded | `05` / `5` |
| `ss` / `s` | Second, padded / unpadded | `07` / `7` |
| `A` / `a` | AM/PM, upper / lower case (`ق.ظ` / `ب.ظ` in Persian) | `PM` / `pm` |

## Where each token works

| Used by | Tokens |
|---|---|
| `format` option, `core.format()`, `PlainDate.format()`, `formatDate()` | All date tokens. |
| `parse()`, `parseDate()`, `submitInput()` | Numeric date tokens only: `YYYY`, `YY`, `MM`, `M`, `DD`, `D`. A format with month or weekday names is not parsed back; turn on `naturalInput` to accept typed names. |
| Input mask (`maskDateInput`, `inputMask`) | `YYYY`, `MM`, `DD`, `M`, `D`. |
| Date field `format` | Date tokens and time tokens. `MMMM` and `MMM` show the month by name, `YY` reads as `YYYY`, weekday tokens are dropped, and time tokens turn time on. |

## Parsing rules

- Any of `/`, `-`, `.` or a space separates groups, whatever the format's separator is.
- Persian and Arabic-Indic digits are normalized to Latin first, and bidi control marks are stripped.
- `YY` resolves to the current century of the target calendar.
- The result must be a real date in the calendar, or parsing returns `null`.

## Examples

```js
import { PlainDate, faIR, enUS } from 'khorshid/headless'

const d = new PlainDate('jalali', 1405, 1, 1)

d.format('YYYY/MM/DD', faIR)        // '۱۴۰۵/۰۱/۰۱'
d.format('dddd D MMMM YYYY', faIR)  // 'شنبه ۱ فروردین ۱۴۰۵'
d.format('D MMM YY', enUS)          // '1 Far 05'
d.format('[Nowruz] YYYY', enUS)     // 'Nowruz 1405'
```

Set the display format of a picker with the `format` option:

```js
createDatePicker('#date', { locale: 'fa-IR', format: 'dddd D MMMM YYYY' })
```
