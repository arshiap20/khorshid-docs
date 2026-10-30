# مرجع Vue

مرجع کامپوننت‌ها و composableهای `khorshid/vue`. این‌ها همان [گزینه‌های](/fa/api/options) پیکر وانیلا را با همان نام‌ها می‌گیرند، پس این صفحه فقط چیزهایی را پوشش می‌دهد که Vue اضافه می‌کند. برای نحوهٔ استفاده، [راهنمای Vue](/fa/vue/) را ببینید.

## بسته {#package}

| import | معادل | محتوا |
|---|---|---|
| `khorshid/vue` | `@khorshid-js/vue` | `DatePicker`، `Calendar`، `DateField`، composableها، `provideDatePicker`، جدول‌های prop، و کل `@khorshid-js/core` |
| `khorshid/styles.css` | `@khorshid-js/vue/styles.css` | استایل‌شیتی که همهٔ لایه‌ها استفاده می‌کنند |

این بسته `VERSION` (نسخهٔ خودش) و `CORE_VERSION` را export می‌کند.

## کامپوننت‌ها {#components}

| کامپوننت | می‌پذیرد | رندر می‌کند |
|---|---|---|
| `<DatePicker>` | `UIOptions`: همهٔ گزینه‌ها، از جمله نمایش و اورلی | یک فیلد متنی به‌اضافهٔ پنلی که باز می‌کند. اورلی‌ها همان‌هایی‌اند که در `@khorshid-js/dom` هستند. |
| `<Calendar>` | `PanelUIOptions`: بدون گزینه‌های نمایش و اورلی | پنل همیشه‌باز. |
| `<DateField>` | `DateFieldUIOptions` | [فیلد تاریخ](/fa/api/date-field) بخش‌بخش. |

هر کامپوننت برای هر رویداد هسته یک رویداد صادر می‌کند. [رویدادها](/fa/api/events#names-in-every-layer) را ببینید.

### `<DatePicker>` و `<Calendar>` {#datepicker-and-calendar}

propهایی که به گزینه‌ها اضافه می‌شوند:

| prop | نوع | توضیح |
|---|---|---|
| `mode` | `PickerMode` | حالت انتخاب. |
| `modelValue` | `PickerValueInput` | مقدار `v-model`. با `update:modelValue` و یک `PickerValue` به‌روز می‌شود. |
| `defaultValue` | `PickerValueInput` | مقدار اولیهٔ کنترل‌نشده. |
| `core` | `PickerCore` | رندر یک هستهٔ موجود به‌جای ساختن هستهٔ جدید. چند کامپوننت می‌توانند یک هسته را شریک شوند. |
| `inputProps` | `Record<string, unknown>` | فقط `<DatePicker>`. attributeهایی که روی `<input>` فیلد پخش می‌شوند. |

slotهای scoped، شکل قالبی گزینه‌های رندر:

| slot | props | معادل |
|---|---|---|
| `day` | `{ cell: DayCell }` | `renderDay` |
| `weekday` | `{ label: WeekdayLabel }` | `renderWeekday` |
| `footer` | `{ value, view }` | `renderFooter` |

اگر هر دو داده شوند، گزینهٔ رندر بر slot مقدم است.

کامپوننتی که هسته‌اش را خودش می‌سازد، هسته را یک بار از propها می‌سازد. بعد از آن `locale`، `mode` و مقدار کنترل‌شده همگام می‌مانند؛ بقیهٔ گزینه‌های رفتاری هنگام ساخت خوانده می‌شوند. گزینه‌های ظاهری در هر رندر اعمال می‌شوند.

prop `mask` وجود ندارد. برای ماسک سفارشی، هسته را با `useDatePicker({ mask })` بسازید و آن را به‌عنوان `core` بدهید.

### `<DateField>` {#datefield}

propهایی که به [گزینه‌های فیلد تاریخ](/fa/api/date-field#behavior-options) اضافه می‌شوند:

| prop | نوع | توضیح |
|---|---|---|
| `modelValue` | `DateFieldValueInput` | مقدار `v-model`. با یک `DateValue \| null` به‌روز می‌شود. |
| `value` | `DateFieldValueInput` | مقدار اولیهٔ کنترل‌نشده (مثل وانیلا). |

`locale` و گزینه‌های قابل تغییر (`min`، `max`، `disabledDates`، `required`، `readOnly`، `disabled`، `invalid`، `validate`) درجا به‌روز می‌شوند. `format`، `time`، `labels` و `placeholderValue` یک بار خوانده می‌شوند.

slotهای `label`، `description`، `prefix`، `suffix` و `error` (`{ validation }`) جای propهای هم‌نام را می‌گیرند و بر آن‌ها مقدم‌اند. `<DateField>` از طریق template ref، `core`، `focus()`، `validate()` و `clear()` را در اختیار می‌گذارد.

## composableها {#composables}

### `useDatePicker` {#usedatepicker}

```ts
function useDatePicker<M extends PickerMode = 'single'>(
  options?: UseDatePickerOptions<M>
): { core: PickerCore; state: Ref<PickerState>; value: ComputedRef<ValueFor<M>>; actions: PickerActions }
```

برای scope فعلی یک هسته می‌سازد و هنگام dispose شدن scope آن را تخریب می‌کند. `locale`، `mode` و `value` کنترل‌شده مقدار ساده، ref یا getter می‌پذیرند و همگام می‌مانند؛ بقیهٔ گزینه‌ها یک بار خوانده می‌شوند.

### composableهای دیگر {#other-composables}

| composable | امضا | توضیح |
|---|---|---|
| `usePickerState` | `(core: PickerCore) => Ref<PickerState>` | دنبال کردن وضعیت هر هسته‌ای به شکل `shallowRef`. |
| `usePickerEvent` | `(core \| null \| undefined, event, handler) => void` | اشتراک برای scope فعلی. اگر هسته نباشد کاری نمی‌کند. |
| `useDateField` | `(options?: UseDateFieldOptions) => { core, state, value }` | نیمهٔ بدون رابط `<DateField>`. `locale`، `value`، `min`، `max`، `required`، `readOnly`، `disabled` و `invalid` مقدار، ref یا getter می‌گیرند؛ `disabledDates` و `validate` مقدار یا ref. `format`، `time`، `labels` و `placeholderValue` یک بار خوانده می‌شوند. |
| `provideDatePicker` | `(options?: { core?, ...UseDatePickerOptions }) => UseDatePicker` | ساختن (یا با `core` به کار گرفتن) یک پیکر و provide کردن آن به نوادگان. |
| `useDatePickerContext` | `() => UseDatePicker` | inject کردن پیکر از نزدیک‌ترین `provideDatePicker`. اگر نباشد خطا پرتاب می‌کند. |

این‌ها هم export شده‌اند: `datePickerKey` (کلید inject)، `sameFieldValue` (آیا ورودی فیلد تاریخ با یک مقدار برابر است)، و جدول‌های prop و emit یعنی `panelProps`، `fieldProps`، `pickerEmits`، `dateFieldProps` و `dateFieldEmits`، برای پیچیدن کامپوننت‌ها در کامپوننت‌های خودتان.

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

## نوع مقدار {#value-types}

propهای زمان اجرای Vue نمی‌توانند generic حالت را حمل کنند، پس payloadهای `change` و `update:modelValue` یک کامپوننت، کل union `PickerValue` را دارند. با `isRangeValue` و گاردهای دیگر باریکش کنید، یا از `useDatePicker` استفاده کنید که `value` آن باریک‌شده است.
