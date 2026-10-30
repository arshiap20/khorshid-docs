# تقویم دوم

خیلی از کاربران هم‌زمان با دو تقویم سروکار دارند: تاریخ جلالی برای زندگی روزمره، تاریخ میلادی
برای بلیت هواپیما یا فرم ویزا، و تاریخ قمری برای مناسبت‌های مذهبی. گزینهٔ `secondaryCalendar`
شمارهٔ روزِ یک تقویم دوم را زیر هر روز و ماه‌های آن را زیر عنوان نشان می‌دهد.

## روشن‌کردن {#turning-it-on}

```js
createDatePicker('#date', { locale: 'fa-IR', secondaryCalendar: true })
```

<Demo inline :options="{ secondaryCalendar: true }" :controls="['locale', 'value']" caption="secondaryCalendar: true. تقویم جلالی تاریخ میلادی را نشان می‌دهد؛ لوکال را میلادی کنید تا تاریخ جلالی نمایش داده شود." />

## انتخاب تقویم دوم {#choosing-the-second-calendar}

| مقدار | چه چیزی نمایش می‌دهد |
|---|---|
| `true` | همتای طبیعی: جلالی ↔ میلادی. در لوکال قمری: برای فارسی و پشتو جلالی، و در بقیه میلادی. |
| `'gregorian'` · `'jalali'` · `'hijri'` | همان تقویم. |
| `false` (پیش‌فرض) | هیچ‌چیز. |

اگر نام تقویم **اصلی** را بدهید، تقویم دوم خاموش می‌شود. مقدار `secondaryCalendar: 'jalali'` روی پیکر
جلالی چیزی نشان نمی‌دهد؛ بنابراین می‌توانید یک مقدار ثابت به پیکرهایی بدهید که لوکالشان در زمان
اجرا عوض می‌شود. با `true`، همتای تقویم در هر تغییر لوکال دوباره تعیین می‌شود:

```js
const picker = createDatePicker('#d', { locale: 'fa-IR', secondaryCalendar: true })
picker.core.getSecondaryCalendar() // 'gregorian'
picker.setLocale('en-US-gregorian')
picker.core.getSecondaryCalendar() // 'jalali'
```

یک تقویم جلالی با تاریخ قمری در زیر هر روز، برای انتخاب تاریخ با در نظر گرفتن مناسبت‌های مذهبی:

```js
createDatePicker('#date', { locale: 'fa-IR', secondaryCalendar: 'hijri' })
```

<Demo inline :options="{ secondaryCalendar: 'hijri' }" :controls="['value']" caption="fa-IR با secondaryCalendar: 'hijri'. زیرعنوان، ماه‌های قمری‌ای را که این صفحه در بر می‌گیرد نام می‌برد." />

## چه چیزی نمایش داده می‌شود {#what-renders}

- **زیر هر روز**: شمارهٔ روز در تقویم دوم، **با رقم‌های لوکال اصلی** (صفحهٔ فارسی از اول تا آخر
  رقم فارسی دارد). در نخستین روز هر ماه از تقویم دوم، به‌جای شماره نام کوتاه ماه نمایش داده
  می‌شود (`آوریل`) تا مرز ماه‌ها در یک نگاه دیده شود.
- **زیر عنوان**: ماه‌هایی از تقویم دوم که این صفحه را پوشش می‌دهند، مثلاً `مارس – آوریل ۲۰۲۶`
  (برای قمری `رمضان – شوال ۱۴۴۷`). اگر چند پن داشته باشید، هر کدام زیرعنوان خودش را دارد.
- **برای صفحه‌خوان**: تاریخ کامل در تقویم دوم به نام دسترس‌پذیر هر روز اضافه می‌شود:
  `شنبه ۱۵ فروردین ۱۴۰۵ (۴ آوریل ۲۰۲۶)`.

نام ماه‌های تقویم دوم به **زبان** لوکال اصلی نوشته می‌شود: پیکر فارسی `آوریل` نشان می‌دهد و پیکر
انگلیسی `April` یا `Farvardin`.

## کلاس‌ها {#classes}

| سلکتور | کاربرد |
|---|---|
| `.sdp--secondary` | روی ریشهٔ پنل، تا وقتی تقویم دوم نمایش داده می‌شود. |
| `.sdp__day-sub` | برچسب کوچک تقویم دوم داخل هر روز. |
| `.sdp__day-sub--month-start` | همان برچسب در نخستین روز هر ماه از تقویم دوم (نام ماه را نشان می‌دهد). |
| `.sdp__subtitle` / `.sdp__subtitle-part` | سطر زیر عنوان / یک بخش برای هر پن. |

```css
.sdp__day-sub { opacity: .6; }
.sdp__day-sub--month-start { color: var(--sdp-accent); font-weight: 600; }
```

## در رابط کاربری سفارشی {#in-a-custom-ui}

رندرکننده‌های headless همین داده‌ها را روی مدل‌های رندر دریافت می‌کنند:

```js
const cell = picker.core.getGrid().weeks[2][3]
cell.secondary
// {
//   calendar: 'gregorian',
//   parts: { year: 2026, month: 4, day: 4 },
//   label: '۴',              // با رقم‌های لوکال اصلی
//   monthStart: false,       // در روز اول هر ماه از تقویم دوم true است
//   monthLabel: 'آوریل',     // نام کوتاه ماه، به زبان اصلی
//   formatted: '۴ آوریل ۲۰۲۶' // برای tooltip و aria-label
// }

picker.core.getTitle().secondary // 'مارس – آوریل ۲۰۲۶'
```

توابع `secondaryDayText(cell.secondary)` و `secondaryDayClassName(cell.secondary)` از هسته دقیقاً
همان چیزی را برمی‌گردانند که رندرکنندهٔ آماده نمایش می‌دهد؛ پس React، Vue و رابط‌های سفارشی با آن
یکسان می‌مانند.

**مطالب مرتبط:** [تقویم‌ها و لوکال‌ها](./calendars-and-locales) · [تم‌بندی](./theming) · [هستهٔ headless](/fa/core/)
