<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, watch, computed } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{
    mode?: 'single' | 'range' | 'multiple'
    locale?: string
    months?: number
    inline?: boolean
    vars?: Record<string, string>
    controls?: Array<'locale' | 'theme' | 'accent' | 'value' | 'events' | 'form' | 'error'>
    options?: Record<string, any>
    placeholder?: string
    caption?: string
  }>(),
  {
    mode: 'single',
    locale: 'fa-IR',
    months: 1,
    inline: false,
    controls: () => [],
    placeholder: '',
  }
)

const { isDark, lang } = useData()
const fa = computed(() => lang.value.startsWith('fa'))
const t = computed(() =>
  fa.value
    ? { locale: 'لوکال', theme: 'تم', accent: 'رنگ', value: 'مقدار', form: 'مقدار فرم', error: 'آخرین خطا', loading: 'در حال بارگذاری…', themes: { light: 'روشن', dark: 'تیره', auto: 'خودکار' } }
    : { locale: 'Locale', theme: 'Theme', accent: 'Accent', value: 'Value', form: 'Form value', error: 'Last error', loading: 'Loading demo…', themes: { light: 'Light', dark: 'Dark', auto: 'Auto' } }
)

const host = ref<HTMLElement | null>(null)
const picker = shallowRef<any>(null)
const ready = ref(false)

const locales = shallowRef<Array<{ key: string; name: string }>>([])
const currentLocale = ref(props.locale)
const currentTheme = ref<'light' | 'dark' | 'auto'>('auto')
const value = ref('—')
const formValue = ref('')
const lastError = ref('')
const events = shallowRef<Array<{ id: number; name: string; payload: string }>>([])
let eventId = 0

const accents = [
  { name: 'Sun', color: '', swatch: 'var(--kh-sun)' },
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Teal', color: '#0d9488' },
  { name: 'Rose', color: '#e11d48' },
  { name: 'Sky', color: '#0284c7' },
]
const currentAccent = ref(props.vars?.accent ?? '')
const accentVars = (color: string) => ({ accent: color, 'on-accent': color ? '#fff' : '' })

const has = (c: string) => props.controls.includes(c as any)

const valueText = computed(() => value.value)

function pushEvent(name: string, payload: unknown) {
  events.value = [
    { id: eventId++, name, payload: JSON.stringify(payload, replacer, 0)?.slice(0, 220) ?? '' },
    ...events.value,
  ].slice(0, 8)
}

function replacer(key: string, val: unknown) {
  if (val && typeof val === 'object' && 'jdn' in (val as any) && 'iso' in (val as any)) {
    return (val as any).formatted ?? (val as any).iso
  }
  return val
}

function renderValue() {
  const p = picker.value
  if (!p) return
  formValue.value = p.core.getFormValue?.() ?? ''
  const v = p.getValue()
  if (!v) {
    value.value = '—'
    return
  }
  if (v.mode === 'single') value.value = v.date ? v.date.formatted : '—'
  else if (v.mode === 'range')
    value.value = `${v.start?.formatted ?? '…'} → ${v.end?.formatted ?? '…'}`
  else value.value = v.dates?.length ? v.dates.map((d: any) => d.formatted).join('، ') : '—'
}

async function build() {
  if (!host.value) return
  const mod = await import('@khorshid-js/dom')
  const { createDatePicker, getRegisteredLocales } = mod

  if (!locales.value.length) {
    locales.value = getRegisteredLocales().map((l: any) => ({ key: l.key, name: l.name }))
  }

  host.value.innerHTML = ''
  const target = document.createElement(props.inline ? 'div' : 'input')
  if (!props.inline) {
    ;(target as HTMLInputElement).type = 'text'
    ;(target as HTMLInputElement).placeholder = props.placeholder || ''
    target.className = 'demo-input'
  }
  host.value.appendChild(target)

  const p = createDatePicker(target, {
    locale: currentLocale.value,
    mode: props.mode,
    months: props.months,
    theme: resolveTheme(currentTheme.value),
    vars: has('accent') ? (currentAccent.value ? accentVars(currentAccent.value) : undefined) : props.vars,
    ...(props.options ?? {}),
  })

  p.on('change', () => {
    lastError.value = ''
    renderValue()
  })
  if (has('error')) {
    p.on('error', (e: { code: string; message: string; reason?: string }) => {
      lastError.value = e.reason ? `${e.code} — ${e.reason}` : e.code
    })
  }
  if (has('events')) {
    p.core.onAny((name: string, payload: unknown) => pushEvent(name, payload))
  }

  picker.value?.destroy?.()
  picker.value = p
  renderValue()
  ready.value = true
}

function setLocale(key: string) {
  currentLocale.value = key
  picker.value?.setLocale(key)
  renderValue()
}
function resolveTheme(theme: 'light' | 'dark' | 'auto') {
  return theme === 'auto' ? (isDark.value ? 'dark' : 'light') : theme
}
function setTheme(theme: 'light' | 'dark' | 'auto') {
  currentTheme.value = theme
  picker.value?.setTheme(resolveTheme(theme))
}
function setAccent(color: string) {
  currentAccent.value = color
  picker.value?.setVars(accentVars(color))
}

onMounted(build)
watch(
  () => [props.mode, props.months, props.inline],
  () => build()
)
watch(isDark, () => picker.value?.setTheme(resolveTheme(currentTheme.value)))
onBeforeUnmount(() => picker.value?.destroy?.())
</script>

<template>
  <div class="demo" :class="{ 'demo--inline': inline }">
    <div v-if="controls.length" class="demo__controls">
      <label v-if="has('locale')" class="demo__control">
        <span>{{ t.locale }}</span>
        <select :value="currentLocale" @change="setLocale(($event.target as HTMLSelectElement).value)">
          <option v-for="l in locales" :key="l.key" :value="l.key">{{ l.name }} — {{ l.key }}</option>
        </select>
      </label>

      <div v-if="has('theme')" class="demo__control">
        <span>{{ t.theme }}</span>
        <div class="demo__seg">
          <button
            v-for="th in (['light', 'dark', 'auto'] as const)"
            :key="th"
            :class="{ 'is-active': currentTheme === th }"
            @click="setTheme(th)"
          >
            {{ t.themes[th] }}
          </button>
        </div>
      </div>

      <div v-if="has('accent')" class="demo__control">
        <span>{{ t.accent }}</span>
        <div class="demo__swatches">
          <button
            v-for="a in accents"
            :key="a.color"
            class="demo__swatch"
            :class="{ 'is-active': currentAccent === a.color }"
            :style="{ background: a.swatch ?? a.color }"
            :title="a.name"
            :aria-label="a.name"
            @click="setAccent(a.color)"
          />
        </div>
      </div>
    </div>

    <div class="demo__stage">
      <div ref="host" class="demo__host" />
      <ClientOnly>
        <div v-if="!ready" class="demo__loading">{{ t.loading }}</div>
      </ClientOnly>
    </div>

    <div v-if="has('value')" class="demo__value">
      <span class="demo__value-label">{{ t.value }}</span>
      <code>{{ valueText }}</code>
    </div>

    <div v-if="has('form')" class="demo__value">
      <span class="demo__value-label">{{ t.form }}</span>
      <code>{{ formValue || '""' }}</code>
    </div>

    <div v-if="has('error')" class="demo__value">
      <span class="demo__value-label">{{ t.error }}</span>
      <code>{{ lastError || '—' }}</code>
    </div>

    <div v-if="has('events') && events.length" class="demo__events">
      <div v-for="e in events" :key="e.id" class="demo__event">
        <span class="demo__event-name">{{ e.name }}</span>
        <code class="demo__event-payload">{{ e.payload }}</code>
      </div>
    </div>

    <p v-if="caption" class="demo__caption">{{ caption }}</p>
  </div>
</template>
