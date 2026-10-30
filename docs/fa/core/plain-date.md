# PlainDate

نوع `PlainDate` تاریخِ تغییرناپذیر و آگاه به تقویم است که در سرتاسر خورشید به کار می‌رود. نه ساعت دارد و نه منطقهٔ زمانی، و به شکل شمارهٔ روز ژولینی ذخیره می‌شود؛ پس تاریخ‌هایی از تقویم‌های مختلف بدون خطا مقایسه و تبدیل می‌شوند. برای محاسبات تاریخ در predicateهای روزهای غیرفعال، میان‌برها، پلاگین‌ها و کدهای headless از آن استفاده کنید.

## ساختن تاریخ {#creating-dates}

```js
import { PlainDate } from 'khorshid/headless'

const nowruz = new PlainDate('jalali', 1405, 1, 1)

PlainDate.today('jalali')       // امروز، در هر تقویمی (پیش‌فرض 'gregorian')
PlainDate.from('2026-03-21')    // رشتهٔ ISO میلادی
PlainDate.from(new Date())      // یک Date بومی (سال، ماه و روز محلی آن)
PlainDate.from({ year: 1405, month: 1, day: 1, calendar: 'jalali' })
PlainDate.fromJDN(2461121, 'jalali')
```

متد `PlainDate.from` هر `DateInput` را می‌پذیرد: یک `PlainDate`، اجزای `{ year, month, day, calendar? }`، یک `Date` بومی، یا رشتهٔ ISO میلادی `'YYYY-MM-DD'`. رشته‌های ISO همیشه میلادی‌اند. اجزای بدون `calendar` در اینجا میلادی خوانده می‌شوند، اما در گزینه‌هایی که به پیکر می‌دهید (`value`، `min`، `goTo()` و …) در تقویم فعال پیکر خوانده می‌شوند. تاریخ نامعتبر خطای `RangeError` می‌دهد.

## ویژگی‌ها و تبدیل {#properties-and-conversion}

```js
nowruz.calendar                  // 'jalali'
nowruz.year; nowruz.month; nowruz.day  // 1405, 1, 1
nowruz.jdn                       // 2461121
nowruz.weekday                   // 6  (۰ = یکشنبه … ۶ = شنبه)
nowruz.daysInMonth               // 31
nowruz.isLeapYear                // false

nowruz.to('gregorian').toParts() // { year: 2026, month: 3, day: 21 }
nowruz.toISO()                   // '2026-03-21'  (ISO همیشه میلادی است)
nowruz.toDate()                  // یک Date بومی در نیمه‌شب محلی
nowruz.toString()                // 'jalali:1405-01-01'
JSON.stringify(nowruz)           // '"2026-03-21"'
```

## محاسبات {#arithmetic}

هر عملیات یک `PlainDate` تازه در همان تقویم برمی‌گرداند. افزودن ماه یا سال، روز را به طول ماه مقصد محدود می‌کند؛ روز و هفته دقیق اضافه می‌شوند:

```js
nowruz.add({ months: 6 })  // 1405/07/01
nowruz.add({ days: 40 })   // 1405/02/10
nowruz.add({ weeks: -1 })  // 1404/12/23
nowruz.with({ day: 15 })   // 1405/01/15
nowruz.startOfMonth()      // 1405/01/01
nowruz.endOfMonth()        // 1405/01/31
```

متد `add` مقدارهای `years`، `months`، `weeks` و `days` را می‌پذیرد که باید عدد صحیح باشند.

## مقایسه {#comparison}

```js
nowruz.isBefore(other)
nowruz.isAfter(other)
nowruz.equals(other)
nowruz.isBetween(a, b)
nowruz.isSameMonth(other)

PlainDate.compare(a, b) // -1 | 0 | 1، برای مرتب‌سازی
```

مقایسه بین تقویم‌های مختلف هم کار می‌کند، چون شمارهٔ روز ژولینی مقایسه می‌شود.

## قالب‌بندی {#formatting}

```js
import { PlainDate, faIR } from 'khorshid/headless'

const d = new PlainDate('jalali', 1405, 1, 1)
d.format('dddd D MMMM YYYY', faIR) // 'شنبه ۱ فروردین ۱۴۰۵'
```

تاریخ اول به تقویم لوکال تبدیل می‌شود. فهرست کامل توکن‌ها در [توکن‌های قالب](/fa/api/format-tokens) آمده است.

## بلوک‌های سازندهٔ سطح‌پایین {#lower-level-building-blocks}

سیستم‌های تقویم و توابع کمکیِ قالب‌بندی و ارقام هم export شده‌اند:

```js
import {
  gregorian, jalali, hijri,    // سیستم‌های تقویم
  registerCalendar,            // جایگزین‌کردن یک سیستم آماده
  formatDate, parseDate, createDateValue,
  toLocaleDigits, toLatinDigits, normalizeDigits, // ابزار ارقام
  faIR,
} from 'khorshid/headless'

jalali.toJDN(1405, 1, 1)       // 2461121
jalali.fromJDN(2461121)        // { year: 1405, month: 1, day: 1 }
jalali.isValid(1403, 12, 30)   // true  (سال کبیسه)
gregorian.isLeapYear(2024)     // true

toLocaleDigits('1405', faIR.digits) // '۱۴۰۵'
toLatinDigits('۱۴۰۵')               // '1405'
```

هر سیستم تقویم متدهای `toJDN`، `fromJDN`، `daysInMonth`، `isLeapYear` و `isValid` را پیاده می‌کند و `id` آن یکی از `'jalali'`، `'gregorian'` یا `'hijri'` است. تابع `registerCalendar` سیستمی را که با همان `id` ثبت شده جایگزین می‌کند؛ [تقویم هجری تنظیم‌شده](/fa/guide/calendars-and-locales#umm-al-qura-civil-and-local-adjustments) هم همین‌طور نصب می‌شود.

**مطالب مرتبط:** [مرجع PlainDate](/fa/core/utilities) · [هستهٔ headless](/fa/core/) · [تقویم‌ها و لوکال‌ها](/fa/guide/calendars-and-locales) · [میان‌برها و محدودیت‌ها](/fa/guide/shortcuts-and-limits)
