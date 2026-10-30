# Web Component

المنت `<khorshid-datepicker>` همان پیکر است در قالب یک Custom Element بی‌نیاز از فریم‌ورک. می‌توانید آن را در HTML ساده، صفحه‌هایی که سمت سرور رندر می‌شوند (Rails، Django، Laravel، قالب‌های Go)، یک CMS یا فریم‌ورکی که آداپتر اختصاصی ندارد به کار ببرید. این صفحه ثبت المنت، attributeها، propertyها، رویدادها، فرم‌ها و تم‌بندی آن را توضیح می‌دهد.

## چطور کار می‌کند {#how-it-works}

این المنت روی [`createDatePicker`](/fa/vanilla/api) سوار است و در light DOM خودش رندر می‌کند، نه در shadow root. در نتیجه:

- همان استایل‌شیت استاندارد اعمال می‌شود و متغیرهای `--sdp-*` طبق معمول کار می‌کنند؛
- فیلدی که برای `name` می‌سازد داخل `<form>` شما قرار می‌گیرد.

<ElementDemo caption="یک المنت واقعی khorshid-datepicker از پکیج build‌شده: نمایش inline، حالت range، میان‌برها و تقویم دوم.">
  <khorshid-datepicker display="inline" locale="fa-IR" mode="range" shortcuts secondary-calendar></khorshid-datepicker>
</ElementDemo>

## نصب و ثبت {#install-and-register}

```js
import { defineDatePickerElement } from 'khorshid/element'
import 'khorshid/styles.css'

defineDatePickerElement() // <khorshid-datepicker> را ثبت می‌کند
```

تابع `defineDatePickerElement(tagName?)` یک نام تگ اختیاری می‌گیرد و ثبت دوبارهٔ یک نام هیچ اثری ندارد. ایمپورت‌کردن این ماژول در رندر سمت سرور هم امن است: سمت سرور نه خطا می‌دهد و نه چیزی را ثبت می‌کند.

::: tip بدون bundler
پکیج scoped یعنی `@khorshid-js/element` یک ورودی خودثبت‌کن به نام `@khorshid-js/element/define` دارد که باندلش لایهٔ DOM و هسته را هم در خود دارد. یک `<script type="module">` ساده که آن را به‌همراه `@khorshid-js/element/styles.css` import کند کافی است و به مرحلهٔ build نیازی نیست. همین ورودی `<khorshid-date-field>` را هم ثبت می‌کند.
:::

بعد المنت را در markup به کار ببرید:

```html
<khorshid-datepicker locale="fa-IR" placeholder="۱۴۰۵/۰۱/۰۱"></khorshid-datepicker>

<khorshid-datepicker mode="range" months="2" min-days="2" shortcuts></khorshid-datepicker>

<khorshid-datepicker display="inline" locale="en-US-gregorian" secondary-calendar></khorshid-datepicker>
```

## attributeها {#attributes}

هر attribute همان [گزینه](/fa/api/options) است، به شکل kebab-case. attributeهای boolean از
قواعد HTML پیروی می‌کنند (وجود attribute یعنی روشن). مقدار `="false"` هم گزینه را خاموش می‌کند و
راه خاموش‌کردن گزینه‌هایی است که به‌طور پیش‌فرض روشن‌اند (`show-today="false"`).

| attribute | گزینه | توضیح |
|---|---|---|
| `locale` | `locale` | زنده. |
| `theme` | `theme` | `light` / `dark` / `auto`. زنده. |
| `mode` | `mode` | `single` / `range` / `multiple`. زنده. |
| `value` | `value` | `2026-03-21`، بازه به شکل `start/end`، یا فهرستی جداشده با ویرگول. زنده. |
| `unit` | `unit` | `day` / `week` / `month` / `year`. |
| `display` | `display` | `auto`، `inline`، `popup`، `sheet`، `modal`. |
| `min`، `max` | `min`، `max` | تاریخ‌های ISO. |
| `months` | `months` | تعداد پن‌های کنار هم. |
| `min-days`، `max-days` | `minDays`، `maxDays` | محدودیت طول بازه. |
| `shortcuts` | `shortcuts` | boolean، یا فهرستی از شناسهٔ پیش‌تنظیم‌ها با ویرگول: `shortcuts="today,thisWeek,thisMonth"`. |
| `secondary-calendar` | `secondaryCalendar` | boolean، یا شناسهٔ یک تقویم (`hijri`). |
| `natural-input` | `naturalInput` | boolean. |
| `time` | `time` | boolean. |
| `name`، `required` | `name`، `required` | ارسال و اعتبارسنجی فرم. |
| `readonly` | `readOnly` | boolean. |
| `disabled` | — | input داخلی را غیرفعال می‌کند؛ پیکر هیچ‌وقت باز نمی‌شود. |
| `placeholder` | — | روی input داخلی تنظیم می‌شود. زنده. |
| `format` | `format` | قالب نمایش، مثلاً `D MMMM YYYY`. |
| `week-start` | `weekStart` | از `0` (یکشنبه) تا `6` (شنبه). |
| `position`، `z-index`، `mobile-breakpoint` | همان‌ها به شکل camelCase | جای قرارگیری overlay. `mobile-breakpoint="false"` یعنی هیچ‌وقت sheet نشود. |
| `outside-days` | `outsideDays` | `interactive` / `visible` / `hidden`. |
| `confirm` | `confirm` | `true` / `false` / `auto`. |
| `show-today`، `show-clear`، `animate`، `highlight-today`، `year-picker`، `fixed-weeks`، `auto-close`، `input-mask` | همان‌ها به شکل camelCase | به‌طور پیش‌فرض روشن‌اند؛ با `="false"` خاموش می‌شوند. |

مقدارهای نامعتبر و attributeهای ناشناخته نادیده گرفته می‌شوند. `locale`، `theme`، `mode`،
`value` و `placeholder` به‌صورت زنده اعمال می‌شوند؛ تغییر هر attribute دیگری پیکر را از نو
می‌سازد و **مقدار فعلی را حفظ می‌کند**.

## propertyها و متدها {#properties-and-methods}

```js
import { holidaysPlugin } from 'khorshid/holidays'

const el = document.querySelector('khorshid-datepicker')

el.value                  // یک PickerValue: { mode: 'single', date: DateValue | null } …
el.value = '2026-03-21'   // هر چیزی که setValue می‌پذیرد (ISO، [..]، { start, end }، PickerValue)

// گزینه‌هایی که فقط از JS قابل تنظیم‌اند (تابع، آبجکت) و روی attributeها merge می‌شوند. مقداردهی، پیکر را از نو می‌سازد.
el.options = {
  disabledDates: (d) => (d.weekday === 5 ? 'جمعه‌ها تعطیل است' : false),
  shortcuts: [{ id: 'nowruz', label: 'نوروز', value: '2026-03-21' }],
  plugins: [holidaysPlugin({ offline: true })],
}

el.picker   // DatePicker زیرین، یا null وقتی المنت از DOM جدا شده
el.core     // PickerCore آن (headless)
el.open(); el.close(); el.clear()
```

حذف المنت از DOM پیکر (و هر overlay باز) را از بین می‌برد. اگر دوباره آن را درج کنید، پیکر
تازه‌ای با همان مقدار ساخته می‌شود.

## رویدادها {#events}

هر رویداد هسته به‌صورت یک `CustomEvent` با نام `sdp-<event>` روی خود المنت هم dispatch می‌شود
(دونقطه‌ها به خط تیره تبدیل می‌شوند). این رویداد bubble می‌شود، composed است و `detail` آن همان
payload هسته است.

```js
el.addEventListener('sdp-change', (e) => {
  console.log(e.detail.value, e.detail.source)
})
el.addEventListener('sdp-range-complete', (e) => book(e.detail.start.iso, e.detail.end.iso))
```

| رویداد | `detail` |
|---|---|
| `sdp-change` | `{ value, source }` |
| `sdp-select` | `{ date }` |
| `sdp-clear` | `{ previous }` |
| `sdp-range-start` / `sdp-range-complete` | `{ start }` / `{ start, end }` |
| `sdp-open` / `sdp-close` | `{}` |
| `sdp-view-change`، `sdp-month-change`، `sdp-year-change` | نما / ناوبری |
| `sdp-locale-change`، `sdp-calendar-change`، `sdp-time-change` | لوکال / تقویم / ساعت جدید |
| `sdp-shortcut` | `{ id, value }` |
| `sdp-input`، `sdp-error` | مانند [رویدادها](/fa/api/events) |

دلیل پیشوند این است که رویدادهای بومی `change`، `input` و `select` مربوط به `<input>` داخلی هم از
المنت میزبان bubble می‌شوند و پیشوند `sdp-` این دو دسته را از هم جدا نگه می‌دارد. ثابت
`DATEPICKER_ELEMENT_EVENTS` فهرست همهٔ نام‌ها را دارد. در TypeScript هم
`addEventListener('sdp-change', …)` تایپ‌شده است.

## فرم‌ها {#forms}

چون المنت در light DOM render می‌کند، فیلد مخفی‌ای که `name` می‌سازد داخل فرم شما قرار می‌گیرد
و یک `<label>` دربرگیرنده هم برچسب input داخلی می‌شود:

```html
<form action="/book">
  <label>
    تاریخ اقامت
    <khorshid-datepicker name="stay" mode="range" min-days="2" required></khorshid-datepicker>
  </label>
  <button>رزرو</button>
</form>
<!-- ارسال می‌شود: stay=2026-04-04/2026-04-07 -->
```

مقدارها به شکل ISO serialize می‌شوند (`2026-04-04`، `start/end` برای بازه، و جداشده با ویرگول
برای چند تاریخ). برای قالب دیگر، `formValue` را از طریق `el.options` بدهید. رفتار اعتبارسنجی و
reset را در [فرم‌ها](/fa/guide/forms) ببینید.

## تم‌بندی {#theming}

این المنت همان markup و استایل‌شیت پیکر vanilla را دارد؛ پس [تم‌بندی](/fa/guide/theming) بدون هیچ تغییری کار می‌کند:

```css
khorshid-datepicker {
  --sdp-accent: #0d9488;
  --sdp-radius: 12px;
}
```

پنجره‌های popup به `<body>` منتقل (portal) می‌شوند؛ پس برای رنگ‌بندی اختصاصی هر نمونه روی
overlay، بهتر است از `el.options = { vars: { accent: '#0d9488' } }` استفاده کنید.

## المنت فیلد تاریخ {#the-date-field-element}

المنت `<khorshid-date-field>` همان [فیلد تاریخ](/fa/guide/date-field) بخش‌بندی‌شده در قالب یک Custom Element است. آن را با `defineDateFieldElement()` از `khorshid/element` ثبت کنید؛ نمونهٔ استفاده‌اش در صفحهٔ فیلد تاریخ آمده است.

**مطالب مرتبط:** [مرجع المنت](/fa/web-component/api) · [فرم‌ها](/fa/guide/forms) · [تم‌بندی](/fa/guide/theming) · [React](/fa/react/) · [Vue](/fa/vue/)
