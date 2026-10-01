# store-page

Live URL: **<https://appscrip-task-mayur-kamble.netlify.app/>**

## Overview

store-page is a frontend e-commerce product listing page built with Next.js. It displays a catalog of products fetched from the DummyJSON mock API, allowing users to browse, filter, sort, and paginate through items. The page features a store header with navigation, a hero section, a filterable product grid, and a detailed footer.

The intended user is a shopper exploring an online catalog. The interface supports selecting products by category, brand, tags, and minimum rating, reordering results by several sort criteria, and stepping through pages of results without a full page reload.

## Features

- **Product listing** – Displays a responsive grid of product cards with images, titles, prices, and ratings.
- **Category filtering** – Multi-select checkbox filter for product categories.
- **Brand filtering** – Multi-select checkbox filter for product brands.
- **Tag filtering** – Multi-select checkbox filter for product tags (matches if any selected tag is present).
- **Rating filter** – Multi-select "and up" rating filter (1 through 5 stars, e.g., selecting 4★ shows 4★ and 5★).
- **Multi-select filters** – All four filter types support selecting multiple values at once.
- **Clear filters** – One-click reset of all selected filters with disabled state when no filters are active.
- **Sorting** – Sort by Recommended, Newest, Popular (rating), Lowest price, or Highest price.
- **Pagination** – 15 products per page, with Previous/Next buttons and numbered page buttons.
- **Hide/show filters** – Toggle button in the toolbar to collapse and expand the filter sidebar.
- **Wishlist toggle** – Per-product heart button to add/remove from a client-side wishlist.
- **Loading states** – Spinner with "Updating products…" indicator during page transitions.
- **Error state** – Graceful message when the product API request fails.
- **Empty state** – Clear message when no products match the active filters.
- **Responsive design** – Adapted layouts for desktop, tablet, and mobile breakpoints.
- **Server-side rendering** – Initial page load and product data fetching happen on the server via Next.js App Router.
- **SEO metadata** – Page title and meta description set through Next.js metadata API.
- **Structured data** – Server-rendered JSON-LD with `CollectionPage` containing an `ItemList` of `Product` entries.
- **Lazy-loaded images** – Product thumbnails use native `loading="lazy"`.
- **Breadcrumb navigation** – Breadcrumb in the header on smaller screens.
- **Mobile menu** – Collapsible hamburger menu for navigation on small devices.
- **Footer accordions** – Collapsible footer link sections on mobile.
- **Newsletter form** – Email subscription input in the footer.
- **Dark mode** – System preference (`prefers-color-scheme`) support for body and global styles.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack React framework providing server rendering, routing, metadata API, and image/font optimization. |
| React 19 | UI library for building component-based interfaces and managing client-side state. |
| CSS Modules | Scoped, component-local styling via `*.module.css` files. |
| Next Font (Geist) | Optimized font loading for the Geist Sans and Geist Mono typefaces. |
| DummyJSON API | Mock product data source providing product catalog, categories, brands, tags, ratings, and images. |
| ESLint (eslint-config-next) | Linting configuration based on Next.js recommended rules. |

## Project Architecture

```text
store-page/
├── app/
│   ├── layout.js          # Root layout, fonts, global metadata
│   ├── page.js            # Home page (Server Component), data fetching, structured data
│   ├── globals.css        # Global base styles and dark mode variables
│   └── page.module.css    # Hero section styles
├── components/
│   ├── Header.js          # Store header, navigation, mobile menu (Client Component)
│   ├── Header.module.css
│   ├── Footer.js          # Footer with newsletter, links, accordions (Client Component)
│   ├── Footer.module.css
│   ├── ProductListing.js  # Filters, sorting, grid, pagination (Client Component)
│   └── ProductListing.module.css
├── lib/
│   └── products.js        # Product API fetching helper and pagination constant
├── public/                # Static assets (Next.js/Vercel logos)
├── package.json
├── next.config.mjs
├── jsconfig.json          # Path alias "@/*" → project root
└── eslint.config.mjs
```

**Folder responsibilities:**

- **`app/`** – Next.js App Router entry point. The layout defines global HTML structure and metadata. The page fetches product data on the server, slices the current page, renders JSON-LD structured data, and composes Header / hero / ProductListing / Footer.
- **`components/`** – Reusable UI pieces. All three components are Client Components (`"use client"`) because they manage local state (menu open/closed, filters, sort, wishlist, pagination, accordions) and respond to user interactions.
- **`lib/products.js`** – Single data-fetching module. Exports `getCompleteProductDataset()` (fetches all products from DummyJSON with an 8-second timeout and 1-hour revalidation) and the `PRODUCTS_PER_PAGE` constant (15).

## How It Works

```text
DummyJSON Products API
          ↓ (server fetch, revalidate 3600s)
  Complete Product Dataset
          ↓ (passed as prop to client)
 Client-side Filter Selection
  (category, brand, tags, rating)
          ↓
    Filtered Products
          ↓
         Sort
  (recommended / newest / popular / price)
          ↓
       Pagination
  (slice 15 products per page)
          ↓
     Product Grid Render
```

**Main interactions in plain English:**

1. On the first load, Next.js runs `app/page.js` on the server. It calls `getCompleteProductDataset()` to fetch every product from DummyJSON in one request, then calculates the total page count. If the requested page number is out of range it redirects to the last valid page.
2. The server renders the page shell (Header, hero, structured data script, Footer) plus the initial `ProductListing` with all products passed as props.
3. Once in the browser, `ProductListing` becomes interactive. Clicking a filter checkbox, changing sort, or toggling wishlist all update React state immediately – no network round-trip.
4. When filters change, the current page resets to 1 and the URL `?page=` parameter is cleared via `history.replaceState`.
5. When the user clicks a pagination button, the page number updates in state, the catalog scrolls smoothly back to the top, and the URL is updated with `history.pushState` so the browser back/forward buttons work. A 220ms loading indicator is shown.
6. A `popstate` event listener keeps the React page state in sync with manual browser navigation.

## Filtering

**Available filter types:**

- **Category** – matches exact product `category` field.
- **Brand** – matches exact product `brand` field.
- **Tags** – matches if the product has *at least one* of the selected tags (OR logic within the tag group).
- **Rating** – "and up" filter: products must have a rating ≥ the lowest selected value (e.g., picking both 3★ and 4★ still shows 3★ and up, effectively the minimum selected).

**Multi-select behavior:**

Each filter group uses checkboxes. Within a group, selecting multiple values uses OR logic (a product matches if it has *any* of the chosen values for category/brand, *contains any* selected tag, or meets *any* selected rating threshold). Between groups, logic is AND (a product must satisfy category AND brand AND tags AND rating criteria that have active selections).

**How filters interact with each other:**

Filter options are derived dynamically from the *full* unfiltered catalog (not the current results), so narrowing one group never hides options in another.

**Clear Filters:**

The button at the top of the sidebar resets `selectedFilters` to an empty object, resets the current page to 1, and updates the URL. The button is disabled and visually muted when no filters are active.

**Pagination response to filtering:**

When any filter is added or removed, `currentPage` is immediately set back to 1 and the URL is rewritten to remove `?page=`, preventing empty pages when the result count shrinks.

## Pagination

**How it works:**

The full (filtered, sorted) product array is sliced client-side into chunks of 15 (`PRODUCTS_PER_PAGE`). Changing the page advances or rewinds the slice start index.

**How page changes are handled:**

- Clicking a numbered or Previous/Next button calls `changePage`, which: validates bounds, sets `isUpdating: true` (shows the loading indicator), scrolls the catalog section smoothly to the top, sets the new `currentPage` in state, and calls `updatePageUrl`.
- Page 1 is treated as the default and written to the URL without the `page` query parameter; page 2+ becomes `/?page=N`.

**Navigation does NOT cause a full page reload.** All pagination is client-side state management with the HTML5 History API (`pushState`/`replaceState` + `popstate` listener) so URLs remain shareable and browser navigation works correctly. A fresh direct visit to a URL with `?page=N` is handled server-side in `page.js`.

**Total page count calculation:** `Math.ceil(filteredProducts.length / 15)`, recalculated whenever filters change. The pagination component renders nothing when `pageCount <= 1`.

**Filtering effect on pagination:** Any filter change (including Clear Filters) resets the active page to 1 and recalculates `pageCount`. If the new `pageCount` is 0, the product grid shows the empty-state message instead.

## Rendering / SSR

**Server-rendered parts:**

- `app/layout.js` and `app/page.js` run on the server (they have no `"use client"` directive).
- The initial `getCompleteProductDataset()` fetch runs server-side.
- Page metadata (`title`, `description`) is injected into `<head>` via the Next.js metadata API on the server.
- JSON-LD structured data is injected as a `<script>` tag during server render.
- All three components (`Header`, `ProductListing`, `Footer`) receive their initial props from the server render so the first paint is fully populated HTML.

**Client-rendered parts (Client Components):**

- `Header.js` (`"use client"`) – manages `isMenuOpen` state for the mobile hamburger menu.
- `Footer.js` (`"use client"`) – manages per-accordion `isOpen` state on mobile.
- `ProductListing.js` (`"use client"`) – manages `currentPage`, `sidebarVisible`, `sortBy`, `wishlist`, `selectedFilters`, `isUpdating`, and the `popstate` listener, plus all user interactions.

**Why these are Client Components:**

The `"use client"` directive is required because each component:
1. Calls React hooks (`useState`, `useMemo`, `useCallback`, `useEffect`, `useRef`, `memo`).
2. Responds to DOM events (clicks, input changes, form submission, history changes).
3. Uses browser-only APIs such as `window.history`, `window.location`, `scrollIntoView`, and `setTimeout`.

**Next.js rendering capabilities used:**

- App Router with Server Components by default for the page entry.
- `next: { revalidate: 3600 }` on the `fetch` call enables ISR-style caching of the API response.
- Streaming of Client Component hydration after the initial server HTML.

## Responsive Design

**Desktop (≥ 901px):**
- Product catalog grid: 3 columns (4 columns when the sidebar is hidden).
- Sidebar: 220px fixed column on the left.
- Header: full navigation links row visible below the top bar; breadcrumb hidden; hamburger hidden.
- Footer: 2-column top section (newsletter + contact/currency) and 3-column bottom links; accordions always expanded.

**Tablet (601px – 900px):**
- Grid: 2 product columns regardless of sidebar state.
- Sidebar: 190px, reduced gap.
- Header: nav links row still present; hamburger still hidden.
- Footer: switches to single-column contact/currency inside the right half.

**Mobile (≤ 600px):**
- Product grid: full-width single column layout for the catalog; sidebar sits above the grid in 2-column filter cards (Clear Filters spans both columns).
- Product count label and "SORT BY" label are hidden; sort dropdown is narrower.
- Header: hamburger menu replaces nav links row; breadcrumb appears in its place; language selector and profile icon hidden in the top row; store name shifts left on very small screens.
- Footer: sections become stacked and collapsible (accordion buttons) on a per-group basis. Newsletter form uses a slimmer layout; payment methods shown as a 3-column grid.
- Additional tweaks at 425px and 375px reduce padding, font sizes, and icon sizes further.

## SEO

**Page title:** `"ShopStore | Discover Something New"` (from `app/layout.js` metadata).

**Meta description:** `"Explore the latest collections at ShopStore."` (same source).

**Heading structure:**
- Single `<h1>` in the hero: *"Discover our product"*.
- Product cards use `<h2>` for product titles (semantic per-card heading).
- Footer sections use `<h2>` for each column title.

**Structured data / schema (JSON-LD, server-rendered):**
- Top-level type: `CollectionPage` with `name`.
- `mainEntity`: `ItemList` with `numberOfItems` (total catalog size, not filtered count).
- `itemListElement`: one `ListItem` per product on the current page with `position` (1-based, accounting for page offset), each wrapping a `Product` that includes `name`, and conditionally `image`, `category`, and `brand` (only when those fields exist on the API response).
- Ratings and offer/pricing are intentionally omitted from schema because the implementation does not populate them with enough fields to be schema-valid.

**Image alt text:** `<img alt>` is set to `"Title by Brand"` if the product has a brand, otherwise just the product title.

**Image handling:** Product thumbnails come directly from DummyJSON's CDN URLs via the `thumbnail` field. Images use native `loading="lazy"` and are rendered at their natural aspect ratio inside the product card's 0.78 aspect-ratio container.

**Other relevant metadata:**
- `<html lang="en">` set in the root layout.
- `aria-labelledby`, `aria-label`, `aria-current`, `aria-expanded`, `aria-pressed`, and `role` attributes are used on interactive elements throughout (see Accessibility).

## Performance Considerations

- **Server rendering + ISR-style fetch caching:** The product data is fetched server-side with `next: { revalidate: 3600 }`, allowing Next.js to reuse the cached result for up to an hour across requests instead of hitting DummyJSON on every visit.
- **Single full-catalog fetch over page-by-page API calls:** All 100+ products are fetched once (or served from cache) and filtering/sorting/pagination are computed in-memory on the client. This trades a larger first payload for zero round-trips during browsing, which works well with DummyJSON's small catalog size.
- **AbortSignal.timeout(8000):** The initial fetch has an 8-second timeout to avoid hanging requests.
- **React `memo` on list-level components:** `ProductToolbar`, `FilterSidebar`, `ProductGrid`, and `Pagination` are wrapped in `memo` to skip re-renders when their props don't change.
- **`useMemo` for derived lists:** `filteredProducts`, `sortedProducts`, and `filters` are memoized so they are only recomputed when their dependencies (full products, filter state, sort) actually change.
- **Native lazy-loading images:** Each product thumbnail uses `loading="lazy"` to defer offscreen image requests.
- **Minimal dependencies:** Runtime dependency set is exactly Next.js + React + React-DOM (three packages); no UI library, no state library, no utility library.
- **Smooth scroll is opt-in and only on page change,** with `prefers-reduced-motion` respected on the loading spinner (animation disabled in reduced-motion mode).
- **CSS Modules keep styles scoped and tree-shakeable;** no global CSS reset overrides framework behavior unnecessarily.
- **`clamp()`-based fluid typography** on the hero and toolbar avoids per-breakpoint redefinitions where possible.

## Accessibility

- **Semantic HTML:** `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`, `<aside>`, `<details>/<summary>`, `<ol>/<li>` for breadcrumbs. Each product card is its own `<article>`.
- **Visible focus styles:** All interactive elements (buttons, links, selects, summary, checkboxes) have explicit `:focus-visible` 2px outline rules with offset, covering both light and dark backgrounds.
- **Labels:**
  - Sort select is wrapped in a `<label>` with visible "SORT BY" text.
  - Newsletter email input has a visually-hidden `<label htmlFor>`.
  - Language selectors use `aria-label="Language"` with a visually-hidden span fallback.
  - Each filter checkbox is wrapped in a `<label>` whose text shows the option (or formatted star rating).
- **Proper button semantics:** Every clickable control is a real `<button type="button">` (never divs), including hamburger, wishlist, sidebar toggle, page links, accordion headers, and icon-only buttons.
- **Keyboard accessibility:** All interactive elements are native controls and therefore tabbable by default; `:focus-visible` outline provides visible indication. Details/summary and select have their built-in keyboard behavior.
- **ARIA:**
  - `aria-expanded` on sidebar toggle, mobile menu toggle, and footer accordion buttons (matching state).
  - `aria-controls` on menu and accordion buttons pointing to the controlled panel id.
  - `aria-pressed` on each wishlist heart button to indicate toggle state.
  - `aria-current="page"` on the active pagination button and breadcrumb.
  - `aria-label` on every icon-only button (search, wishlist, cart, profile, hamburger/close, wishlist per-card).
  - `aria-busy={isUpdating}` on the results container while pagination is transitioning.
  - `role="status"` on the updating indicator.
  - Error empty state uses `role="alert"` when the cause is a load failure.
  - `aria-hidden="true"` on all purely decorative inline SVG icons.
- **Alt text:** Product images include title + brand; hero SVG icon is marked decorative.
- **Heading hierarchy:** One h1 on the page; section and card headings use h2. Footer sections also use h2.
- **Mobile menu:** Uses `role="dialog"`, `aria-modal="true"`, `aria-label="Main menu"`, and `hidden={!isMenuOpen}` so it is removed from the a11y tree when closed.

## API / Data Source

**API:** DummyJSON Products API at `https://dummyjson.com/products`.

**Why it is used:** DummyJSON is a free, public mock API that provides realistic e-commerce product data. It is used as a stand-in catalog for this frontend demo so the page can showcase filtering, sorting, and pagination against a real-looking dataset without a custom backend.

**What data is retrieved (selected fields only, `limit=0` → all products):**

| Field | Purpose |
|---|---|
| `id` | Product key and React list `key` |
| `title` | Product name (card heading, alt text, schema) |
| `thumbnail` → mapped to `image` | Card image |
| `rating` | 1–5 decimal rating (filtering, sorting, display) |
| `price` | Dollar price (display, sorting) |
| `category` | Category filter option and schema |
| `brand` | Brand filter option, alt text, and schema |
| `tags` | Array of string tags for tag filtering |
| `meta.createdAt` → mapped to `createdAt` | ISO date used for Newest sort |

**How the application consumes the data:**

`lib/products.js` → `getCompleteProductDataset()` performs a single `fetch` to retrieve every product in one call, normalizes each record into a flat shape (mapping `thumbnail` → `image`, `meta.createdAt` → `createdAt`, defaulting tags to `[]` and missing fields to safe values), and returns `{ products, error }`. Errors (network failure, HTTP ≥ 400, timeout) are caught and surfaced as `error: true` with an empty product list.

The fetch includes `next: { revalidate: 3600 }` so Next.js caches the response for up to one hour on the server.

**API limitations:**

- DummyJSON is mock data – prices, stock levels, shipping, and tax information are not accurate for any real merchant.
- Product images are served from DummyJSON's CDN. URLs and filenames are out of the project's control, so SEO-friendly image renaming is not possible without replacing the image source entirely.
- No product detail endpoint is consumed; there is no product detail page.
- `meta.createdAt` values are used for "Newest" sort but are not user-visible.
- Ratings and offers are omitted from JSON-LD schema because the selected fields do not include enough structured information (review counts, price currency, availability) to produce valid Schema.org fields.

## Installation

### Prerequisites

- **Node.js** – Version compatible with Next.js 16 (Next.js 16 requires Node.js ≥ 18.18; 20.x LTS recommended). Can be determined from `package.json`: `next: 16.3.7`, `react: 19.2.8`, `react-dom: 19.2.8`.
- **npm** – Included with Node.js. The project ships with a `package-lock.json`, so npm is the expected package manager.

### Clone

```bash
git clone https://github.com/mayurk224/Appscrip-task-Mayur-Kamble.git
cd Appscrip-task-Mayur-Kamble
```

### Install dependencies

```bash
npm install
```

### Environment Variables

No environment variables are required. The project does not read any `process.env` values, and the DummyJSON API used is public and unauthenticated.

### Run locally

```bash
npm run dev
```

The development server starts at `http://localhost:3000` by default (Next.js default).

### Production build

```bash
npm run build
npm run start
```

`npm run build` produces a production build in `.next/`, and `npm run start` serves it with the Next.js production server on port 3000 by default.

Lint the project with:

```bash
npm run lint
```

## Deployment

Live URL: **<https://appscrip-task-mayur-kamble.netlify.app/>**

The application is deployed on Netlify. The project structure is a standard Next.js application and is compatible with any Node-based Next.js host (Netlify, Vercel, self-hosted Node server, etc.). No deployment configuration file (`netlify.toml`, `vercel.json`, Dockerfile, CI manifest) is present in the repository.

## Project Screenshots

Not found in the current implementation. No screenshot assets exist under `public/` or elsewhere in the repository. Screenshots of the desktop, tablet, and mobile layouts can be added here manually if desired.

## Assignment Context

This project was developed as a frontend assignment. The README above describes the features, architecture, and behavior of the implemented solution.

## Engineering Decisions

- **Next.js with App Router was chosen** to get server-side rendering of the initial page + metadata + structured data out of the box, path-based routing, and the Server/Client Component boundary. SSR ensures the page ships with real product HTML for crawlers and first paint.
- **Client Components for interactive parts only.** `Header`, `Footer`, and `ProductListing` are the only modules marked `"use client"` because they're the only ones that need React hooks and browser APIs. Data fetching and metadata stay on the server, keeping the initial HTML lean.
- **Full-catalog fetch + in-memory filtering/sorting/pagination** was preferred over per-page or per-filter API calls because:
  1. DummyJSON returns a modest catalog (~100 products) making a single `limit=0` request practical.
  2. Filter and sort responses are instant with no loading spinner beyond pagination.
  3. The URL state (`?page=`) remains shareable while all non-pagination interaction is purely local.
- **`history.pushState` + `popstate` listener** keeps pagination URLs in sync with the browser back/forward stack without full reloads, and `replaceState` is used when resetting the page via filters so filter changes don't pollute the history.
- **Unnecessary third-party packages were avoided on purpose.** No UI component library, no state management library, no utility library. The app is built with React hooks, memo, and native browser APIs to keep the dependency tree and bundle size minimal.
- **CSS Modules instead of Tailwind/CSS-in-JS** to avoid a build-time tooling dependency and keep styles tightly coupled to their components, with no runtime style injection overhead.
- **Memoization (`memo`, `useMemo`, `useCallback`) is applied to the heavy parts:** filtered/sorted product arrays, filter option list, and the four subcomponents that receive stable props most of the time.

## Known Limitations

- **Mock API data.** Prices, inventory, review counts, and image content are DummyJSON placeholders and not representative of a real store.
- **External image URLs.** Product thumbnails are served from DummyJSON's CDN; image filenames, caching, and SEO naming are outside the project's control. Replacing them with a local, SEO-named image set would require licensing or creating the image assets.
- **Schema/product detail gaps.** Ratings and offers are omitted from JSON-LD because the selected API fields alone don't satisfy all required/recommended Schema.org fields (aggregate rating count, currency, availability, etc.).
- **Wishlist is in-memory only.** Wishlist state lives in React state in `ProductListing`; it is not persisted to `localStorage`, a cookie, or a backend, so it resets on page reload.
- **Header navigation links (`Shop`, `Skills`, `Stories`, `About`, `Contact us`) are placeholders** (`href="#"`). There are no corresponding routes in the `app/` directory.
- **Footer links and newsletter form are UI-only.** Footer links use `href="#"`, the newsletter Subscribe button is `type="button"` with no submit handler, and no API route or backend service backs them.
- **Language selector is static.** The header and footer both offer ENG/FRA/DEU as a `<select>` but it has no effect; the page text is English-only and there is no i18n routing or dictionary.
- **Profile, cart, search, wishlist (header icons) are decorative.** They render icon buttons with ARIA labels but do not open any drawer, navigate, or trigger functionality beyond the per-product wishlist hearts.
- **No product detail page / PDP.** Clicking a product card does not navigate to a detail route; there is no `app/products/[id]` route.
- **No search functionality.** The search icon in the header is purely decorative; there is no search input or query logic.

## Future Improvements

- Add a product detail page (`app/products/[id]/page.js`) with per-product route rendering and DummyJSON single-product endpoint integration.
- Persist wishlist to `localStorage` so it survives reloads, or connect it to a backend user account.
- Hook the newsletter form up to a real email service (or a Next.js API route proxying one) and handle validation + success/error UI.
- Implement the header navigation links as real routes (About, Stories, Contact) or remove the dead links if out of scope.
- Wire the search icon to a search bar + client-side (or API) filtering, including `?q=` URL sync.
- Implement the language selector properly with a dictionary (react-intl / next-intl) or i18n routing so ENG/FRA/DEU actually swap copy.
- Replace DummyJSON with a real CMS/backend so products, images, inventory, and prices are merchant-controlled.
- Add Open Graph/Twitter card metadata and OG image generation for better social previews.
- Add unit/integration tests for the filter/sort/pagination logic (Vitest + Testing Library, or similar).
- Add a loading skeleton instead of a short spinner for the first SSR paint if network-bound.
- Ship structured data for AggregateRating and Offer once richer product fields are available.

## License

Not found in the current implementation. No `LICENSE` file exists in the repository.
