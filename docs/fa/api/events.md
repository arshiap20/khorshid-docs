# رویدادها

همهٔ رویدادهای پیکر، payload هر کدام و زمان صدورشان. این فهرست فقط یک بار در هسته تعریف شده است؛ پس هر لایه همهٔ آن‌ها را دارد و هر handler همان شیء payload را می‌گیرد.

## چهار راه برای گوش دادن {#four-ways-to-listen}

نام‌گذاری مکانیکی است: `'range:complete'` می‌شود `onRangeComplete`، `@range-complete` و `sdp-range-complete`.

```ts
picker.on('range:complete', onDone)                    // وانیلا: ‎.on()
createDatePicker('#d', { onRangeComplete: onDone })    // وانیلا: یک گزینه
<DatePicker onRangeComplete={onDone} />                // React: یک prop
<DatePicker @range-complete="onDone" />                // Vue: یک emit
el.addEventListener('sdp-range-complete', (e) => onDone(e.detail))  // custom element
```

هر handler یک آرگومان می‌گیرد، یعنی شیء payload (`onChange` مقدار `{ value, source }` را می‌گیرد). روی custom element، payload در `event.detail` است.

`on` یک تابع لغو اشتراک برمی‌گرداند. هسته `once` و `onAny` هم دارد:

```js
const off = picker.on('change', ({ value, source }) => { /* … */ })
off()

picker.core.onAny((event, payload) => console.log(event, payload))
```

## نقشهٔ رویدادها {#event-map}

| رویداد | payload | چه زمانی صادر می‌شود |
|---|---|---|
| `change` | `{ value: PickerValue, source: ChangeSource }` | مقدار ثبت‌شده تغییر می‌کند. `source` یکی از `'select'`، `'input'`، `'api'`، `'clear'`، `'time'` یا `'shortcut'` است. انتخاب سر اول یک بازهٔ تازه آن را صادر نمی‌کند. |
| `select` | `{ date: DateValue }` | روزی انتخاب می‌شود، در هر حالتی، از جمله هر دو سر بازه. |
| `clear` | `{ previous: PickerValue }` | مقدار پاک می‌شود. بعد از آن `change` می‌آید. |
| `range:start` | `{ start: DateValue }` | سر اول بازه انتخاب می‌شود. |
| `range:complete` | `{ start: DateValue, end: DateValue }` | سر دوم انتخاب می‌شود، یا متن تایپ‌شده یا یک میان‌بر کل بازه را تعیین می‌کند. |
| `open` / `close` | `{}` | پیکر باز یا بسته می‌شود. |
| `view:change` | `{ view: PickerView, previous: PickerView }` | نما بین `days`، `months` و `years` عوض می‌شود. |
| `month:change` | `{ year, month, direction: 1 \| -1 \| 0 }` | ماه نمایش‌داده‌شده از هر مسیری عوض می‌شود (دکمه‌ها، `goTo`، `setValue`، ورق زدن با کیبورد). `0` یعنی پرش. |
| `year:change` | `{ year, previous }` | سال نمایش‌داده‌شده از هر مسیری عوض می‌شود. |
| `locale:change` | `{ locale: Locale }` | لوکال عوض می‌شود. |
| `calendar:change` | `{ calendar: CalendarId }` | تقویم عوض می‌شود، با `setCalendar` یا با لوکالی که تقویم دیگری دارد. |
| `time:change` | `{ time: TimeValue }` | ساعت روز عوض می‌شود (وقتی انتخابگر ساعت روشن است). |
| `shortcut` | `{ id: string, value: PickerValue }` | یک [میان‌بر](/fa/guide/shortcuts-and-limits) اعمال می‌شود. بعد از آن `change` با منبع `'shortcut'` می‌آید. |
| `input` | `{ text, complete, valid }` | هر کلیدی که از ماسک می‌گذرد، و متن آزاد وقتی `naturalInput` روشن است. |
| `error` | `{ code, message, input?, reason? }` | یک انتخاب، متن تایپ‌شده یا تعویض تقویم رد می‌شود. [کدهای خطا](#error-codes) را ببینید. |

## نام‌ها در هر لایه {#names-in-every-layer}

| رویداد هسته | کال‌بک | emit در Vue | رویداد المنت |
|---|---|---|---|
| `change` | `onChange` | `change` | `sdp-change` |
| `select` | `onSelect` | `select` | `sdp-select` |
| `clear` | `onClear` | `clear` | `sdp-clear` |
| `range:start` | `onRangeStart` | `range-start` | `sdp-range-start` |
| `range:complete` | `onRangeComplete` | `range-complete` | `sdp-range-complete` |
| `open` | `onOpen` | `open` | `sdp-open` |
| `close` | `onClose` | `close` | `sdp-close` |
| `view:change` | `onViewChange` | `view-change` | `sdp-view-change` |
| `month:change` | `onMonthChange` | `month-change` | `sdp-month-change` |
| `year:change` | `onYearChange` | `year-change` | `sdp-year-change` |
| `locale:change` | `onLocaleChange` | `locale-change` | `sdp-locale-change` |
| `calendar:change` | `onCalendarChange` | `calendar-change` | `sdp-calendar-change` |
| `time:change` | `onTimeChange` | `time-change` | `sdp-time-change` |
| `shortcut` | `onShortcut` | `shortcut` | `sdp-shortcut` |
| `input` | `onInput` | `input` | `sdp-input` |
| `error` | `onError` | `error` | `sdp-error` |
| `open` + `close` | `onOpenChange(open: boolean)` | `open-change` | ندارد |

کامپوننت‌های Vue برای `v-model` رویداد `update:modelValue` را هم صادر می‌کنند. فهرست‌های زمان اجرا با نام‌های `PICKER_EVENTS`، `EVENT_HANDLER_NAMES`، `EVENT_EMIT_NAMES` و `DATEPICKER_ELEMENT_EVENTS` export شده‌اند.

فیلد تاریخ مجموعهٔ رویدادهای کوچک‌تر خودش را دارد. [فیلد تاریخ](/fa/api/date-field#events) را ببینید.

## گزارش زندهٔ رویدادها {#live-event-log}

با این پیکر کار کنید و رسیدن هر رویداد را تماشا کنید:

<Demo inline :controls="['events', 'value']" caption="core.onAny() که یک گزارش زنده را تغذیه می‌کند." />

## `PickerValue` بر اساس حالت {#pickervalue-by-mode}

`value` در payload رویداد `change` یک union است که با `mode` از هم جدا می‌شود:

```ts
type ChangeSource = 'select' | 'input' | 'api' | 'clear' | 'time' | 'shortcut'

type PickerValue =
  | { mode: 'single';   date: DateValue | null }
  | { mode: 'range';    start: DateValue | null; end: DateValue | null }
  | { mode: 'multiple'; dates: DateValue[] }
```

`isSingleValue`، `isRangeValue`، `isMultipleValue` و `isPickerValue` نوع آن را باریک می‌کنند. مقدار ثابت `mode` روی پیکر یا hook این کار را خودش انجام می‌دهد.

## `DateValue` {#datevalue}

هر تاریخ در یک payload یک `DateValue` است: همان روز در همهٔ شکل‌های مفید، تا خودتان چیزی تبدیل نکنید.

```js
picker.on('change', ({ value }) => {
  // value.date (حالت تکی، fa-IR، نوروز ۱۴۰۵):
  // {
  //   jalali:    { year: 1405, month: 1, day: 1 },
  //   gregorian: { year: 2026, month: 3, day: 21 },
  //   hijri:     { year: 1447, month: 10, day: 2 },
  //   date:      Date,            // Date بومی در نیمه‌شب محلی
  //   iso:       '2026-03-21',    // ISO میلادی
  //   jdn:       2461121,         // شمارهٔ روز ژولینی
  //   weekday:   6,               // ۰ = یکشنبه … ۶ = شنبه
  //   formatted: '۱۴۰۵/۰۱/۰۱',    // لوکال فعال و قالب نمایش
  // }
})
```

| فیلد | نوع | توضیح |
|---|---|---|
| `jalali` | `DateParts` | سال، ماه و روز جلالی. |
| `gregorian` | `DateParts` | سال، ماه و روز میلادی. |
| `hijri` | `DateParts?` | اجزای هجری قمری، هر وقت تقویم قمری بتواند آن تاریخ را نشان دهد (به‌طور پیش‌فرض ۱۳۰۰ تا ۱۶۰۰ قمری). |
| `date` | `Date` | `Date` بومی در نیمه‌شب محلی. |
| `iso` | `string` | `YYYY-MM-DD` میلادی. |
| `jdn` | `number` | شمارهٔ روز ژولینی. |
| `weekday` | `WeekDay` | `0` = یکشنبه … `6` = شنبه. |
| `formatted` | `string` | قالب‌بندی‌شده با لوکال فعال و قالب نمایش. وقتی `time` روشن است ساعت را هم دارد، و برای واحدهای هفته، ماه و سال کل دوره را توصیف می‌کند (`'خرداد ۱۴۰۵'`). |
| `time` | `TimeValue?` | `{ hour, minute, second }`، فقط وقتی انتخابگر ساعت روشن است. |
| `end` | `DateValue?` | آخرین روز دوره وقتی [`unit`](/fa/guide/selection-units) برابر `'week'`، `'month'` یا `'year'` است. خود مقدار، روز اول است. |

## کدهای خطا {#error-codes}

| کد | معنی |
|---|---|
| `invalid-input` | متن تایپ‌شده یا ثبت‌شده تاریخ معتبری نیست. |
| `out-of-range` | متن تایپ‌شده یا ثبت‌شده به تاریخی بیرون از `min` / `max` اشاره می‌کند. |
| `disabled` | `disabledDates` این تاریخ را می‌گیرد (`reason` دلیل آن را دارد، اگر داده شده باشد)، یا یک کلیک یا `select()` بیرون از `min` / `max` افتاده است. |
| `range-length` | بازه حد `minDays` / `maxDays` را می‌شکند. |
| `no-locale-variant` | `setCalendar` لوکالی با همین زبان برای آن تقویم پیدا نکرد. |

`message` رشته‌ای انگلیسی برای توسعه‌دهنده است. `input` متن ردشده است و برای ورودی تایپ‌شده وجود دارد.

```js
picker.on('error', ({ code, reason }) => {
  if (code === 'disabled' && reason) showHint(reason)   // 'ظرفیت تکمیل'
  if (code === 'range-length') showHint('۲ تا ۱۴ شب')
})
```
