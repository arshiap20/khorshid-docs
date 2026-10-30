# تم‌بندی

هر مقدار بصری در خورشید (رنگ، اندازه، شعاع، حرکت) یک CSS custom property است و همهٔ لایه‌ها با یک استایل‌شیت، یعنی `khorshid/styles.css`، رندر می‌شوند. برای تغییر ظاهر پیکر، تم‌دادن به یک نمونهٔ خاص، رفتن به حالت تیره یا هدف‌گرفتن کلاس‌ها این صفحه را بخوانید.

## امتحان کنید {#try-it}

یک رنگ را انتخاب کنید یا تم را عوض کنید:

<Demo inline :controls="['accent', 'theme', 'value']" caption="تم‌بندی زنده — رنگ اصلی از طریق vars، روشن/تیره/خودکار از طریق setTheme." />

## توکن‌ها چطور کار می‌کنند {#how-the-tokens-work}

استایل‌شیت هر توکن را از یک واسطهٔ دولایهٔ خصوصی می‌خواند (`--_x: var(--sdp-x, <default>)`)؛ پس تنظیم یک متغیر `--sdp-*` روی **هر والدی**، چه `:root`، چه یک المنت دربرگیرنده، چه خودِ `.sdp` یا به‌صورت inline، همیشه بر پیش‌فرض داخلی غلبه می‌کند:

```css
:root {
  --sdp-accent: #0ea5e9;
  --sdp-on-accent: #ffffff;
  --sdp-radius: 12px;
  --sdp-cell-size: 44px;
}
```

نام‌های `--sdp-*` API عمومی‌اند؛ نام‌های `--_*` خصوصی‌اند و ممکن است تغییر کنند.

هر سلکتور استایل‌شیت دقیقاً specificity یک کلاس را دارد؛ پس resetهای سراسری صفحهٔ شما (preflight در Tailwind، Bootstrap Reboot، تم VitePress) استایل پیکر را پاک نمی‌کنند. قانونی که خودتان برای یک کلاس پیکر می‌نویسید بدون `!important` غلبه می‌کند، به شرطی که بعد از `khorshid/styles.css` بارگذاری شود یا یک کلاس بیشتر داشته باشد (مثلاً `.my-app .sdp__day`).

## تم‌بندی یک نمونه {#per-instance-theming}

پنجره‌های popup، sheet و modal به `document.body` (یا به گزینهٔ `container`) منتقل (portal) می‌شوند؛ پس متغیرهایی را که روی والدهای ورودی تنظیم کرده‌اید به ارث نمی‌برند. برای تم‌دادن به یک پیکر، از گزینهٔ `vars` یا متد `setVars()` استفاده کنید. هر دو متغیرها را به‌صورت inline روی پنل و روی هر overlay باز اعمال می‌کنند:

```js
const picker = createDatePicker('#date', { vars: { accent: '#e11d48', 'on-accent': '#fff' } })

picker.setVars({ '--sdp-radius': '8px' }) // با vars موجود ادغام می‌شود
picker.setVars({ accent: '' })            // رشتهٔ خالی یکی را حذف می‌کند
```

کلیدهای بدون پیشوند خودشان `--sdp-` می‌گیرند؛ پس `{ accent: '#e11d48' }` و `{ '--sdp-accent': '#e11d48' }` معادل‌اند.

## حالت تیره {#dark-mode}

گزینهٔ `theme` ویژگی `data-theme` را روی پنل و overlay آن تنظیم می‌کند:

- مقدار `'light'` یا `'dark'` همان حالت را تحمیل می‌کند.
- مقدار `'auto'` (پیش‌فرض) از طریق `prefers-color-scheme` از سیستم‌عامل پیروی می‌کند.

```js
const picker = createDatePicker('#date', { theme: 'auto' })
picker.setTheme('dark') // تعویض در زمان اجرا
```

هر متغیر `--sdp-*` که تنظیم کنید در هر دو حالت اعمال می‌شود. برای مقداری متفاوت در حالت تیره، آن را روی `[data-theme="dark"]` تنظیم کنید و برای `'auto'`، روی `[data-theme="auto"]` داخل `@media (prefers-color-scheme: dark)`؛ هر دو ویژگی روی `.sdp` و `.sdp-overlay` قرار می‌گیرند.

## مرجع توکن‌ها {#token-reference}

گزیده‌ای از پرکاربردترین توکن‌ها (فهرست کامل در مرجع [توکن‌های تم](/fa/api/theming-tokens)):

| متغیر | پیش‌فرض روشن | پیش‌فرض تیره |
|---|---|---|
| `--sdp-accent` | `#f5b400` | `#facc15` |
| `--sdp-on-accent` | `#1f1600` | `#1a1400` |
| `--sdp-accent-strong` | `color-mix(in srgb, <accent> 58%, #000)` | `<accent>` |
| `--sdp-bg` | `#fffdf8` | `#18150f` |
| `--sdp-surface` | `#f6f2e9` | `#262119` |
| `--sdp-text` | `#1c1917` | `#f7f4ee` |
| `--sdp-muted` | `#78716c` | `#a8a29e` |
| `--sdp-border` | `#e8e2d6` | `#3b3428` |
| `--sdp-radius` | `16px` | — |
| `--sdp-day-radius` | `10px` | — |
| `--sdp-day-gap` | `3px` | — |
| `--sdp-cell-size` | `40px` | — |
| `--sdp-font` | `system-ui, …, 'Vazirmatn', Tahoma, sans-serif` | — |
| `--sdp-duration` | `200ms` | — |
| `--sdp-duration-slow` | `420ms` | — |

[فیلد تاریخ](./date-field) هم همین توکن‌ها را می‌خواند و `--sdp-danger`، `--sdp-field-height` و `--sdp-field-radius` را به آن‌ها اضافه می‌کند.

## نام‌های کلاس {#class-names}

برای تغییرات ساختاری می‌توانید کلاس‌ها را هدف بگیرید. این‌ها نام‌های BEM پایدار با پیشوند `sdp` هستند: `.sdp__day--selected`، `.sdp__nav--prev` و مانند آن. برای افزودن کلاس‌های خودتان به بخش‌های پنل، از گزینهٔ `classes` استفاده کنید که کلیدهایش نام بخش‌هاست (`root`، `header`، `title`، `nav`، `grid`، `day`، `weekday`، `footer`، `input`، `overlay`، `sheet`، `popup`):

```js
createDatePicker('#date', { classes: { root: 'my-picker', day: 'my-day' } })
```

این قلاب‌ها به قابلیت‌های مشخصی تعلق دارند:

| سلکتور | قابلیت |
|---|---|
| `.sdp--has-shortcuts`، `.sdp__shortcuts`، `.sdp__shortcut`، `.sdp__shortcut--active` | [چیپ‌های میان‌بر](./shortcuts-and-limits) (با `[data-shortcut=id]`، و `disabled` وقتی قابل استفاده نیستند). |
| `.sdp__day--has-reason` | روز غیرفعالی که [دلیل](./shortcuts-and-limits#disabled-dates-with-a-reason) دارد (دلیل در `title` آن هم می‌آید). |
| `.sdp--secondary`، `.sdp__day-sub`، `.sdp__day-sub--month-start`، `.sdp__subtitle`، `.sdp__subtitle-part` | برچسب‌های [تقویم دوم](./secondary-calendar). |
| `.sdp[data-unit]`، `.sdp__month--range-start`، `--range-end`، `--in-range` (همین‌ها روی `.sdp__year`) | [واحدهای انتخاب](./selection-units). |
| `.sdp-input--invalid` | فیلدی که متن تایپ‌شده‌اش رد شده است (اعتبار بومی را هم تنظیم می‌کند). |
| `.sdp-form-value` | [فیلد فرم](./forms#the-hidden-field) پنهان. |

قرارداد کامل DOM و CSS در [`CONTRACT.md`](https://github.com/khorshid/khorshid/blob/main/packages/dom/CONTRACT.md) پکیج آمده است.

**مطالب مرتبط:** [توکن‌های تم](/fa/api/theming-tokens) · [کیبورد و دسترس‌پذیری](./keyboard-a11y) · [پلاگین‌ها](./plugins)
