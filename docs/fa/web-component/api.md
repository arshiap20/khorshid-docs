# Custom Elements

مرجع `<khorshid-datepicker>` و `<khorshid-date-field>`: attributeها، propertyها، متدها و رویدادهایشان. هر دو در light DOM خودشان رندر می‌شوند، پس استایل‌شیت استاندارد و توکن‌های `--sdp-*` روی آن‌ها اعمال می‌شود و فیلدهای فرمشان جزو `<form>` دربرگیرنده می‌شوند. برای نحوهٔ استفاده، [راهنمای Web Component](/fa/web-component/) را ببینید.

## ثبت کردن {#registering}

```js
import { defineDatePickerElement, defineDateFieldElement } from 'khorshid/element'
import 'khorshid/styles.css'

defineDatePickerElement()   // <khorshid-datepicker>
defineDateFieldElement()    // <khorshid-date-field>
```

| خروجی | توضیح |
|---|---|
| `defineDatePickerElement(tagName?)` | ثبت المنت پیکر، به‌طور پیش‌فرض با نام `khorshid-datepicker`. |
| `defineDateFieldElement(tagName?)` | ثبت المنت فیلد تاریخ، به‌طور پیش‌فرض با نام `khorshid-date-field`. |
| `@khorshid-js/element/define` | import با اثر جانبی که هر دو را ثبت می‌کند. |

ثبت دوبارهٔ تگی که وجود دارد کاری نمی‌کند، و نام تگ دوم یک زیرکلاس ثبت می‌کند. روی سرور (بدون `customElements`) هر دو تابع کاری نمی‌کنند و import ماژول هرگز خطا نمی‌دهد.

## `<khorshid-datepicker>` {#khorshid-datepicker}

[`createDatePicker`](/fa/vanilla/api) را در بر می‌گیرد. یک `<input class="sdp-element__input">` رندر می‌کند، یا با `display="inline"` یک `<div class="sdp-element__mount">` که پنل را در خود دارد.

### Attributeها {#datepicker-attributes}

attributeها همان [گزینه‌ها](/fa/api/options) به شکل kebab-case هستند. attribute بولی با حضورش روشن است؛ `="false"` آن را خاموش می‌کند، و این راه خاموش کردن گزینه‌هایی است که پیش‌فرضشان روشن است. attributeهای ناشناخته و مقدارهای نامعتبر نادیده گرفته می‌شوند.

| attribute | گزینه | مقدارها |
|---|---|---|
| `locale` | `locale` | کلید یک لوکال. زنده. |
| `theme` | `theme` | `light`، `dark`، `auto`. زنده. |
| `mode` | `mode` | `single`، `range`، `multiple`. زنده. |
| `value` | `value` | `2026-03-21`؛ بازه به شکل `start/end` (هر طرف می‌تواند خالی باشد)؛ فهرست جداشده با کاما برای حالت چندتایی. زنده. |
| `placeholder` | ندارد | روی input داخلی گذاشته می‌شود. زنده. |
| `disabled` | ندارد | input داخلی را غیرفعال و پیکر را فقط‌خواندنی می‌کند؛ هرگز باز نمی‌شود. |
| `unit` | `unit` | `day`، `week`، `month`، `year`. |
| `display` | `display` | `auto`، `inline`، `popup`، `sheet`، `modal`. |
| `min`، `max` | `min`، `max` | تاریخ‌های ISO. |
| `months` | `months` | یک عدد. |
| `min-days`، `max-days` | `minDays`، `maxDays` | عدد. |
| `shortcuts` | `shortcuts` | بولی، یا فهرستی از شناسهٔ پیش‌تنظیم‌ها با کاما مثل `today,thisWeek,thisMonth`. |
| `secondary-calendar` | `secondaryCalendar` | بولی، یا شناسهٔ یک تقویم (`jalali`، `gregorian`، `hijri`). |
| `natural-input` | `naturalInput` | بولی. |
| `time` | `time` | بولی (ساعت ۲۴ساعته با `HH:mm`). `TimeOptions` را از طریق `options` بدهید. |
| `format` | `format` | یک [الگوی قالب](/fa/api/format-tokens). |
| `week-start` | `weekStart` | `0` (یکشنبه) … `6` (شنبه). |
| `name`، `required` | `name`، `required` | نام فرم، و بولی. |
| `readonly` | `readOnly` | بولی. |
| `position` | `position` | `auto`، `bottom-start`، `bottom-end`، `top-start`، `top-end`. |
| `z-index` | `zIndex` | یک عدد. |
| `mobile-breakpoint` | `mobileBreakpoint` | یک عدد، یا `false` یعنی هرگز. |
| `outside-days` | `outsideDays` | `interactive`، `visible`، `hidden`. |
| `confirm` | `confirm` | `true`، `false`، `auto`. |
| `show-today`، `show-clear`، `animate`، `highlight-today`، `year-picker`، `fixed-weeks`، `auto-close`، `input-mask` | گزینهٔ camelCase هم‌نام | بولی‌هایی که پیش‌فرضشان روشن است. |

`locale`، `theme`، `mode`، `value` و `placeholder` درجا اعمال می‌شوند. تغییر هر attribute دیگر پیکر را از نو می‌سازد و مقدار فعلی را نگه می‌دارد.

### Propertyها و متدها {#datepicker-properties}

| عضو | نوع | توضیح |
|---|---|---|
| `value` | `PickerValue` (خواندن)، `PickerValueInput` (نوشتن) | مقدار فعلی. پیش از وصل شدن المنت هم خوانده و نوشته می‌شود. |
| `options` | `DatePickerOptions` | گزینه‌های فقط-JS که روی attributeها ادغام می‌شوند: تابع‌ها (`disabledDates`، `renderDay`، `formValue`، `on<Event>`)، آبجکت‌ها (`vars`، `plugins`، `shortcuts` سفارشی). مقداردهی آن پیکر را از نو می‌سازد و مقدار را نگه می‌دارد. |
| `picker` | `DatePicker \| null` | [`DatePicker`](/fa/vanilla/api) زیرین، یا `null` وقتی وصل نیست. |
| `core` | `PickerCore \| null` | [`PickerCore`](/fa/core/picker-core) آن، یا `null` وقتی وصل نیست. |
| `open()` | `() => void` | باز کردن پیکر. وقتی `disabled` است کاری نمی‌کند. |
| `close()` | `() => void` | بستن پیکر. |
| `clear()` | `() => void` | پاک کردن مقدار. |

حذف المنت پیکر را تخریب می‌کند؛ درج دوبارهٔ آن پیکر تازه‌ای با همان مقدار می‌سازد.

### رویدادها {#datepicker-events}

هر رویداد هسته به شکل یک `CustomEvent` با نام `sdp-` به‌اضافهٔ نام رویداد dispatch می‌شود که دونقطه در آن به خط تیره تبدیل شده است: `sdp-change`، `sdp-range-complete`، `sdp-view-change` و غیره (فهرست کامل در [رویدادها](/fa/api/events#names-in-every-layer) است). این رویدادها bubble می‌کنند، composed هستند و payload هسته را در `detail` دارند. `DATEPICKER_ELEMENT_EVENTS` همهٔ نام‌ها را فهرست می‌کند و `addEventListener` برای آن‌ها نوع‌دار است.

پیشوند، آن‌ها را از رویدادهای بومی `change`، `input` و `select` در input داخلی جدا می‌کند که آن‌ها هم از میزبان bubble می‌کنند.

## `<khorshid-date-field>` {#khorshid-date-field}

[`createDateField`](/fa/api/date-field) را در بر می‌گیرد و درخت `.sdp-field` را درون المنت رندر می‌کند.

### Attributeها {#date-field-attributes}

| attribute | گزینه | مقدارها |
|---|---|---|
| `locale` | `locale` | کلید یک لوکال. زنده. |
| `theme` | `theme` | `light`، `dark`، `auto`. زنده. |
| `value` | `value` | یک تاریخ ISO (`2026-03-21`) یا تاریخ و ساعت (`2026-03-21T14:30`، `2026-03-21T14:30:15`). هر چیز دیگر یعنی خالی. زنده، و همان مقداری که ریست فرم برمی‌گرداند. |
| `min`، `max` | `min`، `max` | تاریخ‌های ISO؛ مقدار نامعتبر نادیده گرفته می‌شود. زنده. |
| `required`، `readonly`، `disabled`، `invalid` | `required`، `readOnly`، `disabled`، `invalid` | بولی. زنده. |
| `format` | `format` | یک [الگوی قالب](/fa/api/format-tokens#where-each-token-works). |
| `placeholder-value` | `placeholderValue` | یک تاریخ ISO. |
| `time` | `time` | حضور، `true`، `24` یا `24h` برای ساعت ۲۴ساعته؛ `12` یا `12h` برای ۱۲ساعته با ق.ظ/ب.ظ؛ `false` برای خاموش. |
| `time-seconds` | `time.showSeconds` | بولی؛ فقط وقتی `time` روشن است. |
| `minute-step` | `time.minuteStep` | عدد صحیح از ۱؛ فقط وقتی `time` روشن است. |
| `name` | `name` | نام فیلد فرم. |
| `label`، `description`، `error-message` | `label`، `description`، `errorMessage` | متن؛ به شکل متن رندر می‌شود و هرگز به‌عنوان HTML تفسیر نمی‌شود. |
| `variant` | `variant` | `primary`، `secondary`. |
| `full-width` | `fullWidth` | بولی. |
| `aria-label` | `ariaLabel` | نام دسترس‌پذیر وقتی برچسبی نیست. |
| `auto-focus` | `autoFocus` | بولی؛ فقط هنگام درج المنت اعمال می‌شود. |

attributeهای زنده درجا اعمال می‌شوند. تغییر هر attribute دیگر فیلد را از نو می‌سازد و مقدارش را نگه می‌دارد، و اگر بخشی فوکوس داشت فوکوس را هم.

### Propertyها و متدها {#date-field-properties}

| عضو | نوع | توضیح |
|---|---|---|
| `value` | `DateValue \| null` (خواندن)، `DateFieldValueInput` (نوشتن) | مقدار ثبت‌شده؛ وقتی خالی، ناقص یا نامعتبر است `null`. |
| `options` | `CreateDateFieldOptions` | گزینه‌های فقط-JS که روی attributeها ادغام می‌شوند: `validate`، `disabledDates`، `formValue`، `on<Event>`، `labels`، `vars`، `classes`، گره برای `prefix`، `suffix` یا `label` با HTML. مقداردهی آن فیلد را از نو می‌سازد و مقدار را نگه می‌دارد. |
| `field` | `DateField \| null` | [`DateField`](/fa/vanilla/date-field#datefield-instance) زیرین، یا `null` وقتی وصل نیست. |
| `core` | `DateFieldCore \| null` | هستهٔ آن، یا `null` وقتی وصل نیست. |
| `focus()` | `() => void` | فوکوس روی اولین بخش خالی، وگرنه اولین بخش. |
| `validate()` | `() => DateFieldValidation \| null` | اعتبارسنجی همین حالا، از جمله `required` و `incomplete`. وقتی وصل نیست `null`. |
| `clear()` | `() => void` | پاک کردن مقدار. |

### رویدادها {#date-field-events}

| رویداد | `detail` |
|---|---|
| `sdp-change` | `{ value, source }` |
| `sdp-input` | `{ type, value, text, complete }` |
| `sdp-error` | `{ code, message, reason?, input }` |
| `sdp-locale-change` | `{ locale }` |

`DATE_FIELD_ELEMENT_EVENTS` آن‌ها را فهرست می‌کند. پیشوند، آن‌ها را از رویدادهای بومی `input` بخش‌های قابل ویرایش جدا می‌کند.

## خروجی‌های دیگر {#other-exports}

| خروجی | توضیح |
|---|---|
| `KhorshidDatePickerElement`، `KhorshidDateFieldElement` | کلاس‌های المنت، برای زیرکلاس‌سازی یا بررسی `instanceof`. |
| `parseValueAttribute(raw)` | نحوهٔ خواندن attribute `value` پیکر و تبدیل آن به `PickerValueInput`. |
| `parseDateFieldValueAttribute(raw)` | نحوهٔ خواندن attribute `value` فیلد تاریخ: رشتهٔ ISO یا `null`. |
| `ElementEventName`، `KhorshidDatePickerEventMap`، `DateFieldElementEventName`، `KhorshidDateFieldEventMap` | نوع‌های نام رویدادها و `CustomEvent`ها. |
