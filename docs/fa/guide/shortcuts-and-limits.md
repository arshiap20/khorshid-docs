# میان‌برها و محدودیت‌ها

سه قابلیت تعیین می‌کنند کاربر چه چیزی را و با چه سرعتی می‌تواند انتخاب کند: چیپ‌های میان‌بر مثل «این ماه» یا «۷ روز گذشته»، محدودیت طول بازه (`minDays` / `maxDays`) برای رزرو و گزارش‌گیری، و روزهای غیرفعالی که دلیل غیرفعال بودنشان را می‌گویند. وقتی یک تقویم ساده برای فرایند رزرو، گزارش یا زمان‌بندی شما کافی نیست، این صفحه را بخوانید.

## میان‌برها {#shortcuts}

ردیف چیپ‌ها با `shortcuts: true` روشن می‌شود و مجموعه‌ای متناسب با حالت فعلی پیکر نشان می‌دهد:

```js
createDatePicker('#report', {
  locale: 'fa-IR',
  mode: 'range',
  shortcuts: true,
})
```

<Demo inline mode="range" :options="{ shortcuts: true }" :controls="['locale', 'value']" caption="shortcuts: true در حالت range. لوکال را میلادی کنید تا «این ماه» یک ماه میلادی را انتخاب کند." />

### محاسبه در تقویم فعال {#computed-in-the-active-calendar}

همهٔ پیش‌تنظیم‌ها محاسبه‌شان را در **تقویم فعال** پیکر انجام می‌دهند. در پیکر جلالی، «این ماه»
یعنی ۱ تا ۳۱ فروردین، نه ماه مارس. همین پیکر را به `en-US-gregorian` ببرید تا همان میان‌بر
۱ تا ۳۰ آوریل را انتخاب کند. برای این کار هیچ تنظیمی لازم نیست.

```js
const picker = createDatePicker('#d', { locale: 'fa-IR', mode: 'range', shortcuts: ['thisMonth'] })
picker.core.applyShortcut('thisMonth')
picker.getValue().start.jalali // { year: 1405, month: 1, day: 1 }
picker.getValue().end.jalali   // { year: 1405, month: 1, day: 31 }
```

### ۱۴ پیش‌تنظیم {#the-14-presets}

| پیش‌تنظیم | چه چیزی انتخاب می‌شود |
|---|---|
| `today` · `yesterday` · `tomorrow` | همان یک روز. |
| `thisWeek` · `lastWeek` · `nextWeek` | یک هفتهٔ کامل، با رعایت `weekStart` (برای `fa-IR` از شنبه). |
| `last7Days` · `last30Days` | ۷ یا ۳۰ روزی که به امروز ختم می‌شوند؛ خودِ امروز هم جزو آن‌هاست. |
| `next7Days` | ۷ روز، از امروز به بعد. |
| `thisMonth` · `lastMonth` · `nextMonth` | یک ماه کامل **در تقویم فعال**. |
| `thisYear` · `lastYear` | یک سال کامل **در تقویم فعال** (در جلالی از ۱ فروردین تا ۲۹ یا ۳۰ اسفند). |

اینکه `shortcuts: true` به کدام مجموعه تبدیل شود، به حالت و [واحد انتخاب](./selection-units) بستگی دارد:

| حالت / واحد | مجموعهٔ پیش‌فرض |
|---|---|
| `single` | `today`، `yesterday`، `tomorrow` |
| `range` | `today`، `last7Days`، `last30Days`، `thisWeek`، `thisMonth`، `lastMonth`، `thisYear` |
| `multiple` | `today`، `thisWeek` |
| `unit: 'week'` | `thisWeek`، `lastWeek`، `nextWeek` |
| `unit: 'month'` | `thisMonth`، `lastMonth`، `nextMonth` |
| `unit: 'year'` | `thisYear`، `lastYear` |

نحوهٔ اعمال یک بازهٔ زمانی هم به حالت بستگی دارد: در حالت range هر دو سرِ بازه تنظیم می‌شود؛
در حالت **single** پیش‌تنظیم‌هایی که یک دوره را می‌پوشانند فقط روز اول آن دوره را اعمال می‌کنند؛
و در حالت **multiple** دوره به روزهای جداگانه‌اش باز می‌شود (`thisWeek` هفت تاریخ را انتخاب می‌کند).

برچسب‌ها از لوکال خوانده می‌شوند (`labels.shortcuts`): `fa-IR` چیپ‌هایی مثل «این ماه»،
«۷ روز گذشته» و «امسال» نشان می‌دهد. اگر لوکال سفارشی شما این برچسب‌ها را تعریف نکرده باشد،
نسخهٔ انگلیسی‌شان نمایش داده می‌شود.

### فهرست دلخواه، میان‌برهای دلخواه {#your-own-list-your-own-shortcuts}

با دادن یک آرایه، خودتان تعیین می‌کنید کدام چیپ‌ها و به چه ترتیبی نمایش داده شوند.
پیش‌تنظیم‌ها و میان‌برهای سفارشی را می‌شود آزادانه کنار هم گذاشت. `value` یک میان‌بر سفارشی
می‌تواند هر چیزی باشد که `setValue` می‌پذیرد، یا تابعی که context فعلی را دریافت می‌کند:

```js
createDatePicker('#d', {
  locale: 'fa-IR',
  mode: 'range',
  shortcuts: [
    'today',
    'last7Days',
    { id: 'nowruz', label: 'تعطیلات نوروز', value: { start: '2026-03-21', end: '2026-04-02' } },
    {
      id: 'next3',
      label: '۳ روز آینده',
      // ShortcutContext: { today, calendar, locale, weekStart, mode, unit }
      value: ({ today }) => ({ start: today, end: today.add({ days: 2 }) }),
    },
  ],
})
```

`today` در این context یک [`PlainDate`](/fa/core/plain-date) در تقویم فعال است؛ بنابراین
`today.startOfMonth()`، `today.add({ months: -3 })` و متدهای مشابه همگی با ماه‌های جلالی کار می‌کنند.

### چیپ‌های active و disabled {#active-and-disabled-chips}

هر چیپ دو چیز را دربارهٔ خودش می‌داند:

- **`active`**: مقدار فعلی پیکر دقیقاً همان چیزی است که این میان‌بر اعمال می‌کند. در این حالت
  چیپ کلاس `.sdp__shortcut--active` و `aria-pressed="true"` می‌گیرد.
- **`disabled`**: اعمال این میان‌بر یکی از محدودیت‌ها را نقض می‌کند (`min` / `max`،
  `disabledDates`، `minDays` / `maxDays`). چیپ به‌صورت دکمهٔ غیرفعال نمایش داده می‌شود و
  اعمال‌کردنش هیچ اثری ندارد.

```js
createDatePicker('#d', {
  mode: 'range',
  maxDays: 10,
  shortcuts: ['today', 'last7Days', 'last30Days'], // 'last30Days' غیرفعال است: از سقف مجاز طولانی‌تر است
})
```

### کنترل میان‌برها از کد {#driving-shortcuts-yourself}

ردیف چیپ‌ها یک رندرکننده روی دو متد هسته است؛ با همین دو متد می‌توانید میان‌برها را در
نوار کناری یا منوی کشویی خودتان هم نمایش دهید:

```js
picker.core.getShortcuts()
// → [{ id: 'today', label: 'امروز', active: false, disabled: false }, …]

picker.core.applyShortcut('thisMonth')
```

با اعمال یک میان‌بر، اول رویداد `shortcut` و بعد رویداد `change` با source برابر `'shortcut'`
صادر می‌شود؛ اگر مقدار کامل باشد و `autoClose` روشن باشد، overlay هم بسته می‌شود:

```js
picker.on('shortcut', ({ id, value }) => analytics.track('shortcut', id))
picker.on('change', ({ source }) => {
  if (source === 'shortcut') { /* … */ }
})
```

کلیدهایی که داخل ردیف چیپ‌ها زده می‌شوند ناوبری گرید به حساب نمی‌آیند؛ پس Tab و کلیدهای
جهت‌نما آنجا همان رفتار بومی مرورگر را دارند.

## محدودیت طول بازه: `minDays` / `maxDays` {#range-length-mindays-maxdays}

فرایندهای رزرو به حداقل مدت اقامت نیاز دارند و صفحه‌های گزارش و تحلیل به سقفی برای بازهٔ
زمانی. هر دو محدودیت **روزهای تقویمی را با احتساب هر دو سرِ بازه** می‌شمارند: بازه‌ای که شروع
و پایانش یک روز باشد ۱ روز حساب می‌شود، و **دو شب اقامت در هتل یعنی ۳ روز**.

```js
createDatePicker('#stay', {
  mode: 'range',
  months: 2,
  minDays: 3,  // دست‌کم دو شب
  maxDays: 15, // حداکثر دو هفته
})
```

<Demo inline mode="range" :options="{ minDays: 3, maxDays: 8 }" :controls="['value', 'error']" caption="minDays: 3 و maxDays: 8. روز شروع را انتخاب کنید: تا وقتی پایان بازه را انتخاب نکرده‌اید، روزهای خیلی نزدیک یا خیلی دور غیرفعال می‌مانند." />

تا وقتی پایان بازه انتخاب نشده، هر روزی که محدودیت را نقض کند **غیرفعال** است، آن هم در هر دو
جهت (چون انتخاب پایانی قبل از روز شروع هم مجاز است). همین که بازه کامل شد، محدودیت‌ها دوباره
برداشته می‌شوند تا کاربر بتواند از هر جای تقویم از نو شروع کند.

اگر بازه‌ای کوتاه‌تر یا بلندتر از حد مجاز از راه دیگری برسد (متن تایپ‌شده، `submitInput`)،
با رویداد `error` رد می‌شود و روز شروع همچنان انتخاب‌شده می‌ماند:

```js
picker.on('error', ({ code }) => {
  if (code === 'range-length') toast('Stays are 2 to 14 nights')
})
```

میان‌برهایی که این محدودیت‌ها را نقض کنند هم غیرفعال نمایش داده می‌شوند (بخش قبل را ببینید).

## روزهای غیرفعال همراه با دلیل {#disabled-dates-with-a-reason}

گزینهٔ `disabledDates` تاریخ‌های ساده را می‌پذیرد، اما هر مورد می‌تواند یک `reason` (دلیل) هم داشته
باشد. تابع predicate هم می‌تواند به‌جای `true` یک رشته برگرداند:

```js
createDatePicker('#appointment', {
  locale: 'fa-IR',
  disabledDates: [
    { date: '2026-04-10', reason: 'ظرفیت تکمیل است' },
    '2026-04-11', // غیرفعال، بدون دلیل
  ],
})

createDatePicker('#delivery', {
  locale: 'en-US-gregorian',
  disabledDates: (date) => (date.weekday === 5 ? 'Closed on Fridays' : false),
})
```

<Demo inline locale="en-US-gregorian" :options="{ disabledDates: (d) => d.weekday === 5 ? 'Closed on Fridays' : d.day === 13 ? 'Inventory day' : false }" :controls="['value', 'error']" caption="نشانگر را روی یک جمعه یا روز سیزدهم ببرید تا دلیل را در tooltip ببینید. کلیک روی آن، رویداد error را همراه با دلیل صادر می‌کند." />

تابع predicate یک [`PlainDate`](/fa/core/plain-date) دریافت می‌کند. برای غیرفعال کردن روز، `true` یا رشتهٔ
دلیل را برگردانید و برای مجاز بودنش `false`، `null` یا `undefined`.

دلیل هر جا که به کار بیاید حاضر است:

| کجا | چه اتفاقی می‌افتد |
|---|---|
| tooltip | ویژگی `title` خانهٔ تقویم همان دلیل است. |
| کلاس | خانه کلاس `.sdp__day--has-reason` را می‌گیرد (هر طور که می‌خواهید استایلش کنید). |
| صفحه‌خوان | دلیل به نام دسترس‌پذیر (accessible name) خانه اضافه می‌شود: «جمعه ۲۱ فروردین ۱۴۰۵، ظرفیت تکمیل است». |
| مدل رندر | `DayCell.disabledReason` برای رابط‌های کاربری سفارشی. |
| رویدادها | انتخابی که رد شود (با کلیک یا متن تایپ‌شده) رویداد `error` را با `code: 'disabled'` و `reason` صادر می‌کند. |

```js
picker.on('error', ({ code, reason }) => {
  if (code === 'disabled' && reason) showHint(reason)
})
```

**مطالب مرتبط:** [حالت‌های انتخاب](./selection-modes) · [واحدهای انتخاب](./selection-units) · [ورودی طبیعی](./natural-input)
