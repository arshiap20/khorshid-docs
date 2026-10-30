---
layout: home
markdownStyles: false
title: Khorshid
titleTemplate: Jalali & Gregorian date picker
---

<HomeHero lang="en" />

<div class="kh-home">

<HomeCalendars lang="en" />

<section class="kh-section layers">
<div class="kh-section__head">
<h2>One engine, any stack</h2>
<p>Options, events and values are defined once in the core. Every layer renders the same element tree against the same stylesheet, so you can move between them without relearning anything.</p>
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
  <a href="./guide/getting-started">Getting started</a>
  <a href="./guide/react-and-vue">React &amp; Vue</a>
  <a href="./guide/web-component">Web Component</a>
  <a href="./guide/headless-core">Headless core</a>
</div>
</section>

<HomeFacts lang="en" />

<section class="kh-section kh-cta">
<h2>Try it with your own options</h2>
<p>The playground builds a live picker from the options you choose and writes the matching code.</p>
<div class="kh-cta__actions">
  <a class="kh-btn kh-btn--brand" href="./playground">Open the playground</a>
  <a class="kh-btn kh-btn--ghost" href="./api/options">Browse all options</a>
</div>
</section>

</div>
