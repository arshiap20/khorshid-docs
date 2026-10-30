# PickerCore

`createPicker(options?)` یک `PickerCore` برمی‌گرداند، موتور headless که همهٔ پیکرها روی آن اجرا می‌شوند. وضعیت را نگه می‌دارد، قواعد را اعمال می‌کند و مدل‌های رندر را می‌سازد، و هرگز به DOM دست نمی‌زند. برای مدل ذهنی، [هستهٔ headless](/fa/core/) را ببینید.

```ts
import { createPicker } from 'khorshid/headless'   // یا '@khorshid-js/core'

function createPicker(options?: PickerOptions): PickerCore
```

[`PickerOptions`](/fa/api/options#pickeroptions) را می‌گیرد (بدون گزینه‌های ظاهری). هر پیکر رابط‌دار، هسته‌اش را با `picker.core` در اختیار می‌گذارد.

## وضعیت {#state}

| عضو | امضا | توضیح |
|---|---|---|
| `getState` | `() => Readonly<PickerState>` | تصویری از وضعیت فعلی. |
| `subscribe` | `(listener: (state) => void) => Unsubscribe` | بعد از هر تغییر وضعیت صدا زده می‌شود. این همان سیگنال رندر دوباره است. |

`PickerState`:

| فیلد | نوع | توضیح |
|---|---|---|
| `view` | `'days' \| 'months' \| 'years'` | نمای قابل مشاهده. |
| `viewDate` | `DateParts` | سال و ماه اولین پن، در تقویم فعال. `day` همیشه `1` است. |
| `selected` | `PlainDate[]` | انتخاب: در حالت تکی ۰ یا ۱ تاریخ، در حالت بازه ۰ تا ۲ تاریخ (مرتب)، در حالت چندتایی هر تعداد. |
| `hovered` | `PlainDate \| null` | روزی که نشانگر روی آن است؛ برای پیش‌نمایش بازه. |
| `focused` | `PlainDate` | روزی که فوکوس کیبورد روی آن است. همیشه تاریخ معتبر است. |
| `open` | `boolean` | آیا پیکر باز است. |
| `time` | `TimeValue \| null` | ساعت روز وقتی `time` روشن است، وگرنه `null`. |

## رویدادها {#events}

| عضو | امضا | توضیح |
|---|---|---|
| `on` | `(event, handler) => Unsubscribe` | اشتراک در یک [رویداد](/fa/api/events) با نوع مشخص. |
| `once` | `(event, handler) => Unsubscribe` | اشتراک فقط برای یک بار. |
| `off` | `(event, handler) => void` | حذف یک handler. |
| `onAny` | `(handler: (event, payload) => void) => Unsubscribe` | گوش دادن به همهٔ رویدادها. |

## پیکربندی {#configuration}

| عضو | امضا | توضیح |
|---|---|---|
| `getOptions` | `() => Readonly<PickerOptions>` | گزینه‌ها، با مقدار نهایی `mode`، `months`، `fixedWeeks` و `autoClose`. |
| `getLocale` | `() => Locale` | لوکال فعال. |
| `setLocale` | `(locale: string \| Locale) => void` | تعویض لوکال. `locale:change` صادر می‌کند، و اگر تقویم عوض شود `calendar:change`. |
| `getCalendar` | `() => CalendarSystem` | سیستم تقویم فعال. |
| `setCalendar` | `(calendar: CalendarId) => void` | رفتن به لوکال ثبت‌شده‌ای با همین زبان و آن تقویم، ترجیحاً از همان منطقه (`fa-AF` ← `fa-AF-gregorian`). اگر نباشد، `error` با کد `no-locale-variant` صادر می‌کند. |
| `getMode` | `() => PickerMode` | حالت انتخاب. |
| `setMode` | `(mode: PickerMode) => void` | تعویض حالت. تکی اولین تاریخ را نگه می‌دارد و بازه دو تاریخ زودتر را؛ اگر مقدار کوتاه شود `change` صادر می‌شود. |
| `getUnit` | `() => SelectionUnit` | [واحد انتخاب](/fa/guide/selection-units)، که هنگام ساخت ثابت می‌شود. |
| `getSecondaryCalendar` | `() => CalendarId \| null` | [تقویم دوم](/fa/guide/secondary-calendar) نهایی، یا `null` وقتی خاموش است. |
| `getPlugin` | `<P>(name: string) => P \| undefined` | پلاگین ثبت‌شده با این `name`، برای دسترسی به API خودش (مثلاً `getPlugin<HolidaysPlugin>('holidays')`). |

## انتخاب {#selection}

| عضو | امضا | توضیح |
|---|---|---|
| `select` | `(date: DateInput) => void` | انتخاب یک روز مثل یک کلیک، بر اساس حالت: جایگزینی (تکی)، شروع یا پایان (بازه)، افزودن یا حذف (چندتایی). تاریخ غیرفعال یا خارج از محدوده به‌جای آن `error` صادر می‌کند. |
| `setValue` | `(value: PickerValueInput) => void` | جایگزینی کل مقدار. با محدودیت‌ها اعتبارسنجی نمی‌شود. وقتی انتخاب عوض شود `change` با منبع `'api'` صادر می‌کند. |
| `getValue` | `() => PickerValue` | مقدار فعلی. |
| `clear` | `() => void` | پاک کردن مقدار. `clear` و سپس `change` صادر می‌کند. |
| `hover` | `(date: DateInput \| null) => void` | تعیین روز زیر نشانگر (پیش‌نمایش بازه را می‌سازد). |

## ساعت {#time}

روی همهٔ هسته‌ها هستند؛ وقتی `time` خاموش است کاری نمی‌کنند.

| عضو | امضا | توضیح |
|---|---|---|
| `getTime` | `() => TimeValue \| null` | ساعت فعلی، یا `null` وقتی انتخابگر ساعت خاموش است. |
| `setTime` | `(time: Partial<TimeValue>) => void` | ادغام بخشی از ساعت، محدود و گردشده به گام‌ها. `time:change` صادر می‌کند، و اگر تاریخی انتخاب شده باشد `change` با منبع `'time'`. |

## پیمایش و نماها {#navigation-and-views}

| عضو | امضا | توضیح |
|---|---|---|
| `next` / `prev` | `() => void` | ورق زدن نمای فعلی: یک ماه در نمای روزها، یک سال در نمای ماه‌ها، ۱۲ سال در نمای سال‌ها. |
| `goTo` | `(date: DateInput) => void` | نمایش ماهی که تاریخ در آن است و فوکوس روی آن (محدودشده به `min` و `max`). |
| `goToToday` | `() => void` | همان `goTo(today())`. انتخاب نمی‌کند. |
| `setView` | `(view: PickerView) => void` | رفتن به `'days'`، `'months'` یا `'years'`. |
| `selectMonth` | `(month: number) => void` | انتخاب یک ماه در نمای ماه‌ها و برگشت به روزها. با `unit: 'month'` انتخاب را ثبت می‌کند. |
| `selectYear` | `(year: number) => void` | انتخاب یک سال در نمای سال‌ها و برگشت به ماه‌ها. با `unit: 'year'` انتخاب را ثبت می‌کند. |

## وضعیت باز بودن {#open-state}

هسته فقط پرچم را نگه می‌دارد؛ لایه‌های رابط، اورلی‌ها را حول آن نصب و متحرک می‌کنند.

| عضو | امضا | توضیح |
|---|---|---|
| `open` | `() => void` | `open` را روشن می‌کند و رویداد `open` را صادر می‌کند. |
| `close` | `() => void` | `open` را خاموش می‌کند و رویداد `close` را صادر می‌کند. |
| `toggle` | `() => void` | اگر بسته است باز می‌کند، اگر باز است می‌بندد. |

## فوکوس کیبورد {#keyboard-focus}

| عضو | امضا | توضیح |
|---|---|---|
| `focusDate` | `(date: DateInput) => void` | بردن فوکوس به یک تاریخ و نمایش ماه آن. |
| `moveFocus` | `(unit: 'day' \| 'week' \| 'month' \| 'year', delta: number) => void` | جابه‌جایی فوکوس به اندازهٔ چند واحد. |
| `focusWeekEdge` | `(edge: 'start' \| 'end') => void` | فوکوس روی اولین یا آخرین روز هفتهٔ فعلی. |
| `selectFocused` | `() => void` | انتخاب روزی که فوکوس دارد (Enter یا Space). |

## میان‌برها {#shortcuts}

| عضو | امضا | توضیح |
|---|---|---|
| `getShortcuts` | `() => ShortcutItem[]` | [میان‌برهای](/fa/guide/shortcuts-and-limits) تنظیم‌شده، آماده برای لوکال و وضعیت فعلی: `{ id, label, active, disabled }`. |
| `applyShortcut` | `(id: string) => void` | اعمال یک میان‌بر: مقدار را تعیین می‌کند (`change` با منبع `'shortcut'`)، آن را نمایش می‌دهد، `shortcut` صادر می‌کند، و اگر `autoClose` روشن باشد با مقدار کامل می‌بندد. شناسهٔ غیرفعال یا ناشناخته کاری نمی‌کند. |

## مدل‌های رندر {#render-models}

| عضو | امضا | توضیح |
|---|---|---|
| `getGrid` | `(offset?: number) => CalendarGrid` | جدول روزهای پن `offset` (پیش‌فرض `0`). |
| `getTitle` | `(offset?: number) => GridTitle` | عنوان هدر برای نمای فعلی. |
| `getWeekdayLabels` | `() => WeekdayLabel[]` | سرستون‌های روز هفته به ترتیب نمایش. |
| `getMonthCells` | `() => MonthCell[]` | ۱۲ خانهٔ نمای ماه‌ها. |
| `getYearCells` | `() => YearCell[]` | ۱۲ خانهٔ نمای سال‌ها (صفحه‌ای که `viewDate.year` در آن است). |
| `getYearRangeLabel` | `() => string` | برچسب بازهٔ نمای سال‌ها، مثل `۱۴۰۰ – ۱۴۱۱`. |
| `isDisabled` | `(date: DateInput) => boolean` | آیا تاریخ خارج از `min`/`max` است یا `disabledDates` آن را می‌گیرد. |
| `today` | `() => PlainDate` | امروز، در تقویم فعال. |
| `toDateValue` | `(date: DateInput) => DateValue` | تبدیل یک تاریخ به [`DateValue`](/fa/api/events#datevalue) کامل. |

`CalendarGrid` برابر `{ year, month, title, weekdays, weeks }` است، که در آن `weeks` ردیف‌هایی از ۷ `DayCell` است (با `fixedWeeks`، ۶ ردیف).

`DayCell`:

| فیلد | نوع | توضیح |
|---|---|---|
| `date` | `PlainDate` | خود روز. |
| `parts` | `DateParts` | سال، ماه و روز در تقویم فعال. |
| `iso` | `string` | `YYYY-MM-DD` میلادی؛ کلیدی پایدار. |
| `label` | `string` | شمارهٔ روز با ارقام لوکال. |
| `weekday` | `WeekDay` | `0` = یکشنبه … `6` = شنبه. |
| `today`، `selected`، `focused`، `weekend` | `boolean` | پرچم‌های وضعیت. |
| `rangeStart`، `rangeEnd`، `inRange` | `boolean` | دو سر بازه یا دوره، و روزهای میان آن‌ها. |
| `preview` | `boolean` | بین شروع بازه و روز زیر نشانگر، هنگام انتخاب انتهای بازه. |
| `disabled` | `boolean` | قابل انتخاب نیست. |
| `disabledReason` | `string?` | علت، وقتی `disabledDates` [دلیلی](/fa/guide/shortcuts-and-limits#disabled-dates-with-a-reason) داده است. |
| `outside` | `boolean` | متعلق به ماه قبل یا بعد. |
| `unsupported` | `boolean?` | این خانه بیرون از بازهٔ پشتیبانی‌شدهٔ تقویم است. آن را خالی رندر کنید. |
| `marks` | `DayMark[]` | نشانه‌های پلاگین‌ها، مثل تعطیلات؛ اگر نباشد خالی است. |
| `secondary` | `SecondaryDay?` | همین روز در تقویم دوم: `{ calendar, parts, label, monthStart, monthLabel, formatted }`. |

مدل‌های دیگر:

| نوع | فیلدها |
|---|---|
| `GridTitle` | `month`، `year`، `label` (بر اساس `locale.formats.monthHeader`)، `secondary?` (ماه‌های تقویم دوم که پن در بر می‌گیرد) |
| `WeekdayLabel` | `index`، `long`، `short`، `min`، `weekend` |
| `MonthCell` | `month`، `label`، `shortLabel`، `selected`، `rangeStart`، `rangeEnd`، `inRange`، `current`، `disabled` |
| `YearCell` | `year`، `label`، `selected`، `rangeStart`، `rangeEnd`، `inRange`، `current`، `disabled` |

روی خانهٔ ماه یا سال، `selected` با `unit: 'month'` یا `'year'` یعنی «جزو مقدار»، و در غیر این صورت یعنی «ماه یا سالی که نمایش داده می‌شود». `current` یعنی امروز در آن است.

## ورودی و خروجی متن {#text-input-and-output}

| عضو | امضا | توضیح |
|---|---|---|
| `format` | `(date: DateInput, pattern?: FormatPattern) => string` | قالب‌بندی تاریخ با لوکال فعال. الگوی پیش‌فرض، قالب نمایش است. |
| `parse` | `(text: string) => PlainDate \| null` | خواندن متن با قالب نمایش. |
| `handleInput` | `(raw: string, caret?: number \| null) => MaskResult` | عبور یک کلید از ماسک (یا `mask` سفارشی). `input` صادر می‌کند و تاریخ کامل، معتبر و مجاز را ثبت می‌کند (`change` با منبع `'input'`). با `naturalInput` متن آزاد دست‌نخورده عبور می‌کند. |
| `submitInput` | `(text: string) => boolean` | ثبت متن، مثل کاری که فیلد با Enter یا blur می‌کند: اول قالب نمایش، سپس با `naturalInput` [زبان طبیعی](/fa/guide/natural-input). در حالت بازه `A تا B`، `A to B` یا `A – B` هر دو سر را تعیین می‌کند. اگر مقداری ثبت شود `true` برمی‌گرداند؛ اگر متن رد شود `error` صادر می‌کند. |
| `getInputValue` | `() => string` | مقدار فعلی به شکل متن فیلد، با ساعت در انتها وقتی `time` روشن است. |
| `getFormValue` | `() => string` | مقدار فعلی سریال‌شده با `toFormValue`. گزینهٔ `formValue` گزینهٔ رابط است، پس هسته از آن استفاده نمی‌کند. |

## چرخهٔ عمر {#lifecycle}

| عضو | امضا | توضیح |
|---|---|---|
| `destroy` | `() => void` | اجرای پاک‌سازی پلاگین‌ها به ترتیب معکوس و حذف همهٔ listenerها و مشترک‌ها. |

## مثال {#example}

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
