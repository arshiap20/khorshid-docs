# Natural Input

With `naturalInput: true` the field accepts free text as well as masked digits, so people can type a date the way they would say it: `فردا`, `۳ روز بعد`, `جمعه بعد`, `next friday`, `in 2 weeks`, `+3`. This page covers what the parser understands, the rules it follows, and how to use it from code.

## Turning it on

```js
import { createDatePicker } from 'khorshid'

createDatePicker('#due', { locale: 'fa-IR', naturalInput: true })
```

<Demo :options="{ naturalInput: true }" placeholder="فردا، ۳ روز بعد، جمعه بعد…" :controls="['value', 'form']" caption="Type a phrase and press Enter (or leave the field). Digits still go through the smart mask." />

## How it behaves

- While the user types words, the text stays exactly as typed. Input made only of digits
  still goes through the [smart mask](./input-mask).
- The text is committed on **Enter** or on **blur**. On success the field shows the
  normalized date (`فردا` → `۱۴۰۵/۰۱/۱۶`).
- A phrase that isn't a date, or a date that is out of range or disabled, **stays in the
  field**, gets `.sdp-input--invalid`, and the field's native validity is set to the
  locale's `labels.invalidDate` (`تاریخ معتبر نیست`), so a surrounding form won't submit it.
- The field gets `dir="auto"` and no `inputmode`, so words get a full keyboard and the
  right direction. It stays editable in every mode, range and multiple included (with the
  default day [unit](./selection-units)).

## What it understands

Persian and English are understood **whatever the active locale**, and may even be mixed
(`۳ days بعد`). All digit scripts work (۳, ٣, 3), along with the usual spelling variants:
`پس‌فردا` / `پس فردا` / `پسفردا`, Arabic ي/ك, a trailing `؟` or `.`.

| Kind | Persian | English |
|---|---|---|
| Relative days | `امروز` · `فردا` · `پس‌فردا` · `دیروز` · `پریروز` | `today` · `tomorrow` · `day after tomorrow` · `yesterday` |
| Offsets | `۳ روز بعد` · `دو هفته دیگه` · `یه ماه بعد` · `۵ روز پیش` | `in 3 days` · `3 days from now` · `5 days ago` · `in a week` |
| Short offsets | `+۳` · `-۲` | `+3` · `-2` · `+2d` · `+2w` · `+1m` · `+1y` |
| Next / last period | `هفته بعد` · `ماه قبل` · `سال بعد` | `next week` · `last month` · `next year` |
| Weekdays | `جمعه` · `جمعه بعد` · `شنبه گذشته` | `friday` · `next friday` · `last monday` |
| Period edges | `اول ماه` · `آخر سال` · `اول هفته بعد` | `start of month` · `end of next month` |
| Day + month | `۱۵ مهر` · `۲۰ اسفند ۱۴۰۴` · `اول اردیبهشت` | `15 March` · `March 15, 2026` · `1st of May` |
| Numeric | `۱۴۰۵/۰۱/۱۵` · `1405-1-15` | `2026-04-04` |

### Decisions the parser makes

Some phrases are ambiguous. The parser resolves them with these rules, which you can pass on
to your users:

- **A bare weekday is today or the next one, never in the past.** On a Saturday, `شنبه` is
  today and `جمعه` is six days ahead.
- **`next friday` / `جمعه بعد` is the Friday of next week**, where "week" follows
  `weekStart`. So it can be 7 to 13 days away. `last friday` / `جمعه قبل` is the most recent
  Friday strictly before today.
- **Week offsets are exact** (`هفته بعد` = +7 days). **Month and year offsets use calendar
  arithmetic and clamp the day**: 31 Shahrivar + 1 month = 30 Mehr.
- **Month names don't cross calendars.** On a Jalali picker `15 March` is not a date, and on a
  Gregorian picker `۱۵ فروردین` isn't either. A month name is only read in the calendar it
  belongs to. Names from every registered locale on the active calendar count, so
  `۱۵ حمل` (Dari) works on a Jalali picker too.
- **Numeric dates must be `YYYY/MM/DD`**: a 4-digit year first, any separator, read in the
  **active** calendar (`1405/01/15` on Jalali, `2026-04-04` on Gregorian). Year-less or
  year-last forms like `15/01/1405` are ambiguous and rejected.
- **Invalid days are not clamped**: `۳۱ مهر` (Mehr has 30 days) is rejected rather than
  quietly turned into the 30th.
- **A year must be written with digits.** Number words (`یک` … `دوازده`, `one` … `twelve`)
  only count as days or amounts.
- **Unknown words fail the whole phrase.** A sentence that merely *contains* a date word
  (`فردا سلام`, `tomorrow please`) is not a date.

## Ranges in one line

In range mode the field accepts both ends at once, separated by `تا`, `to`, `until`, or a
spaced dash:

```js
createDatePicker('#trip', { locale: 'fa-IR', mode: 'range', naturalInput: true })
// type:  امروز تا ۳ روز بعد     →  1405/01/15 – 1405/01/18
// or:    next friday to +2w
```

<Demo mode="range" :options="{ naturalInput: true }" placeholder="امروز تا جمعه بعد" :controls="['value', 'form']" caption="Range mode with naturalInput: type 'A تا B' and press Enter." />

Both ends are checked against `min` / `max`, `disabledDates` and
[`minDays` / `maxDays`](./shortcuts-and-limits#range-length-mindays-maxdays). A range that
breaks the length limits is refused with `error` code `'range-length'`.

## `submitInput()`: the same thing, programmatically

The field commits text through one core method, which you can also call yourself, for
example with text from a chat-style input or a voice transcript:

```js
picker.core.submitInput('پس‌فردا')   // → true, value committed (change source 'input')
picker.core.submitInput('blah')      // → false, emits error { code: 'invalid-input' }
```

`submitInput` first tries the display format, then (with `naturalInput`) natural language.
It returns `true` when a value was committed and emits `error` (`invalid-input`,
`out-of-range`, `disabled`, `range-length`) when it refuses. Without `naturalInput` it
still accepts text in the display format, which is handy for pasted values.

## `parseNaturalDate()`: the parser on its own

The parser is exported as a pure utility, with no picker needed:

```js
import { parseNaturalDate, PlainDate, getLocale } from 'khorshid/headless'

const today = PlainDate.today('jalali')

parseNaturalDate('۳ روز بعد', { locale: getLocale('fa-IR'), today })
// → PlainDate (jalali), or null when the text isn't a date

parseNaturalDate('next friday', {
  locale: getLocale('en-US-gregorian'),
  today: PlainDate.today('gregorian'),
  weekStart: 1, // optional; default locale.weekStart
})
```

`today` is passed in (and decides the calendar of the result), so results are deterministic
and easy to test. The function never throws: anything it cannot read returns `null`.

**Related:** [Input Mask & Formatting](./input-mask) · [Shortcuts & Limits](./shortcuts-and-limits) · [Forms](./forms)
