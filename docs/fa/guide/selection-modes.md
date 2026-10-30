# حالت‌های انتخاب

گزینهٔ `mode` تعیین می‌کند کاربر چند تاریخ انتخاب کند: یکی، یک بازه، یا هر تعداد. حالت انتخاب شکل مقدار و رویدادهایی را هم که صادر می‌شوند تعیین می‌کند. برای انتخاب حالت مناسب و تعیین مقدار اولیه‌اش این صفحه را بخوانید.

::: tip هفته، ماه و سال
گزینهٔ `mode` تعیین می‌کند چند مورد انتخاب شود. برای اینکه هر کلیک یک هفته، ماه یا سالِ کامل را انتخاب کند، آن را با [`unit`](./selection-units) ترکیب کنید: انتخاب ماه، انتخاب هفته، یا بازه‌ای از ماه‌ها.
:::

## تکی {#single}

حالت پیش‌فرض: هر بار یک تاریخ.

```js
createDatePicker('#date', { locale: 'fa-IR', mode: 'single' })
```

<Demo inline mode="single" :controls="['value']" caption="mode: 'single'" />

مقدار به شکل `{ mode: 'single', date: DateValue | null }` است.

## بازه {#range}

یک شروع و یک پایان انتخاب کنید. تا وقتی پایان انتخاب نشده، تقویم بازه را تا روزی که نشانگر رویش است پیش‌نمایش می‌دهد، در همهٔ پن‌های ماه.

```js
createDatePicker('#stay', { locale: 'fa-IR', mode: 'range', months: 2 })
```

<Demo inline mode="range" :months="2" :controls="['value']" caption="mode: 'range' با دو پن و پیش‌نمایش بازه زیر نشانگر." />

مقدار به شکل `{ mode: 'range', start: DateValue | null, end: DateValue | null }` است و دو سر بازه همیشه به ترتیب‌اند. علاوه بر `change`، دو رویداد دیگر هم صادر می‌شود:

```js
picker.on('range:start', ({ start }) => console.log('شروع', start.formatted))
picker.on('range:complete', ({ start, end }) => console.log('تمام', start, end))
```

## چندتایی {#multiple}

با کلیک روی هر تعداد تاریخ، آن‌ها را انتخاب یا از انتخاب خارج کنید.

```js
createDatePicker('#days-off', { locale: 'fa-IR', mode: 'multiple' })
```

<Demo inline mode="multiple" :controls="['value']" caption="mode: 'multiple' — با هر کلیک، تاریخ انتخاب یا از انتخاب خارج می‌شود." />

مقدار به شکل `{ mode: 'multiple', dates: DateValue[] }` است.

## تعیین مقدار اولیه {#setting-an-initial-value}

گزینهٔ `value` هر چیزی را که حالت انتظار دارد می‌پذیرد:

```js
// تکی
createDatePicker('#a', { value: '2026-03-21' })

// بازه
createDatePicker('#b', { mode: 'range', value: { start: '2026-03-21', end: '2026-04-10' } })

// چندتایی
createDatePicker('#c', { mode: 'multiple', value: ['2026-03-21', '2026-03-28'] })
```

هر تاریخ می‌تواند هر `DateInput` باشد: رشتهٔ ISO میلادی، یک `Date` بومی، یک [`PlainDate`](/fa/core/plain-date)، یا اجزای `{ year, month, day, calendar? }` (اگر `calendar` را ندهید، در تقویم پیکر خوانده می‌شود). یک `PickerValue` هم، که از `getValue()` یا رویداد `change` گرفته‌اید، پذیرفته می‌شود؛ پس مقدارها بدون تبدیل رفت‌وبرگشت می‌کنند.

## تعویض حالت در زمان اجرا {#switching-modes-at-runtime}

```js
picker.setMode('range')
```

انتخاب فعلی تا جایی که حالت تازه جا دارد حفظ می‌شود: با رفتن به حالت تکی، اولین تاریخ می‌ماند؛ با رفتن به بازه، دو تاریخ اول (به ترتیب)؛ و با رفتن به چندتایی، همه. اگر تاریخی کنار گذاشته شود، رویداد `change` با source برابر `'api'` صادر می‌شود.

## محدودیت‌ها {#constraints}

گزینه‌های `min`، `max` و `disabledDates` در همهٔ حالت‌ها یکسان کار می‌کنند:

```js
createDatePicker('#date', {
  mode: 'range',
  min: '2026-03-21',
  max: '2026-06-21',
  disabledDates: (date) => date.weekday === 5, // همهٔ جمعه‌ها
})
```

مقدار `disabledDates` یا فهرستی از تاریخ‌هاست یا یک predicate که یک [`PlainDate`](/fa/core/plain-date) می‌گیرد و برای غیرفعال‌کردن آن `true` برمی‌گرداند. روز غیرفعال می‌تواند دلیلش را هم بگوید (با `{ date, reason }`، یا predicateای که یک رشته برمی‌گرداند)؛ جزئیات در [روزهای غیرفعال همراه با دلیل](./shortcuts-and-limits#disabled-dates-with-a-reason).

حالت بازه گزینه‌های `minDays` و `maxDays` را هم برای محدودکردن طول بازه دارد. [میان‌برها](./shortcuts-and-limits) هم در هر حالتی چیپ‌های تک‌کلیکی مثل «۷ روز گذشته» اضافه می‌کنند:

```js
createDatePicker('#stay', { mode: 'range', minDays: 3, maxDays: 15, shortcuts: true })
```

**مطالب مرتبط:** [واحدهای انتخاب](./selection-units) · [میان‌برها و محدودیت‌ها](./shortcuts-and-limits) · [فرم‌ها](./forms)
