# جاوااسکریپت خالص (Vanilla)

لایهٔ vanilla پیکر آماده برای جاوااسکریپت خالص است: `createDatePicker` یک پیکر را به ورودی متصل می‌کند یا یک تقویم درون‌صفحه mount می‌کند، و `createDateField` فیلد تاریخ بخش‌بندی‌شده را رندر می‌کند. به هیچ فریم‌ورک یا پلاگین بیلدی نیاز ندارد. لایه‌های React، Vue و Web Component از overlayها و کیبورد همین لایه استفاده می‌کنند.

## نصب {#installation}

```bash
npm install khorshid
```

```js
import { createDatePicker, createDateField } from 'khorshid'
import 'khorshid/styles.css'
```

ورودی `khorshid` کل [هستهٔ headless](/fa/core/) را هم export می‌کند و هیچ‌وقت React یا Vue را وارد باندل شما نمی‌کند. اگر پکیج scoped را ترجیح می‌دهید، همین کد با نام `@khorshid-js/dom` هم منتشر شده است.

## اولین پیکر {#your-first-picker}

پیکر را به یک `<input>` متصل کنید. نتیجه یک ورودی ماسک‌دار است که در دسکتاپ یک popup و در صفحه‌های کوچک یک bottom sheet باز می‌کند:

```js
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

const picker = createDatePicker('#birthday', { locale: 'fa-IR' })

picker.on('change', ({ value }) => {
  if (value.mode === 'single' && value.date) {
    console.log(value.date.iso)       // '2026-03-21'  (ISO میلادی)
    console.log(value.date.formatted) // '۱۴۰۵/۰۱/۰۱'  (لوکال فعال)
  }
})
```

در فیلد تایپ کنید، یا روی آن کلیک کنید تا تقویم باز شود:

<Demo :controls="['value']" placeholder="۱۴۰۵/۰۱/۰۱" caption="یک پیکر تکی fa-IR با ماسک ورودی هوشمند." />

## تقویم درون‌صفحه {#an-inline-calendar}

اگر المنتی غیر از `<input>` بدهید، تقویم به‌صورت درون‌صفحه و همیشه‌نمایان mount می‌شود:

```js
createDatePicker(document.querySelector('#calendar'), {
  locale: 'fa-IR',
})
```

گزینهٔ `display` شکل پیکر را، فارغ از المنت مقصد، تعیین می‌کند: `'inline'`، `'popup'`، `'sheet'` یا `'modal'`. جزئیات در [گزینه‌ها](/fa/api/options#display-is-independent-of-the-target).

<Demo inline locale="fa-IR" :controls="['value']" caption="یک تقویم درون‌صفحهٔ همیشه‌نمایان." />

## بازه در دو ماه {#a-range-across-two-months}

```js
createDatePicker('#stay', {
  locale: 'fa-IR',
  mode: 'range',
  months: 2,
})
```

<Demo inline mode="range" :months="2" :controls="['value']" caption="انتخاب بازه با دو پنِ ماه و پیش‌نمایش بازه زیر نشانگر." />

## رویدادها {#events}

با `picker.on()` گوش دهید، یا یک کال‌بک `on<Event>` همراه گزینه‌ها بدهید:

```js
const picker = createDatePicker('#stay', {
  mode: 'range',
  onRangeComplete: ({ start, end }) => book(start.iso, end.iso),
})

const off = picker.on('change', ({ value, source }) => console.log(value, source))
off() // لغو اشتراک
```

همهٔ رویدادها و payloadهایشان در [رویدادها](/fa/api/events) آمده‌اند.

## نمونهٔ برگشتی {#the-returned-instance}

خروجی `createDatePicker()` یک `DatePicker` است که از کد کنترلش می‌کنید:

```js
picker.open()
picker.setValue('2026-03-21')
picker.setLocale('en-US')
picker.setTheme('dark')
picker.getValue()
picker.clear()
picker.destroy()
```

ویژگی `picker.core` همان [`PickerCore`](/fa/core/picker-core) هستهٔ headless است و `picker.el` المنت‌های رندرشده را نگه می‌دارد. سطح کامل API در [مرجع DatePicker](/fa/vanilla/api) آمده است.

## فیلد تاریخ {#date-field}

`createDateField` [فیلد تاریخ](/fa/guide/date-field) بخش‌بندی‌شده را رندر می‌کند، برای تاریخ‌هایی که کاربر تایپ می‌کند نه این‌که دنبالش بگردد:

```js
import { createDateField } from 'khorshid'

const field = createDateField('#birthday', {
  locale: 'fa-IR',
  label: 'تاریخ تولد',
  name: 'birthday',
  onChange: ({ value }) => console.log(value?.iso),
})
```

[مرجع createDateField](/fa/vanilla/date-field) را ببینید.

**مطالب مرتبط:** [مرجع DatePicker](/fa/vanilla/api) · [گزینه‌ها](/fa/api/options) · [فرم‌ها](/fa/guide/forms) · [Web Component](/fa/web-component/)
