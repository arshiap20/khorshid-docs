import { defineConfig, type DefaultTheme } from 'vitepress'

const github = 'https://github.com/arshiap20/khorshid-docs'

// GitHub Pages serves project sites under /<repo>/; the deploy workflow passes it in.
const base = process.env.DOCS_BASE ?? '/'

type Translate = (en: string, persian: string) => string

const translator = (fa: boolean): Translate => (en, persian) => (fa ? persian : en)

function guideSidebar(prefix: string, fa: boolean): DefaultTheme.SidebarItem[] {
  const t = translator(fa)
  const link = (path: string) => `${prefix}/guide/${path}`
  const api = (path: string) => `${prefix}/api/${path}`
  return [
    {
      text: t('Introduction', 'آشنایی'),
      items: [
        { text: t('What is Khorshid?', 'خورشید چیست؟'), link: link('what-is-khorshid') },
        { text: t('Getting started', 'شروع سریع'), link: link('getting-started') },
      ],
    },
    {
      text: t('Calendars', 'تقویم‌ها'),
      items: [
        { text: t('Calendars & locales', 'تقویم‌ها و لوکال‌ها'), link: link('calendars-and-locales') },
        { text: t('Secondary calendar', 'تقویم دوم'), link: link('secondary-calendar') },
      ],
    },
    {
      text: t('Selecting dates', 'انتخاب تاریخ'),
      items: [
        { text: t('Selection modes', 'حالت‌های انتخاب'), link: link('selection-modes') },
        { text: t('Selection units', 'واحد انتخاب'), link: link('selection-units') },
        { text: t('Shortcuts & limits', 'میان‌بُرها و محدودیت‌ها'), link: link('shortcuts-and-limits') },
      ],
    },
    {
      text: t('Typing dates', 'تایپ تاریخ'),
      items: [
        { text: t('Input mask & formatting', 'ماسک ورودی و قالب‌بندی'), link: link('input-mask') },
        { text: t('Natural input', 'ورودی متنی آزاد'), link: link('natural-input') },
        { text: t('Date field', 'فیلد تاریخ'), link: link('date-field') },
      ],
    },
    {
      text: t('Forms & accessibility', 'فرم و دسترس‌پذیری'),
      items: [
        { text: t('Forms', 'فرم‌ها'), link: link('forms') },
        { text: t('Keyboard & accessibility', 'کیبورد و دسترس‌پذیری'), link: link('keyboard-a11y') },
      ],
    },
    {
      text: t('Look & feel', 'ظاهر'),
      items: [{ text: t('Theming', 'تم‌بندی'), link: link('theming') }],
    },
    {
      text: t('Extending', 'گسترش'),
      items: [
        { text: t('Plugins', 'پلاگین‌ها'), link: link('plugins') },
        { text: t('Holidays', 'تعطیلات'), link: link('holidays') },
      ],
    },
    {
      text: t('Shared reference', 'مرجع مشترک'),
      items: [
        { text: t('Options', 'گزینه‌ها'), link: api('options') },
        { text: t('Events', 'رویدادها'), link: api('events') },
        { text: t('Date field options', 'گزینه‌های فیلد تاریخ'), link: api('date-field') },
        { text: t('Format tokens', 'توکن‌های قالب'), link: api('format-tokens') },
        { text: t('Theming tokens', 'توکن‌های تم'), link: api('theming-tokens') },
      ],
    },
  ]
}

/** The sidebar of one layer: its guide pages, then its API pages. */
function layerSidebar(
  title: string,
  base: string,
  guide: [string, string][],
  api: [string, string][],
  t: Translate,
): DefaultTheme.SidebarItem[] {
  const item = ([text, path]: [string, string]) => ({ text, link: `${base}/${path}` })
  return [
    { text: title, items: guide.map(item) },
    { text: t('API reference', 'مرجع API'), items: api.map(item) },
  ]
}

function layerSidebars(prefix: string, fa: boolean): DefaultTheme.Sidebar {
  const t = translator(fa)
  const start = t('Getting started', 'شروع')
  return {
    [`${prefix}/core/`]: layerSidebar(
      t('Core', 'هسته'),
      `${prefix}/core`,
      [
        [t('Overview', 'معرفی'), ''],
        ['PlainDate', 'plain-date'],
      ],
      [
        ['PickerCore', 'picker-core'],
        ['DateFieldCore', 'date-field-core'],
        [t('PlainDate & utilities', 'PlainDate و ابزارها'), 'utilities'],
      ],
      t,
    ),
    [`${prefix}/vanilla/`]: layerSidebar(
      'Vanilla',
      `${prefix}/vanilla`,
      [[start, '']],
      [
        ['createDatePicker', 'api'],
        ['createDateField', 'date-field'],
      ],
      t,
    ),
    [`${prefix}/web-component/`]: layerSidebar(
      'Web Component',
      `${prefix}/web-component`,
      [[start, '']],
      [['Custom Elements', 'api']],
      t,
    ),
    [`${prefix}/react/`]: layerSidebar(
      'React',
      `${prefix}/react`,
      [[start, '']],
      [[t('Components & hooks', 'کامپوننت‌ها و هوک‌ها'), 'api']],
      t,
    ),
    [`${prefix}/vue/`]: layerSidebar(
      'Vue',
      `${prefix}/vue`,
      [[start, '']],
      [[t('Components & composables', 'کامپوننت‌ها و composableها'), 'api']],
      t,
    ),
  }
}

function nav(prefix: string, fa: boolean): DefaultTheme.NavItem[] {
  const t = translator(fa)
  const root = `^/${prefix.replace(/^\//, '')}${prefix ? '/' : ''}`
  const layer = (text: string, dir: string) => ({
    text,
    link: `${prefix}/${dir}/`,
    activeMatch: `${root}${dir}/`,
  })
  return [
    {
      text: t('Guide', 'راهنما'),
      link: `${prefix}/guide/getting-started`,
      activeMatch: `${root}(guide|api)/`,
    },
    {
      text: t('Layers', 'لایه‌ها'),
      activeMatch: `${root}(core|vanilla|web-component|react|vue)/`,
      items: [
        layer(t('Core', 'هسته'), 'core'),
        layer('Vanilla', 'vanilla'),
        layer('Web Component', 'web-component'),
        layer('React', 'react'),
        layer('Vue', 'vue'),
      ],
    },
    { text: t('Playground', 'پلی‌گراند'), link: `${prefix}/playground` },
  ]
}

export default defineConfig({
  title: 'Khorshid',
  description: 'Headless, zero-dependency date picker with first-class Jalali, Gregorian and Hijri calendars.',
  base,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&family=Lalezar&family=Young+Serif&display=swap',
      },
    ],
    ['meta', { name: 'theme-color', content: '#f5b400' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Khorshid · خورشید' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Headless date picker with first-class Jalali (Persian), Gregorian and Hijri calendars.',
      },
    ],
  ],

  vue: {
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith('khorshid-') },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: github }],
    outline: { level: [2, 3] },
    search: {
      provider: 'local',
      options: {
        locales: {
          fa: {
            translations: {
              button: { buttonText: 'جستجو', buttonAriaLabel: 'جستجو' },
              modal: {
                displayDetails: 'نمایش جزئیات',
                resetButtonTitle: 'پاک کردن',
                backButtonTitle: 'بستن',
                noResultsText: 'نتیجه‌ای پیدا نشد',
                footer: {
                  selectText: 'انتخاب',
                  navigateText: 'جابه‌جایی',
                  closeText: 'بستن',
                },
              },
            },
          },
        },
      },
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      dir: 'ltr',
      themeConfig: {
        nav: nav('', false),
        sidebar: {
          '/guide/': guideSidebar('', false),
          '/api/': guideSidebar('', false),
          ...layerSidebars('', false),
        },
        editLink: {
          pattern: `${github}/edit/main/docs/:path`,
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Khorshid · خورشید',
        },
      },
    },

    fa: {
      label: 'فارسی',
      lang: 'fa-IR',
      dir: 'rtl',
      link: '/fa/',
      title: 'خورشید',
      description: 'دیت‌پیکر headless و بدون وابستگی با تقویم جلالی، میلادی و قمری.',
      themeConfig: {
        nav: nav('/fa', true),
        sidebar: {
          '/fa/guide/': guideSidebar('/fa', true),
          '/fa/api/': guideSidebar('/fa', true),
          ...layerSidebars('/fa', true),
        },
        editLink: {
          pattern: `${github}/edit/main/docs/:path`,
          text: 'ویرایش این صفحه در گیت‌هاب',
        },
        docFooter: { prev: 'قبلی', next: 'بعدی' },
        outline: { label: 'در این صفحه', level: [2, 3] },
        lastUpdated: { text: 'آخرین به‌روزرسانی' },
        returnToTopLabel: 'بازگشت به بالا',
        sidebarMenuLabel: 'منو',
        darkModeSwitchLabel: 'حالت تیره',
        lightModeSwitchTitle: 'رفتن به حالت روشن',
        darkModeSwitchTitle: 'رفتن به حالت تیره',
        langMenuLabel: 'تغییر زبان',
        skipToContentLabel: 'رفتن به محتوا',
        notFound: {
          title: 'صفحه پیدا نشد',
          quote: 'این آدرس به هیچ صفحه‌ای نمی‌رسد. شاید جابه‌جا شده یا نامش عوض شده باشد.',
          linkLabel: 'رفتن به صفحهٔ اصلی',
          linkText: 'صفحهٔ اصلی',
        },
        footer: {
          message: 'منتشرشده با مجوز MIT.',
          copyright: 'خورشید · Khorshid',
        },
      },
    },
  },
})
