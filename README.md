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

## Authentication

- Routes: `/login` and `/register` (full-screen split layout, no site header/footer). Signed-in visitors are redirected away from both.
- **Local mode (default):** while `VITE_API_URL` is empty, any valid credentials (and the Facebook / Apple / Google buttons) create a session stored in this browser, so the whole UI works without a backend. This is NOT real authentication.
- **Real backend:** copy `.env.example` to `.env`, set `VITE_API_URL`, restart `npm run dev`. `src/services/authService.js` documents the endpoints it expects (`/auth/login`, `/auth/register`, `/auth/:provider`, `/auth/change-password`, `DELETE /account`).
- `src/context/AuthContext.jsx` stores the session (`localStorage` when "Remember me" is ticked, `sessionStorage` otherwise) and exposes `useAuth()` -> `{ user, session, isAuthenticated, signIn, signOut }`.

## Account area

- Routes (signed-in only, otherwise redirected to `/login`): `/account/orders`, `/orders/:orderId`, `/orders/:orderId/return`, `/repairs`, `/trade-ins`, `/saved-items`, `/reservations`, `/addresses`, `/payment-methods`, `/invoices`, `/profile`. `/account` redirects to `/account/orders`.
- **Orders, Repairs and Trade-ins** (`pages/account/OrdersPage.jsx`, `OrderDetailsPage.jsx`, `RepairsPage.jsx`, `TradeInsPage.jsx`): each has status filters and shows sample data from `useAccount()`. "Track order" on the first order opens `/account/orders/GN-260142` (order tracking, items, delivery and payment summary). Their styles are in `components/account/records.css`. - **Return flow (sample data):** order `#GN-259604` is Delivered. Orders → View details (`/account/orders/GN-259604`, all steps complete, "Start a return") → `StartReturnPage.jsx` (`/account/orders/GN-259604/return`: pick items, a reason and a refund / collection method) → submit. `submitReturn()` in `AccountContext` marks the order "Return requested" and moves it to the Returns filter; the page redirects away if the order isn't returnable or already has a request. Nothing is persisted, so a refresh resets it.
- Buttons that need a backend (approve / decline a repair quote, view invoice, reschedule, cancel order, buy again) are visual only for now.
- Data is SAMPLE data from `src/data/account.js`, held in memory by `src/context/AccountContext.jsx` (resets on refresh). Replace the seeds and actions in that context with API calls; the pages only use `useAccount()`.
- Cards: only brand, last 4 digits, expiry and holder are kept. The full number and CVV are discarded on submit. For real payments, tokenize with your payment provider's SDK and never send raw card data to your own server.
- Invoices: PDFs are generated in the browser (`src/utils/invoicePdf.js`). Use `invoice.pdfUrl` from the API when it exists.
- The map in the "Add a new address" popup is a placeholder illustration (`AddressModal.jsx`, `MapBanner`).
