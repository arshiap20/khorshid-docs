# پلاگین‌ها

پلاگین یک پیکر را بدون فورک‌کردن گسترش می‌دهد: می‌تواند اثرهای جانبی اجرا کند و سلول روزها را با markهایی تزئین کند که همهٔ لایه‌های رابط کاربری رندرشان می‌کنند. برای نوشتن پلاگین خودتان این صفحه را بخوانید؛ [پلاگین رسمی تعطیلات](./holidays) هم روی همین قرارداد ساخته شده است.

## پلاگین‌ها چطور کار می‌کنند {#how-plugins-work}

پلاگین یک آبجکت ساده با hookهای اختیاری است. پلاگین‌ها را در گزینهٔ `plugins` بدهید. هر کدام یک بار `setup` را روی پیکرِ زنده اجرا می‌کند و `decorateDay` آن برای هر روزِ رندرشده صدا زده می‌شود. هسته هیچ فرضی دربارهٔ کار پلاگین ندارد، و hookی که خطا بدهد گزارش و رد می‌شود؛ پس یک پلاگین نمی‌تواند پیکر را از کار بیندازد.

```js
import { createDatePicker } from 'khorshid'

const picker = createDatePicker('#date', {
  locale: 'fa-IR',
  plugins: [myPlugin],
})

picker.core.getPlugin('my-plugin') // بعداً به API عمومی پلاگین دسترسی بگیرید
```

این گزینه بخشی از هسته است؛ پس `createPicker` از `khorshid/headless` و کامپوننت‌های React و Vue هم آن را می‌پذیرند.

## قرارداد {#the-contract}

```ts
interface PickerPlugin {
  readonly name: string
  /** یک بار هنگام ساخت پیکر صدا زده می‌شود. */
  setup?(ctx: PluginContext): void
  /** افزودن mark به سلول روز. برای هر روزِ رندرشده صدا زده می‌شود، پس سبک نگهش دارید. */
  decorateDay?(day: DayInfo): DayMark | DayMark[] | null | void
}

interface PluginContext {
  picker: PickerCore              // پیکرِ زنده
  refresh(): void                 // تزئین و رندر دوباره (بعد از رسیدن دادهٔ async صدا بزنید)
  onCleanup(fn: () => void): void // هنگام destroy() (به ترتیب معکوس) اجرا می‌شود
}

interface DayInfo {
  date: PlainDate
  iso: string        // 'YYYY-MM-DD' میلادی، کلید پایدار و مستقل از تقویم
  parts: DateParts   // اجزا در تقویم فعال
  weekday: WeekDay
  outside: boolean   // متعلق به ماه قبل یا بعد
}
```

## markهای روز {#day-marks}

خروجی `decorateDay` مجموعه‌ای از markهاست: برچسب‌هایی انتزاعی و بدون DOM که لایه‌های رابط کاربری به شکل بصری درشان می‌آورند. این markها روی `DayCell.marks` قرار می‌گیرند که همیشه وجود دارد و وقتی چیزی روز را تزئین نکند، خالی است.

```ts
interface DayMark {
  type: string    // دستهٔ kebab-case، مثل 'holiday'
  label?: string  // متن tooltip و صفحه‌خوان
  source?: string // نام پلاگین، که هسته پرش می‌کند
  data?: unknown  // هر payload دلخواه
}
```

مقدار `DayInfo.iso` همیشه تاریخ ISO میلادی است؛ کلیدی که با تغییر تقویم یا لوکال عوض نمی‌شود. به همین دلیل تعطیلی‌ای که با تاریخ میلادی ذخیره شده، روی روز درستِ جدول جلالی می‌نشیند و markها بعد از `setCalendar` سر جایشان می‌مانند.

یک پلاگین ساده که روز ۲۵ هر ماه را در تقویم فعال علامت می‌زند:

```js
const payday = {
  name: 'payday',
  decorateDay: (day) =>
    day.parts.day === 25 ? { type: 'payday', label: 'روز حقوق' } : null,
}

createDatePicker('#date', { locale: 'fa-IR', plugins: [payday] })
```

## دادهٔ async و `refresh` {#async-data-and-refresh}

تابع `setup` به `ctx.refresh()` دسترسی دارد. داده را هر وقت لازم است بارگذاری کنید (معمولاً در `setup`، و دوباره روی رویدادهای پیمایش)، نگهش دارید و بعد `refresh()` را صدا بزنید تا تزئین دوباره اجرا و صفحه دوباره رندر شود. یک تابع سازنده داده را برای هر نمونهٔ پلاگین خصوصی نگه می‌دارد:

```js
function eventsPlugin() {
  let byIso = {}

  return {
    name: 'events',
    setup(ctx) {
      const load = async () => {
        byIso = await fetch('/api/events').then((r) => r.json())
        ctx.refresh() // رندر دوباره با دادهٔ تازه
      }
      ctx.onCleanup(ctx.picker.on('month:change', load))
      load()
    },
    decorateDay: (day) =>
      byIso[day.iso] ? { type: 'event', label: byIso[day.iso].title } : null,
  }
}

createDatePicker('#date', { plugins: [eventsPlugin()] })
```

## markها چطور رندر می‌شوند {#how-marks-are-rendered}

رندرکننده‌های آماده (vanilla، React و Vue) با هیچ نوع markی رفتار خاص ندارند. سلولِ تزئین‌شده این‌ها را می‌گیرد:

- کلاس `.sdp__day--marked`، به‌علاوهٔ یک `.sdp__day--mark-<type>` برای هر نوع متمایز (مثلاً `.sdp__day--mark-holiday`)؛
- یک نوار نقطه، `.sdp__day-marks`، با یک `.sdp__day-mark.sdp__day-mark--<type>` برای هر mark؛
- برچسب markها که به `title` و `aria-label` سلول اضافه می‌شود تا صفحه‌خوان آن‌ها را بخواند.

نوع mark خودتان را فقط با CSS استایل بدهید:

```css
.sdp__day--mark-event .sdp__day-num { color: #7c3aed; }
.sdp__day-mark--event { background: #7c3aed; }
```

## چرخهٔ حیات {#lifecycle}

- **ترتیب setup.** پلاگین‌ها به همان ترتیبی که فهرستشان کرده‌اید، روی پیکرِ کاملاً ساخته‌شده setup می‌شوند.
- **پاک‌سازی.** callbackهای `ctx.onCleanup(fn)` هنگام از بین رفتن پیکر، به ترتیب معکوس اجرا می‌شوند.
- **جداسازی.** hookی که خطا بدهد در کنسول گزارش و رد می‌شود؛ پیکر و بقیهٔ پلاگین‌ها به کارشان ادامه می‌دهند.
- **دسترسی.** متد `core.getPlugin<T>(name)` پلاگین ثبت‌شده را با تایپ درست برمی‌گرداند؛ پس هر پلاگین می‌تواند یک API عمومی داشته باشد (API خواندن تعطیلات را ببینید).

**مطالب مرتبط:** [تعطیلات](./holidays) · [هستهٔ headless](/fa/core/) · [تم‌بندی](./theming)
