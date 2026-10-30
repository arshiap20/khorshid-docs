# هستهٔ headless

هستهٔ headless موتوری است که همهٔ رابط‌های خورشید روی آن ساخته شده‌اند: هیچ کدی برای DOM ندارد و هیچ وابستگی زمان اجرا هم ندارد. وقتی پیکر آماده به کارتان نمی‌آید، مثلاً برای canvas، ترمینال، یک پوستهٔ native یا دیزاین‌سیستم خودتان، مستقیم روی همین هسته بسازید.

## نصب {#installation}

```bash
npm install khorshid
```

```js
import { createPicker, createDateFieldCore, PlainDate } from 'khorshid/headless'
```

`khorshid/headless` هیچ API مربوط به DOM ندارد؛ پس روی سرور، در workerها و در پوسته‌های native هم اجرا می‌شود. اگر پکیج scoped را ترجیح می‌دهید، همین کد با نام `@khorshid-js/core` هم منتشر شده است.

## مدل {#the-model}

تابع `createPicker(options)` از `khorshid/headless` یک `PickerCore` برمی‌گرداند: وضعیت، یک سیگنال رندر دوباره، رویدادهای تایپ‌شده و مدل‌های رندر مشتق‌شده. هر رابط کاربری یک حلقهٔ رندر است که این مدل‌ها را به المنت تبدیل می‌کند.

```js
import { createPicker } from 'khorshid/headless'

const picker = createPicker({ locale: 'fa-IR', mode: 'single' })

function render() {
  const grid = picker.getGrid() // CalendarGrid برای پنِ ۰

  header.textContent = grid.title.label     // مثلاً 'فروردین ۱۴۰۵'
  renderWeekdayRow(grid.weekdays)           // { min, short, long, weekend }

  for (const week of grid.weeks) {          // DayCell[][]، ردیف‌های ۷تایی
    for (const cell of week) {
      // cell.label از قبل با ارقام لوکال است و همهٔ flagها از پیش محاسبه شده‌اند:
      // today, selected, rangeStart, rangeEnd, inRange, preview,
      // disabled, outside, weekend, focused
      const el = renderDay(cell)
      el.onclick = () => picker.select(cell.date)
      el.onmouseenter = () => picker.hover(cell.date)
    }
  }
}

const unsubscribe = picker.subscribe(render) // پس از هر تغییر وضعیت صدا زده می‌شود
render()

prevButton.onclick = () => picker.prev()
nextButton.onclick = () => picker.next()

picker.on('change', ({ value, source }) => console.log(value, source))
```

رندرکننده‌های آمادهٔ vanilla، React و Vue هم دقیقاً همین‌طور ساخته شده‌اند. هر flagی که یک سلول لازم دارد (`selected`، `inRange`، `disabled`، `today`، `focused` و …) از پیش در هسته محاسبه شده است؛ پس رندرکننده هیچ محاسبهٔ تاریخی انجام نمی‌دهد. وقتی رابط کنار می‌رود، `picker.destroy()` را صدا بزنید.

## آداپترهای فریم‌ورک {#framework-adapters}

همین حلقه در هر فریم‌ورکی کار می‌کند. در React:

```jsx
const picker = useMemo(() => createPicker(options), [])
const state = useSyncExternalStore(picker.subscribe, picker.getState)
// picker.getGrid() را به کامپوننت‌ها نگاشت کنید و روی کلیک picker.select(cell.date) را صدا بزنید
```

در Vue، خروجی `subscribe` را در یک `shallowRef` بریزید و در `onScopeDispose` اشتراک را لغو کنید. معمولاً لازم نیست این را خودتان بنویسید: `khorshid/react` و `khorshid/vue` تابع `useDatePicker` را دارند که دقیقاً همین کار را می‌کند. [React](/fa/react/) و [Vue](/fa/vue/) را ببینید.

## مدل‌های رندر {#render-models}

| متد | خروجی |
|---|---|
| `getGrid()` | `CalendarGrid` برای پنِ ۰: `title`، `weekdays`، `weeks: DayCell[][]` |
| `getGrid(n)` | پنِ `n`اُم، وقتی `months > 1` |
| `getTitle(n?)` | عنوان سرصفحه برای نمای فعلی |
| `getWeekdayLabels()` | هفت برچسب روزهای هفته، به ترتیب نمایش |
| `getMonthCells()` | سلول‌های نمای ماه‌ها |
| `getYearCells()` | سلول‌های نمای سال‌ها (یک صفحهٔ ۱۲ساله) |
| `getYearRangeLabel()` | برچسب همان صفحه، مثلاً `۱۴۰۴ – ۱۴۱۵` |
| `getShortcuts()` | چیپ‌های [میان‌بر](/fa/guide/shortcuts-and-limits)، محاسبه‌شده برای وضعیت فعلی |

## پیمایش و نماها {#navigation-and-views}

```js
picker.next(); picker.prev()                   // ورق‌زدن نمای فعلی
picker.goTo({ year: 1405, month: 7, day: 1 })  // پرش به یک تاریخ (اجزا در تقویم فعال خوانده می‌شوند)
picker.goToToday()
picker.setView('months')                       // 'days' | 'months' | 'years'
picker.selectMonth(7); picker.selectYear(1405)
```

## کمک‌کننده‌های کیبورد {#keyboard-helpers}

منطق فوکوس در هسته است، تا همهٔ رابط‌ها رفتار کیبورد یکسانی داشته باشند:

```js
picker.focusDate(date)
picker.moveFocus('day', 1)    // 'day' | 'week' | 'month' | 'year'، ±n
picker.focusWeekEdge('start') // 'start' | 'end'
picker.selectFocused()
```

## ورودی و خروجی متن {#text-input-and-output}

```js
picker.format(date)        // رشته با لوکال و قالب فعال
picker.parse(text)         // PlainDate | null
picker.handleInput(text)   // اجرای ماسک ورودی و ثبت تاریخ کامل
picker.submitInput(text)   // ثبت متن آزاد هنگام Enter/blur (ورودی طبیعی را ببینید)
picker.getInputValue()     // مقدار فعلی، قالب‌بندی‌شده برای فیلد متنی
picker.getFormValue()      // مقدار فعلی، serialize‌شده برای فرم
picker.toDateValue(date)   // تبدیل هر تاریخ به payload کامل DateValue
```

## اشتراک و رویدادها {#subscriptions-and-events}

- **`subscribe(fn)`** یک سیگنال رندر دوبارهٔ سطح‌پایین است. پس از هر تغییر وضعیت صدا زده می‌شود و تابعی برای لغو اشتراک برمی‌گرداند. حلقهٔ رندرتان را با آن به راه بیندازید.
- **`on(event, handler)`** و `once` و `onAny` [رویدادهای](/fa/api/events) تایپ‌شده‌اند، مثل `change`، `select` و `range:complete`. برای اثرهای جانبی مثل آنالیتیکس یا اتصال به فرم از آن‌ها استفاده کنید.

سطح کامل در [مرجع PickerCore](/fa/core/picker-core) آمده است.

**مطالب مرتبط:** [PlainDate](/fa/core/plain-date) · [پلاگین‌ها](/fa/guide/plugins) · [React](/fa/react/) · [Vue](/fa/vue/)
