# گزینه‌های فیلد تاریخ

گزینه‌ها، رویدادها و کدهای اعتبارسنجی فیلد تاریخ بخش‌بخش. این‌ها در همهٔ لایه‌ها یکسان‌اند: گزینه‌های [`createDateField`](/fa/vanilla/date-field)، propهای `<DateField>` در [React](/fa/react/api#datefield) و [Vue](/fa/vue/api#datefield)، و attributeهای [`<khorshid-date-field>`](/fa/web-component/api#khorshid-date-field). موتور بدون رابط آن [`DateFieldCore`](/fa/core/date-field-core) است. برای آموزش قدم‌به‌قدم با نمونه‌های زنده، [راهنمای فیلد تاریخ](/fa/guide/date-field) را ببینید.

## گزینه‌های رفتاری {#behavior-options}

`DateFieldOptions`، مشترک با هستهٔ بدون رابط.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `locale` | `string \| Locale` | `'fa-IR'` | کلید یا آبجکت لوکال. تقویم، ارقام و متن‌های داخلی را تعیین می‌کند. |
| `format` | `FormatPattern` | `locale.formats.display`، و با `time` الگوی ساعت | ترتیب بخش‌ها، جداکننده‌ها و صفرهای ابتدایی. [توکن‌های قالب](/fa/api/format-tokens#where-each-token-works) را ببینید. |
| `value` | `DateFieldValueInput` | ندارد | مقدار اولیه: یک `DateInput`، یک `DateValue` یا `null`. ریست فرم هم همین را برمی‌گرداند. |
| `placeholderValue` | `DateInput` | امروز | نقطهٔ شروع بخش خالی وقتی با کلیدهای جهت عوض می‌شود. |
| `min` | `DateInput` | ندارد | زودترین تاریخ مجاز. |
| `max` | `DateInput` | ندارد | دیرترین تاریخ مجاز. |
| `disabledDates` | `DisabledDates` | ندارد | تاریخ‌هایی که نمی‌توان وارد کرد، به همان شکل گزینهٔ پیکر. |
| `time` | `boolean \| TimeOptions` | `false` | افزودن بخش‌های ساعت. `true` یعنی ۲۴ساعته با `HH:mm`. توکن‌های ساعت در `format` هم آن را روشن می‌کنند. |
| `required` | `boolean` | `false` | وارد کردن مقدار لازم است. در اعتبارسنجی بومی فرم شرکت می‌کند. |
| `readOnly` | `boolean` | `false` | فوکوس می‌گیرد و خوانده می‌شود، ولی قابل ویرایش نیست. |
| `disabled` | `boolean` | `false` | فوکوس نمی‌گیرد، قابل ویرایش نیست و ارسال نمی‌شود. |
| `invalid` | `boolean` | `false` | اجبار حالت نامعتبر، مثلاً از روی اعتبارسنجی سمت سرور. |
| `validate` | `(value: DateValue) => string \| boolean \| null \| undefined` | ندارد | بررسی اضافه برای تاریخ کامل و داخل محدوده. برای رد کردن، یک پیام یا `false` (برای پیام عمومی) برگردانید. |
| `labels` | `{ segments?, placeholders?, empty?, messages? }` | متن‌های داخلی انگلیسی و فارسی | بازنویسی هر متن داخلی. پیام‌ها می‌توانند `{min}` و `{max}` داشته باشند. |

## گزینه‌های ظاهر و فرم {#presentation-and-form-options}

`DateFieldUIOptions`.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | طرح رنگ. |
| `vars` | `Record<string, string>` | ندارد | متغیرهای CSS همین نمونه (`accent` یا `--sdp-accent`). [توکن‌های تم](/fa/api/theming-tokens#date-field) را ببینید. |
| `label` | `Node` | ندارد | برچسب قابل مشاهده که به گروه وصل است. کلیک روی آن، اولین بخش خالی را فوکوس می‌کند. |
| `description` | `Node` | ندارد | متن راهنما زیر فیلد؛ وقتی خطا نمایش داده می‌شود پنهان است. |
| `errorMessage` | `Node \| ((validation) => Node)` | پیام اعتبارسنجی | چیزی که در حالت نامعتبر نمایش داده می‌شود. تابع، `DateFieldValidation` فعلی را می‌گیرد، یا `null` وقتی فقط `invalid` حالت را اجبار کرده است. |
| `prefix` | `Node` | ندارد | محتوای قبل از بخش‌ها، مثل یک آیکن. |
| `suffix` | `Node` | ندارد | محتوای بعد از بخش‌ها، مثل یک دکمه. |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | `'primary'` حاشیه و سایهٔ باریک دارد؛ `'secondary'` پرشده است، برای استفاده روی یک سطح. |
| `fullWidth` | `boolean` | `false` | کشیده شدن به عرض ظرف. |
| `classes` | `Partial<Record<DateFieldSlotName, string>>` | ندارد | کلاس‌های اضافه برای هر بخش: `root`، `label`، `group`، `input`، `segment`، `literal`، `prefix`، `suffix`، `description`، `error`. |
| `name` | `string` | ندارد | مقدار را با همین نام همراه `<form>` دربرگیرنده ارسال می‌کند. |
| `formValue` | `(value: DateValue \| null) => string` | ISO به شکل `YYYY-MM-DD`، و با ساعت `THH:mm:ss` | تبدیل مقدار به رشته برای فرم. |
| `autoFocus` | `boolean` | `false` | فوکوس روی اولین بخش هنگام نصب. |
| `ariaLabel` | `string` | ندارد | نام دسترس‌پذیر وقتی `label` قابل مشاهده‌ای نیست. |

`Node` در وانیلا یک رشته یا `HTMLElement` است (رشته به‌عنوان HTML تفسیر می‌شود)، در React یک `ReactNode` و در Vue یک `VNodeChild`.

## رویدادها {#events}

| رویداد | کال‌بک | payload | چه زمانی صادر می‌شود |
|---|---|---|---|
| `change` | `onChange` | `{ value: DateValue \| null, source: 'input' \| 'api' \| 'clear' }` | مقدار ثبت‌شده عوض می‌شود؛ وقتی پاک شود یا دیگر قابل استفاده نباشد `null`. |
| `input` | `onInput` | `{ type: DateSegmentType, value: number \| null, text: string, complete: boolean }` | یک بخش ویرایش می‌شود: هر کلید و هر فشار کلید جهت. |
| `error` | `onError` | `{ code, message, reason?, input }` | یک ورودی کامل رد می‌شود. |
| `locale:change` | `onLocaleChange` | `{ locale: Locale }` | لوکال عوض می‌شود. |

Vue آن‌ها را با نام‌های `change`، `input`، `error` و `locale-change` صادر می‌کند (به‌اضافهٔ `update:modelValue`)؛ custom element رویدادهای `sdp-change`، `sdp-input`، `sdp-error` و `sdp-locale-change` را dispatch می‌کند.

## کدهای اعتبارسنجی {#validation-codes}

| کد | چه زمانی |
|---|---|
| `required` | خالی است، بعد از ترک فیلد یا اجرای `validate()`. |
| `incomplete` | بخشی پر شده، بعد از ترک فیلد یا اجرای `validate()`. |
| `invalid-input` | تاریخ واقعی‌ای در آن تقویم نیست. |
| `out-of-range` | بیرون از `min` / `max` است. |
| `disabled` | `disabledDates` آن را می‌گیرد؛ `reason` دلیلش را دارد. |
| `custom` | `validate` آن را رد کرده است. |

`required` و `incomplete` هیچ‌وقت وسط تایپ کردن نمایش داده نمی‌شوند. بقیه به‌محض کامل شدن ورودی نمایش داده می‌شوند. پیام‌های پیش‌فرض در [راهنما](/fa/guide/date-field) آمده‌اند.
