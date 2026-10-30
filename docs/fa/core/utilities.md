# PlainDate و ابزارها

مرجع `PlainDate`، تاریخ تغییرناپذیر و آگاه از تقویم، و توابع کمکی‌ای که `@khorshid-js/core` export می‌کند: تقویم‌ها، لوکال‌ها، ارقام، قالب‌بندی، خواندن متن، مقدارها و ساعت. همهٔ این‌ها بدون DOM هستند و از `khorshid/headless` در دسترس‌اند. برای آشنایی، [راهنمای PlainDate](/fa/core/plain-date) را ببینید.

## `PlainDate` {#plaindate}

تاریخی بدون ساعت و بدون منطقهٔ زمانی. شکل اصلی آن شمارهٔ روز ژولینی است، پس تاریخ‌های تقویم‌های مختلف بدون هیچ اتلافی مقایسه و تبدیل می‌شوند.

```ts
new PlainDate(calendar: CalendarId, year: number, month: number, day: number)
```

اگر تاریخ در آن تقویم وجود نداشته باشد، سازنده `RangeError` پرتاب می‌کند.

### ویژگی‌ها {#plaindate-properties}

| ویژگی | نوع | توضیح |
|---|---|---|
| `calendar` | `CalendarId` | `'jalali'`، `'gregorian'` یا `'hijri'`. |
| `year`، `month`، `day` | `number` | تاریخ در تقویم خودش؛ `month` از ۱ شروع می‌شود. |
| `jdn` | `number` | شمارهٔ روز ژولینی. |
| `weekday` | `WeekDay` | `0` = یکشنبه … `6` = شنبه. |
| `daysInMonth` | `number` | طول ماه این تاریخ. |
| `isLeapYear` | `boolean` | آیا سال این تاریخ کبیسه است. |
| `system` | `CalendarSystem` | پیاده‌سازی تقویم. |

### متدهای ایستا {#plaindate-static-methods}

| متد | امضا | توضیح |
|---|---|---|
| `from` | `(input: DateInput, calendar?: CalendarId) => PlainDate` | تبدیل هر `DateInput`، و در صورت دادن `calendar` بردن به آن تقویم. اجزای بدون `calendar` و رشته‌های ISO میلادی خوانده می‌شوند. با ورودی نامعتبر خطا پرتاب می‌کند. |
| `fromJDN` | `(jdn: number, calendar: CalendarId) => PlainDate` | تاریخی با آن شمارهٔ روز ژولینی. |
| `today` | `(calendar?: CalendarId) => PlainDate` | امروز در منطقهٔ زمانی محلی. تقویم پیش‌فرض `'gregorian'` است. |
| `compare` | `(a: PlainDate, b: PlainDate) => -1 \| 0 \| 1` | مقایسه‌گر برای مرتب‌سازی. |

### متدها {#plaindate-methods}

هر متدی که تاریخ برمی‌گرداند، یک `PlainDate` تازه برمی‌گرداند.

| متد | امضا | توضیح |
|---|---|---|
| `to` | `(calendar: CalendarId) => PlainDate` | همان روز در تقویمی دیگر. |
| `add` | `({ years?, months?, weeks?, days? }) => PlainDate` | محاسبهٔ تقویمی. سال و ماه، روز را به طول ماه مقصد محدود می‌کنند (۳۱ فروردین + ۶ ماه = ۳۰ مهر)؛ هفته و روز دقیق‌اند. مقدارها باید عدد صحیح باشند، وگرنه `RangeError` پرتاب می‌شود. |
| `with` | `(parts: Partial<DateParts>) => PlainDate` | جایگزینی سال، ماه یا روز؛ روز به طول ماه محدود می‌شود. |
| `startOfMonth` / `endOfMonth` | `() => PlainDate` | اولین / آخرین روز ماه. |
| `compare` | `(other: PlainDate) => number` | اختلاف به روز (`this.jdn - other.jdn`). |
| `equals` | `(other: PlainDate) => boolean` | همان روز مطلق، صرف‌نظر از تقویم‌ها. |
| `isBefore` / `isAfter` | `(other: PlainDate) => boolean` | ترتیب اکید. |
| `isBetween` | `(start: PlainDate, end: PlainDate) => boolean` | هر دو سر را شامل می‌شود؛ دو سر به هر ترتیبی می‌توانند بیایند. |
| `isSameMonth` | `(other: PlainDate) => boolean` | در همان ماهِ تقویم این تاریخ. |
| `format` | `(pattern: FormatPattern, locale: Locale) => string` | قالب‌بندی با یک [الگو](/fa/api/format-tokens)، در تقویم لوکال. |
| `toDate` | `() => Date` | `Date` بومی در نیمه‌شب محلی. |
| `toISO` | `() => string` | `YYYY-MM-DD` میلادی. |
| `toParts` | `() => DateParts` | `{ year, month, day }`. |
| `toString` | `() => string` | `'jalali:1405-01-01'`. |
| `toJSON` | `() => string` | همان `toISO()`، تا `JSON.stringify` تاریخ ISO بدهد. |

## تقویم‌ها {#calendars}

| خروجی | توضیح |
|---|---|
| `jalali`، `gregorian`، `hijri` | `CalendarSystem`های داخلی. `hijri` ام‌القری است، ۱۳۰۰ تا ۱۶۰۰ قمری. |
| `getCalendar(id)` | سیستم ثبت‌شده برای یک شناسه. |
| `registerCalendar(system)` | ثبت یک سیستم، به‌جای سیستمی که همان `id` را دارد. |
| `createHijriCalendar({ variant?, adjustments? })` | یک سیستم قمری: `variant` برابر `'umalqura'` (پیش‌فرض) یا `'civil'` است؛ `adjustments` طول ماه‌ها را با کلید `'YYYY-MM'` و مقدار `29` یا `30` بازنویسی می‌کند. با variant ناشناخته یا کلید بدشکل خطا پرتاب می‌کند. |

هر `CalendarSystem` این‌ها را پیاده می‌کند: `id`، `toJDN(year, month, day)`، `fromJDN(jdn)`، `daysInMonth(year, month)`، `isLeapYear(year)` و `isValid(year, month, day)`.

## لوکال‌ها {#locales}

| کلید | خروجی | تقویم | زبان |
|---|---|---|---|
| `fa-IR` | `faIR` | جلالی | فارسی (پیش‌فرض) |
| `fa-IR-gregorian` | `faIRGregorian` | میلادی | فارسی |
| `fa-IR-hijri` | `faIRHijri` | قمری | فارسی |
| `en-US` | `enUS` | جلالی | انگلیسی |
| `en-US-gregorian` | `enUSGregorian` | میلادی | انگلیسی |
| `en-US-hijri` | `enUSHijri` | قمری | انگلیسی |
| `fa-AF` | `faAF` | جلالی | دری |
| `fa-AF-gregorian` | `faAFGregorian` | میلادی | دری |
| `ps-AF` | `psAF` | جلالی | پشتو |

| تابع | توضیح |
|---|---|
| `getLocale(key)` | لوکال ثبت‌شده برای یک کلید. با کلید ناشناخته خطا پرتاب می‌کند. |
| `registerLocale(locale)` | ثبت یک `Locale` با `key` خودش. [ثبت لوکال سفارشی](/fa/guide/calendars-and-locales#registering-a-custom-locale) را ببینید. |
| `getLocaleForCalendar(language, calendar, preferKey?)` | لوکال ثبت‌شده‌ای با آن زبان و تقویم، یا `null`. `preferKey` همان منطقه را ترجیح می‌دهد. |
| `getRegisteredLocales()` | همهٔ لوکال‌های ثبت‌شده. |

## ارقام {#digits}

| تابع | توضیح |
|---|---|
| `toLocaleDigits(text, digits)` | جایگزینی ارقام ASCII با یک مجموعهٔ ۱۰حرفی ارقام، مثل `faIR.digits`. |
| `toLatinDigits(text)` | ارقام فارسی و عربی-هندی به ASCII. |
| `normalizeDigits(text)` | `toLatinDigits` به‌اضافهٔ حذف نویسه‌های کنترل جهت. |

## قالب‌بندی و خواندن متن {#formatting-and-parsing}

| تابع | توضیح |
|---|---|
| `formatDate(date, pattern, locale)` | قالب‌بندی یک `PlainDate`. |
| `parseDate(text, { locale, format?, calendar? })` | خواندن متن عددی و تبدیل به `PlainDate`، یا `null`. [قواعد خواندن متن](/fa/api/format-tokens#parsing-rules) را ببینید. |
| `parseNaturalDate(text, { locale, today, weekStart? })` | خواندن متن آزاد مثل `فردا` یا `next friday`، یا `null`. هرگز خطا پرتاب نمی‌کند. |
| `maskDateInput(raw, { locale, format?, calendar?, caret?, previous? })` | اجرای ماسک هوشمند ورودی. یک `MaskResult` برمی‌گرداند: `{ text, caret, parts, complete, valid }`. |
| `createDateValue(date, locale, pattern?)` | ساختن یک `DateValue` از یک `PlainDate`. |

## مقدارها و فرم‌ها {#values-and-forms}

| تابع | توضیح |
|---|---|
| `toFormValue(value)` | سریال‌سازی یک `PickerValue` به همان شکلی که فرم ارسال می‌کند: تاریخ‌های ISO، `THH:mm:ss` با ساعت، بازه‌های `start/end`، فهرست با کاما، و `''` وقتی خالی است. |
| `isSingleValue`، `isRangeValue`، `isMultipleValue` | باریک کردن `PickerValue` بر اساس حالت. |
| `isPickerValue(value)` | آیا چیزی یک `PickerValue` است، به همان شکلی که `getValue()` برمی‌گرداند. |
| `periodStart(date, unit, weekStart)` / `periodEnd(date, unit, weekStart)` | اولین / آخرین روز هفته، ماه یا سالی که تاریخ در آن است. |

## ساعت {#time}

| تابع | توضیح |
|---|---|
| `formatTime(time, pattern, digits, meridiem?)` | قالب‌بندی یک `TimeValue` با [توکن‌های ساعت](/fa/api/format-tokens#time-tokens). |
| `normalizeTime(partial)` | کامل کردن و محدود کردن یک ساعت ناقص. |
| `resolveTimeOptions(time)` | تبدیل `true` یا `TimeOptions` به گزینه‌های کامل؛ وقتی خاموش است `null`. |
| `snapTime(time, resolved)` | گرد کردن دقیقه و ثانیه رو به پایین به گام‌ها. |
| `stepTime(time, unit, delta, resolved)` | جابه‌جا کردن یک فیلد با چرخش. |
| `to12Hour(hour)` / `from12Hour(hour12, meridiem)` | تبدیل بین شکل ۲۴ساعته و ۱۲ساعته. |
| `timeEquals(a, b)` | مقایسهٔ دو ساعت. |
| `defaultTimePattern(resolved)` | `'HH:mm'` یا `'HH:mm:ss'`. |

## میان‌برها {#shortcuts}

| خروجی | توضیح |
|---|---|
| `defaultShortcutPresets(mode, unit)` | پیش‌تنظیم‌هایی که `shortcuts: true` استفاده می‌کند. |
| `presetSpan(preset, context)` | `{ start, end }` که یک پیش‌تنظیم پوشش می‌دهد، در تقویم فعال. |
| `SHORTCUT_LABELS_EN` | برچسب‌های انگلیسی پیش‌تنظیم‌ها. |

## برای نویسندگان رندرکننده {#for-renderer-authors}

این‌ها یک رندرکنندهٔ سفارشی را با رندرکننده‌های داخلی هماهنگ نگه می‌دارند.

| خروجی | توضیح |
|---|---|
| `UI_DEFAULTS` | مقدار پیش‌فرض همهٔ گزینه‌های رابط. |
| `PICKER_EVENTS`، `EVENT_HANDLER_NAMES`، `EVENT_EMIT_NAMES` | همهٔ رویدادها، نام کال‌بک و نام kebab هر کدام. |
| `eventHandlerName(event)`، `eventEmitName(event)` | `'range:complete'` به `'onRangeComplete'` / `'range-complete'`. |
| `bindEventHandlers(core, getHandlers)` | وصل کردن کال‌بک‌های `on<Event>` (و `onOpenChange`) به یک هسته. تابع لغو اشتراک برمی‌گرداند. |
| `splitEventHandlers(props)` | جدا کردن handlerها از گزینه‌ها در یک مجموعه prop. |
| `REOPEN_SUPPRESS_MS` | مدتی که برگشت فوکوس به فیلد بعد از بسته شدن نادیده گرفته می‌شود (۲۵۰ میلی‌ثانیه). |
| `buildPaneModels`، `dayClassName`، `dayLabels`، `periodCellClassName`، `rootClassName`، `shortcutClassName`، `secondaryDayText`، `secondaryDayClassName`، `toVarStyle`، `tracksHover`، `rovingCellIndex`، `dayTabStopKey` | مدل نمای مشترک: فهرست کلاس‌ها، نام‌های دسترس‌پذیر و قواعد فوکوس که همهٔ لایه‌ها از آن رندر می‌کنند. |
| `monthTransition`، `viewTransition`، `MOTION_SETTLE_MS` | اینکه هر رندر کدام انیمیشن را اجرا کند، و مهلت اطمینان آن. |
| `Emitter` | emitter رویداد نوع‌دار که هسته‌ها استفاده می‌کنند. |
| `VERSION` | نسخهٔ هسته. |
