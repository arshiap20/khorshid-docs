<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

const props = withDefaults(
  defineProps<{
    options?: Record<string, any>
    showValue?: boolean
    caption?: string
  }>(),
  { options: () => ({}), showValue: true }
)

const host = ref<HTMLElement | null>(null)
const field = shallowRef<any>(null)
const value = ref('—')
const formValue = ref('')

function sync(): void {
  const current = field.value?.getValue()
  value.value = current ? current.formatted : '—'
  formValue.value = field.value?.core.getFormValue() ?? ''
}

onMounted(async () => {
  const { createDateField } = await import('@khorshid-js/dom')
  if (!host.value) return
  field.value = createDateField(host.value, { locale: 'fa-IR', ...props.options })
  field.value.on('change', sync)
  sync()
})

onBeforeUnmount(() => field.value?.destroy())
</script>

<template>
  <div class="sdp-docs-demo sdp-docs-field-demo">
    <div ref="host" class="sdp-docs-field-host" />
    <div v-if="showValue" class="sdp-docs-field-value">
      <span>value: <code>{{ value }}</code></span>
      <span>form: <code>{{ formValue || "''" }}</code></span>
    </div>
    <p v-if="caption" class="sdp-docs-caption">{{ caption }}</p>
  </div>
</template>

<style scoped>
.sdp-docs-field-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}
.sdp-docs-field-host {
  min-height: 64px;
}
.sdp-docs-field-value {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.sdp-docs-caption {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
