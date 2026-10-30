# Holidays

The holidays plugin, `khorshid/holidays`, marks public holidays on the calendar. It loads holidays for whatever range is on screen and fetches more as the user navigates. Use it when users pick dates around days off, such as deliveries, appointments or leave requests.

## Quick start

```js
import { createDatePicker } from 'khorshid'
import { holidaysPlugin } from 'khorshid/holidays'

createDatePicker('#date', {
  locale: 'fa-IR',
  plugins: [holidaysPlugin({ country: 'IR' })], // Iranian (Jalali) holidays
})
```

Holiday days get a dot and a red-tinted number. The holiday name is the day's tooltip and is read out by screen readers. The plugin works the same with `createPicker` from `khorshid/headless`, where the holidays arrive as [day marks](./plugins#day-marks) for your own renderer.

`country` picks a built-in provider: `'IR'` (the default) uses the Iran provider and any other code uses the global Nager.Date provider. Pass `provider` to choose one explicitly.

To work without a network, add `offline: true` and Iran's holidays are computed in the browser:

```js
holidaysPlugin({ country: 'IR', offline: true })
```

## Options

| Option | Default | Description |
|---|---|---|
| `provider` | derived from `country` | The data source. See [Providers](#providers). |
| `country` | `'IR'` | Selects and configures a built-in provider. |
| `offline` | `false` | Compute holidays locally with no network. Iran only; other countries throw. Ignored when `provider` is given. |
| `markType` | `'holiday'` | The mark `type`, which becomes the `.sdp__day--mark-<type>` class. |
| `includeObservances` | `false` | Also mark observances that are not days off. |
| `fetch` | global `fetch` | A custom fetch, for SSR, authentication or tests. |
| `onLoad(holidays)` | — | Called after each batch loads. |
| `onError(err)` | `console.error` | Called when loading fails. |
| `name` | `'holidays'` | The plugin name. Change it to run several holiday layers at once. |

## Reading the loaded holidays

`picker.core.getPlugin('holidays')` returns the plugin with a small read API over the loaded data:

```js
const holidays = picker.core.getPlugin('holidays')

holidays.get('2026-03-21')    // Holiday | null
holidays.isHoliday(dateInput) // boolean
holidays.all()                // Holiday[], sorted by date
holidays.reload()             // drop the cache and fetch the visible range again
```

A `Holiday` is always keyed by its Gregorian ISO date:

```ts
interface Holiday {
  iso: string          // 'YYYY-MM-DD' (Gregorian), the key
  name: string         // localized where the provider offers it
  englishName?: string
  official: boolean    // true = a public day off
  raw?: unknown        // the provider's raw record
}
```

## Providers

A provider turns its backend's data into `Holiday[]` keyed by Gregorian ISO. The plugin caches per Gregorian year and calls the provider once for each batch of years it has not loaded yet.

```ts
interface HolidayProvider {
  readonly id: string
  load(
    years: number[],
    ctx: { fetch: typeof fetch; signal?: AbortSignal },
  ): Promise<Holiday[]>
}
```

### Iran (online)

Iranian holidays are defined on the Jalali calendar, so the provider maps each requested Gregorian year to the Jalali months it overlaps, fetches those months, and returns Gregorian-keyed holidays. The transport is fully configurable:

```js
import { holidaysPlugin, iranProvider } from 'khorshid/holidays'

holidaysPlugin({ provider: iranProvider() })

// Point it at another source: a different API, a static host, an internal service.
iranProvider({
  baseUrl: 'https://my.host',
  endpoint: (jYear, jMonth) => `https://my.host/holidays?y=${jYear}&m=${jMonth}`,
  normalize: (payload, jYear, jMonth) => [/* Holiday[] */],
  includeReligious: true,
})
```

::: tip
The default source is [holidayapi.ir](https://holidayapi.ir). Override `endpoint` and `normalize` for any other Iranian source.
:::

### Offline (no network)

`iranOfflineProvider()` computes Iran's official public holidays locally, with no API, no key and no `fetch`. It works offline, in tests, and on servers without network access. `holidaysPlugin({ offline: true })` is shorthand for it.

```js
import { holidaysPlugin, iranOfflineProvider } from 'khorshid/holidays'

holidaysPlugin({ offline: true })
// same as:
holidaysPlugin({ provider: iranOfflineProvider() })
```

- **Solar holidays** (Nowruz on 1–4 Farvardin, 12 and 13 Farvardin, 14 and 15 Khordad, 22 Bahman, 29 Esfand) come from the Jalali calendar and are exact.
- **Religious holidays** (Tasua, Ashura, Arbaeen, Eid al-Fitr, Eid al-Adha, Ghadir, …) come from the lunar [Hijri calendar](./calendars-and-locales#the-hijri-calendar), Umm al-Qura by default.
- Two holidays on the same day are merged into one record with both names.
- `includeObservances: true` on the provider also returns a few well-known observances that are not days off (`official: false`), such as Yalda night and Persian Gulf Day. The plugin's own `includeObservances` still decides whether they are marked.

::: warning Lunar dates can be a day off
Iran starts lunar months on a local moon sighting, so its official calendar can differ from Umm al-Qura by one day. When a religious holiday lands on the wrong day, give the provider an adjusted Hijri calendar:

```js
import { createHijriCalendar } from 'khorshid'
import { holidaysPlugin, iranOfflineProvider } from 'khorshid/holidays'

const iranHijri = createHijriCalendar({
  adjustments: { '1447-09': 29 }, // Ramadan 1447 has 29 days in Iran, so Eid al-Fitr is a day earlier
})

holidaysPlugin({ provider: iranOfflineProvider({ hijri: iranHijri }) })
```

The provider uses this calendar directly; it does not need to be registered. If you also call `registerCalendar(iranHijri)`, Hijri pickers use it too. See [Umm al-Qura, civil, and local adjustments](./calendars-and-locales#umm-al-qura-civil-and-local-adjustments).
:::

The online provider reflects whatever its source publishes, including one-off holidays announced during the year. The offline provider is deterministic and instant. Choose per app.

### Global (Nager.Date)

```js
import { holidaysPlugin, nagerProvider } from 'khorshid/holidays'

holidaysPlugin({ provider: nagerProvider({ country: 'DE' }) })
```

This provider uses the free [Nager.Date](https://date.nager.at) API, which covers more than 100 countries and needs no key.

::: warning
Nager.Date does not cover Iran (`IR`) or Afghanistan (`AF`). For Iran use `iranProvider` or `iranOfflineProvider`; otherwise write a [custom provider](#custom-provider).
:::

### Custom provider

Any object that matches `HolidayProvider` works: call your own API, read a static table, and so on.

```js
const myProvider = {
  id: 'my-company',
  async load(years, { fetch, signal }) {
    const res = await fetch(`/api/holidays?years=${years.join(',')}`, { signal })
    const data = await res.json()
    return data.map((h) => ({ iso: h.date, name: h.title, official: true, raw: h }))
  },
}

holidaysPlugin({ provider: myProvider })
```

## Caching and lifecycle

- **Lazy and cached.** Only the Gregorian years covered by the visible panes are fetched, each once. Navigation fills in missing years; loaded years are never fetched again. `reload()` clears the cache and fetches again.
- **Safe with async.** In-flight requests are aborted on `reload()` and on `destroy()`. Failures go to `onError` and never throw into the picker.
- **Independent of the calendar.** Holidays are keyed by Gregorian ISO, so switching between Jalali and Gregorian keeps every mark in place.

## Theming

One token sets the holiday color, used for the dot and the day-number tint:

```css
.sdp { --sdp-holiday: #dc2626; } /* dark default: #f87171 */
```

**Related:** [Plugins](./plugins) · [Calendars & Locales](./calendars-and-locales) · [Theming](./theming)
