# DatePicker

`createDatePicker(target, options?)` تنها factory پیکر وانیلا است. خروجی آن یک `DatePicker` است: پنل رندرشده، فیلد و اورلی آن، و هستهٔ headless پشت آن‌ها.

```ts
import { createDatePicker } from 'khorshid'   // یا '@khorshid-js/dom'
import 'khorshid/styles.css'

function createDatePicker<M extends PickerMode = 'single'>(
  target: string | HTMLElement,
  options?: DatePickerOptions & { mode?: M }
): DatePicker<M>
```

| پارامتر | توضیح |
|---|---|
| `target` | یک سلکتور CSS یا یک المنت. `<input>` یا `<textarea>` فیلدی ماسک‌دار می‌شود که اورلی باز می‌کند؛ هر المنت دیگر یک پنل inline درون خودش می‌گیرد. [`display`](/fa/api/options#display-is-independent-of-the-target) هر دو پیش‌فرض را تغییر می‌دهد. |
| `options` | `DatePickerOptions`: همهٔ [گزینه‌ها](/fa/api/options) به‌اضافهٔ یک کال‌بک `on<Event>` برای هر [رویداد](/fa/api/events). |

اگر DOM وجود نداشته باشد (`document` تعریف نشده باشد) یا سلکتور به هیچ المنتی نخورد، factory خطا پرتاب می‌کند.

factory آماده‌ای مثل `rangePicker` یا `inlineCalendar` وجود ندارد. `mode` و `display` همهٔ آن موارد را پوشش می‌دهند.

## نوع بر اساس حالت {#typed-by-mode}

مقدار ثابت `mode` نوع خروجی را باریک می‌کند، پس `getValue()` به بررسی `value.mode` نیاز ندارد:

```ts
const range = createDatePicker('#stay', { mode: 'range' })
range.getValue().start   // نوع: DateValue | null
```

| نوع | معادل |
|---|---|
| `SingleDatePicker` | `DatePicker<'single'>` |
| `RangeDatePicker` | `DatePicker<'range'>` |
| `MultipleDatePicker` | `DatePicker<'multiple'>` |
| `DomNode` | `string \| HTMLElement \| null \| void`، چیزی که قلاب‌های رندر می‌توانند برگردانند |

## ویژگی‌ها {#properties}

| ویژگی | نوع | توضیح |
|---|---|---|
| `core` | `PickerCore` | موتور headless. [PickerCore](/fa/core/picker-core) را ببینید. |
| `el.input` | `HTMLInputElement \| undefined` | فیلد، وقتی target فیلد بوده است. |
| `el.panel` | `HTMLElement` | ریشهٔ پنل `.sdp`. |
| `el.overlay` | `HTMLElement \| undefined` | ریشهٔ `.sdp-overlay`، فقط وقتی popup، sheet یا modal نصب است. |

## متدها {#methods}

| متد | امضا | توضیح |
|---|---|---|
| `open` | `() => void` | باز کردن اورلی. پنل inline همیشه باز است. |
| `close` | `() => void` | بستن اورلی. |
| `toggle` | `() => void` | اگر بسته است باز می‌کند، اگر باز است می‌بندد. |
| `getValue` | `() => ValueFor<M>` | مقدار فعلی، باریک‌شده بر اساس `mode`. |
| `setValue` | `(value: PickerValueInput) => void` | تعیین مقدار. وقتی انتخاب واقعاً عوض شود، `change` با منبع `'api'` صادر می‌کند. |
| `clear` | `() => void` | پاک کردن مقدار. `clear` و سپس `change` با منبع `'clear'` صادر می‌کند. اگر مقدار خالی باشد کاری نمی‌کند. |
| `on` | `(event, handler) => Unsubscribe` | اشتراک در یک [رویداد](/fa/api/events). تابع لغو اشتراک برمی‌گرداند. |
| `off` | `(event, handler) => void` | حذف یک handler. |
| `setTheme` | `(theme: 'light' \| 'dark' \| 'auto') => void` | تعویض طرح رنگ پنل و اورلی. |
| `setLocale` | `(locale: string) => void` | تعویض لوکال با کلید آن، و همراهش تقویم. `locale:change` صادر می‌کند (و اگر تقویم عوض شود `calendar:change`). |
| `setCalendar` | `(calendar: CalendarId) => void` | رفتن به لوکال هم‌زبانِ آن تقویم، ترجیحاً از همان منطقه. اگر چنین لوکالی نباشد، `error` با کد `no-locale-variant` صادر می‌کند. |
| `setMode` | `(mode: PickerMode) => void` | تعویض حالت انتخاب. مقدار تا جایی که جا شود حفظ می‌شود: تکی اولین تاریخ را نگه می‌دارد و بازه دو تاریخ زودتر را. اگر مقدار کوتاه شود `change` صادر می‌کند. |
| `setVars` | `(vars: Record<string, string>) => void` | ادغام متغیرهای CSS همین نمونه در پنل و اورلی. رشتهٔ خالی یک متغیر را حذف می‌کند. |
| `destroy` | `() => void` | حذف پنل، اورلی، فیلد فرم و همهٔ listenerها، و تخریب هسته. |

هر چیز دیگر (پیمایش، نماها، مدل‌های رندر، میان‌برها، `format`، `parse`، `submitInput`، `once`، `onAny`) روی `picker.core` است.

## مثال {#example}

```js
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

const picker = createDatePicker('#date', { locale: 'fa-IR' })

const off = picker.on('change', ({ value, source }) => console.log(value, source))

picker.setValue('2026-03-21')
picker.setLocale('en-US')
picker.setTheme('dark')
picker.setVars({ accent: '#e11d48' })
picker.core.goToToday()
picker.core.applyShortcut('thisMonth')

off()
picker.destroy()
```

## فیلد فرم {#form-field}

با `name` یا `required`، پیکر یک `input.sdp-form-value` پنهان اضافه می‌کند که مقدار سریال‌شده را نگه می‌دارد، تا `<form>` دربرگیرنده آن را ارسال کند. [فرم‌ها](/fa/guide/forms) را ببینید.

```js
const picker = createDatePicker('#stay', { mode: 'range', name: 'stay', required: true })

new FormData(form).get('stay') // '2026-04-04/2026-04-07'
picker.core.getFormValue()     // همان رشته
```

| رفتار | جزئیات |
|---|---|
| جایگاه | بعد از target از نوع `<input>`، درون mount از نوع inline، یا بعد از المنتی که اورلی به آن لنگر انداخته است. |
| همگام‌سازی | با هر `change`، هر تغییر لوکال و هر تغییر ساعت به‌روز می‌شود. |
| `required` | تا مقداری نباشد فرم نامعتبر است (بازه هر دو سر را لازم دارد). با رویداد `invalid`، فوکوس به فیلد یا به جدول روزها می‌رود. |
| متن تایپ‌شده | متن ردشده به فیلد کلاس `.sdp-input--invalid` می‌دهد و پیام validity بومی آن را `labels.invalidDate` می‌کند. |
| `reset` | ریست فرم، گزینهٔ `value` را برمی‌گرداند. |
| `destroy()` | فیلد پنهان را حذف می‌کند. |

markup را ترجیح می‌دهید؟ [`<khorshid-datepicker>`](/fa/web-component/api) همین factory را به شکل یک Custom Element ارائه می‌کند.

## خروجی‌های سطح پایین {#lower-level-exports}

`@khorshid-js/dom` قطعه‌هایی را هم که `createDatePicker` از آن‌ها ساخته شده export می‌کند. React و Vue از همین‌ها استفاده می‌کنند، پس اورلی‌ها و کیبورد در همهٔ لایه‌ها یکسان رفتار می‌کنند.

| خروجی | توضیح |
|---|---|
| `Panel` | رندرکنندهٔ پنل `.sdp`، متصل به یک هسته. |
| `Popup`، `Sheet`، `Modal` | پوسته‌های اورلی: جای‌گذاری، کشیدن برای بستن، به دام انداختن فوکوس، انیمیشن ورود و خروج. |
| `bindInput(input, core, { inputMask?, getPanel? })` | اتصال یک فیلد متنی به هسته: ماسک، ثبت با Enter و blur، باز شدن با فوکوس. تابع جداسازی برمی‌گرداند. |
| `bindFormField(core, options)` | افزودن `input.sdp-form-value` پنهان. تابع جداسازی برمی‌گرداند. |
| `bindKeyboard(core, root)`، `handlePanelKey(event, core, root)` | نقشهٔ کیبورد پنل. [کیبورد و دسترس‌پذیری](/fa/guide/keyboard-a11y) را ببینید. |
| `measureTitle`، `glideTitle` | لغزش عنوان هدر بین ماه‌ها. |
| `createDateField` | ورودی تاریخ بخش‌بخش. [createDateField](/fa/vanilla/date-field) را ببینید. |

`@khorshid-js/dom` (و بستهٔ `khorshid`) کل `@khorshid-js/core` را هم دوباره export می‌کند.
