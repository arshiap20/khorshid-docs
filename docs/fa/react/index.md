# React

`khorshid/react` همان پیکر است به شکل کامپوننت و هوک React؛ همان پیکر با رندرکننده‌ای دیگر، نه APIای جداگانه. نام گزینه‌ها، پیش‌فرض‌ها، رویدادها و مقدارها یک بار در [هسته](/fa/core/) تعریف شده‌اند و کامپوننت‌ها همان درخت المنت `sdp` را با همان استایل‌شیتی رندر می‌کنند که بقیهٔ لایه‌ها.

## نصب {#installation}

```bash
npm install khorshid
```

```tsx
import { DatePicker, Calendar, DateField, useDatePicker } from 'khorshid/react'
import 'khorshid/styles.css'
```

به React 18 یا بالاتر نیاز دارد. اگر پکیج scoped را ترجیح می‌دهید، همین کد با نام `@khorshid-js/react` هم منتشر شده است.

## کامپوننت `<DatePicker>`: فیلد و پنلی که باز می‌کند {#datepicker-a-field-and-the-panel-it-opens}

```tsx
<DatePicker
  locale="fa-IR"
  defaultValue="2026-03-21"
  onChange={({ value, source }) => console.log(value, source)}
/>
```

این کامپوننت هر [گزینه](/fa/api/options) را با همان نام می‌پذیرد (`display`، `readOnly`، `outsideDays`، `time`، `renderDay`، `dayProps`، `classes`، `vars` و …)، به‌علاوهٔ `inputProps` برای `<input>` متصل. پنجره‌های overlay آن همان overlayهای پیکر vanilla هستند؛ پس جای‌گذاری popup، bottom sheet قابل‌کشیدن، modal، نگه‌داشتن فوکوس و انیمیشن‌ها یکسان‌اند.

## کامپوننت `<Calendar>`: پنل همیشه‌نمایان {#calendar-the-always-visible-panel}

```tsx
<Calendar locale="en-US-gregorian" mode="range" months={2} />
```

فقط گزینه‌های پنل را می‌پذیرد؛ پس گزینه‌هایی که روی یک پنل تنها اثری ندارند در autocomplete دیده نمی‌شوند.

## کنترل‌شده یا کنترل‌نشده {#controlled-or-uncontrolled}

برای کامپوننت کنترل‌نشده `defaultValue` بدهید، و برای کنترل‌شده `value` را همراه `onChange`:

```tsx
const [value, setValue] = useState<PickerValueInput>('2026-03-21')

<DatePicker value={value} onChange={({ value }) => setValue(value)} />
```

مقداری که دریافت می‌کنید را می‌توانید بدون تبدیل دوباره به کامپوننت بدهید. `mode` ثابت، نوع `value` و payload `onChange` را دقیق می‌کند.

## رویدادها {#events}

هر رویداد هسته یک prop کال‌بک است با نام `on` به‌اضافهٔ نام رویداد به شکل PascalCase:

| رویداد هسته | prop در React |
|---|---|
| `change` | `onChange` |
| `select` | `onSelect` |
| `range:complete` | `onRangeComplete` |
| `view:change` | `onViewChange` |
| `error` | `onError` |
| (باز و بسته شدن) | `onOpenChange` |

```tsx
<DatePicker locale="fa-IR" mode="range" months={2}
            onRangeComplete={({ start, end }) => book(start.iso, end.iso)} />
```

فهرست کامل و payloadها در [رویدادها](/fa/api/events) آمده است.

## هوک `useDatePicker`: headless {#usedatepicker-headless}

پنل را خودتان رندر کنید و وضعیت را به خورشید بسپارید:

```tsx
const { core, state, value, actions } = useDatePicker({ mode: 'range' })

value.start        // با mode ثابت، تایپ دقیق است و به بررسی value.mode نیازی نیست
actions.goToToday()
```

`locale`، `mode` و `value` کنترل‌شده همگام می‌مانند؛ بقیهٔ گزینه‌ها یک بار خوانده می‌شوند. `usePickerState(core)` و `usePickerEvent(core, event, handler)` هر هسته‌ای را که از قبل دارید دنبال می‌کنند.

## اشتراک یک core {#sharing-one-core}

با prop `core` چند کامپوننت یک پیکر را رندر می‌کنند، مثلاً یک فیلد و یک پنل بزرگ inline:

```tsx
const { core } = useDatePicker({ mode: 'range' })

<DatePicker core={core} />
<Calendar core={core} months={2} />
```

`<DatePickerProvider>` و `useDatePickerContext()` هسته را بدون پاس‌دادن دستی به پایین درخت می‌رسانند.

## فیلد تاریخ {#date-field}

`<DateField>` همان [فیلد تاریخ](/fa/guide/date-field) بخش‌بندی‌شده است، با همان نام گزینه‌های `createDateField`:

```tsx
import { DateField } from 'khorshid/react'

export function Birthday() {
  const [value, setValue] = useState(null)
  return (
    <DateField
      locale="fa-IR"
      label="تاریخ تولد"
      value={value}
      onChange={({ value }) => setValue(value)}
    />
  )
}
```

`useDateField` نیمهٔ بدون رابط آن است: `state.segments` را خودتان رندر کنید.

**مطالب مرتبط:** [مرجع React](/fa/react/api) · [گزینه‌ها](/fa/api/options) · [رویدادها](/fa/api/events) · [هستهٔ headless](/fa/core/)
