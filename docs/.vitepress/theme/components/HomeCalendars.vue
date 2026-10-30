<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ lang?: 'en' | 'fa' }>(), { lang: 'en' })

const copy = computed(() =>
  props.lang === 'fa'
    ? {
        title: 'یک روز، سه تقویم',
        body: 'هر تاریخ به‌صورت شمارهٔ روز ژولینی (JDN) نگه داشته می‌شود. تبدیل بین تقویم‌ها یعنی خواندن همان روز با یک سیستم دیگر، پس هیچ خطای انباشته‌ای پیش نمی‌آید. محاسبهٔ جلالی بر پایهٔ جدول رسمی سال‌های کبیسه است و تقویم قمری ام‌القری روز به روز با ICU مقایسه شده است.',
        prev: 'روز قبل',
        next: 'روز بعد',
        today: 'امروز',
        names: { jalali: 'جلالی (شمسی)', gregorian: 'میلادی', hijri: 'قمری (ام‌القری)' },
      }
    : {
        title: 'One day, three calendars',
        body: 'Every date is stored as a Julian Day Number. Converting between calendars means reading the same day through a different system, so nothing drifts. The Jalali math follows the official leap-year table, and the Umm al-Qura Hijri calendar is checked against ICU day by day.',
        prev: 'Previous day',
        next: 'Next day',
        today: 'Today',
        names: { jalali: 'Jalali (Solar Hijri)', gregorian: 'Gregorian', hijri: 'Hijri (Umm al-Qura)' },
      }
)

const mod = shallowRef<any>(null)
const jdn = shallowRef<number | null>(null)
const todayJdn = shallowRef<number | null>(null)

const rows = computed(() => {
  const m = mod.value
  if (!m || jdn.value == null) return []
  const fa = props.lang === 'fa'
  const systems = [
    { id: 'jalali', locale: fa ? 'fa-IR' : 'en-US' },
    { id: 'gregorian', locale: fa ? 'fa-IR-gregorian' : 'en-US-gregorian' },
    { id: 'hijri', locale: fa ? 'fa-IR-hijri' : 'en-US-hijri' },
  ] as const
  return systems.map((s) => {
    const locale = m.getLocale(s.locale)
    try {
      const date = m.PlainDate.fromJDN(jdn.value, s.id)
      return {
        id: s.id,
        name: copy.value.names[s.id],
        weekday: date.format('dddd', locale),
        day: date.format('D', locale),
        rest: date.format('MMMM YYYY', locale),
      }
    } catch {
      return { id: s.id, name: copy.value.names[s.id], weekday: '', day: '—', rest: '' }
    }
  })
})

const jdnText = computed(() => {
  if (jdn.value == null) return ''
  return props.lang === 'fa' ? mod.value.toLocaleDigits(String(jdn.value), '۰۱۲۳۴۵۶۷۸۹') : String(jdn.value)
})

function step(days: number) {
  if (jdn.value != null) jdn.value += days
}

onMounted(async () => {
  const m = await import('@khorshid-js/dom')
  mod.value = m
  todayJdn.value = m.PlainDate.today('gregorian').jdn
  jdn.value = todayJdn.value
})
</script>

<template>
  <section class="kh-section same-day">
    <div class="kh-section__head">
      <h2>{{ copy.title }}</h2>
      <p>{{ copy.body }}</p>
    </div>
    <div class="same-day__board">
      <div class="same-day__cards">
        <article v-for="r in rows" :key="r.id" class="same-day__card" :class="`same-day__card--${r.id}`">
          <span class="same-day__system">{{ r.name }}</span>
          <span class="same-day__day">{{ r.day }}</span>
          <span class="same-day__rest">{{ r.rest }}</span>
          <span class="same-day__weekday">{{ r.weekday }}</span>
        </article>
        <template v-if="!rows.length">
          <article v-for="i in 3" :key="i" class="same-day__card is-placeholder" />
        </template>
      </div>
      <div class="same-day__bar">
        <button type="button" class="same-day__step" :aria-label="copy.prev" @click="step(-1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <code class="same-day__jdn" dir="ltr">JDN {{ jdnText }}</code>
        <button type="button" class="same-day__step" :aria-label="copy.next" @click="step(1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <button
          type="button"
          class="same-day__today"
          :disabled="jdn === todayJdn"
          @click="jdn = todayJdn"
        >
          {{ copy.today }}
        </button>
      </div>
    </div>
  </section>
</template>
