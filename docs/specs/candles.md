# Spec: Candles (enquiry only, phase 1)

Status: agreed direction, 2026-10-14
Scope: a Candles range shown alongside the paintings, sold by enquiry exactly like the paintings. Online ordering is deferred to phase 2 (section 9).

## 1. Decisions

| Question | Decision |
|---|---|
| How are candles bought? | Enquiry only, for now. No cart, no checkout. Andrea sends a draft order invoice, as for paintings. |
| Image treatment | Same square painting mount, image contained at 76%. |
| Name in the menu | "Candles" |
| Bag / cart link | None. Stays hidden until there is a real cart in phase 2. `/cart` keeps redirecting. |

Because candles follow the painting model, almost everything in `CLAUDE.md` still holds. The real work is:
1. telling the theme which products are paintings and which are candles,
2. keeping candles out of every painting grid (and paintings out of candle grids),
3. a candle page and enquiry form with candle wording and fields,
4. a sixth menu item.

## 2. Product kind convention

Every product gets a **product type** in the admin: `Painting` or `Candle`. This is the single switch the theme reads.

```liquid
assign is_candle = false
if product.type == 'Candle'
  assign is_candle = true
endif
```

Liquid snippets cannot return values, so this block is repeated wherever a product is rendered. Any product without a type is treated as a painting (safe default for the existing catalogue).

### Availability
Candles reuse the existing `sold` tag so Andrea has one mechanism to learn:
- painting tagged `sold`: "Sold" label, "This painting has found a home..." copy, moved to the Sold tab (unchanged)
- candle tagged `sold`: **"Sold out"** label, no enquire button, copy "[This candle is sold out for now. Ask to be told when it is back.]" with a link to the enquiry form, which still works so people can ask about restocks. Andrea removes the tag when restocked.

Scent-level sold out is not possible with a tag. If one scent runs out, Andrea removes that variant (or that scent's option value) rather than tagging. Revisit with real inventory in phase 2.

## 3. Admin set-up (Andrea)

### 3.1 Before the first candle is published (do this first)
- Set product type `Painting` on every existing painting (bulk editor).
- Edit the automated collections `available-works` and `sold-works`: add the condition **Product type is equal to Painting**. Without this, candles will appear on the Works page, the homepage grid and "More available works".

### 3.2 Candles
- Product type `Candle`, theme template `candle`.
- Variants for scent and/or size if needed, each with its price.
- Images: first image a straight-on photo of the candle on a plain background (it sits in the mount at 76%), further images for detail, lid, label, burning.
- Metafield definitions (namespace `custom`, products), all optional, skipped when empty:
  - `custom.dimensions` (exists): "Dimensions"
  - `custom.burn_time` (single line text): "Burn time"
  - `custom.wax` (single line text): "Wax"
  - `custom.notes` (single line text): "Scent notes"
  - `custom.vessel` (single line text): "Vessel"
  - `custom.care` (multi-line text): "Care and safety" text block
  - `custom.in_room_image` (exists): reused as the "In a room" thumbnail if Andrea has a styled photo
- Automated collection **`candles`**: Product type is equal to Candle. Assign it the `candles` collection template.

### 3.3 Menu
Main menu, 6 items: Works, Candles, Features, My story, For designers, Contact (order is Andrea's call).

## 4. Theme changes

### 4.1 New files

| File | Purpose |
|---|---|
| `templates/product.candle.json` | Candle page: product section with candle settings, candle enquiry section on oatmeal, "More candles" |
| `templates/collection.candles.json` | Candles grid, no Available/Sold tabs |

The candle template reuses the existing sections (`product`, `product-enquiry`, `product-more-works`, `collection`) with new settings, rather than forking them, so the painting and candle pages stay one design.

### 4.2 Changes to existing files

| File | Change |
|---|---|
| `snippets/product-card.liquid` | Branch on kind. Candles: meta line from size / burn time instead of medium and dimensions; "from R[lowest]" when variant prices differ; "Sold out" instead of "Sold". Same mount. |
| `sections/product.liquid` | Kind-aware: candle details list (Dimensions, Burn time, Wax, Scent notes, Vessel) instead of Medium, Dimensions, Framing, Signed; year line hidden for candles; button labels from section settings (see 4.3); "Care and safety" block under "About this candle"; sold copy and label from settings. Thumbnails: first three images plus the in-room image, all mounted. The to-scale figure and painting reassurance lines are off in the candle template (section settings). |
| Variant picker (inside `product.liquid`) | Only rendered when the product has more than one variant. One radio group per option in a `fieldset` with `legend`, quiet text pills with a hairline border, ink border when selected. Changing a variant updates the shown price (crossfade over `--dur-fast`), the URL `?variant=`, and the read-only enquiry field. Without JS: a plain `select` and the price of the first variant. No quantity selector, no add to cart. |
| `sections/product-enquiry.liquid` | Kind-aware. Candle version: read-only field **Candle** submitted as `contact[Candle]` (title, chosen scent or size, price, e.g. "Fig leaf, 300 g, R450"), **Quantity** (number, min 1, submitted as `contact[Quantity]`), **Delivery** (select: "Deliver to me" / "Collect in Cape Town", submitted as `contact[Delivery]`, options editable in section settings, can be switched off), then Name, Email, Phone (optional), Message, consent. Heading, intro, button text and success copy from section settings. Painting version unchanged. |
| `sections/product-more-works.liquid` | Skip products whose kind differs from the current product, as well as sold ones. Candle template points it at the `candles` collection with heading "More candles". |
| `sections/featured-works.liquid` | "Show" setting (Paintings / Candles, default Paintings). Skips products of the other kind and counts only matching ones for the minimum-to-show rule. |
| `sections/collection.liquid` | Not filtered: skipping products inside `paginate` would leave short pages and wrong counts, so the Works and Candles collections must be kept separate in the admin (3.1). Cards are kind-aware, so a mixed collection still shows the right labels. Candle template (PR 3) turns the tabs off and uses "[n] candles" count text. |
| `sections/header.liquid` | Raise the menu limit from 5 to 6 (both desktop and drawer loops) and add the sixth `nth-child` to the mobile stagger. Fix the active state: today any product page underlines the first collection link (lines 21 and 48), so a candle page would underline Works. Underline the link whose collection matches the product's kind (Works for paintings, Candles for candles), using the product template suffix or type. Six links need about 860px beside the wordmark (measured), so the menu toggle now takes over below 900px instead of 750px. No bag link. |
| `snippets/meta-tags.liquid` | JSON-LD `category` "Candle" for candles instead of the hard-coded "Painting"; `availability` "SoldOut" when tagged `sold`; `AggregateOffer` (low and high price) when variants differ. |
| `sections/search.liquid` | Optional: render results with the shared card so paintings and candles show in house style. |
| `locales/en.default.json`, `en.default.schema.json` | New strings: Sold out, from price, candle details labels, quantity, delivery, candle enquiry field, kind setting labels. |
| `templates/index.json` + new section or a kind setting on `featured-works` | Optional homepage "Candles" block: heading, short text, 3 candles, link "View all candles". Off until Andrea has candles. |

### 4.3 Candle page copy (all editable in the theme editor)
- Primary button: "ENQUIRE ABOUT THIS CANDLE", scrolls to the form.
- Secondary button: none by default. Optional setting for a second button with a pre-filled message (e.g. "[I would like to order candles as gifts.]").
- Shipping note: "[Delivery and collection note]".
- Breadcrumb: Candles / [title].
- Prices shown in ZAR, as for paintings.

### 4.4 Unchanged
- No cart, cart drawer, bag link, quantity selector on the page itself, add to cart, buy now, dynamic checkout or quick add anywhere.
- `templates/cart.json` keeps redirecting to `available-works`.
- Painting mount rule, motion, typography, colours.

## 5. Changes to `CLAUDE.md`
- "What this is": original paintings and a small range of candles, both by enquiry.
- New "Candles" section: product type convention, `sold` tag meaning "Sold out" for candles, candle metafields, candle enquiry fields (`contact[Candle]`, `contact[Quantity]`, `contact[Delivery]`).
- Painting image rule: "Every painting **and candle**".
- Product data: add the product type rule and the candle metafields.
- Pages and templates: add Candles collection and Candle product templates.
- Navigation: max 6 items.
- Done means: add "Candles never appear in Works grids and paintings never appear in Candles grids" and "A candle enquiry arrives with the candle, scent, price and quantity included".

## 6. Design
No candle mockup exists in `/design`. The candle page and collection follow `Painting.dc.html` and the Works grid closely, so they can be built from the existing design. One item worth a quick mockup or a screenshot review: the header with six items at 1440 and 1024.

## 7. Build plan

1. `feature/candles-guards`: product kind convention, card branching, kind guards in grids and more works, header 6 items and active state fix, JSON-LD. Safe to merge before any candle exists; paintings look identical.
2. `feature/candles-product`: candle template, kind-aware product and enquiry sections, variant picker, candle metafields.
3. `feature/candles-collection`: candles collection template, "from" prices, Sold out, homepage candles block, `CLAUDE.md` update.

Each PR: `shopify theme check` clean, screenshots at 1440x800 and 390, and Andrea's admin checklist.

## 8. Testing
- Painting pages, Works grid, homepage grid and sold paintings look and behave exactly as before (regression).
- A candle never appears in Works, homepage works grid or "More available works"; a painting never appears in Candles or "More candles".
- Candle with one variant (no picker), with several variants (picker, price updates, enquiry field updates, `?variant=` link opens the right scent), tagged `sold` (Sold out label, restock copy, no enquire button).
- Candle enquiry email (tested on the live theme preview, not local dev) includes Candle, Quantity and Delivery.
- Header: Candles underlined on candle pages, Works on painting pages; six links fit; mobile menu shows six with the stagger.
- First screen rule at 1440x800 on the candle page and Candles collection.
- Keyboard and screen reader on the variant picker; reduced motion.

## 9. Phase 2: online ordering (deferred)

Kept here so the work is not lost. Phase 1 is built so this is an addition, not a rewrite: the product kind convention and kind-aware cards are already in place, and the bag link is simply not rendered yet.

When Andrea wants candles bought online:
- **Safeguard paintings first.** Once checkout is in use, any published product can reach checkout via `/cart/<variant-id>:1` or `/cart/add.js`, whatever the theme shows. Set paintings to tracked inventory 0 with "Continue selling when out of stock" off, and guard the bag page against non-candle lines. (Verify draft orders still accept a 0-stock painting.)
- Payments: Shopify Payments is not offered in South Africa; choose PayFast, Yoco, Paystack or Peach Payments.
- Shipping zones and rates, product weights, local pickup from the studio.
- Policies (refunds, shipping, terms, privacy) checked against ECTA, the Consumer Protection Act and POPIA; VAT status.
- Switch candle availability from the `sold` tag to tracked inventory per variant.
- Theme: Add to bag with quantity on the candle page (no-JS form post first, then a small `cart.js`), a real bag page replacing the `/cart` redirect, a header "Bag (n)" text link, policy links in the footer, checkout and notification email branding.
- Rewrite the commerce rules in `CLAUDE.md` so only candles reach the bag and only the bag reaches checkout.
