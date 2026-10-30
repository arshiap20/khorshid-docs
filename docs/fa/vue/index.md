# Vue

`khorshid/vue` همان پیکر است به شکل کامپوننت و composable در Vue 3؛ همان پیکر با رندرکننده‌ای دیگر، نه APIای جداگانه. نام گزینه‌ها، پیش‌فرض‌ها، رویدادها و مقدارها یک بار در [هسته](/fa/core/) تعریف شده‌اند و کامپوننت‌ها همان درخت المنت `sdp` را با همان استایل‌شیتی رندر می‌کنند که بقیهٔ لایه‌ها.

## نصب {#installation}

```bash
npm install khorshid
```

```ts
import { DatePicker, Calendar, DateField, useDatePicker } from 'khorshid/vue'
import 'khorshid/styles.css'
```

به Vue 3.4 یا بالاتر نیاز دارد. اگر پکیج scoped را ترجیح می‌دهید، همین کد با نام `@khorshid-js/vue` هم منتشر شده است.

## کامپوننت‌های `<DatePicker>` و `<Calendar>` {#datepicker-and-calendar}

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, type PickerValueInput } from 'khorshid/vue'
import 'khorshid/styles.css'

const stay = ref<PickerValueInput>(null)
</script>

<template>
  <DatePicker
    v-model="stay"
    locale="fa-IR"
    mode="range"
    :months="2"
    @range-complete="({ start, end }) => book(start.iso, end.iso)"
  />
</template>
```

`<DatePicker>` یک فیلد و پنلی است که باز می‌کند؛ `<Calendar>` پنل همیشه‌نمایان است. هر دو هر [گزینه](/fa/api/options) را با همان نامی که پیکر vanilla می‌گیرد، به شکل prop می‌پذیرند. مقدار با `v-model` متصل می‌شود و برای مقدار اولیهٔ کنترل‌نشده از `defaultValue` استفاده کنید.

## رویدادها {#events}

رویدادها emitهایی با نام kebab-case هستند و هر کدام همان payload هسته را دارند:

| رویداد هسته | emit در Vue |
|---|---|
| `change` | `@change` |
| `select` | `@select` |
| `range:complete` | `@range-complete` |
| `view:change` | `@view-change` |
| `error` | `@error` |
| (باز و بسته شدن) | `@open-change` |

فهرست کامل و payloadها در [رویدادها](/fa/api/events) آمده است.

## اسلات‌ها {#slots}

اسلات‌های scoped یعنی `day` (`{ cell }`)، `weekday` (`{ label }`) و `footer` (`{ value, view }`) معادل قالبیِ `renderDay`، `renderWeekday` و `renderFooter` هستند:

```vue
<DatePicker v-model="date">
  <template #day="{ cell }">
    <span :class="{ busy: isBusy(cell.iso) }">{{ cell.label }}</span>
  </template>
</DatePicker>
```

## composable `useDatePicker`: headless {#usedatepicker-headless}

پنل را خودتان رندر کنید و وضعیت را به خورشید بسپارید:

```ts
const { core, state, value, actions } = useDatePicker({
  mode: 'range',
  locale: computed(() => store.locale),   // ref و getter پذیرفته می‌شوند
})

value.value.start   // تایپ دقیق
```

گزینه‌های `locale`، `mode` و `value` کنترل‌شده می‌توانند ref یا getter باشند؛ بقیهٔ گزینه‌ها فقط یک بار، هنگام ساخت پیکر، خوانده می‌شوند. هسته هنگام dispose شدن scope تخریب می‌شود.

## اشتراک یک core {#sharing-one-core}

با prop `core` چند کامپوننت یک پیکر را رندر می‌کنند، مثلاً یک فیلد و یک پنل بزرگ inline:

```vue
<script setup>
const { core } = useDatePicker({ mode: 'range' })
</script>

<template>
  <DatePicker :core="core" />
  <Calendar :core="core" :months="2" />
</template>
```

`provideDatePicker()` و `useDatePickerContext()` هسته را بدون پاس‌دادن دستی به پایین درخت می‌رسانند.

## فیلد تاریخ {#date-field}

`<DateField>` همان [فیلد تاریخ](/fa/guide/date-field) بخش‌بندی‌شده است، با همان نام گزینه‌های `createDateField`:

```vue
<script setup>
import { ref } from 'vue'
import { DateField } from 'khorshid/vue'

const value = ref(null)
</script>

<template>
  <DateField v-model="value" locale="fa-IR" label="تاریخ تولد" />
</template>
```

`useDateField` نیمهٔ بدون رابط آن است: `state.segments` را خودتان رندر کنید.

## تایپ‌ها {#typing}

payload رویداد `@change` و `v-model` کامپوننت‌ها همان union کامل `PickerValue` است، چون propهایی که در زمان اجرا تعریف می‌شوند نمی‌توانند جنریکِ `mode` را حمل کنند. برای دقیق‌کردن تایپ از `useDatePicker` یا گاردهای export‌شده (`isRangeValue`، `isSingleValue`، `isMultipleValue`) استفاده کنید.

**مطالب مرتبط:** [مرجع Vue](/fa/vue/api) · [گزینه‌ها](/fa/api/options) · [رویدادها](/fa/api/events) · [هستهٔ headless](/fa/core/)
