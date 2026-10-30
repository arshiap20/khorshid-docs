<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'fa' }>(), { lang: 'en' })

const p = (path: string) => withBase((props.lang === 'fa' ? '/fa' : '') + path)

const content = computed(() =>
  props.lang === 'fa'
    ? {
        title: 'هر چیزی که یک فیلد تاریخ لازم دارد',
        body: 'همهٔ این‌ها در هسته پیاده شده‌اند و در هر چهار لایه یکسان کار می‌کنند.',
        more: 'بیشتر',
        facts: [
          { key: 'تقویم', title: 'جلالی، میلادی، قمری', text: 'نُه لوکال آماده از fa-IR تا ps-AF. نمایش تقویم دوم کنار هر روز و ثبت تقویم یا لوکال سفارشی.', link: '/guide/calendars-and-locales' },
          { key: 'انتخاب', title: 'تکی، بازه، چندتایی', text: 'واحد انتخاب روز، هفته، ماه یا سال. حداقل و حداکثر طول بازه، و میان‌برهایی مثل «۷ روز گذشته».', link: '/guide/selection-modes' },
          { key: 'ورودی', title: 'ماسک هوشمند و زبان طبیعی', text: 'تایپ با ارقام فارسی یا لاتین. عبارت‌هایی مثل «فردا» یا «جمعه بعد» هم مستقیم به تاریخ تبدیل می‌شوند.', link: '/guide/input-mask' },
          { key: 'دسترسی', title: 'کیبورد و صفحه‌خوان', text: 'گرید ARIA، roving tabindex، تلهٔ فوکوس و کلیدهای جهت‌دار که در راست‌به‌چپ درست کار می‌کنند.', link: '/guide/keyboard-a11y' },
          { key: 'ظاهر', title: 'متغیرهای CSS', text: 'رنگ، گردی گوشه، اندازه و حرکت با توکن‌های --sdp-*. حالت روشن، تیره یا خودکار، بدون بازنویسی کلاس.', link: '/guide/theming' },
          { key: 'افزونه', title: 'پلاگین و تعطیلات', text: 'روزها را با پلاگین علامت بزنید. پلاگین رسمی تعطیلات، تعطیلات ایران را حتی آفلاین هم دارد.', link: '/guide/plugins' },
        ],
      }
    : {
        title: 'Everything a date field needs',
        body: 'All of it lives in the core, so it behaves the same in every layer.',
        more: 'Read more',
        facts: [
          { key: 'calendars', title: 'Jalali, Gregorian, Hijri', text: 'Nine built-in locales, from fa-IR to ps-AF. Show a second calendar under each day, or register your own calendar or locale.', link: '/guide/calendars-and-locales' },
          { key: 'selection', title: 'Single, range, multiple', text: 'Select by day, week, month or year. Set minimum and maximum range lengths, and offer shortcuts like “Last 7 days”.', link: '/guide/selection-modes' },
          { key: 'input', title: 'Smart mask and natural language', text: 'Type in Persian or Latin digits. Phrases like “tomorrow” or “جمعه بعد” turn straight into dates.', link: '/guide/input-mask' },
          { key: 'a11y', title: 'Keyboard and screen readers', text: 'ARIA grid, roving tabindex, focus trap, and arrow keys that do the right thing in RTL.', link: '/guide/keyboard-a11y' },
          { key: 'theming', title: 'CSS variables', text: 'Color, radius, size and motion through --sdp-* tokens. Light, dark or auto, with no class overrides.', link: '/guide/theming' },
          { key: 'plugins', title: 'Plugins and holidays', text: 'Mark days from a plugin. The official holidays plugin ships Iran’s public holidays, even offline.', link: '/guide/plugins' },
        ],
      }
)
</script>

<template>
  <section class="kh-section facts">
    <div class="kh-section__head">
      <h2>{{ content.title }}</h2>
      <p>{{ content.body }}</p>
    </div>
    <div class="facts__list">
      <a v-for="f in content.facts" :key="f.key" class="facts__item" :href="p(f.link)">
        <span class="facts__key">{{ f.key }}</span>
        <h3 class="facts__title">{{ f.title }}</h3>
        <p class="facts__text">{{ f.text }}</p>
        <span class="facts__more" aria-hidden="true">{{ content.more }} <span class="facts__arrow">→</span></span>
      </a>
    </div>
  </section>
</template>
