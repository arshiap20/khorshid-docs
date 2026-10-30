# Vue

`khorshid/vue` is the picker as Vue 3 components and composables. It is the same picker with a different renderer, not a separate API: option names, defaults, events and values are defined once in the [core](/core/), and the components render the same `sdp` element tree against the same stylesheet as every other layer.

## Installation

```bash
npm install khorshid
```

```ts
import { DatePicker, Calendar, DateField, useDatePicker } from 'khorshid/vue'
import 'khorshid/styles.css'
```

Vue 3.4 or later is required. The same code is published as `@khorshid-js/vue` if you prefer the scoped package.

## `<DatePicker>` and `<Calendar>`

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

`<DatePicker>` is a field and the panel it opens; `<Calendar>` is the always-visible panel. They take every [option](/api/options) as a prop, by the same name the vanilla picker uses. `v-model` binds the value; use `defaultValue` for an uncontrolled initial value.

## Events

Events are emits with kebab-case names, each carrying the core's payload object:

| Core event | Vue emit |
|---|---|
| `change` | `@change` |
| `select` | `@select` |
| `range:complete` | `@range-complete` |
| `view:change` | `@view-change` |
| `error` | `@error` |
| (open and close) | `@open-change` |

See [Events](/api/events) for the full list and payloads.

## Slots

`day` (`{ cell }`), `weekday` (`{ label }`) and `footer` (`{ value, view }`) are scoped slots, the template equivalents of `renderDay`, `renderWeekday` and `renderFooter`:

```vue
<DatePicker v-model="date">
  <template #day="{ cell }">
    <span :class="{ busy: isBusy(cell.iso) }">{{ cell.label }}</span>
  </template>
</DatePicker>
```

## `useDatePicker`: headless

Render the panel yourself and keep the state in Khorshid:

```ts
const { core, state, value, actions } = useDatePicker({
  mode: 'range',
  locale: computed(() => store.locale),   // refs and getters are accepted
})

value.value.start   // narrowed
```

`locale`, `mode` and a controlled `value` can be refs or getters; other options are read once when the picker is created. The core is destroyed when the scope is disposed.

## Sharing one core

Pass `core` and several components render one picker, for example a field and a large inline panel:

```vue
<script setup>
const { core } = useDatePicker({ mode: 'range' })
</script>

<template>
  <DatePicker :core="core" />
  <Calendar :core="core" :months="2" />
</template>
```

`provideDatePicker()` and `useDatePickerContext()` pass the core down the tree implicitly.

## Date field

`<DateField>` is the segmented [date field](/guide/date-field), with the same option names as `createDateField`:

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

`useDateField` is its headless half: render `state.segments` yourself.

## Typing

The `@change` and `v-model` payloads of the components are the full `PickerValue` union, because Vue's runtime-declared props cannot carry the mode generic. To narrow the value, use `useDatePicker` or the exported guards (`isRangeValue`, `isSingleValue`, `isMultipleValue`).

**Related:** [Vue API](/vue/api) · [Options](/api/options) · [Events](/api/events) · [The Headless Core](/core/)
