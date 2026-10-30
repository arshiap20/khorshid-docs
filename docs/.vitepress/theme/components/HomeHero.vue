<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import SunDial from './SunDial.vue'

const props = withDefaults(defineProps<{ lang?: 'en' | 'fa' }>(), { lang: 'en' })

const copy = computed(() =>
  props.lang === 'fa'
    ? {
        headline: '',
        tagline:
          'یک هستهٔ headless و بدون وابستگی، با رابط آماده برای جاوااسکریپت خالص، React، Vue و Web Component. ورودی هوشمند، راست‌به‌چپ درست و دسترس‌پذیری کامل از همان اول.',
        start: 'شروع کنید',
        startLink: '/fa/guide/getting-started',
        playground: 'پلی‌گراند',
        playgroundLink: '/fa/playground',
        copy: 'کپی',
        copied: 'کپی شد',
      }
    : {
        headline: 'The Jalali calendar, done right.',
        tagline:
          'A headless, zero-dependency core with ready-made UIs for vanilla JS, React, Vue and Web Components. Smart input, correct RTL and full accessibility built in.',
        start: 'Get started',
        startLink: '/guide/getting-started',
        playground: 'Playground',
        playgroundLink: '/playground',
        copy: 'Copy',
        copied: 'Copied',
      }
)

const install = 'npm i khorshid'
const copied = ref(false)

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(install)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section class="hero" :class="`hero--${lang}`">
    <div class="hero__text">
      <h1 class="hero__mark">
        <template v-if="lang === 'fa'">
          <span class="hero__mark-fa">خورشید</span>
          <span class="hero__mark-en" lang="en">Khorshid</span>
        </template>
        <template v-else>
          <span class="hero__mark-en">Khorshid</span>
          <span class="hero__mark-fa" lang="fa">خورشید</span>
        </template>
      </h1>
      <p v-if="copy.headline" class="hero__headline">{{ copy.headline }}</p>
      <p class="hero__tagline">{{ copy.tagline }}</p>
      <div class="hero__actions">
        <a class="kh-btn kh-btn--brand" :href="withBase(copy.startLink)">{{ copy.start }}</a>
        <a class="kh-btn kh-btn--ghost" :href="withBase(copy.playgroundLink)">{{ copy.playground }}</a>
        <button type="button" class="hero__install" dir="ltr" @click="copyInstall">
          <span class="hero__prompt">$</span>
          <code>{{ install }}</code>
          <span class="hero__copy">{{ copied ? copy.copied : copy.copy }}</span>
        </button>
      </div>
    </div>
    <div class="hero__visual">
      <ClientOnly>
        <SunDial :lang="lang" />
      </ClientOnly>
    </div>
  </section>
</template>
