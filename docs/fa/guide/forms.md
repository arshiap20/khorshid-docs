# فرم‌ها

پیکر می‌تواند عضوی از یک `<form>` معمولی HTML باشد: با دادن `name` مقدارش همراه فرم ارسال می‌شود، `required` تا وقتی تاریخی انتخاب نشده جلوی ارسال را می‌گیرد، و بازنشانی فرم مقدار اولیه را برمی‌گرداند. وقتی پیکر داخل فرمی است که به سرور ارسال می‌شود یا مقدارش را با `FormData` می‌خوانید، این صفحه را بخوانید.

## استفادهٔ پایه {#basic-usage}

```html
<form action="/book" method="post">
  <input id="checkin" placeholder="تاریخ ورود" />
  <button>رزرو</button>
</form>
```

```js
import { createDatePicker } from 'khorshid'

createDatePicker('#checkin', {
  locale: 'fa-IR',
  name: 'checkin',
  required: true,
})
// ارسال می‌شود: checkin=2026-04-04
```

لازم نیست خودتان input مخفی بسازید یا همگامش نگه دارید.

## چه چیزی ارسال می‌شود {#what-gets-submitted}

کاربر تاریخ جلالی می‌بیند و بک‌اند شما تاریخ ISO دریافت می‌کند. تابع پیش‌فرض برای serialize، یعنی `toFormValue`، به تقویمی که کاربر دیده وابسته نیست:

| مقدار | به این شکل ارسال می‌شود |
|---|---|
| یک تاریخ | `2026-04-04` |
| تاریخ همراه با [انتخاب ساعت](/fa/api/options#time) | `2026-04-04T09:05:00` |
| یک بازه | `2026-04-01/2026-04-03` (بازهٔ ISO 8601)؛ تا وقتی هر دو سر بازه انتخاب نشده‌اند، خالی است |
| چند تاریخ | `2026-04-01,2026-04-03` |
| انتخاب [هفته، ماه یا سال](./selection-units) | بازهٔ آن دوره: `2026-05-22/2026-06-21` |
| چند هفتهٔ انتخاب‌شده | چند بازه، جداشده با ویرگول: `2026-04-04/2026-04-10,2026-04-11/2026-04-17` |
| هیچ‌چیز | `''`؛ پس `required` جلوی ارسال را می‌گیرد |

برای قالبی دیگر، گزینهٔ `formValue` را بدهید؛ تابعی که [`PickerValue`](/fa/api/events#pickervalue-by-mode) را می‌گیرد:

```js
createDatePicker('#stay', {
  mode: 'range',
  name: 'stay',
  // مثلاً متن جلالی برای یک بک‌اند قدیمی
  formValue: (value) =>
    value.start && value.end ? `${value.start.formatted}|${value.end.formatted}` : '',
})
```

تابع `toFormValue` هم export شده و `picker.core.getFormValue()` مقدار serialize‌شدهٔ فعلی را برمی‌گرداند. هر دو برای بدنهٔ درخواست‌های `fetch` و نوشتن تست به کار می‌آیند:

```js
import { toFormValue } from 'khorshid'

toFormValue(picker.getValue())   // همان picker.core.getFormValue()
```

## فیلد مخفی {#the-hidden-field}

وقتی `name` یا `required` تنظیم شده باشد، پیکر یک `input.sdp-form-value` به DOM اضافه می‌کند:

- مقدار آن `formValue(value)` است و با هر تغییر مقدار، تغییر لوکال و تغییر ساعت به‌روز می‌شود.
- این فیلد یک input از نوع **text** است که به‌صورت بصری پنهان شده، نه `type="hidden"`؛ چون مرورگرها inputهای مخفی را در اعتبارسنجی محدودیت‌ها نادیده می‌گیرند. ویژگی‌های `tabindex="-1"` و `aria-hidden="true"` را دارد؛ پس کاربران کیبورد و صفحه‌خوان هیچ‌وقت به آن نمی‌رسند.
- اگر مقصد یک `<input>` باشد، بلافاصله بعد از آن قرار می‌گیرد؛ در تقویم inline، داخل همان المنت؛ و برای overlayی که از یک المنت معمولی باز می‌شود، بعد از المنتِ لنگر. در هر صورت داخل `<form>` شما می‌افتد.
- متد `destroy()` آن را حذف می‌کند.

## اعتبارسنجی {#validation}

- **`required`**: تا وقتی مقداری وجود نداشته باشد، فرم نامعتبر است؛ برای بازه یعنی هر دو سر آن. وقتی مرورگر جلوی ارسال را می‌گیرد، فوکوس به فیلد پیکر (یا در پیکر inline به جدول تقویم) منتقل می‌شود.
- **متن تایپ‌شده**: اگر input متصل متنی داشته باشد که رد شده (تاریخ ناممکن، تاریخ خارج از محدوده یا غیرفعال، یا عبارت [ورودی طبیعی](./natural-input) که خوانده نشده)، اعتبار بومی input روی `labels.invalidDate` لوکال تنظیم می‌شود و کلاس `.sdp-input--invalid` را می‌گیرد. آن‌وقت پیام اعتبارسنجی خودِ مرورگر به زبان کاربر نمایش داده می‌شود (`تاریخ معتبر نیست` یا `Invalid date`).

```js
form.checkValidity() // false تا وقتی فیلد required خالی است، یا متن نامعتبر است
```

## بازنشانی {#reset}

بازنشانی فرم، `value` اولیهٔ پیکر را برمی‌گرداند (همان گزینهٔ `value` که پیکر با آن ساخته شده) و input قابل‌مشاهده هم همراهش به‌روز می‌شود:

```js
createDatePicker('#d', { name: 'd', value: '2026-04-04' })
// کاربر 2026-06-01 را انتخاب می‌کند … form.reset() ← برمی‌گردد به 2026-04-04
```

## یک مثال کامل {#a-full-example}

<Demo mode="range" :options="{ name: 'stay', required: true, minDays: 2 }" placeholder="ورود تا خروج" :controls="['value', 'form']" caption="name: 'stay' با required و minDays: 2. مقدار فرم دقیقاً همان چیزی است که فرم ارسال می‌کند." />

```html
<form id="booking">
  <label>
    Stay
    <input id="stay" />
  </label>
  <button>Book</button>
  <button type="reset">Reset</button>
</form>

<script type="module">
  import { createDatePicker } from 'khorshid'

  createDatePicker('#stay', {
    locale: 'fa-IR',
    mode: 'range',
    months: 2,
    minDays: 2,
    name: 'stay',
    required: true,
  })

  document.querySelector('#booking').addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    data.get('stay') // '2026-04-04/2026-04-07'
  })
</script>
```

::: tip Web Component
المنت `<khorshid-datepicker name="stay" required>` همین کار را در markup انجام می‌دهد. [Web Component](/fa/web-component/#forms) را ببینید.
:::

**مطالب مرتبط:** [فیلد تاریخ](./date-field) · [ورودی طبیعی](./natural-input) · [میان‌برها و محدودیت‌ها](./shortcuts-and-limits)
