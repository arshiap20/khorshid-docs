# مرجع React

مرجع کامپوننت‌ها و hookهای `khorshid/react`. این‌ها همان [گزینه‌های](/fa/api/options) پیکر وانیلا را با همان نام‌ها می‌گیرند، پس این صفحه فقط چیزهایی را پوشش می‌دهد که React اضافه می‌کند. برای نحوهٔ استفاده، [راهنمای React](/fa/react/) را ببینید.

## بسته {#package}

| import | معادل | محتوا |
|---|---|---|
| `khorshid/react` | `@khorshid-js/react` | `DatePicker`، `Calendar`، `DateField`، hookها، `DatePickerProvider`، و کل `@khorshid-js/core` |
| `khorshid/styles.css` | `@khorshid-js/react/styles.css` | استایل‌شیتی که همهٔ لایه‌ها استفاده می‌کنند |

این بسته `VERSION` (نسخهٔ خودش) و `CORE_VERSION` را export می‌کند.

## کامپوننت‌ها {#components}

| کامپوننت | می‌پذیرد | رندر می‌کند |
|---|---|---|
| `<DatePicker>` | `UIOptions`: همهٔ گزینه‌ها، از جمله نمایش و اورلی | یک فیلد متنی به‌اضافهٔ پنلی که باز می‌کند. اورلی‌ها همان‌هایی‌اند که در `@khorshid-js/dom` هستند. |
| `<Calendar>` | `PanelUIOptions`: بدون گزینه‌های نمایش و اورلی | پنل همیشه‌باز. |
| `<DateField>` | `DateFieldUIOptions` | [فیلد تاریخ](/fa/api/date-field) بخش‌بخش. |

هر کامپوننت برای هر رویداد هسته یک prop کال‌بک می‌گیرد. [رویدادها](/fa/api/events#names-in-every-layer) را ببینید.

### `<DatePicker>` و `<Calendar>` {#datepicker-and-calendar}

propهایی که به گزینه‌ها اضافه می‌شوند:

| prop | نوع | توضیح |
|---|---|---|
| `mode` | `PickerMode` | حالت انتخاب. مقدار ثابت آن نوع `value` و `onChange` را باریک می‌کند. |
| `value` | `PickerValueInput` | مقدار کنترل‌شده. وقتی تعیین شده باشد (نه `undefined`)، آن را از `onChange` به‌روز کنید. مقداری که `onChange` می‌دهد را می‌توان مستقیم برگرداند. |
| `defaultValue` | `PickerValueInput` | مقدار اولیهٔ کنترل‌نشده. |
| `core` | `PickerCore` | رندر یک هستهٔ موجود به‌جای ساختن هستهٔ جدید. چند کامپوننت می‌توانند یک هسته را شریک شوند. |
| `className` | `string` | کلاس‌های اضافه روی ریشهٔ پنل (همان `classes.root`). |
| `inputProps` | `InputHTMLAttributes` | فقط `<DatePicker>`. attributeهایی که روی `<input>` فیلد پخش می‌شوند. |

کامپوننتی که هسته‌اش را خودش می‌سازد، هسته را یک بار از propها می‌سازد. بعد از آن `locale`، `mode` و مقدار کنترل‌شده همگام می‌مانند؛ بقیهٔ گزینه‌های رفتاری هنگام ساخت خوانده می‌شوند. گزینه‌های ظاهری در هر رندر اعمال می‌شوند.

### `<DateField>` {#datefield}

propهایی که به [گزینه‌های فیلد تاریخ](/fa/api/date-field#behavior-options) اضافه می‌شوند:

| prop | نوع | توضیح |
|---|---|---|
| `value` | `DateFieldValueInput` | مقدار کنترل‌شده. برگرداندن مقدار `onChange` کاری نمی‌کند. |
| `defaultValue` | `DateFieldValueInput` | مقدار اولیهٔ کنترل‌نشده، و همان چیزی که ریست فرم برمی‌گرداند. |
| `core` | `DateFieldCore` | استفاده از یک هستهٔ موجود؛ کامپوننت هرگز آن را تخریب نمی‌کند. |
| `className` | `string` | کلاس‌های اضافه روی ریشه (همان `classes.root`). |
| `id` | `string` | `id` ریشه، و پیشوند idهای برچسب، توضیح و خطا. |

`locale` و گزینه‌های قابل تغییر (`min`، `max`، `disabledDates`، `required`، `readOnly`، `disabled`، `invalid`، `validate`) درجا به‌روز می‌شوند. تغییر `format`، `time`، `labels` یا `placeholderValue` هستهٔ تازه‌ای می‌سازد و مقدار را منتقل می‌کند.

## hookها {#hooks}

### `useDatePicker` {#usedatepicker}

```ts
function useDatePicker<M extends PickerMode = 'single'>(
  options?: UseDatePickerOptions<M>
): { core: PickerCore; state: Readonly<PickerState>; value: ValueFor<M>; actions: PickerActions }
```

برای عمر کامپوننت یک هسته می‌سازد و با هر تغییر وضعیت دوباره رندر می‌کند. `UseDatePickerOptions` همان `PickerOptions` است به‌اضافهٔ `defaultValue`، یک `value` کنترل‌شده و کال‌بک‌های `on<Event>`. `locale`، `mode` و `value` واکنش‌گرا هستند؛ بقیهٔ گزینه‌ها یک بار خوانده می‌شوند. اعمال `value` کنترل‌شده از طریق `onChange` برگشت داده نمی‌شود.

| خروجی | توضیح |
|---|---|
| `core` | `PickerCore` زنده، پایدار در طول عمر کامپوننت. |
| `state` | `PickerState` فعلی. |
| `value` | مقدار ثبت‌شده، باریک‌شده بر اساس `mode`. |
| `actions` | [`PickerActions`](#pickeractions) متصل و پایدار. |

### hookهای دیگر {#other-hooks}

| hook | امضا | توضیح |
|---|---|---|
| `usePickerState` | `(core: PickerCore) => Readonly<PickerState>` | دنبال کردن وضعیت هر هسته‌ای با `useSyncExternalStore`. برای SSR امن است. |
| `usePickerEvent` | `(core \| null \| undefined, event, handler) => void` | اشتراک در یک رویداد برای عمر کامپوننت. handler تازه در هر رندر اشتراک را دوباره نمی‌سازد. اگر هسته نباشد کاری نمی‌کند. |
| `useDateField` | `(options?: UseDateFieldOptions) => { core, state, value, controlled }` | نیمهٔ بدون رابط `<DateField>`: `state.segments` را خودتان رندر کنید. علاوه بر `DateFieldOptions`، `value`، `defaultValue`، `core` و کال‌بک‌های `on<Event>` را می‌گیرد. |
| `useDatePickerContext` | `() => UseDatePicker` | پیکرِ نزدیک‌ترین `<DatePickerProvider>`. بیرون از آن خطا پرتاب می‌کند. |

`<DatePickerProvider>` گزینه‌های `useDatePicker` و `children` را می‌گیرد و یک پیکر را در اختیار زیردرخت می‌گذارد. با `core` یک هستهٔ موجود را به کار می‌گیرد؛ در این حالت هرگز هسته‌ای نمی‌سازد یا تخریب نمی‌کند.

## `PickerActions` {#pickeractions}

متدهای متصلی که `useDatePicker` برمی‌گرداند. هر کدام متد هم‌نام هسته را صدا می‌زند؛ [PickerCore](/fa/core/picker-core) را ببینید.

| گروه | actionها |
|---|---|
| مقدار | `select`، `setValue`، `clear`، `hover` |
| باز بودن | `open`، `close`، `toggle` |
| پیمایش | `next`، `prev`، `goTo`، `goToToday`، `setView`، `selectMonth`، `selectYear` |
| ساعت | `setTime` |
| پیکربندی | `setLocale`، `setCalendar`، `setMode` |
| فوکوس کیبورد | `focusDate`، `moveFocus`، `selectFocused` |
