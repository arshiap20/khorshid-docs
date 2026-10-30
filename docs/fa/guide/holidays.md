# تعطیلات

پلاگین تعطیلات، `khorshid/holidays`، تعطیلات رسمی را روی تقویم علامت می‌زند. تعطیلاتِ بازه‌ای را که روی صفحه است بارگذاری می‌کند و با پیمایش کاربر، بقیه را هم واکشی می‌کند. وقتی کاربر تاریخی را با توجه به روزهای تعطیل انتخاب می‌کند، مثل زمان تحویل، نوبت یا مرخصی، از آن استفاده کنید.

## شروع سریع {#quick-start}

```js
import { createDatePicker } from 'khorshid'
import { holidaysPlugin } from 'khorshid/holidays'

createDatePicker('#date', {
  locale: 'fa-IR',
  plugins: [holidaysPlugin({ country: 'IR' })], // تعطیلات ایران (جلالی)
})
```

روزهای تعطیل یک نقطه و شمارهٔ روزِ قرمز می‌گیرند. نام تعطیلی در tooltip روز نمایش داده می‌شود و صفحه‌خوان آن را می‌خواند. این پلاگین با `createPicker` از `khorshid/headless` هم به همین شکل کار می‌کند و تعطیلات به شکل [mark روز](./plugins#day-marks) به رندرکنندهٔ خودتان می‌رسند.

گزینهٔ `country` یکی از providerهای آماده را انتخاب می‌کند: `'IR'` (پیش‌فرض) provider ایران را به کار می‌گیرد و هر کد دیگر provider جهانی Nager.Date را. برای انتخاب صریح، `provider` را بدهید.

برای کار بدون شبکه، `offline: true` را اضافه کنید تا تعطیلات ایران همان‌جا در مرورگر محاسبه شود:

```js
holidaysPlugin({ country: 'IR', offline: true })
```

## گزینه‌ها {#options}

| گزینه | پیش‌فرض | توضیح |
|---|---|---|
| `provider` | برگرفته از `country` | منبع داده. [Providerها](#providers) را ببینید. |
| `country` | `'IR'` | یکی از providerهای آماده را انتخاب و پیکربندی می‌کند. |
| `offline` | `false` | تعطیلات را بدون شبکه و به‌صورت محلی محاسبه می‌کند. فقط برای ایران؛ برای کشورهای دیگر خطا می‌دهد. اگر `provider` داده شود نادیده گرفته می‌شود. |
| `markType` | `'holiday'` | مقدار `type` در mark، که به کلاس `.sdp__day--mark-<type>` تبدیل می‌شود. |
| `includeObservances` | `false` | مناسبت‌هایی را هم که تعطیل نیستند علامت می‌زند. |
| `fetch` | `fetch` سراسری | یک fetch سفارشی، برای SSR، احراز هویت یا تست. |
| `onLoad(holidays)` | — | بعد از بارگذاری هر دسته صدا زده می‌شود. |
| `onError(err)` | `console.error` | وقتی بارگذاری شکست بخورد صدا زده می‌شود. |
| `name` | `'holidays'` | نام پلاگین. برای اجرای هم‌زمان چند لایهٔ تعطیلات، آن را عوض کنید. |

## خواندن تعطیلات بارگذاری‌شده {#reading-the-loaded-holidays}

متد `picker.core.getPlugin('holidays')` پلاگین را همراه یک API کوچک برای خواندن دادهٔ بارگذاری‌شده برمی‌گرداند:

```js
const holidays = picker.core.getPlugin('holidays')

holidays.get('2026-03-21')    // Holiday | null
holidays.isHoliday(dateInput) // boolean
holidays.all()                // Holiday[]، مرتب‌شده بر اساس تاریخ
holidays.reload()             // پاک‌کردن کش و واکشی دوبارهٔ بازهٔ دیده‌شده
```

هر `Holiday` همیشه با تاریخ ISO میلادی‌اش کلید می‌خورد:

```ts
interface Holiday {
  iso: string          // 'YYYY-MM-DD' (میلادی)، کلید
  name: string         // هرجا provider ارائه دهد، محلی‌شده
  englishName?: string
  official: boolean    // true یعنی تعطیل رسمی
  raw?: unknown        // رکورد خام provider
}
```

## Providerها {#providers}

هر provider دادهٔ بک‌اند خودش را به `Holiday[]` با کلید ISO میلادی تبدیل می‌کند. پلاگین بر اساس سال میلادی کش می‌کند و برای هر دسته از سال‌هایی که هنوز بارگذاری نشده‌اند، یک بار provider را صدا می‌زند.

```ts
interface HolidayProvider {
  readonly id: string
  load(
    years: number[],
    ctx: { fetch: typeof fetch; signal?: AbortSignal },
  ): Promise<Holiday[]>
}
```

### ایران (آنلاین) {#iran-online}

تعطیلات ایران روی تقویم جلالی تعریف شده‌اند؛ پس این provider هر سال میلادیِ درخواستی را به ماه‌های جلالیِ هم‌پوشان نگاشت می‌کند، آن ماه‌ها را واکشی می‌کند و تعطیلات را با کلید میلادی برمی‌گرداند. لایهٔ انتقال کاملاً قابل‌پیکربندی است:

```js
import { holidaysPlugin, iranProvider } from 'khorshid/holidays'

holidaysPlugin({ provider: iranProvider() })

// به منبعی دیگر وصلش کنید: یک API دیگر، یک هاست استاتیک، یک سرویس داخلی.
iranProvider({
  baseUrl: 'https://my.host',
  endpoint: (jYear, jMonth) => `https://my.host/holidays?y=${jYear}&m=${jMonth}`,
  normalize: (payload, jYear, jMonth) => [/* Holiday[] */],
  includeReligious: true,
})
```

::: tip
منبع پیش‌فرض [holidayapi.ir](https://holidayapi.ir) است. برای هر منبع ایرانی دیگر، `endpoint` و `normalize` را بازنویسی کنید.
:::

### آفلاین (بدون شبکه) {#offline-no-network}

تابع `iranOfflineProvider()` تعطیلات رسمی ایران را به‌صورت محلی محاسبه می‌کند: نه API لازم دارد، نه کلید و نه `fetch`. بنابراین بدون اینترنت، در تست‌ها و روی سرورهای بدون دسترسی به شبکه هم کار می‌کند. نوشتن `holidaysPlugin({ offline: true })` شکل کوتاه همین provider است.

```js
import { holidaysPlugin, iranOfflineProvider } from 'khorshid/holidays'

holidaysPlugin({ offline: true })
// معادل است با:
holidaysPlugin({ provider: iranOfflineProvider() })
```

- **تعطیلات شمسی** (نوروز از ۱ تا ۴ فروردین، ۱۲ و ۱۳ فروردین، ۱۴ و ۱۵ خرداد، ۲۲ بهمن و ۲۹ اسفند) از تقویم جلالی به دست می‌آیند و دقیق‌اند.
- **تعطیلات مذهبی** (تاسوعا، عاشورا، اربعین، عید فطر، عید قربان، غدیر و …) از [تقویم هجری قمری](./calendars-and-locales#the-hijri-calendar) محاسبه می‌شوند که پیش‌فرض آن ام‌القری است.
- اگر دو تعطیلی در یک روز بیفتند، در یک رکورد با هر دو نام ادغام می‌شوند.
- با `includeObservances: true` روی خود provider، چند مناسبت شناخته‌شده که تعطیل نیستند (`official: false`) هم برگردانده می‌شوند، مثل شب یلدا و روز ملی خلیج فارس. اینکه علامت بخورند یا نه را همچنان گزینهٔ `includeObservances` خود پلاگین تعیین می‌کند.

::: warning تاریخ‌های قمری ممکن است یک روز جابه‌جا باشند
در ایران آغاز ماه‌های قمری با رؤیت محلی هلال تعیین می‌شود؛ پس تقویم رسمی ممکن است یک روز با ام‌القری فرق داشته باشد. اگر یک تعطیلی مذهبی روی روز اشتباه افتاد، یک تقویم هجری تنظیم‌شده به provider بدهید:

```js
import { createHijriCalendar } from 'khorshid'
import { holidaysPlugin, iranOfflineProvider } from 'khorshid/holidays'

const iranHijri = createHijriCalendar({
  adjustments: { '1447-09': 29 }, // رمضان ۱۴۴۷ در ایران ۲۹ روزه است، پس عید فطر یک روز زودتر می‌افتد
})

holidaysPlugin({ provider: iranOfflineProvider({ hijri: iranHijri }) })
```

این provider تقویم را مستقیم به کار می‌گیرد و نیازی به ثبت آن نیست. اگر `registerCalendar(iranHijri)` را هم صدا بزنید، پیکرهای هجری هم از آن استفاده می‌کنند. جزئیات در [ام‌القری، civil و تنظیمات محلی](./calendars-and-locales#umm-al-qura-civil-and-local-adjustments).
:::

نسخهٔ آنلاین (`iranProvider`) هر چیزی را که منبعش منتشر کند منعکس می‌کند، از جمله تعطیلی‌های یک‌باره‌ای که در طول سال اعلام می‌شوند. در مقابل، نسخهٔ آفلاین قطعی و آنی است. بسته به نیاز هر برنامه یکی را انتخاب کنید.

### جهانی (Nager.Date) {#global-nager-date}

```js
import { holidaysPlugin, nagerProvider } from 'khorshid/holidays'

holidaysPlugin({ provider: nagerProvider({ country: 'DE' }) })
```

این provider از API رایگان [Nager.Date](https://date.nager.at) استفاده می‌کند که بیش از ۱۰۰ کشور را پوشش می‌دهد و کلید لازم ندارد.

::: warning
سرویس Nager.Date تعطیلات ایران (`IR`) و افغانستان (`AF`) را پوشش نمی‌دهد. برای ایران از `iranProvider` یا `iranOfflineProvider` استفاده کنید؛ در غیر این صورت یک [provider سفارشی](#custom-provider) بنویسید.
:::

### provider سفارشی {#custom-provider}

هر آبجکتی که با `HolidayProvider` جور باشد کار می‌کند؛ می‌تواند API خودتان را صدا بزند، یک جدول استاتیک بخواند و مانند آن.

```js
const myProvider = {
  id: 'my-company',
  async load(years, { fetch, signal }) {
    const res = await fetch(`/api/holidays?years=${years.join(',')}`, { signal })
    const data = await res.json()
    return data.map((h) => ({ iso: h.date, name: h.title, official: true, raw: h }))
  },
}

holidaysPlugin({ provider: myProvider })
```

## کش و چرخهٔ حیات {#caching-and-lifecycle}

- **بارگذاری تنبل و کش.** فقط سال‌های میلادی‌ای که پن‌های دیده‌شده پوشش می‌دهند واکشی می‌شوند، هر کدام یک بار. پیمایش سال‌های جاافتاده را تکمیل می‌کند و سال‌های بارگذاری‌شده دوباره واکشی نمی‌شوند. متد `reload()` کش را پاک می‌کند و دوباره واکشی می‌کند.
- **امن در برابر کار async.** درخواست‌های در جریان هنگام `reload()` و `destroy()` لغو می‌شوند. خطاها به `onError` می‌روند و هرگز به داخل پیکر throw نمی‌شوند.
- **مستقل از تقویم.** تعطیلات با ISO میلادی کلید می‌خورند؛ پس جابه‌جایی بین جلالی و میلادی همهٔ علامت‌ها را سر جایشان نگه می‌دارد.

## تم‌بندی {#theming}

یک توکن رنگ تعطیلات را تعیین می‌کند و برای نقطه و رنگ شمارهٔ روز به کار می‌رود:

```css
.sdp { --sdp-holiday: #dc2626; } /* پیش‌فرض حالت تیره: #f87171 */
```

**مطالب مرتبط:** [پلاگین‌ها](./plugins) · [تقویم‌ها و لوکال‌ها](./calendars-and-locales) · [تم‌بندی](./theming)
