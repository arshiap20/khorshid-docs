# Keyboard & Accessibility

Every Khorshid picker can be operated from the keyboard and is announced correctly by screen readers, with no configuration. This page lists the keys, the ARIA structure, and how right-to-left locales change the behavior.

## Try it

Click a day, then use the arrow keys. In RTL locales `←` and `→` are swapped to follow the reading direction:

<Demo inline :controls="['locale']" caption="Click a day, then navigate with the keyboard. Switch to a Gregorian locale to feel the LTR arrow behavior." />

## Days view

| Key | Action |
|---|---|
| `←` / `→` | Previous / next day, swapped in RTL locales |
| `↑` / `↓` | Previous / next week |
| `PageUp` / `PageDown` | Previous / next month |
| `Shift+PageUp` / `Shift+PageDown` | Previous / next year |
| `Home` / `End` | Start / end of the week |
| `Enter` / `Space` | Select the focused day |
| `Escape` | Close the picker |

## Months and years views

The arrow keys move by 1 or by 3 (the grid is 3 columns wide), skipping disabled cells, and `Enter` selects. Open these views by clicking the month or year in the header.

Keys pressed in the header, the footer, the [shortcut](./shortcuts-and-limits) row or the time row keep their normal behavior; only the grid handles navigation keys. The vanilla, React and Vue pickers share one keyboard implementation, so they behave identically.

## Screen readers and focus

- The popup is a `role="dialog"` with `aria-modal="false"`; the bottom sheet and the modal set `aria-modal="true"` and keep focus inside while open.
- Closing an overlay returns focus to the field that opened it.
- The day grid uses ARIA grid roles with a roving tabindex: the grid is one tab stop, and the arrow keys move focus inside it. The months and years views work the same way.
- Weekday headers are `role="columnheader"` cells inside the grid, so each day is announced with its column.
- Each day's accessible name is the full localized date. It also includes the [secondary calendar](./secondary-calendar) date, the reason a day is [disabled](./shortcuts-and-limits#disabled-dates-with-a-reason), and [plugin](./plugins) mark labels such as holiday names.
- Month and year changes are announced through a visually hidden `aria-live` region.
- The navigation buttons have localized labels: previous/next month in the days view, previous/next year in the months and years views.
- Animations follow `prefers-reduced-motion`. Set `animate: false` to turn them off for everyone.

The [date field](./date-field) has its own keyboard map, documented on its page.

## RTL

Direction comes from the locale; there is no separate flag. A `fa-IR` picker lays out right to left, swaps the horizontal arrow keys and orders range edges accordingly; an `en-US-gregorian` picker is left to right. Switching the locale at runtime updates all of this immediately.

The full DOM structure, ARIA roles and keyboard map are specified in the package's [`CONTRACT.md`](https://github.com/khorshid/khorshid/blob/main/packages/dom/CONTRACT.md).

**Related:** [Theming](./theming) · [Date Field](./date-field) · [Calendars & Locales](./calendars-and-locales)
