---
layout: home
markdownStyles: false
title: خورشید
titleTemplate: دیت‌پیکر جلالی و میلادی
---

<HomeHero lang="fa" />

<div class="kh-home">

<HomeCalendars lang="fa" />

<section class="kh-section layers">
<div class="kh-section__head">
<h2>یک موتور، هر استکی</h2>
<p>گزینه‌ها، رویدادها و مقدارها فقط یک بار در هسته تعریف شده‌اند. همهٔ لایه‌ها همان درخت المان را با همان استایل‌شیت رندر می‌کنند، پس جابه‌جایی بین آن‌ها یادگیری دوباره نمی‌خواهد.</p>
</div>
<div class="vp-doc layers__code">

::: code-group

```js [Vanilla]
import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

createDatePicker('#stay', {
  locale: 'fa-IR',
  mode: 'range',
  months: 2,
  onRangeComplete: ({ start, end }) => book(start.iso, end.iso),
})
```

```tsx [React]
import { DatePicker } from 'khorshid/react'
import 'khorshid/styles.css'

<DatePicker
  locale="fa-IR"
  mode="range"
  months={2}
  onRangeComplete={({ start, end }) => book(start.iso, end.iso)}
/>
```

```vue [Vue]
<script setup>
import { DatePicker } from 'khorshid/vue'
import 'khorshid/styles.css'
</script>

<template>
  <DatePicker
    locale="fa-IR"
    mode="range"
    :months="2"
    @range-complete="({ start, end }) => book(start.iso, end.iso)"
  />
</template>
```

```html [Web Component]
<script type="module">
  import { defineDatePickerElement } from 'khorshid/element'
  defineDatePickerElement()
</script>

<khorshid-datepicker locale="fa-IR" mode="range" months="2" name="stay">
</khorshid-datepicker>
```

```js [Headless]
import { createPicker } from 'khorshid/headless'

const picker = createPicker({ locale: 'fa-IR', mode: 'range' })

picker.subscribe(() => {
  const grid = picker.getGrid()
  // grid.title.label → 'مهر ۱۴۰۵'
  // grid.weeks → DayCell[][] with selected, inRange, disabled… precomputed
})
```

:::

</div>
<div class="layers__links">
  <a href="./guide/getting-started">شروع سریع</a>
  <a href="./guide/react-and-vue">React و Vue</a>
  <a href="./guide/web-component">Web Component</a>
  <a href="./guide/headless-core">هستهٔ headless</a>
</div>
</section>

<HomeFacts lang="fa" />

<section class="kh-section kh-cta">
<h2>با گزینه‌های خودتان امتحان کنید</h2>
<p>پلی‌گراند با گزینه‌هایی که انتخاب می‌کنید یک پیکر زنده می‌سازد و کد متناظرش را می‌نویسد.</p>
<div class="kh-cta__actions">
  <a class="kh-btn kh-btn--brand" href="./playground">باز کردن پلی‌گراند</a>
  <a class="kh-btn kh-btn--ghost" href="./api/options">همهٔ گزینه‌ها</a>
</div>
</section>

</div>
