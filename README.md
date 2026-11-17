# GEN-I

React + Vite implementation of the GEN-I Figma design.

```
npm install
npm run dev        # http://localhost:5173
npm run assets     # run once: downloads Figma images/icons into public/assets (links expire after 7 days)
npm run build
```

## Structure

```
src/
  assets/          assets.js – every Figma image/icon (single source of truth)
  components/
    ui/            reusable primitives: Button, Icon, Badge, Avatar, Check, ScrollRow, Glyphs (+ ui.css)
    layout/        Layout, Header (sticky), Footer
    sections/      one component + stylesheet per landing-page section (+ its own .css)
  pages/           route-level screens (LandingPage, NotFoundPage)
  hooks/           shared hooks (useDragScroll)
  styles/          tokens.css (colours, fonts), base.css, typography.css, utilities.css
  App.jsx          routes
  main.jsx         entry
```

- Import with the `@/` alias, e.g. `import { Button } from '@/components/ui/Button'`.
- New screen: add a file in `pages/`, then a `<Route>` in `App.jsx`.
- Colours / fonts live in `styles/tokens.css` only.

## Storefront

- `/shop` provides the searchable, filterable product catalog.
- `/shop/:productId` shows variant, price freshness and branch details.
- `/bag` opens the shopping bag empty state; adding products to a bag is not yet supported.
- `src/data/products.js` is a local demonstration catalog. Its prices, stock counts and store details are sample data and are not connected to a live inventory service.
