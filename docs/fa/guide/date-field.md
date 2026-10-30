# فیلد تاریخ

**فیلد تاریخ** ورودیِ تاریخِ بخش‌بندی‌شده است: سال، ماه و روز (و در صورت نیاز ساعت،
دقیقه، ثانیه و ق.ظ/ب.ظ) هر کدام یک بخشِ مستقل‌اند. در هر بخش رقم تایپ می‌کنید، با کلیدهای
بالا و پایین مقدارش را کم و زیاد می‌کنید و با ← / → بین بخش‌ها جابه‌جا می‌شوید. متنِ آزادی
برای تفسیر یا پنجره‌ای برای باز کردن در کار نیست، پس چیزِ مبهمی هم نمی‌شود تایپ کرد. با همهٔ
تقویم‌ها و لوکال‌های خورشید کار می‌کند.

<FieldDemo :options="{ label: 'تاریخ تولد', description: 'سال، ماه و روز را وارد کنید' }" />

وقتی تاریخ معمولاً **معلوم** است (تاریخ تولد، تاریخ سند، مهلتی که از روی کاغذ وارد می‌شود)
از فیلد تاریخ استفاده کنید. اگر کاربر باید در تقویم **بگردد** تا تاریخ را پیدا کند،
[دیت‌پیکر](./getting-started) مناسب‌تر است.

## استفاده

::: code-group

```js [Vanilla]
import { createDateField } from 'khorshid'
import 'khorshid/styles.css'

const field = createDateField('#birthday', {
  locale: 'fa-IR',
  label: 'تاریخ تولد',
  name: 'birthday',
  onChange: ({ value }) => console.log(value?.iso),
})
```

```tsx [React]
import { DateField } from 'khorshid/react'
import 'khorshid/styles.css'

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

```vue [Vue]
<script setup>
import { ref } from 'vue'
import { DateField } from 'khorshid/vue'
import 'khorshid/styles.css'

const value = ref(null)
</script>

<template>
  <DateField v-model="value" locale="fa-IR" label="تاریخ تولد" />
</template>
```

```html [Custom element]
<script type="module">
  import { defineDateFieldElement } from 'khorshid/element'
  defineDateFieldElement()
</script>

<khorshid-date-field locale="fa-IR" label="تاریخ تولد" name="birthday"></khorshid-date-field>
```

:::

همهٔ لایه‌ها **همان گزینه‌ها را با همان نام‌ها** می‌گیرند. در React و Vue به‌صورت prop
و در المنتِ سفارشی به‌صورت attribute با نامِ kebab-case.

## ساختار

```
.sdp-field
  .sdp-field__label          برچسب
  .sdp-field__group          role=group — قابِ فیلد
    .sdp-field__prefix       پیشوند
    .sdp-field__input        بخش‌ها (همیشه چپ‌به‌راست، مثل خودِ عدد)
      .sdp-field__segment    role=spinbutton، یکی برای هر بخش
      .sdp-field__literal    جداکننده‌ها
    .sdp-field__suffix       پسوند
  .sdp-field__description    توضیح (هنگام خطا پنهان می‌شود)
  .sdp-field__error          پیام خطا
```

## تایپ و کلیدها

| کلید | کار |
|---|---|
| رقم‌ها (فارسی، عربی، لاتین) | در بخش تایپ می‌شود. وقتی رقمِ دیگری جا نشود، خودش به بخشِ بعد می‌رود: `۴` در ماه مستقیم به روز می‌رود، ولی `۱` منتظر می‌ماند شاید `۱۲` بیاید. |
| `/` `-` `.` `:` فاصله | بخشِ فعلی را زودتر تمام می‌کند (`۳/` یعنی روزِ ۳) |
| ↑ / ↓ | یکی کم و زیاد می‌کند و از ابتدا/انتها دور می‌زند. بخشِ خالی از `placeholderValue` شروع می‌کند (پیش‌فرض: امروز). |
| PageUp / PageDown | گام‌های بزرگ‌تر (سال ۵، ماه ۲، روز ۷، دقیقه ۱۵) |
| Home / End | کمینه / بیشینهٔ بخش |
| ← / → | بخشِ قبلی / بعدی |
| Backspace / Delete | یک رقم پاک می‌کند. روی بخشِ خالی یک بخش به عقب برمی‌گردد. |
| `ق` / `ب` (`a` / `p`) | قبل‌ازظهر / بعدازظهر |

در موبایل کیبوردِ عددی باز می‌شود. چسباندنِ `۱۴۰۳/۰۵/۱۲` همهٔ بخش‌ها را پر می‌کند.

**مقدار فقط وقتی ثبت می‌شود که ورودیِ یک بخش تمام شود.** وقتی سال را تایپ می‌کنید،
مقدارهای میانیِ ۱، ۱۴ و ۱۴۰ ثبت نمی‌شوند و فقط ۱۴۰۳ ثبت می‌شود. ماهی که روی `۱` رها
شده باشد، با رفتنِ فوکوس به بخشِ دیگر ثبت می‌شود.

## قالب: ترتیب، صفرِ پیشرو، نامِ ماه

ترتیبِ بخش‌ها از قالب می‌آید. پیش‌فرض، قالبِ لوکال است: `YYYY/MM/DD` برای فارسی و
`MM/DD/YYYY` برای `en-US-gregorian`.

```js
createDateField(el, { format: 'D MMMM YYYY' })   // ۱۲ مرداد ۱۴۰۳
createDateField(el, { format: 'YYYY/MM' })       // فقط سال و ماه؛ روز = ۱
```

`MMMM` ماه را با نام نشان می‌دهد و `M`/`D` بدونِ صفرِ پیشرو هستند. توکن‌های روزِ هفته
حذف می‌شوند، چون روزِ هفته تایپ نمی‌شود. توکن‌های زمان (`HH` `hh` `mm` `ss` `A`)
بخش‌های زمان را اضافه می‌کنند.

## زمان

```js
createDateField(el, { time: true })                                      // + HH:mm
createDateField(el, { time: { use12Hour: true, showSeconds: true } })    // + hh:mm:ss ق.ظ
createDateField(el, { time: { minuteStep: 15 } })                        // ↑/↓ پانزده‌دقیقه‌ای
```

در این حالت مقدار، فیلدِ `time` هم دارد و مقدارِ فرم به شکلِ `YYYY-MM-DDTHH:mm:ss` در
می‌آید.

## اعتبارسنجی

```js
createDateField(el, {
  required: true,
  min: { year: 1403, month: 1, day: 1, calendar: 'jalali' },
  max: '2030-12-31',
  disabledDates: [{ date: '2024-03-20', reason: 'نوروز — تعطیل' }],
  validate: (value) => value.weekday === 5 ? 'جمعه‌ها نه' : true,
})
```

<FieldDemo :options="{ label: 'تاریخ نوبت', required: true, min: '2024-03-20', max: '2030-12-31', validate: (v) => v.weekday === 5 ? 'جمعه‌ها نوبت نمی‌دهیم' : true }" />

| کد | کِی | پیامِ پیش‌فرض |
|---|---|---|
| `required` | خالی، پس از ترکِ فیلد | لطفاً تاریخ را وارد کنید. |
| `incomplete` | نیمه‌کاره، پس از ترکِ فیلد | تاریخ کامل نیست. |
| `out-of-range` | بیرون از `min`/`max` | تاریخ باید بین … و … باشد. |
| `disabled` | جزوِ `disabledDates` | دلیلِ داده‌شده، وگرنه «این تاریخ قابل انتخاب نیست.» |
| `invalid-input` | تاریخِ واقعی نیست | تاریخ معتبر نیست. |
| `custom` | `validate` ردش کرد | پیامِ خودتان |

خطاهای `required` و `incomplete` هیچ‌وقت وسطِ تایپ نشان داده نمی‌شوند. این دو وقتی ظاهر
می‌شوند که فوکوس از فیلد خارج شود یا `validate()` را صدا بزنید (مثلاً هنگامِ ارسالِ فرم).
خطاهای دیگر به‌محضِ کامل شدنِ ورودی نشان داده می‌شوند. وقتی فیلد نامعتبر است،
`getValue()` مقدارِ `null` برمی‌گرداند، پیامِ خطا جای توضیح را می‌گیرد و فرمِ HTML هم
ارسال نمی‌شود. پیام را با `errorMessage` عوض کنید، با `invalid: true` حالتِ خطا را از
بیرون (مثلاً از سرور) تحمیل کنید و متن‌های داخلی را با `labels.messages` بازنویسی کنید.

## فرم

با `name`، فیلد مقداری مستقل از تقویم ارسال می‌کند: `2024-08-02`، یا با زمان
`2024-08-02T09:30:00`. پس رابطِ شمسی و بک‌اندِ میلادی به هیچ تبدیلی نیاز ندارند.
`required` در اعتبارسنجیِ بومیِ مرورگر شرکت می‌کند و `reset` فرم، مقدارِ اولیه را
برمی‌گرداند.

## ظاهر

- `variant`: `'primary'` (پیش‌فرض، با حاشیه و سایهٔ ظریف) یا `'secondary'` (پُرشده، برای
  روی سطح‌ها)
- `fullWidth`: تمام‌عرض
- `prefix` / `suffix`: آیکون یا دکمه داخلِ قاب. دکمهٔ پسوند کلیکِ خودش را نگه می‌دارد.
- `theme`، `vars` و `classes`: مثلِ دیت‌پیکر

توکن‌های دیت‌پیکر (`--sdp-accent`، `--sdp-bg`، …) اینجا هم کار می‌کنند. سه توکنِ تازه هم
اضافه شده: `--sdp-danger`، `--sdp-field-height` (۴۴px) و `--sdp-field-radius` (۱۲px).
وضعیتِ فیلد به‌صورتِ data attribute در دسترس است: `data-invalid`، `data-disabled`،
`data-readonly`، `data-required`، `data-empty`، `data-focus-within`، و روی بخش‌های خالی
`data-placeholder`.

## رویدادها

| رویداد | داده |
|---|---|
| `change` | `{ value, source: 'input' \| 'api' \| 'clear' }` |
| `input` | با هر کلید یا فلش: `{ type, value, text, complete }` |
| `error` | ورودیِ کامل ولی رد شده: `{ code, message, reason?, input }` |
| `locale:change` | `{ locale }` |

## Headless

موتورِ فیلد بدونِ DOM است و در `@khorshid-js/core` قرار دارد:

```js
import { createDateFieldCore, dateFieldKeyAction, segmentAttributes } from 'khorshid/headless'

const field = createDateFieldCore({ locale: 'fa-IR' })
field.subscribe((state) => render(state.segments))

const { handled, move } = dateFieldKeyAction(field, 'month', event)
if (handled) event.preventDefault()   // سپس فوکوس را به بخشِ 'next' / 'prev' ببرید
```

جدولِ کاملِ گزینه‌ها در [نسخهٔ انگلیسی](/guide/date-field#options) آمده است.
