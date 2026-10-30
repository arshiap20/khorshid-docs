<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineProps<{
  caption?: string
}>()

const host = ref<HTMLElement | null>(null)
const value = ref('—')
const ready = ref(false)
let stop: (() => void) | null = null

onMounted(async () => {
  const { defineDatePickerElement } = await import('@khorshid-js/element')
  defineDatePickerElement()
  ready.value = true
  const el = host.value
  if (!el) return
  const onChange = (event: Event) => {
    const target = event.target as any
    value.value = target?.core?.getFormValue?.() || '—'
  }
  el.addEventListener('sdp-change', onChange)
  stop = () => el.removeEventListener('sdp-change', onChange)
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <div class="demo demo--inline">
    <div class="demo__stage">
      <div ref="host" class="demo__host"><slot /></div>
      <ClientOnly>
        <div v-if="!ready" class="demo__loading">Loading demo…</div>
      </ClientOnly>
    </div>
    <div class="demo__value">
      <span class="demo__value-label">sdp-change</span>
      <code>{{ value }}</code>
    </div>
    <p v-if="caption" class="demo__caption">{{ caption }}</p>
  </div>
</template>
