# createDateField

ورودی تاریخ بخش‌بخش در وانیلا: `createDateField` و نمونهٔ `DateField` که برمی‌گرداند. گزینه‌ها، رویدادها و کدهای اعتبارسنجی‌اش بین همهٔ لایه‌ها مشترک‌اند و در [گزینه‌های فیلد تاریخ](/fa/api/date-field) آمده‌اند. برای آموزش قدم‌به‌قدم با نمونه‌های زنده، [راهنمای فیلد تاریخ](/fa/guide/date-field) را ببینید.

## امضا {#signature}

```ts
import { createDateField } from 'khorshid'   // یا '@khorshid-js/dom'
import 'khorshid/styles.css'

function createDateField(
  target: string | HTMLElement,
  options?: CreateDateFieldOptions
): DateField
```

| پارامتر | توضیح |
|---|---|
| `target` | یک سلکتور CSS یا یک المنت. ریشهٔ `.sdp-field` درون آن اضافه می‌شود. اگر سلکتور به چیزی نخورد خطا پرتاب می‌کند. |
| `options` | `CreateDateFieldOptions`: [گزینه‌های فیلد تاریخ](/fa/api/date-field) به‌اضافهٔ یک کال‌بک `on<Event>` برای هر [رویداد](/fa/api/date-field#events). |

همین گزینه‌ها با همین نام‌ها، propهای `<DateField>` در [React](/fa/react/api#datefield) و [Vue](/fa/vue/api#datefield) و attributeهای [`<khorshid-date-field>`](/fa/web-component/api#khorshid-date-field) هستند.

## نمونهٔ `DateField` {#datefield-instance}

| عضو | امضا | توضیح |
|---|---|---|
| `core` | `DateFieldCore` | فیلد بدون رابط. [DateFieldCore](/fa/core/date-field-core) را ببینید. |
| `el` | `{ root, group, input }` | ریشهٔ `.sdp-field`، جعبهٔ `.sdp-field__group` و `.sdp-field__input` که بخش‌ها را در خود دارد. |
| `getValue` | `() => DateValue \| null` | مقدار ثبت‌شده؛ وقتی خالی، ناقص یا نامعتبر است `null`. |
| `setValue` | `(value: DateFieldValueInput) => void` | تعیین مقدار. |
| `clear` | `() => void` | خالی کردن همهٔ بخش‌ها. |
| `focus` | `() => void` | فوکوس روی اولین بخش خالی، وگرنه اولین بخش. |
| `validate` | `() => DateFieldValidation \| null` | اعتبارسنجی همین حالا و نمایش نتیجه، از جمله `required` و `incomplete`. |
| `on` / `off` | `(event, handler)` | اشتراک در یک [رویداد](/fa/api/date-field#events) یا حذف handler. `on` تابع لغو اشتراک برمی‌گرداند. |
| `setOptions` | `(options: DateFieldMutableOptions) => void` | تغییر درجای `min`، `max`، `disabledDates`، `required`، `readOnly`، `disabled`، `invalid` یا `validate`. |
| `setLocale` | `(locale: string) => void` | تعویض لوکال. اگر تقویم عوض شود، مقدار در تقویم جدید بیان می‌شود. |
| `setCalendar` | `(calendar: CalendarId) => void` | رفتن به لوکال هم‌زبانِ آن تقویم. |
| `setTheme` | `(theme: Theme) => void` | تعویض طرح رنگ. |
| `setVars` | `(vars: Record<string, string>) => void` | ادغام متغیرهای CSS همین نمونه. رشتهٔ خالی یکی را حذف می‌کند. |
| `destroy` | `() => void` | حذف فیلد و listenerهایش. |
