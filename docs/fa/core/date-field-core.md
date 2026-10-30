# DateFieldCore

موتور بدون DOM فیلد تاریخ بخش‌بخش، و ابزارهایی که همهٔ لایه‌ها با آن‌ها رندرش می‌کنند. [گزینه‌های رفتاری](/fa/api/date-field#behavior-options) را می‌گیرد و [رویدادهای فیلد تاریخ](/fa/api/date-field#events) را صادر می‌کند. برای فیلد رندرشده، [`createDateField`](/fa/vanilla/date-field) یا کامپوننت‌های `<DateField>` را ببینید.

## `createDateFieldCore` {#createdatefieldcore}

`createDateFieldCore(options?: DateFieldOptions)` از `khorshid/headless` فیلد بدون DOM را برمی‌گرداند که همهٔ لایه‌ها رندرش می‌کنند.

| عضو | امضا | توضیح |
|---|---|---|
| `getState` | `() => Readonly<DateFieldState>` | وضعیت فعلی (تصویری پایدار تا تغییر بعدی). |
| `subscribe` | `(listener) => Unsubscribe` | بعد از هر تغییر وضعیت صدا زده می‌شود. |
| `on` / `once` / `off` / `onAny` | | اشتراک در رویدادها، مثل هستهٔ پیکر. |
| `getOptions` | `() => Readonly<DateFieldOptions>` | گزینه‌ها. |
| `setOptions` | `(options: DateFieldMutableOptions) => void` | به‌روزرسانی محدودیت‌ها و پرچم‌ها و اعتبارسنجی دوباره. |
| `getLocale` / `setLocale` | | خواندن یا تعویض لوکال. |
| `getCalendar` / `setCalendar` | | خواندن سیستم تقویم، یا رفتن به لوکال هم‌زبانِ یک تقویم. |
| `getValue` / `setValue` / `clear` | | خواندن، تعیین یا پاک کردن مقدار. |
| `focusSegment` | `(type: DateSegmentType \| null) => void` | علامت زدن بخشی که ویرایش می‌شود (هنگام فوکوس صدا بزنید). ورودی نیمه‌کارهٔ بخش قبلی را تمام می‌کند. |
| `blur` | `() => void` | فیلد فوکوس را از دست داد: ورودی را تمام می‌کند و `required` / `incomplete` را نشان می‌دهد. |
| `increment` / `decrement` | `(type, amount?) => void` | جابه‌جا کردن مقدار یک بخش، با چرخش. بخش خالی از `placeholderValue` شروع می‌کند. |
| `setSegment` | `(type, value: number \| null) => void` | تعیین یا پاک کردن یک بخش. |
| `typeText` | `(type, text: string) => boolean` | تایپ ارقام (به هر خطی)، `a`/`p` (یا `ق`/`ب`) برای ق.ظ/ب.ظ، یا یک جداکننده. اگر فوکوس باید به بخش بعد برود `true` برمی‌گرداند. |
| `backspace` | `(type) => boolean` | حذف آخرین رقم. اگر بخش از قبل خالی بوده `true` برمی‌گرداند، تا فوکوس به عقب برگردد. |
| `validate` | `() => DateFieldValidation \| null` | اعتبارسنجی همین حالا، از جمله `required` و `incomplete`. |
| `getText` | `() => string` | کل فیلد به شکل متن، با placeholder به‌جای بخش‌های خالی. |
| `getFormValue` | `() => string` | مقدار سریال‌شده برای فرم؛ وقتی خالی است `''`. |
| `destroy` | `() => void` | حذف همهٔ listenerها. |

`DateFieldState`:

| فیلد | نوع | توضیح |
|---|---|---|
| `segments` | `DateSegment[]` | همهٔ بخش‌ها و جداکننده‌ها به ترتیب نمایش. |
| `value` | `DateValue \| null` | مقدار ثبت‌شده. |
| `complete` / `empty` | `boolean` | همهٔ / هیچ‌کدام از بخش‌های قابل ویرایش مقدار دارند. |
| `active` | `DateSegmentType \| null` | بخشی که ویرایش می‌شود. |
| `validation` | `DateFieldValidation \| null` | چرا ورودی قابل استفاده نیست: `{ code, message, reason? }`. |
| `invalid` | `boolean` | `validation` مقدار دارد، یا `invalid` آن را اجبار کرده است. |
| `disabled`، `readOnly`، `required` | `boolean` | پرچم‌های فعلی. |

`DateSegment`:

| فیلد | نوع | توضیح |
|---|---|---|
| `type` | `DateSegmentType \| 'literal'` | `year`، `month`، `day`، `hour`، `minute`، `second`، `dayPeriod`، یا `literal` برای جداکننده‌ها. |
| `value` | `number \| null` | عدد بخش؛ وقتی خالی است `null`. در ساعت ۱۲ساعته `hour` بین ۱ تا ۱۲ است و `dayPeriod` برابر `0` (ق.ظ) یا `1` (ب.ظ). |
| `text` | `string` | چیزی که رندر می‌شود: مقدار با ارقام لوکال، ارقامی که تا اینجا تایپ شده، placeholder، یا متن جداکننده. |
| `placeholder` | `string` | وقتی خالی است نمایش داده می‌شود. |
| `isPlaceholder` | `boolean` | بخش خالی است. |
| `isEditable` | `boolean` | برای جداکننده‌ها `false`. |
| `min`، `max` | `number` | حدود؛ بیشینهٔ روز از ماه و سالی که تا اینجا وارد شده پیروی می‌کند. |
| `label` | `string` | نام دسترس‌پذیر، مثل `'ماه'` یا `'Month'`. |
| `valueText` | `string` | `aria-valuetext`، مثل `'3 – Khordad'`. |

## ابزارهای رندر {#rendering-helpers}

ابزارهای مشترکی که همهٔ لایه‌ها از آن‌ها رندر می‌کنند، از `khorshid/headless`:

| خروجی | توضیح |
|---|---|
| `segmentAttributes(segment, state)` | attributeهای ARIA و data یک بخش (`role="spinbutton"`، `aria-valuenow`، …). |
| `dateFieldRootAttributes(state, { variant?, fullWidth?, extra? })` | کلاس و attributeهای وضعیت `data-*` ریشه. |
| `dateFieldKeyAction(core, type, event)` | اعمال یک فشار کلید روی یک بخش. خروجی `{ handled, move }` است که `move` یکی از `'next'`، `'prev'`، `'first'`، `'last'` یا `null` است. |
| `adjacentSegment(state, type, 1 \| -1)` | بخش قابل ویرایش بعدی یا قبلی. |
| `dateFieldErrorText(state)` | پیام اعتبارسنجی فعلی، یا `''`. |
| `FIELD_PAGE_STEPS` | گام PageUp / PageDown برای هر بخش: سال ۵، ماه ۲، روز ۷، ساعت ۲، دقیقه و ثانیه ۱۵. |
| `DATE_FIELD_DEFAULTS` | پیش‌فرض‌های `theme`، `variant`، `fullWidth`، `readOnly`، `disabled`، `required` و `autoFocus`. |
| `DATE_FIELD_EVENTS`، `bindDateFieldHandlers`، `splitDateFieldHandlers` | فهرست رویدادها و ابزارهایی که کال‌بک‌های `on<Event>` را وصل می‌کنند. |
