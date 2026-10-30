# گزینه‌ها

همهٔ گزینه‌ها، با نوع، مقدار پیش‌فرض و کاری که می‌کنند. همین نام‌ها و پیش‌فرض‌ها در `createDatePicker`، کامپوننت‌های React و Vue، و `<khorshid-datepicker>` (به‌صورت attributeهای kebab-case) به کار می‌روند.

## لایه‌های گزینه‌ها {#pickeroptions}

گزینه‌ها فقط یک بار، در `@khorshid-js/core`، و در سه interface تودرتو تعریف شده‌اند. پیش‌فرض‌ها از یک جدول واحد، `UI_DEFAULTS`، می‌آیند؛ پس هیچ لایه‌ای نمی‌تواند با لایهٔ دیگر فرق داشته باشد.

| Interface | چه چیزی اضافه می‌کند | چه کسی می‌پذیرد |
|---|---|---|
| `PickerOptions` | رفتار: لوکال، حالت، مقدار، محدودیت‌ها، میان‌برها، متن ورودی، ساعت، پلاگین‌ها | `createPicker()` (headless) و همهٔ موارد پایین‌تر |
| `PanelUIOptions` | ظاهر پنل، و فرم‌ها | `<Calendar>` (React و Vue) و همهٔ موارد پایین‌تر |
| `UIOptions` | اینکه پیکر چطور و کجا باز شود | `createDatePicker()`، `<DatePicker>` (React و Vue)، `<khorshid-datepicker>` |

`DatePickerOptions` (وانیلا) همان `UIOptions` است به‌اضافهٔ یک کال‌بک `on<Event>` برای هر رویداد. هر بخش پایین می‌گوید گزینه‌هایش به کدام interface تعلق دارند.

::: info `DateInput`
هر چیز تاریخ‌مانند: یک `PlainDate`، اجزای `{ year, month, day, calendar? }`، یک `Date` بومی (سال، ماه و روز محلی‌اش خوانده می‌شود)، یا رشتهٔ ISO میلادی `'YYYY-MM-DD'`. اجزای بدون `calendar` در تقویم فعال پیکر خوانده می‌شوند.
:::

## هسته {#core}

`PickerOptions`.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `locale` | `string \| Locale` | `'fa-IR'` | کلید یا آبجکت لوکال. زبان، تقویم، جهت و ارقام را تعیین می‌کند. [تقویم‌ها و لوکال‌ها](/fa/guide/calendars-and-locales) را ببینید. |
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | حالت انتخاب. مقدار ثابت `mode` نوع مقدار را باریک می‌کند. |
| `value` | `PickerValueInput` | ندارد | مقدار اولیه: یک تاریخ، آرایه‌ای از تاریخ‌ها، `{ start, end }`، یا یک `PickerValue` که از `getValue()` گرفته‌اید. |
| `months` | `number` | `1` | تعداد پن‌های ماه که کنار هم نمایش داده می‌شوند. |
| `fixedWeeks` | `boolean` | `true` | همیشه ۶ ردیف هفته رندر می‌شود تا ارتفاع پنل نپرد. |
| `weekStart` | `WeekDay` (`0`–`6`) | مقدار لوکال | اولین روز هفته (`0` = یکشنبه … `6` = شنبه). |
| `weekdays` | `string[]` (۷ عضو) | مقدار لوکال | برچسب سرستون روزهای هفته، به ترتیب شمارهٔ روز (`0` = یکشنبه)، نه به ترتیب نمایش. |
| `secondaryCalendar` | `boolean \| CalendarId` | خاموش | روز تقویم دوم زیر هر روز، و ماه‌هایش زیر عنوان. `true` همتای طبیعی را انتخاب می‌کند (جلالی و میلادی با هم جفت‌اند؛ قمری در فارسی و پشتو با جلالی و در بقیه با میلادی). [تقویم دوم](/fa/guide/secondary-calendar) را ببینید. |
| `autoClose` | `boolean` | `true` | بستن پس از انتخاب کامل: در حالت تکی با انتخاب روز، در حالت بازه با انتخاب انتهای بازه. حالت چندتایی هرگز خودبه‌خود بسته نمی‌شود. |
| `plugins` | `PickerPlugin[]` | ندارد | پلاگین‌هایی مثل [تعطیلات](/fa/guide/holidays)؛ به ترتیب راه‌اندازی و با `destroy()` جمع می‌شوند. [پلاگین‌ها](/fa/guide/plugins) را ببینید. |

## انتخاب و محدودیت‌ها {#selection-and-limits}

`PickerOptions`.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `unit` | `'day' \| 'week' \| 'month' \| 'year'` | `'day'` | هر انتخاب چه چیزی را برمی‌گزیند. مقدار، روز اول دوره را نگه می‌دارد و `DateValue.end` روز آخر را. `'month'` و `'year'` با نمای ماه‌ها یا سال‌ها باز می‌شوند. هنگام ساخت ثابت می‌شود. [واحد انتخاب](/fa/guide/selection-units) را ببینید. |
| `min` | `DateInput` | ندارد | زودترین تاریخ قابل انتخاب. |
| `max` | `DateInput` | ندارد | دیرترین تاریخ قابل انتخاب. |
| `disabledDates` | `DisabledDates` | ندارد | تاریخ‌هایی که انتخاب نمی‌شوند: فهرستی از تاریخ‌ها یا ورودی‌های `{ date, reason }`، یا یک predicate به شکل `(date: PlainDate) => boolean \| string \| null \| undefined`. دلیل، tooltip روز می‌شود، به نام دسترس‌پذیر آن اضافه می‌شود و در `error.reason` می‌آید. [روزهای غیرفعال همراه با دلیل](/fa/guide/shortcuts-and-limits#disabled-dates-with-a-reason) را ببینید. |
| `minDays` | `number` | ندارد | حالت بازه: کوتاه‌ترین بازه به روز، با احتساب هر دو سر (دو شب هتل = ۳). هنگام انتخاب انتهای بازه، روزهایی که این حد را می‌شکنند غیرفعال می‌شوند. |
| `maxDays` | `number` | ندارد | حالت بازه: بلندترین بازه به روز، با احتساب هر دو سر. |
| `shortcuts` | `boolean \| (ShortcutPreset \| Shortcut)[]` | خاموش | ردیفی از چیپ‌های انتخاب سریع. `true` مجموعه‌ای متناسب با حالت و واحد انتخاب می‌کند. [میان‌برها](/fa/guide/shortcuts-and-limits) را ببینید. |

با `shortcuts: true` این‌ها را می‌گیرید:

| حالت / واحد | پیش‌تنظیم‌ها |
|---|---|
| single | `today`، `yesterday`، `tomorrow` |
| range | `today`، `last7Days`، `last30Days`، `thisWeek`، `thisMonth`، `lastMonth`، `thisYear` |
| multiple | `today`، `thisWeek` |
| `unit: 'week'` | `thisWeek`، `lastWeek`، `nextWeek` |
| `unit: 'month'` | `thisMonth`، `lastMonth`، `nextMonth` |
| `unit: 'year'` | `thisYear`، `lastYear` |

```ts
type ShortcutPreset =
  | 'today' | 'yesterday' | 'tomorrow'
  | 'thisWeek' | 'lastWeek' | 'nextWeek'
  | 'last7Days' | 'last30Days' | 'next7Days'
  | 'thisMonth' | 'lastMonth' | 'nextMonth'
  | 'thisYear' | 'lastYear'

interface Shortcut {
  id: string          // payload رویداد shortcut و data-shortcut
  label: string
  value: PickerValueInput | ((ctx: ShortcutContext) => PickerValueInput)
}

interface ShortcutContext {
  today: PlainDate    // در تقویم فعال
  calendar: CalendarId
  locale: Locale
  weekStart: WeekDay
  mode: PickerMode
  unit: SelectionUnit
}
```

## ورودی و متن {#input-and-text}

`format`، `mask` و `naturalInput` جزو `PickerOptions` هستند؛ `inputMask` گزینهٔ `UIOptions` است.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `format` | `FormatPattern` | `locale.formats.display` | قالب نمایش مقدارها و فیلد. فقط توکن‌های تاریخ؛ [توکن‌های قالب](/fa/api/format-tokens) را ببینید. |
| `mask` | `MaskFn` | ماسک هوشمند داخلی | جایگزینی کامل ماسک ورودی. [تابع ماسک سفارشی](/fa/guide/input-mask#تابع-ماسک-سفارشی) را ببینید. |
| `naturalInput` | `boolean` | `false` | پذیرفتن متن آزاد مثل `فردا`، `next friday` یا `+2w` که با Enter یا blur ثبت می‌شود. با `unit: 'day'` فیلد در همهٔ حالت‌ها قابل ویرایش می‌ماند. [ورودی متنی آزاد](/fa/guide/natural-input) را ببینید. |
| `inputMask` | `boolean` | `true` | ماسک هوشمند روی فیلد متصل. در حالت تکی با `unit: 'day'` اعمال می‌شود؛ در حالت‌های دیگر فیلد متن فقط‌خواندنی است، مگر اینکه `naturalInput` روشن باشد. |

## ساعت {#time}

`PickerOptions`.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `time` | `boolean \| TimeOptions` | خاموش | افزودن انتخابگر ساعت. `true` یعنی ساعت ۲۴ساعته با قالب `HH:mm`. `DateValue.time` در تاریخ انتخاب‌شده ساعت را نگه می‌دارد و فیلد آن را بعد از تاریخ نشان می‌دهد. |

`TimeOptions`:

| فیلد | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `minuteStep` | `number` | `1` | گام دقیقه برای جابه‌جایی و گرد کردن. |
| `secondStep` | `number` | `1` | گام ثانیه. |
| `showSeconds` | `boolean` | `false` | نمایش فیلد ثانیه. |
| `use12Hour` | `boolean` | `false` | ساعت ۱۲ساعته با دکمهٔ ق.ظ/ب.ظ. |
| `defaultTime` | `Partial<TimeValue>` | `00:00:00` | ساعتی که روی تاریخ تازه‌انتخاب‌شده می‌نشیند. |

## ظاهر پنل {#panel-presentation}

`PanelUIOptions`. یک `<Calendar>` تنها همهٔ این‌ها را می‌پذیرد.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | طرح رنگ. `'auto'` از `prefers-color-scheme` پیروی می‌کند. |
| `vars` | `Record<string, string>` | ندارد | متغیرهای CSS مخصوص همین نمونه. کلید ساده پیشوند `--sdp-` می‌گیرد (`accent` ← `--sdp-accent`). روی پنل و همهٔ اورلی‌ها اعمال می‌شود. [توکن‌های تم](/fa/api/theming-tokens) را ببینید. |
| `readOnly` | `boolean` | `false` | مقدار نمایش داده می‌شود ولی تغییری از کاربر پذیرفته نمی‌شود. فیلد قابل ویرایش نیست و باز نمی‌شود؛ پنل inline بی‌اثر است. |
| `animate` | `boolean` | `true` | انیمیشن‌ها. `prefers-reduced-motion` همیشه مقدم است. |
| `showToday` | `boolean` | `true` | دکمهٔ فوتر که به امروز می‌پرد (امروز را انتخاب نمی‌کند). |
| `showClear` | `boolean` | `true` | دکمهٔ فوتر که مقدار را پاک می‌کند. |
| `confirm` | `boolean \| 'auto'` | `'auto'` | دکمهٔ فوتر که پیکر را می‌بندد. `'auto'` آن را فقط وقتی پنل sheet یا modal است نشان می‌دهد و با عبور از بریک‌پوینت دوباره بررسی می‌شود. |
| `outsideDays` | `'interactive' \| 'visible' \| 'hidden'` | `'interactive'` | روزهای ماه قبل و بعد: قابل انتخاب، کم‌رنگ و غیرفعال، یا خالی. |
| `highlightToday` | `boolean` | `true` | حلقه دور خانهٔ امروز. با `false` کلاس `--today` می‌ماند و فقط حلقهٔ پیش‌فرض حذف می‌شود. |
| `yearPicker` | `boolean` | `true` | سالِ هدر دکمه‌ای است که نمای سال‌ها را باز می‌کند. با `false` متن ساده است. |
| `classes` | `Partial<Record<SlotName, string>>` | ندارد | کلاس‌های اضافی برای هر بخش. |
| `renderDay` | `(cell: DayCell) => Node` | ندارد | جایگزینی محتوای خانهٔ روز. چیزی برنگردانید تا پیش‌فرض بماند. |
| `renderWeekday` | `(label: WeekdayLabel) => Node` | ندارد | جایگزینی محتوای سرستون روز هفته. برای تغییر فقط متن، از `weekdays` استفاده کنید. |
| `renderFooter` | `(ctx: FooterContext) => Node` | ندارد | محتوای دلخواه زیر دکمه‌های فوتر (`.sdp__note`). `ctx` برابر `{ value, view }` است. |
| `dayProps` | `(cell: DayCell) => DayProps \| null \| void` | ندارد | `className`، `title` و `attrs` برای هر روز. فقط برای استایل؛ غیرفعال‌سازی با `disabledDates`. |
| `icons` | `{ prev?, next? }` | شِورون | آیکن‌های ناوبری: یک گره، یا `(dir: 'prev' \| 'next') => node`. |

`Node` هر چیزی است که آن لایه رندر می‌کند: رشته یا `HTMLElement` در وانیلا، `ReactNode` در React، `VNodeChild` در Vue. در وانیلا، رشته‌ای که `renderDay` یا `renderWeekday` برمی‌گرداند به‌صورت متن گذاشته می‌شود، ولی رشتهٔ `renderFooter` یا `icons` به‌عنوان HTML تفسیر می‌شود.

`SlotName` یکی از این‌هاست: `root`، `header`، `title`، `nav`، `grid`، `day`، `weekday`، `footer`، `input`، `overlay`، `sheet`، `popup`.

## نمایش و اورلی {#display-and-overlay}

`UIOptions`. این گزینه‌ها دربارهٔ باز شدن‌اند، پس `<Calendar>` آن‌ها را نمی‌گیرد.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `display` | `'auto' \| 'inline' \| 'popup' \| 'sheet' \| 'modal'` | `'auto'` | شکلی که پیکر می‌گیرد. جدول پایین را ببینید. |
| `mobileBreakpoint` | `number \| false` | `640` | عرضی به px که در آن و کمتر از آن، `display: 'auto'` به bottom sheet تبدیل می‌شود. `false` یعنی هرگز. |
| `position` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'auto'` | جای popup. `'auto'` برای ماندن در صفحه جهتش را عوض می‌کند و جابه‌جا می‌شود. |
| `container` | `HTMLElement` | `document.body` | جایی که اورلی به آن portal می‌شود. |
| `zIndex` | `number` | `1000` | ترتیب لایهٔ اورلی. |

<a id="display-مستقل-از-المنت-مقصد-است"></a>

### `display` مستقل از المنت مقصد است {#display-is-independent-of-the-target}

| مقدار | روی `<input>` | روی هر المنت دیگر |
|---|---|---|
| `'auto'` (پیش‌فرض) | popup، یا bottom sheet در عرض `mobileBreakpoint` و کمتر | پنل inline |
| `'inline'` | فیلد سر جایش می‌ماند و پنلی همیشه‌باز بعد از آن می‌نشیند | پنل inline |
| `'popup'` / `'sheet'` / `'modal'` | همان اورلی | همان اورلی، لنگرانداخته به المنت و با کلیک روی آن باز و بسته می‌شود |

::: info `mode` در برابر `display`
`mode` نوع انتخاب است (`single`، `range`، `multiple`). `display` شکلی است که پیکر می‌گیرد. این دو از هم مستقل‌اند.
:::

## فرم‌ها {#forms}

`PanelUIOptions`. [فرم‌ها](/fa/guide/forms) را ببینید.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `name` | `string` | ندارد | مقدار را با همین نام همراه `<form>` دربرگیرنده ارسال می‌کند. یک `input.sdp-form-value` پنهان اضافه می‌شود. |
| `required` | `boolean` | `false` | اعتبارسنجی بومی: تا مقداری انتخاب نشود فرم ارسال نمی‌شود (بازه هر دو سر را لازم دارد). |
| `formValue` | `(value: PickerValue) => string` | `toFormValue` | تبدیل مقدار به رشته برای فرم. پیش‌فرض: ISO به شکل `YYYY-MM-DD` (و `THH:mm:ss` اگر ساعت روشن باشد)، بازه به شکل `start/end`، چند تاریخ با کاما، و انتخاب هفته، ماه یا سال به‌صورت بازهٔ ISO. |

## رویدادها به‌عنوان گزینه {#events-as-options}

هر مجموعهٔ گزینه برای هر [رویداد](/fa/api/events) یک کال‌بک هم می‌پذیرد که نامش `on` به‌اضافهٔ نام رویداد به شکل PascalCase است. هر کدام شیء payload همان رویداد را می‌گیرد.

| کال‌بک | رویداد |
|---|---|
| `onChange` | `change` |
| `onSelect` | `select` |
| `onClear` | `clear` |
| `onRangeStart` | `range:start` |
| `onRangeComplete` | `range:complete` |
| `onOpen` / `onClose` | `open` / `close` |
| `onOpenChange` | ترکیب `open` و `close`؛ `true` یا `false` می‌گیرد |
| `onViewChange` | `view:change` |
| `onMonthChange` | `month:change` |
| `onYearChange` | `year:change` |
| `onLocaleChange` | `locale:change` |
| `onCalendarChange` | `calendar:change` |
| `onTimeChange` | `time:change` |
| `onShortcut` | `shortcut` |
| `onInput` | `input` |
| `onError` | `error` |

## مثال {#example}

```js
createDatePicker('#stay', {
  // هسته، انتخاب
  locale: 'fa-IR',
  mode: 'range',
  months: 2,
  min: '2026-03-21',
  disabledDates: (date) => (date.weekday === 5 ? 'جمعه‌ها تعطیل است' : false),
  minDays: 2,
  shortcuts: true,
  secondaryCalendar: true,
  format: 'D MMMM YYYY',

  // ظاهر، نمایش، فرم
  vars: { accent: '#0d9488', radius: '12px' },
  position: 'bottom-start',
  name: 'stay',
  required: true,

  // رویدادها
  onRangeComplete: ({ start, end }) => console.log(start.iso, end.iso),
})
```
