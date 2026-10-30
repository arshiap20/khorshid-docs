<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'fa' }>(), { lang: 'en' })

type CalendarKey = 'jalali' | 'gregorian' | 'hijri'

const { isDark } = useData()

const localeFor: Record<'en' | 'fa', Record<CalendarKey, string>> = {
  en: { jalali: 'en-US', gregorian: 'en-US-gregorian', hijri: 'en-US-hijri' },
  fa: { jalali: 'fa-IR', gregorian: 'fa-IR-gregorian', hijri: 'fa-IR-hijri' },
}

const calendarLabels = computed(() =>
  props.lang === 'fa'
    ? { jalali: 'جلالی', gregorian: 'میلادی', hijri: 'قمری' }
    : { jalali: 'Jalali', gregorian: 'Gregorian', hijri: 'Hijri' }
)

const host = ref<HTMLElement | null>(null)
const picker = shallowRef<any>(null)
const ready = ref(false)
const calendar = ref<CalendarKey>('jalali')
const months = ref<string[]>([])
const viewMonth = ref(1)
const todayMonth = ref(0)
const sunAngle = ref(0)

const R = 276
const ticks = Array.from({ length: 72 }, (_, i) => i * 5)

function polar(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: 300 + radius * Math.cos(rad), y: 300 + radius * Math.sin(rad) }
}

const labels = computed(() =>
  months.value.map((name, i) => {
    const p = polar(i * 30, 304)
    return { name, x: p.x, y: p.y, active: i + 1 === viewMonth.value }
  })
)

const activeArc = computed(() => {
  const a = polar(-14, R)
  const b = polar(14, R)
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`
})

const todayDot = computed(() => (todayMonth.value ? polar((todayMonth.value - 1) * 30, R - 14) : null))

let stop: (() => void) | null = null

function sync() {
  const core = picker.value?.core
  if (!core) return
  const next = core.getState().viewDate.month as number
  const delta = ((((next - viewMonth.value) % 12) + 18) % 12) - 6
  sunAngle.value += delta * 30
  viewMonth.value = next
  months.value = core.getLocale().months
}

async function build() {
  const mod = await import('@khorshid-js/dom')
  if (!host.value) return
  const target = document.createElement('div')
  host.value.appendChild(target)
  const p = mod.createDatePicker(target, {
    locale: localeFor[props.lang][calendar.value],
    theme: isDark.value ? 'dark' : 'light',
  })
  picker.value = p
  const core = p.core
  viewMonth.value = core.getState().viewDate.month
  sunAngle.value = (viewMonth.value - 1) * 30
  months.value = core.getLocale().months
  todayMonth.value = mod.PlainDate.today(core.getLocale().calendar).month
  stop = core.subscribe(sync)
  ready.value = true
}

async function setCalendar(key: CalendarKey) {
  if (key === calendar.value || !picker.value) return
  calendar.value = key
  picker.value.setLocale(localeFor[props.lang][key])
  const mod = await import('@khorshid-js/dom')
  todayMonth.value = mod.PlainDate.today(picker.value.core.getLocale().calendar).month
  sync()
}

watch(isDark, (dark) => picker.value?.setTheme(dark ? 'dark' : 'light'))

onMounted(build)
onBeforeUnmount(() => {
  stop?.()
  picker.value?.destroy?.()
})
</script>

<template>
  <figure class="dial" :class="{ 'is-ready': ready }">
    <div class="dial__face">
      <svg class="dial__ring" viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <radialGradient id="dial-glow">
            <stop offset="0%" stop-color="var(--kh-sun)" stop-opacity="0.55" />
            <stop offset="100%" stop-color="var(--kh-sun)" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle class="dial__orbit" cx="300" cy="300" :r="R" pathLength="1" />
        <g class="dial__ticks">
          <line
            v-for="t in ticks"
            :key="t"
            :class="{ major: t % 30 === 0 }"
            :x1="polar(t, R + 4).x"
            :y1="polar(t, R + 4).y"
            :x2="polar(t, t % 30 === 0 ? R + 14 : R + 8).x"
            :y2="polar(t, t % 30 === 0 ? R + 14 : R + 8).y"
          />
        </g>
        <circle v-if="todayDot" class="dial__today" :cx="todayDot.x" :cy="todayDot.y" r="3.5" />
        <g class="dial__labels">
          <text
            v-for="(l, i) in labels"
            :key="i"
            :x="l.x"
            :y="l.y"
            :class="{ active: l.active }"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ l.name }}
          </text>
        </g>
        <g class="dial__sun" :style="{ transform: `rotate(${sunAngle}deg)` }">
          <path class="dial__arc" :d="activeArc" />
          <circle cx="300" :cy="300 - R" r="30" fill="url(#dial-glow)" />
          <g class="dial__rays">
            <line
              v-for="r in 8"
              :key="r"
              :x1="300 + 13 * Math.cos((r * Math.PI) / 4)"
              :y1="300 - R + 13 * Math.sin((r * Math.PI) / 4)"
              :x2="300 + 18 * Math.cos((r * Math.PI) / 4)"
              :y2="300 - R + 18 * Math.sin((r * Math.PI) / 4)"
            />
          </g>
          <circle class="dial__disc" cx="300" :cy="300 - R" r="8.5" />
        </g>
      </svg>
      <div ref="host" class="dial__picker" />
    </div>
    <figcaption class="dial__switch" role="group" :aria-label="lang === 'fa' ? 'تقویم' : 'Calendar'">
      <button
        v-for="key in (['jalali', 'gregorian', 'hijri'] as const)"
        :key="key"
        type="button"
        :class="{ 'is-active': calendar === key }"
        :aria-pressed="calendar === key"
        @click="setCalendar(key)"
      >
        {{ calendarLabels[key] }}
      </button>
    </figcaption>
  </figure>
</template>
