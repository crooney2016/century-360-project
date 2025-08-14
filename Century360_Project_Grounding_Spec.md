# Century 360 — Project Grounding & Working Spec

**Last updated:** 2025-08-09 09:35 (America/Chicago)

> This doc unifies the latest README and the current app/API structure you
> provided. It is the single source of truth for scope, behavior, and
> conventions so all future chats and work stay aligned to the business
> outcomes.

---

## 1) Purpose & Business Outcomes (MVP)

**Business-first, tech is a tool.** The app exists to:

- **Accelerate assisted order entry** for internal agents with a
  **keyboard-first** variant matrix and minimal clicks.
- **Reduce oversell risk** by validating at-risk inventory at order entry and
  keeping the cart coherent.
- **Provide consistent pricing/fees** in the interim via **stubbed
  quote/submit** flows (shipping/tax/payment), enabling demos and end‑to‑end UX
  now.
- **Improve observability** with clear, structured logs around the full "place
  order" event for later analytics and QA.
- **Stay adaptable**: simple, clean foundations that can later connect to
  TaxJar, Adyen, and D365 without rewriting the UI.

**Non-goals (for MVP):**

- Full CRM suite, deep case management, or custom tenant features.
- Real payment capture, real tax nexus logic, or D365 posting (all stubbed for
  now).
- Perfect algorithmic shipping; we will use demo-friendly, explainable logic.

---

## 2) Current App Structure (Next.js / TypeScript)

```typescript
/app
  /(dashboard)/page.tsx
  /catalog/page.tsx
  /product/[id]/page.tsx
  /cart/page.tsx
  /checkout/page.tsx
  /dev/seed-status/page.tsx      // counts, verification
  /api
    /products/route.ts           // GET ?query=&dept=&class=&take=&cursor=
    /products/[id]/route.ts      // GET product + variants + color/size
    /cart/route.ts               // POST add/update/remove lines (batched)
    /checkout/quote/route.ts     // POST quote (stub tax/shipping)
    /checkout/submit/route.ts    // POST submit (stub Adyen/TaxJar/D365)
/components                     // atoms/molecules/organisms
  /atoms/…
  /molecules/…
  /organisms/…
/lib
  /api.ts                       // typed fetchers
  /types.ts                     // shared TS types
  /zod.ts                       // schemas for requests
  /format.ts                    // money/qty helpers
  /keyboard.ts                  // matrix key handling helpers
/store
  /cart.ts                      // Zustand store (client)
/prisma
  schema.prisma
  seed.ts
```

### Page responsibilities

- **(dashboard)/page.tsx**: internal dashboard; quick KPIs and shortcuts to
  search/catalog.
- **catalog/page.tsx**: search + filters (**query, dept, class**), infinite
  scroll (**cursor**) and list -> product.
- **product/[id]/page.tsx**: product detail with **color × size matrix**,
  keyboard navigation, bulk add.
- **cart/page.tsx**: batched **add/update/remove** lines; edit quantities
  inline.
- **checkout/page.tsx**: address + shipping option + totals **(quote via stub)**
  -> **submit (stub)**.
- **dev/seed-status/page.tsx**: DB counts for **sanity verification** after
  seed.

---

## 3) Tech Stack (Pragmatic)

- **Next.js (App Router)** + **TypeScript**
- **Prisma ORM** + **SQL Server**
- **Zustand** for client cart state
- **Zod** for runtime validation of requests/responses
- **Fast-CSV** for seeding CSVs
- Optional **Docker** for local SQL Server

> Stack is intentionally boring and reliable. We'll swap stubs for real services
> later without changing UX.

---

## 4) API Contracts (MVP)

All responses use `application/json`. Validate all inputs with **Zod**. Cursor
pagination is forward-only.

### GET `/api/products`

Query params: `?query=&dept=&class=&take=&cursor=`  
**200 OK**

```ts
type ProductSummary = {
  id: string;
  sku: string;
  name: string;
  dept?: string;
  class?: string;
  price: number;
  thumbnailUrl?: string;
};
type ProductsResponse = { items: ProductSummary[]; cursor?: string };
```

#### Notes

- `take` default 24 (cap 100).
- `cursor` is an opaque string from the previous page.

### GET `/api/products/[id]`

### 200 OK\*\*

```ts
type VariantDim = { id: string; code: string; name: string };
// e.g., color or size
type VariantCell = {
  variantId: string;
  colorId: string;
  sizeId: string;
  sku: string;
  price: number;
  inStockQty?: number;
};
type ProductDetail = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  colorAxis: VariantDim[];
  sizeAxis: VariantDim[]; // matrix axes
  cells: VariantCell[]; // matrix body
  media?: string[];
};
```

**404** if product missing.

### POST `/api/cart` — **batched ops**

Body:

```ts
type CartOp =
  | { type: "add"; variantId: string; qty: number }
  | { type: "update"; lineId: string; qty: number }
  | { type: "remove"; lineId: string };

type CartRequest = { ops: CartOp[] };
type CartLine = {
  lineId: string;
  variantId: string;
  sku: string;
  name: string;
  qty: number;
  price: number;
  extended: number;
};
type CartState = { lines: CartLine[]; subtotal: number; warnings?: string[] };
```

**200 OK** → updated `CartState` (server‑authoritative math).  
Notes: clamp `qty >= 0`; return warnings for low/zero stock if applicable.

### POST `/api/checkout/quote` — **stubbed totals**

Body:

```ts
type QuoteRequest = {
  shipTo: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  cartId?: string; // or include explicit lines if not using a server cart
};
type QuoteResponse = {
  subtotal: number;
  shipping: number; // simple rule-based demo logic
  tax: number; // flat or % for demo
  grandTotal: number;
  details?: { shippingRule: string; taxRule: string };
};
```

**Shipping (demo rules)**: keep **explainable**. Example: flat tiers by
weight/qty and a known **oversize flat rate** for specific SKUs (e.g., "BOB XL"
as a demo).

### POST `/api/checkout/submit` — **stub integration**

Body:

```ts
type SubmitRequest = {
  quote: QuoteResponse; // echo from previous step
  payment: { method: "card" | "terms"; token?: string }; // token is a stub
  customer: { id?: string; email?: string; name?: string }; // minimal for MVP
};
type SubmitResponse = {
  orderId: string;
  status: "accepted";
  submittedAt: string;
};
```

### Notess

- No real Adyen/TaxJar/D365 calls yet—**log intent** and return a deterministic
  confirmation.
- Return 409 if cart mutated after quote (simple mismatch check).

---

## 5) Frontend Behavior (Keyboard‑first where it matters)

### Variant Matrix (product page)

- **Arrow keys** move cell focus; **number keys** type qty; **Enter** commits;
  **Backspace** clears.
- `lib/keyboard.ts` centralizes focus and input behavior; pure functions so it's
  testable.
- Visual cues: focused cell, changed qty badge, error states on invalid
  quantities.

### Catalog

- Search-as-you-type with debounced fetch.
- Filters: **dept**, **class**. Cursor-based infinite scroll.
- Card list -> product detail; keep client-side state of last
  search/filter/cursor for fast back‑navigation.

### Cart

- Batch apply line updates in one POST to `/api/cart`.
- Server computes **extended** and **subtotal** to avoid drift.
- Inline remove; clamp negative to zero.

### Checkout

- Minimal address capture (demo-form).
- Quote button -> totals + rule detail (transparent).
- Submit button -> deterministic **orderId**; toast success + link to dashboard
  or order confirmation (simple page).

### Dev/Seed Status

- Shows product/variant counts and time of last seed to confirm environment
  health.

---

## 6) Data & Seeding (Prisma + CSV)

- **Prisma models**: `Product`, `Variant`, and supporting tables (e.g.,
  Dept/Class if available).
- **Seed** reads CSV (Fast-CSV), upserts Products and Variants.
- Recent runs (for context): _Parsed 18,967 rows → 4,119 products; 18,967
  variants upserted._
- Use the **/dev/seed-status** page to confirm counts match expectations after a
  seed.

### Scripts

- `pnpm prisma:generate` – build Prisma client
- `pnpm prisma:migrate` – create/apply migrations
- `pnpm db:seed` – run seeding
- `pnpm dev` – start Next.js dev server
- `pnpm prisma:studio` – browse the DB

---

## 7) Validation, Types & Formatting

- **`/lib/zod.ts`**: request/response schemas for each API route.
- **`/lib/types.ts`**: shared TypeScript types that mirror Zod inferences.
- **`/lib/format.ts`**: `formatMoney`, `formatQty`, rounding rules in one place.
- Enforce **server-authoritative math** for totals; client only formats.

---

## 8) State Management

- **Zustand** `store/cart.ts` keeps local cart state in sync with server
  responses.
- Minimize SSR/CSR mismatch by deferring cart math to server, only storing IDs
  and qty locally.

---

## 9) Observability (MVP)

Log the **Place Order** journey with consistent names:

- **catalog:search** → query, filters, resultCount
- **product:matrix:navigate** → fromCell, toCell
- **product:matrix:edit** → cellId, qtyBefore, qtyAfter
- **cart:applyOps** → opsCount, warningsCount
- **checkout:quote** → shippingRule, taxRule, totals
- **checkout:submit** → orderId, totals, elapsedMs
- **seed:status** → productsCount, variantsCount

Keep logs privacy-safe; no raw PAN or PII beyond what’s already stored.

---

## 10) Environment & Config

`.env` (sample):

```text
DATABASE_URL="sqlserver://localhost:1433;database=Century360;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true"
NODE_ENV=development

# Placeholders for later real integrations
ADYEN_API_KEY="stub"
TAXJAR_API_KEY="stub"
```

Local SQL Server via Docker:

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourStrong!Passw0rd' \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

---

## 11) Acceptance Criteria (MVP)

### Catalog\*

- Given a search and filters, when I scroll, then more products load via
  `cursor` until exhausted.
- Given I click a product, then I land on `/product/[id]` with a visible matrix.

### Product Matrix

- Arrow keys move focus; typing sets qty; Enter commits.
- Adding multiple cells posts **one** batched update to `/api/cart`.

### Cart\*

- Editing several lines and pressing “Update” posts a single `/api/cart`
  request.
- Server recalculates subtotal; client displays updated totals.

### Quote & Submit\*

- Quote returns subtotal/shipping/tax/grandTotal with readable rule labels.
- Submit returns a stable `orderId` and writes a clear log entry.

### Dev/Seed Status\*

- Shows product + variant counts; matches last seeding run.

---

## 12) Roadmap (Post‑MVP)

- Replace **stubbed** quote/submit with real **TaxJar**, **Adyen**, and D365
  integrations (APIM boundary).
- Add at‑risk inventory checks on **update**/ **add** ops to warn or block.
- Customer account lookup and lightweight account profile page before cart.
- Richer shipping logic and surcharge handling (still explainable).
- Hardening: e2e tests for keyboard flows; load tests for `/api/products` cursor
  paging.

---

## 13) Working Agreements

- Business outcomes drive decisions (speed, accuracy, transparency).
- Keep modules **small, typed, and testable** (e.g., `keyboard.ts` pure
  functions).
- Avoid premature complexity; prioritize a crisp demo path end‑to‑end.

---

## 14) Quick Start

1. `pnpm install`
2. Ensure SQL Server is reachable; set `DATABASE_URL`.
3. `pnpm prisma:migrate` → `pnpm db:seed`
4. `pnpm dev` and open `http://localhost:3000`
5. Visit **/dev/seed-status** to verify counts.
6. Try the happy path: **Catalog → Product Matrix → Cart → Quote → Submit**.

---

_This document is the grounding reference for the current Century 360 web app.
If something's unclear or changes, update this file first and treat it as the
canonical contract._

## Project Review: Century 360 - Atomic Design & Testing Implementation

### Current State Assessment

**✅ Strengths:**

1. **Solid Foundation**: Well-structured Next.js 15 with TypeScript and strict
   mode enabled [[memory:2621868]]
2. **Atomic Design Structure**: You have proper atoms/molecules/organisms folder
   structure
3. **Design System**: Good start with Tailwind CSS, CSS custom properties, and
   class-variance-authority for type-safe component variants
4. **Documentation**: Excellent TSDoc documentation on components like `Button`
   [[memory:5487757]]
5. **Code Quality**: ESLint, Prettier, and TypeScript checking configured
   [[memory:5499345]]
6. **E2E Testing**: Playwright is set up with basic smoke tests
7. **Package Management**: Using pnpm as preferred [[memory:4858229]]

**⚠️ Areas for Improvement:**

### 1. **Storybook Integration** (Missing)

Storybook is not yet configured, which is critical for atomic design development
and component documentation.

### 2. **Test Coverage Gaps**

- Only basic smoke tests exist
- No unit tests for components
- No visual regression testing
- Missing accessibility testing

### 3. **Component Architecture Refinements**

- UI components in `/src/ui/` should be properly categorized as atoms
- Mixed import patterns (relative vs absolute) [[memory:2621863]]
- Need better component composition patterns

### 4. **Development Workflow**

- No Storybook for isolated component development
- Limited component testing strategy

## Recommended Implementation Plan

### Phase 1: Storybook Setup & Component Stories

```bash
# Add Storybook dependencies
pnpm dlx storybook@latest init
pnpm add -D @storybook/addon-a11y @storybook/addon-coverage @storybook/test-runner
```

### Phase 2: Enhanced Testing Strategy

1. **Component Testing**: Add Jest + Testing Library for unit tests
2. **Visual Testing**: Chromatic integration with Storybook
3. **Accessibility Testing**: Axe-core integration
4. **Coverage**: Set up comprehensive test coverage reporting

### Phase 3: Atomic Design Refinement

**Recommended Structure:**

```
src/
├── components/
│   ├── atoms/          # Basic building blocks
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Logo/
│   │   └── ...
│   ├── molecules/      # Groups of atoms
│   │   ├── TopNav/
│   │   ├── ProductCard/
│   │   └── ...
│   ├── organisms/      # Complex UI sections
│   │   ├── ProductGrid/
│   │   ├── AppShell/
│   │   └── ...
│   ├── templates/      # Page layouts
│   └── pages/          # Full pages
├── ui/                 # Move to components/atoms/
└── ...
```

### Phase 4: Testing Infrastructure

**Jest Configuration:**

```typescript
<code_block_to_apply_changes_from>
```

### Phase 5: Dagger Integration (Optional)

For CI/CD pipeline consistency:

```typescript
// dagger/main.ts
import { dag, Container, Directory, object, func } from "@dagger.io/dagger";

@object()
class Century360 {
  @func()
  async test(source: Directory): Promise<string> {
    return await dag
      .container()
      .from("node:18-alpine")
      .withDirectory("/src", source)
      .withWorkdir("/src")
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "validate"])
      .withExec(["npm", "run", "test:e2e"])
      .stdout();
  }
}
```

## Immediate Next Steps

1. **Add Storybook** - This should be your first priority for atomic design
   development
2. **Reorganize Components** - Move `/src/ui/` components to proper atomic
   structure
3. **Add Component Tests** - Start with critical components like Button, TopNav
4. **Visual Regression Testing** - Set up Chromatic or similar
5. **Accessibility Testing** - Integrate axe-core with Storybook and Playwright

Would you like me to help implement any of these phases? I can start with
setting up Storybook and reorganizing your component structure to better align
with atomic design principles.

## Root Cause Analysis & Prevention Rules

### **Issue 1: Unused Imports**

**Root Cause:** Import statements added during development but not cleaned up
when code changes.

**Prevention Rule:**

```json
// Add to eslint.config.mjs or create .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unused-imports": "error"
  }
}
```

### **Issue 2: Database Schema Drift**

**Root Cause:** Database state doesn't match Prisma migration files, likely from
manual schema changes or incomplete migrations.

**Prevention Rules:**

1. **Always use Prisma for schema changes:**

   ```bash
   # Wrong: Manual DB changes
   # Right: Prisma schema changes + migration
   pnpm prisma:migrate
   ```

2. **Add pre-commit hooks:**

   ```json
   // In package.json
   "lint-staged": {
     "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
     "prisma/schema.prisma": ["prisma format", "prisma generate"]
   }
   ```

3. **Development workflow rule:**

   ```bash
   # Always run this sequence when schema changes
   pnpm prisma:generate && pnpm prisma:migrate && pnpm db:seed
   ```

## Proposed Cursor Rules
