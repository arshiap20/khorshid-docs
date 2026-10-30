# khorshid-docs

The docs site for [Khorshid](https://www.npmjs.com/package/khorshid), the Jalali, Gregorian and Hijri date picker. The library itself lives in its own repo. This one installs the published `@khorshid-js/*` packages from npm, the same way any app would.

```bash
npm install
npm run docs:dev      # VitePress docs, English + Persian
npm run docs:build
npm run docs:preview
```

## Layout

```
docs/         VitePress site. English at the root, Persian under fa/ (RTL).
              Live examples mount the real @khorshid-js/dom and @khorshid-js/element.
```

## Updating Khorshid

Bump the `@khorshid-js/*` versions in `package.json`, run `npm install`, then run `npm run docs:build`.
