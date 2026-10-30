<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, computed, watch } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'fa' }>(), { lang: 'en' })

type Mode = 'single' | 'range' | 'multiple'
type Unit = 'day' | 'week' | 'month' | 'year'
type Display = 'inline' | 'auto' | 'modal'
type ThemeChoice = 'light' | 'dark' | 'auto'

const t = computed(() =>
  props.lang === 'fa'
    ? {
        options: 'گزینه‌ها',
        preview: 'پیش‌نمایش',
        code: 'کد',
        selection: 'انتخاب',
        mode: 'حالت',
        unit: 'واحد',
        calendar: 'تقویم و لوکال',
        months: 'تعداد ماه',
        display: 'نمایش',
        features: 'امکانات',
        look: 'ظاهر',
        theme: 'تم',
        accent: 'رنگ',
        value: 'مقدار',
        events: 'رویدادها',
        copy: 'کپی',
        copied: 'کپی شد',
        reset: 'بازنشانی',
        modes: { single: 'تکی', range: 'بازه', multiple: 'چندتایی' },
        units: { day: 'روز', week: 'هفته', month: 'ماه', year: 'سال' },
        displays: { inline: 'درون‌صفحه', auto: 'پاپ‌آپ', modal: 'مودال' },
        themes: { light: 'روشن', dark: 'تیره', auto: 'خودکار' },
        flags: {
          shortcuts: 'میان‌بُرها',
          secondaryCalendar: 'تقویم دوم',
          time: 'انتخاب ساعت',
          naturalInput: 'ورودی متنی آزاد',
        },
        placeholder: 'کلیک کنید یا تایپ کنید',
      }
    : {
        options: 'Options',
        preview: 'Preview',
        code: 'Code',
        selection: 'Selection',
        mode: 'Mode',
        unit: 'Unit',
        calendar: 'Calendar & locale',
        months: 'Months',
        display: 'Display',
        features: 'Features',
        look: 'Look',
        theme: 'Theme',
        accent: 'Accent',
        value: 'Value',
        events: 'Events',
        copy: 'Copy',
        copied: 'Copied',
        reset: 'Reset',
        modes: { single: 'Single', range: 'Range', multiple: 'Multiple' },
        units: { day: 'Day', week: 'Week', month: 'Month', year: 'Year' },
        displays: { inline: 'Inline', auto: 'Popup', modal: 'Modal' },
        themes: { light: 'Light', dark: 'Dark', auto: 'Auto' },
        flags: {
          shortcuts: 'Shortcuts',
          secondaryCalendar: 'Secondary calendar',
          time: 'Time',
          naturalInput: 'Natural input',
        },
        placeholder: 'Click or type a date',
      }
)

const { isDark } = useData()
const resolveTheme = (v: ThemeChoice) => (v === 'auto' ? (isDark.value ? 'dark' : 'light') : v)

const host = ref<HTMLElement | null>(null)
const picker = shallowRef<any>(null)
const locales = shallowRef<Array<{ key: string; name: string }>>([])

const defaults = {
  mode: 'range' as Mode,
  unit: 'day' as Unit,
  locale: props.lang === 'fa' ? 'fa-IR' : 'en-US',
  months: 1,
  display: 'inline' as Display,
  theme: 'auto' as ThemeChoice,
  accent: '',
  flags: { shortcuts: false, secondaryCalendar: false, time: false, naturalInput: false },
}

const mode = ref<Mode>(defaults.mode)
const unit = ref<Unit>(defaults.unit)
const locale = ref(defaults.locale)
const months = ref(defaults.months)
const display = ref<Display>(defaults.display)
const theme = ref<ThemeChoice>(defaults.theme)
const accent = ref(defaults.accent)
const flags = ref({ ...defaults.flags })

const value = ref('—')
const events = shallowRef<Array<{ id: number; name: string }>>([])
const copied = ref(false)
let eventId = 0

const accents = [
  { color: '', swatch: 'var(--kh-sun)', name: 'Sun' },
  { color: '#4f46e5', name: 'Indigo' },
  { color: '#0d9488', name: 'Teal' },
  { color: '#e11d48', name: 'Rose' },
  { color: '#0284c7', name: 'Sky' },
  { color: '#7c3aed', name: 'Violet' },
]
const accentVars = (color: string) => ({ accent: color, 'on-accent': color ? '#fff' : '' })
const flagKeys = ['shortcuts', 'secondaryCalendar', 'time', 'naturalInput'] as const

const code = computed(() => {
  const opts: string[] = [`  locale: '${locale.value}',`]
  if (mode.value !== 'single') opts.push(`  mode: '${mode.value}',`)
  if (unit.value !== 'day') opts.push(`  unit: '${unit.value}',`)
  if (months.value > 1) opts.push(`  months: ${months.value},`)
  if (display.value === 'modal') opts.push(`  display: 'modal',`)
  for (const key of flagKeys) if (flags.value[key]) opts.push(`  ${key}: true,`)
  if (theme.value !== 'auto') opts.push(`  theme: '${theme.value}',`)
  if (accent.value) opts.push(`  vars: { accent: '${accent.value}', 'on-accent': '#fff' },`)
  const target = display.value === 'inline' ? "document.querySelector('#calendar')" : "'#date'"
  return `import { createDatePicker } from 'khorshid'
import 'khorshid/styles.css'

const picker = createDatePicker(${target}, {
${opts.join('\n')}
})

picker.on('change', ({ value }) => console.log(value))`
})

function formatValue(v: any) {
  if (!v) return '—'
  if (v.mode === 'single') return v.date ? v.date.formatted : '—'
  if (v.mode === 'range') return v.start ? `${v.start.formatted} → ${v.end?.formatted ?? '…'}` : '—'
  return v.dates?.length ? v.dates.map((d: any) => d.formatted).join(' · ') : '—'
}

async function build() {
  const mod = await import('@khorshid-js/dom')
  if (!host.value) return
  if (!locales.value.length) {
    locales.value = mod.getRegisteredLocales().map((l: any) => ({ key: l.key, name: l.name }))
  }
  picker.value?.destroy?.()
  host.value.innerHTML = ''
  const inline = display.value === 'inline'
  const target = document.createElement(inline ? 'div' : 'input')
  if (!inline) {
    ;(target as HTMLInputElement).type = 'text'
    ;(target as HTMLInputElement).placeholder = t.value.placeholder
    target.className = 'demo-input'
  }
  host.value.appendChild(target)

  const p = mod.createDatePicker(target, {
    locale: locale.value,
    mode: mode.value,
    unit: unit.value,
    months: months.value,
    ...(display.value === 'modal' ? { display: 'modal' } : {}),
    ...flags.value,
    theme: resolveTheme(theme.value),
    ...(accent.value ? { vars: accentVars(accent.value) } : {}),
  })
  p.on('change', () => (value.value = formatValue(p.getValue())))
  p.core.onAny((name: string) => {
    events.value = [{ id: eventId++, name }, ...events.value].slice(0, 12)
  })
  picker.value = p
  value.value = formatValue(p.getValue())
}

function reset() {
  mode.value = defaults.mode
  unit.value = defaults.unit
  locale.value = defaults.locale
  months.value = defaults.months
  display.value = defaults.display
  theme.value = defaults.theme
  accent.value = defaults.accent
  flags.value = { ...defaults.flags }
  events.value = []
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}

watch([mode, unit, months, display, flags], build, { deep: true })
watch(locale, (v) => {
  picker.value?.setLocale(v)
  value.value = formatValue(picker.value?.getValue())
})
watch([theme, isDark], () => picker.value?.setTheme(resolveTheme(theme.value)))
watch(accent, (v) => picker.value?.setVars(accentVars(v)))

onMounted(build)
onBeforeUnmount(() => picker.value?.destroy?.())
</script>

<template>
  <div class="pg" :dir="lang === 'fa' ? 'rtl' : 'ltr'">
    <aside class="pg__panel">
      <div class="pg__panel-head">
        <span class="pg__panel-title">{{ t.options }}</span>
        <button type="button" class="pg__reset" @click="reset">{{ t.reset }}</button>
      </div>

      <fieldset class="pg__fieldset">
        <legend class="pg__legend">{{ t.selection }}</legend>
        <div class="pg__group">
          <span class="pg__label">{{ t.mode }}</span>
          <div class="pg__seg">
            <button
              v-for="m in (['single', 'range', 'multiple'] as const)"
              :key="m"
              type="button"
              :class="{ 'is-active': mode === m }"
              :aria-pressed="mode === m"
              @click="mode = m"
            >
              {{ t.modes[m] }}
            </button>
          </div>
        </div>
        <div class="pg__group">
          <span class="pg__label">{{ t.unit }}</span>
          <div class="pg__seg">
            <button
              v-for="u in (['day', 'week', 'month', 'year'] as const)"
              :key="u"
              type="button"
              :class="{ 'is-active': unit === u }"
              :aria-pressed="unit === u"
              @click="unit = u"
            >
              {{ t.units[u] }}
            </button>
          </div>
        </div>
      </fieldset>

      <fieldset class="pg__fieldset">
        <legend class="pg__legend">{{ t.calendar }}</legend>
        <select v-model="locale" :aria-label="t.calendar">
          <option v-for="l in locales" :key="l.key" :value="l.key">{{ l.name }} · {{ l.key }}</option>
        </select>
        <div class="pg__group">
          <span class="pg__label">{{ t.months }}</span>
          <div class="pg__seg">
            <button
              v-for="n in [1, 2, 3]"
              :key="n"
              type="button"
              :class="{ 'is-active': months === n }"
              :aria-pressed="months === n"
              @click="months = n"
            >
              {{ n }}
            </button>
          </div>
        </div>
        <div class="pg__group">
          <span class="pg__label">{{ t.display }}</span>
          <div class="pg__seg">
            <button
              v-for="d in (['inline', 'auto', 'modal'] as const)"
              :key="d"
              type="button"
              :class="{ 'is-active': display === d }"
              :aria-pressed="display === d"
              @click="display = d"
            >
              {{ t.displays[d] }}
            </button>
          </div>
        </div>
      </fieldset>

      <fieldset class="pg__fieldset">
        <legend class="pg__legend">{{ t.features }}</legend>
        <label v-for="key in flagKeys" :key="key" class="pg__toggle">
          <span>{{ t.flags[key] }}</span>
          <span class="pg__switch">
            <input v-model="flags[key]" type="checkbox" />
            <span class="pg__switch-track"><span class="pg__switch-thumb" /></span>
          </span>
        </label>
      </fieldset>

      <fieldset class="pg__fieldset">
        <legend class="pg__legend">{{ t.look }}</legend>
        <div class="pg__group">
          <span class="pg__label">{{ t.theme }}</span>
          <div class="pg__seg">
            <button
              v-for="th in (['light', 'dark', 'auto'] as const)"
              :key="th"
              type="button"
              :class="{ 'is-active': theme === th }"
              :aria-pressed="theme === th"
              @click="theme = th"
            >
              {{ t.themes[th] }}
            </button>
          </div>
        </div>
        <div class="pg__group">
          <span class="pg__label">{{ t.accent }}</span>
          <div class="pg__swatches">
            <button
              v-for="c in accents"
              :key="c.name"
              type="button"
              class="pg__swatch"
              :class="{ 'is-active': accent === c.color }"
              :style="{ background: c.swatch ?? c.color }"
              :aria-label="c.name"
              :aria-pressed="accent === c.color"
              @click="accent = c.color"
            />
          </div>
        </div>
      </fieldset>
    </aside>

    <section class="pg__main" :aria-label="t.preview">
      <div class="pg__stage">
        <div ref="host" class="pg__host" />
      </div>
      <div class="pg__readout">
        <div class="pg__row">
          <span class="pg__row-label">{{ t.value }}</span>
          <code class="pg__value">{{ value }}</code>
        </div>
        <div class="pg__row">
          <span class="pg__row-label">{{ t.events }}</span>
          <div class="pg__event-list">
            <span v-for="e in events" :key="e.id" class="pg__chip">{{ e.name }}</span>
          </div>
        </div>
      </div>
      <div class="pg__code">
        <div class="pg__code-head">
          <span class="pg__code-file">main.ts</span>
          <button type="button" class="pg__copy" @click="copyCode">{{ copied ? t.copied : t.copy }}</button>
        </div>
        <pre><code>{{ code }}</code></pre>
      </div>
    </section>
  </div>
</template>
