# شروع سریع

این صفحه خورشید را نصب می‌کند و کمکتان می‌کند لایهٔ مناسب پروژه‌تان را انتخاب کنید. همهٔ لایه‌ها روی یک هسته اجرا می‌شوند؛ پس گزینه‌ها، رویدادها و مقدارهایی که این‌جا یاد می‌گیرید همه‌جا کار می‌کنند.

## نصب {#installation}

::: code-group

```bash [npm]
npm install khorshid
```

```bash [pnpm]
pnpm add khorshid
```

```bash [yarn]
yarn add khorshid
```

:::

یک پکیج همهٔ لایه‌ها را روی چند زیرمسیر در اختیارتان می‌گذارد. ایمپورت `khorshid` هیچ‌وقت React یا Vue را وارد باندل شما نمی‌کند.

## انتخاب لایه {#pick-a-layer}

| لایه | ایمپورت | کی به کارش ببرید | از این‌جا شروع کنید |
|---|---|---|---|
| **هسته** | `khorshid/headless` | رابط را خودتان می‌کشید: دیزاین‌سیستم، canvas، ترمینال یا یک پوستهٔ native. بدون DOM. | [هسته](/fa/core/) |
| **Vanilla** | `khorshid` | جاوااسکریپت خالص، بدون فریم‌ورک. `createDatePicker` و `createDateField`. | [Vanilla](/fa/vanilla/) |
| **Web Component** | `khorshid/element` | HTML ساده، صفحه‌های رندرشده در سرور، CMS، یا فریم‌ورکی که آداپتور خودش را ندارد. | [Web Component](/fa/web-component/) |
| **React** | `khorshid/react` | React 18 به بالا: کامپوننت و هوک. | [React](/fa/react/) |
| **Vue** | `khorshid/vue` | Vue 3.4 به بالا: کامپوننت و composable. | [Vue](/fa/vue/) |

دو زیرمسیر دیگر با همهٔ لایه‌ها کار می‌کنند:

| ایمپورت | چیست |
|---|---|
| `khorshid/styles.css` | تنها استایل‌شیتی که همهٔ لایه‌ها با آن رندر می‌شوند. [تم‌بندی](./theming) را ببینید. |
| `khorshid/holidays` | پلاگین رسمی [تعطیلات](./holidays). |

همین کد به شکل پکیج‌های scoped هم منتشر می‌شود (`@khorshid-js/core`، `@khorshid-js/dom`، `@khorshid-js/element`، `@khorshid-js/react`، `@khorshid-js/vue` و `@khorshid-js/holidays`)، اگر ترجیح می‌دهید لایه‌ها را جداگانه نصب کنید. این مستندات از ایمپورت‌های `khorshid` استفاده می‌کنند.

## یک مجموعه گزینه برای همه {#one-option-surface}

گزینه‌های یکسان، با همان نام‌ها، در همهٔ لایه‌ها کار می‌کنند:

::: code-group

```js [Vanilla]
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

createDatePicker('#stay', { locale: 'fa-IR', mode: 'range', months: 2 })
```

```html [Web Component]
<khorshid-datepicker locale="fa-IR" mode="range" months="2"></khorshid-datepicker>
```

```tsx [React]
import { DatePicker } from 'khorshid/react'
import 'khorshid/styles.css'

<DatePicker locale="fa-IR" mode="range" months={2} />
```

```vue [Vue]
<script setup>
import { DatePicker } from 'khorshid/vue'
import 'khorshid/styles.css'
</script>

<template>
  <DatePicker locale="fa-IR" mode="range" :months="2" />
</template>
```

```js [هسته]
import { createPicker } from 'khorshid/headless'

const core = createPicker({ locale: 'fa-IR', mode: 'range' })
```

:::

<Demo inline mode="range" :months="2" :controls="['value']" caption="همان پیکر بازه، هر لایه‌ای که رندرش کند." />

## گزینه‌های پرکاربرد {#common-options}

هر گزینه مقدار پیش‌فرض دارد؛ پس فقط چیزی را بدهید که می‌خواهید عوض شود. این‌ها گزینه‌هایی‌اند که بیشتر صفحه‌ها لازم دارند:

| گزینه | پیش‌فرض | کاربرد |
|---|---|---|
| `locale` | `'fa-IR'` | زبان، تقویم، جهت، ارقام و روز شروع هفته. [تقویم‌ها و لوکال‌ها](./calendars-and-locales) را ببینید. |
| `mode` | `'single'` | `'single'`، `'range'` یا `'multiple'`. [حالت‌های انتخاب](./selection-modes) را ببینید. |
| `value` | — | مقدار اولیه: رشتهٔ ISO، یک `Date`، یک فهرست یا `{ start, end }`. |
| `min` / `max` | — | زودترین و دیرترین تاریخ قابل انتخاب. |
| `display` | `'auto'` | `'auto'`، `'inline'`، `'popup'`، `'sheet'` یا `'modal'`. |
| `months` | `1` | تعداد پن‌های ماه که کنار هم نمایش داده می‌شوند. |
| `time` | `false` | یک ردیف انتخاب ساعت اضافه می‌کند. مقدار `true` یعنی ۲۴ساعته با قالب `HH:mm`؛ برای تغییرش `{ use12Hour, showSeconds, minuteStep }` را بدهید. [ساعت](/fa/api/options#time) را ببینید. |
| `theme` | `'auto'` | `'light'`، `'dark'`، یا `'auto'` برای پیروی از سیستم‌عامل. [تم‌بندی](./theming) را ببینید. |

فهرست کامل در [مرجع گزینه‌ها](/fa/api/options) آمده است.

## گام‌های بعدی {#next-steps}

- [تقویم‌ها و لوکال‌ها](./calendars-and-locales): جلالی، میلادی، هجری قمری و نُه لوکال آماده.
- [حالت‌های انتخاب](./selection-modes) و [واحدهای انتخاب](./selection-units): بازه، چند تاریخ، و انتخاب هفته، ماه و سال.
- [فرم‌ها](./forms): ارسال مقدار همراه یک `<form>`.
- [فیلد تاریخ](./date-field): ورودی بخش‌بندی‌شده برای تاریخ‌هایی که کاربر تایپ می‌کند.
- [پلی‌گراند](/fa/playground): یک پیکر را تعاملی تنظیم کنید و کدش را بردارید.
