# تقویم‌ها و لوکال‌ها

خورشید سه سیستم تقویم و نُه لوکال آماده دارد که هر کدام یک زبان را با یک تقویم جفت می‌کند. این صفحه توضیح می‌دهد این‌ها چطور کنار هم کار می‌کنند، تقویم را چطور در زمان اجرا عوض کنید، تقویم هجری قمری را چطور تنظیم کنید و لوکال خودتان را چطور ثبت کنید.

## سه سیستم تقویم {#three-calendar-systems}

هر تاریخ بدون خطا بین تقویم‌ها تبدیل می‌شود، چون نمایش درونی تاریخ‌ها **شمارهٔ روز ژولینی (JDN)** است: عددی صحیح که روزها را می‌شمارد و به هیچ تقویم خاصی تعلق ندارد.

| تقویم | `CalendarId` | الگوریتم | بازهٔ پشتیبانی‌شده |
|---|---|---|---|
| جلالی (هجری شمسی) | `'jalali'` | الگوریتم break-table جلالی، منطبق با تقویم رسمی ایران | سال `-61` تا `3177` ه‍.ش |
| میلادی | `'gregorian'` | میلادیِ Proleptic | ۲۰ مارس ۵۶۰ تا ۱۹ مارس ۳۷۹۹ میلادی (همان بازه‌ای که جدول جلالی پوشش می‌دهد) |
| هجری قمری | `'hijri'` | به‌طور پیش‌فرض جدول ام‌القری؛ گونهٔ جدولیِ «civil» هم در دسترس است | ۱۳۰۰ تا ۱۶۰۰ ه‍.ق (ام‌القری)، ۱ تا ۳۰۰۰ ه‍.ق (civil) |

بازهٔ میلادی به بازهٔ جلالی محدود است، چون هر [`DateValue`](/fa/api/events#datevalue) تاریخ را در هر دو تقویم نگه می‌دارد. جدول ام‌القری برای تک‌تک روزهای ۱۹۰۰ تا ۲۱۰۰ میلادی با ICU مقایسه شده است.

## لوکال‌ها {#locales}

هر لوکال یک زبان، یک تقویم و قراردادهای آن را به هم گره می‌زند: جهت متن، نخستین روز هفته، روزهای تعطیل آخر هفته، ارقام، نام ماه‌ها و روزهای هفته، قالب‌های تاریخ و برچسب‌های رابط کاربری. این نُه لوکال آماده‌اند:

| کلید | زبان | تقویم | جهت | شروع هفته | ماه‌ها |
|---|---|---|---|---|---|
| `fa-IR` | فارسی | جلالی | RTL | شنبه | فروردین، اردیبهشت … |
| `en-US` | انگلیسی | **جلالی** | LTR | شنبه | Farvardin, Ordibehesht … |
| `fa-IR-gregorian` | فارسی | میلادی | RTL | شنبه | ژانویه، فوریه … |
| `en-US-gregorian` | انگلیسی | میلادی | LTR | یکشنبه | January, February … |
| `fa-IR-hijri` | فارسی | هجری قمری | RTL | شنبه | محرم، صفر … |
| `en-US-hijri` | انگلیسی | هجری قمری | LTR | یکشنبه | Muharram, Safar … |
| `fa-AF` | دری | جلالی | RTL | شنبه | حمل، ثور، جوزا … |
| `fa-AF-gregorian` | دری | میلادی | RTL | شنبه | جنوری، فبروری … |
| `ps-AF` | پشتو | جلالی | RTL | شنبه | وری، غویی، غبرگولی … |

بین آن‌ها جابه‌جا شوید. جهت متن، ارقام، روز شروع هفته و نام ماه‌ها با هم عوض می‌شوند:

<Demo inline :controls="['locale', 'value']" caption="یک پیکر با همهٔ لوکال‌های آماده. از منوی بالا لوکال را عوض کنید." />

::: tip لوکال `en-US`
لوکال `en-US` همان تقویم جلالی با نام ماه‌های انگلیسیِ آوانگاری‌شده است: Farvardin، Ordibehesht، Khordad و … . این لوکال برای کاربران انگلیسی‌زبانی است که با تقویم شمسی کار می‌کنند، و دلیل جدا بودن تنظیم تقویم از زبان هم همین است.
:::

### افغانستان: دری و پشتو {#afghanistan-dari-and-pashto}

افغانستان همان تقویم هجری شمسیِ ایران را به کار می‌برد، با این تفاوت که ماه‌ها نام برج‌های فلکی را دارند. لوکال‌های `fa-AF` (دری) و `ps-AF` (پشتو) لوکال‌های جلالی با همین نام‌ها هستند و `fa-AF-gregorian` تقویم میلادی را با املای افغانیِ نام ماه‌ها (جنوری، فبروری، مارچ …) در اختیار کاربران دری‌زبان می‌گذارد:

```js
createDatePicker('#date', { locale: 'fa-AF' })            // ۱ حمل ۱۴۰۵
createDatePicker('#date', { locale: 'ps-AF' })            // ۱ وری ۱۴۰۵
createDatePicker('#date', { locale: 'fa-AF-gregorian' })  // ۲۱ مارچ ۲۰۲۶
```

## تعویض تقویم {#switching-the-calendar}

هر گونهٔ تقویمی یک لوکال جداگانه است تا نام ماه‌ها همیشه با تقویم جور باشد. متد `setCalendar()` به گونهٔ هم‌زبان می‌رود و منطقهٔ فعلی را در اولویت قرار می‌دهد:

```js
const picker = createDatePicker('#date', { locale: 'fa-IR' })
picker.setCalendar('gregorian') // → fa-IR-gregorian
picker.setCalendar('hijri')     // → fa-IR-hijri
picker.setCalendar('jalali')    // → بازگشت به fa-IR

const dari = createDatePicker('#date2', { locale: 'fa-AF' })
dari.setCalendar('gregorian')   // → fa-AF-gregorian (و نه fa-IR-gregorian)
```

اگر آن منطقه برای تقویم موردنظر گونه‌ای نداشته باشد، نخستین لوکال ثبت‌شده با همان زبان انتخاب می‌شود (`fa-AF` با `'hijri'` به `fa-IR-hijri` می‌رسد). اگر برای آن زبان اصلاً گونه‌ای وجود نداشته باشد (مثلاً لوکال پشتوی میلادی نداریم)، پیکر رویداد `error` را با کد `'no-locale-variant'` صادر می‌کند و لوکال فعلی‌اش را نگه می‌دارد. همین جست‌وجو را مستقیم هم می‌توانید انجام دهید:

```js
import { getLocaleForCalendar } from 'khorshid'

getLocaleForCalendar('fa', 'gregorian', 'fa-AF') // fa-AF-gregorian
getLocaleForCalendar('ps', 'gregorian')          // null
```

## تقویم هجری قمری {#the-hijri-calendar}

با یک لوکال هجری، کل پیکر با ماه‌های قمری کار می‌کند: جدول روزها، سرصفحه، ماسک ورودی، قالب‌بندی، [میان‌برها](./shortcuts-and-limits) («این ماه» یعنی رمضان) و [ورودی طبیعی](./natural-input):

```js
createDatePicker('#date', { locale: 'fa-IR-hijri' })   // ۱۴۴۷/۱۰/۰۱
createDatePicker('#date', { locale: 'en-US-hijri' })   // 10/01/1447
```

<Demo inline locale="fa-IR-hijri" :options="{ secondaryCalendar: true }" :controls="['value']" caption="لوکال fa-IR-hijri با secondaryCalendar: true که در فارسی، هجری قمری را کنار جلالی نشان می‌دهد." />

هر [`DateValue`](/fa/api/events#datevalue)، فارغ از تقویم فعال، اجزای هجری را هم دارد، به شرط آنکه تاریخ در بازهٔ تقویم هجری بگنجد:

```js
picker.on('change', ({ value }) => {
  value.date.jalali    // { year: 1404, month: 12, day: 29 }
  value.date.gregorian // { year: 2026, month: 3,  day: 20 }
  value.date.hijri     // { year: 1447, month: 10, day: 1 }  (۱ شوال)
})
```

### ام‌القری، civil و تنظیمات محلی {#umm-al-qura-civil-and-local-adjustments}

تقویم پیش‌فرضِ `'hijri'` همان تقویم ام‌القری عربستان سعودی است که از یک جدول تعبیه‌شده خوانده می‌شود (۱۳۰۰ تا ۱۶۰۰ ه‍.ق، تقریباً ۱۸۸۲ تا ۲۱۷۴ میلادی). تاریخ‌های بیرون از این جدول نامعتبرند و تقویم در لبه‌های جدول به محاسبهٔ ریاضی رو نمی‌آورد.

در بسیاری از کشورها آغاز ماه قمری با رؤیت محلی هلال تعیین می‌شود، پس تقویمی که در عمل رعایت می‌شود ممکن است یک روز با جدول فرق داشته باشد. با `createHijriCalendar` یک تقویم تنظیم‌شده بسازید و آن را به‌جای تقویم پیش‌فرض ثبت کنید:

```js
import { createHijriCalendar, registerCalendar } from 'khorshid'

registerCalendar(
  createHijriCalendar({
    adjustments: {
      '1447-09': 29, // رمضان امسال در اینجا ۲۹ روزه است
    },
  }),
)
```

گزینهٔ `adjustments` کلیدهای `'YYYY-MM'` را به `29` یا `30` نگاشت می‌کند. طول هر ماه تعیین می‌کند همهٔ ماه‌های بعدی از کجا شروع شوند:

- برای اینکه ماه M یک روز زودتر شروع شود، ماه M-1 را کوتاه کنید (۳۰ ← ۲۹) و ماه M را بلند (۲۹ ← ۳۰).
- برای اینکه یک روز دیرتر شروع شود، برعکس عمل کنید.
- تنظیم حتی یک ماه، همهٔ ماه‌های بعد از آن را جابه‌جا می‌کند.

برای تقویمی کاملاً حسابی، `createHijriCalendar({ variant: 'civil' })` تقویم اسلامیِ جدولی را می‌سازد (مبدأ civil، ۱۱ سال کبیسه در هر چرخهٔ ۳۰ساله، سال‌های ۱ تا ۳۰۰۰). این گونه هم `adjustments` را می‌پذیرد. هر دو گونه `id: 'hijri'` را گزارش می‌کنند.

::: tip تعطیلات
[provider آفلاین تعطیلات ایران](./holidays#offline-no-network) تعطیلات مذهبی را با یک تقویم هجری محاسبه می‌کند؛ پس همین تنظیمات هم پیکر را درست می‌کند و هم علامت‌های تعطیلی را.
:::

## تقویم دوم زیر هر روز {#a-second-calendar-under-every-day}

با گزینهٔ `secondaryCalendar` می‌توانید تاریخ میلادی را زیر هر روز جلالی نشان دهید، یا هر ترکیب دیگری را. جزئیات در [تقویم دوم](./secondary-calendar).

## بازنویسی قراردادها {#overriding-conventions}

سه گزینه قراردادهای لوکال را برای یک پیکر تغییر می‌دهند، بدون اینکه لوکال تازه‌ای ثبت کنید:

| گزینه | چه چیزی را تغییر می‌دهد |
|---|---|
| `weekStart` | نخستین روز هفته، از `0` (یکشنبه) تا `6` (شنبه). |
| `weekdays` | برچسب ستون‌های روز هفته: دقیقاً ۷ رشته که بر اساس شمارهٔ روز هفته (`0` = یکشنبه) مرتب شده‌اند، نه بر اساس ترتیب نمایش. |
| `format` | قالب نمایش ورودی و مقدار `formatted`. [ماسک ورودی و قالب‌بندی](./input-mask) را ببینید. |

```js
createDatePicker('#date', {
  locale: 'en-US-gregorian',
  weekStart: 1, // دوشنبه
})
```

## ثبت لوکال سفارشی {#registering-a-custom-locale}

لوکال خودتان را با `registerLocale` اضافه کنید. این لوکال باید نوع `Locale` را پیاده کند و ساده‌ترین راه این است که یک لوکال آماده را باز کنید و فقط چیزهایی را که لازم دارید تغییر دهید:

```js
import { registerLocale, faIR } from 'khorshid'

registerLocale({
  ...faIR,
  key: 'fa-IR-custom',
  name: 'فارسی (سفارشی)',
  weekStart: 5,     // هفته از جمعه شروع شود
  formats: { ...faIR.formats, display: 'D MMMM YYYY' },
  labels: {
    ...faIR.labels,
    shortcuts: { ...faIR.labels.shortcuts, thisMonth: 'ماه جاری' },
    invalidDate: 'این تاریخ قابل قبول نیست',
  },
})

createDatePicker('#date', { locale: 'fa-IR-custom' })
```

دو برچسب اختیاری‌اند تا لوکال‌های سفارشیِ قدیمی همچنان بدون خطا کامپایل شوند:

| برچسب | کاربرد | مقدار جایگزین |
|---|---|---|
| `labels.shortcuts` | متن چیپ‌های ۱۴ [میان‌بر آماده](./shortcuts-and-limits#the-14-presets). رکورد ناقص هم پذیرفته است. | انگلیسی |
| `labels.invalidDate` | پیام اعتبارسنجی بومیِ فیلد (بخش [فرم‌ها](./forms#validation) را ببینید). | `'Invalid date'` |

لوکالی که ثبت می‌کنید بلافاصله در `setCalendar()` و در پارسر ورودی طبیعی به کار می‌رود؛ این پارسر نام ماه‌ها را از همهٔ لوکال‌های ثبت‌شده روی تقویم فعال می‌خواند.

همهٔ لوکال‌های ثبت‌شده را با `getRegisteredLocales()` فهرست کنید:

```js
import { getRegisteredLocales } from 'khorshid'

for (const locale of getRegisteredLocales()) {
  console.log(locale.key, locale.name, locale.calendar)
}
```

## محاسبات تقویم {#calendar-math}

خود سیستم‌های تقویم هم برای محاسبهٔ مستقیم export شده‌اند. برای نوع تاریخی که روی آن‌ها ساخته شده، [PlainDate](/fa/core/plain-date) را ببینید:

```js
import { jalali, gregorian, hijri, PlainDate } from 'khorshid'

jalali.isLeapYear(1403)        // true
jalali.daysInMonth(1403, 12)   // 30  (اسفند در سال کبیسه)
gregorian.toJDN(2026, 3, 21)   // 2461121
hijri.daysInMonth(1447, 9)     // 30  (رمضان ۱۴۴۷، ام‌القری)

new PlainDate('gregorian', 2026, 3, 20).to('hijri').toParts()
// { year: 1447, month: 10, day: 1 }
```

**مطالب مرتبط:** [تقویم دوم](./secondary-calendar) · [PlainDate](/fa/core/plain-date) · [تعطیلات](./holidays)
