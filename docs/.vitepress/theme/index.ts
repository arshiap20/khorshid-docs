import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import '@khorshid-js/dom/styles.css'
import './custom.css'

import Demo from './components/Demo.vue'
import Playground from './components/Playground.vue'
import HomeHero from './components/HomeHero.vue'
import HomeCalendars from './components/HomeCalendars.vue'
import HomeFacts from './components/HomeFacts.vue'
import ElementDemo from './components/ElementDemo.vue'
import FieldDemo from './components/FieldDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('Playground', Playground)
    app.component('HomeHero', HomeHero)
    app.component('HomeCalendars', HomeCalendars)
    app.component('HomeFacts', HomeFacts)
    app.component('ElementDemo', ElementDemo)
    app.component('FieldDemo', FieldDemo)
  },
} satisfies Theme
