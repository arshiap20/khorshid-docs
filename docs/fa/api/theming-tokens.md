# توکن‌های تم

همهٔ custom propertyهای `--sdp-*` که استایل‌شیت می‌خواند، با مقدار پیش‌فرض روشن و تیره. هر کدام را روی هر جدی، روی خود `.sdp`، به‌صورت inline، یا برای یک نمونه با `vars` / `setVars()` تعیین کنید تا جای پیش‌فرض را بگیرد. برای سازوکار توکن‌ها [راهنمای تم‌بندی](/fa/guide/theming) را ببینید.

::: tip نام‌های عمومی و خصوصی
نام‌های `--sdp-*` API عمومی‌اند. استایل‌شیت هر کدام را از طریق یک همتای خصوصی `--_*` می‌خواند (`--_accent: var(--sdp-accent, …)`)؛ آن نام‌ها ممکن است تغییر کنند.
:::

## توکن‌ها کجا اعمال می‌شوند {#where-tokens-apply}

| محدوده | می‌خواند |
|---|---|
| `.sdp`، `.sdp-overlay` | همهٔ توکن‌های این صفحه به‌جز توکن‌های فیلد تاریخ. |
| `.sdp-field` ([فیلد تاریخ](/fa/api/date-field)) | `--sdp-accent`، `--sdp-on-accent`، `--sdp-accent-strong`، `--sdp-accent-soft`، `--sdp-bg`، `--sdp-surface`، `--sdp-text`، `--sdp-muted`، `--sdp-border`، `--sdp-font`، `--sdp-font-size`، `--sdp-duration`، `--sdp-ease`، و توکن‌های فیلد تاریخ. |

مقدارهای تیره زیر `[data-theme="dark"]` اعمال می‌شوند، و زیر `[data-theme="auto"]` وقتی `prefers-color-scheme: dark` برقرار باشد.

## رنگ‌ها {#colors}

| متغیر | روشن | تیره | کاربرد |
|---|---|---|---|
| `--sdp-accent` | `#f5b400` | `#facc15` | روزهای انتخاب‌شده، دو سر بازه، پس‌زمینهٔ دکمهٔ اصلی. |
| `--sdp-on-accent` | `#1f1600` | `#1a1400` | متن روی رنگ accent. |
| `--sdp-accent-strong` | `color-mix(in srgb, var(--sdp-accent) 58%, #000)` | همان accent | accent وقتی روی پس‌زمینه کشیده می‌شود: حلقهٔ امروز، خط فوکوس، متن accent. مشتق است، پس accent سفارشی هم یکی می‌گیرد. |
| `--sdp-accent-soft` | `color-mix(in srgb, var(--sdp-accent) 28%, transparent)` | همان با ۲۰٪ | پس‌زمینهٔ روزهای داخل بازه و پیش‌نمایش. |
| `--sdp-bg` | `#fffdf8` | `#18150f` | پس‌زمینهٔ پنل. |
| `--sdp-surface` | `#f6f2e9` | `#262119` | hover و سطوح ثانویه. |
| `--sdp-text` | `#1c1917` | `#f7f4ee` | متن اصلی. |
| `--sdp-muted` | `#78716c` | `#a8a29e` | متن ثانویه، روزهای ماه دیگر. |
| `--sdp-border` | `#e8e2d6` | `#3b3428` | حاشیه‌ها و دستگیرهٔ sheet. |
| `--sdp-holiday` | `#dc2626` | `#f87171` | نقطهٔ تعطیلی و رنگ شمارهٔ روز تعطیل (از [پلاگین تعطیلات](/fa/guide/holidays)). |
| `--sdp-backdrop` | `rgba(0,0,0,.32)` | `rgba(0,0,0,.55)` | پس‌زمینهٔ تیرهٔ پشت sheet و modal. |
| `--sdp-shadow` | `0 12px 40px rgba(28,25,23,.14), 0 2px 8px rgba(28,25,23,.06)` | `0 16px 48px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.35)` | سایهٔ پنل و اورلی. |

## شکل و اندازه {#shape-and-sizing}

| متغیر | پیش‌فرض | کاربرد |
|---|---|---|
| `--sdp-radius` | `16px` | گوشه‌های پنل (گوشه‌های بالای sheet). |
| `--sdp-day-radius` | `10px` | گوشه‌های خانهٔ روز. |
| `--sdp-day-gap` | `3px` | فاصلهٔ خانه‌های روز. |
| `--sdp-cell-size` | `40px` (درون sheet، `44px`) | اندازهٔ خانهٔ روز. |

## تایپوگرافی {#typography}

| متغیر | پیش‌فرض |
|---|---|
| `--sdp-font` | `system-ui, -apple-system, 'Segoe UI', Roboto, 'Vazirmatn', Tahoma, sans-serif` |
| `--sdp-font-size` | `14px` |

## حرکت {#motion}

| متغیر | پیش‌فرض | چه چیزی را تنظیم می‌کند |
|---|---|---|
| `--sdp-duration` | `200ms` | تغییر حالت‌ها: hover، رنگ‌ها، بازخورد فشردن. |
| `--sdp-duration-slow` | `420ms` | حرکت: باز شدن اورلی، لغزش ماه، زوم نما، جهش انتخاب. خروج‌ها با نصف آن اجرا می‌شوند. |
| `--sdp-ease` | `cubic-bezier(.22, 1, .36, 1)` | کاهش سرعت نرم و بلند برای محو شدن و لغزیدن. |
| `--sdp-spring` | یک فنر میرا (`linear()`)؛ در مرورگرهای قدیمی‌تر `cubic-bezier(.34, 1.25, .64, 1)` | چیزهایی که سر جایشان می‌نشینند: popup، modal، جهش روز، رها کردن فشار. |

انیمیشن‌ها همیشه به `prefers-reduced-motion` و `animate: false` احترام می‌گذارند، این مقدارها هر چه باشند. `--sdp-duration-slow` را زیر یک ثانیه نگه دارید.

## لایه‌بندی {#layering}

| متغیر | پیش‌فرض | کاربرد |
|---|---|---|
| `--sdp-z` | `1000` | ترتیب لایهٔ اورلی. گزینهٔ `zIndex` آن را روی هر اورلی تعیین می‌کند. |

## فیلد تاریخ {#date-field}

فقط `.sdp-field` آن‌ها را می‌خواند.

| متغیر | روشن | تیره | کاربرد |
|---|---|---|---|
| `--sdp-danger` | `#dc2626` | `#f87171` | حاشیه، حلقه و متن خطای حالت نامعتبر. |
| `--sdp-field-height` | `44px` | | ارتفاع فیلد. |
| `--sdp-field-radius` | `12px` | | گوشه‌های فیلد. |

## تعیین‌شده در زمان اجرا {#set-at-runtime}

| متغیر | تعیین‌کننده | توضیح |
|---|---|---|
| `--sdp-popup-origin` | `Popup` | مبدأ transform در popup (مثلاً `top left`)، تا از سمت فیلد باز شود. برای تعیین دستی نیست. |

## کلاس‌های قابلیت‌ها {#feature-classes}

میان‌برها، تقویم دوم، واحدهای انتخاب و دلیل غیرفعال بودن توکن جداگانه ندارند و از توکن‌های بالا استفاده می‌کنند. برای تغییرات ساختاری، کلاس‌هایشان را هدف بگیرید: `.sdp__shortcut`، `.sdp__shortcut--active`، `.sdp__day--has-reason`، `.sdp__day-sub`، `.sdp__subtitle`، `.sdp[data-unit]`، `.sdp__day--mark-holiday`. فهرست کامل در [راهنمای تم‌بندی](/fa/guide/theming#class-names) است.

## مثال {#example}

```css
:root {
  --sdp-accent: #0ea5e9;
  --sdp-on-accent: #ffffff;
  --sdp-radius: 12px;
  --sdp-cell-size: 44px;
  --sdp-duration: 120ms;
}
```

برای یک نمونه، که به اورلی‌های portal‌شده هم می‌رسد (قاعدهٔ روی جد نمی‌رسد):

```js
createDatePicker('#date', {
  vars: { accent: '#0ea5e9', 'on-accent': '#ffffff', radius: '12px' },
})
```
