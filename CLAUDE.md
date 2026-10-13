# Andrea Bowman: gallery website (custom Shopify theme)

## What this is
A custom Shopify Online Store 2.0 theme for Andrea Bowman, a painter selling original abstract paintings (around R30,000 each) from Cape Town. The site is a gallery and catalogue for collectors and interior designers. **Sales are by enquiry only: there is no cart and no checkout.** When a painting sells, Andrea sends the buyer a Shopify draft order invoice from the admin, outside the theme.

Andrea will manage all content herself in the Shopify admin and theme editor, so everything she might change (images, text, featured items, press, homes, events) must be editable there without code.

The approved design is in `/design` (read `design/README.md` first). Match it closely.

## Design principles
- Minimal, calm and harmonious. It should feel plush, inviting and clearly expensive: a sophisticated, open room.
- The paintings are the colour. The interface stays quiet.
- Generous spacing everywhere. When in doubt, add space rather than elements.
- One typeface family across the whole site.

## Design tokens (use exactly)
| Token | Value | Use |
|---|---|---|
| ivory | #F8F5F0 | page background |
| oatmeal | #EDE7DE | alternate section background |
| mount | #EFEAE2 | square mount behind every painting image |
| hairline | #DDD5CA | dividers and borders |
| field-line | #CFC6BA | form field underlines on oatmeal |
| ink | #22201E | text |
| ink-soft | #4F4A43 | body paragraphs |
| muted | #5E5850 | captions, labels, metadata |
| moss | #3F4636 | the only accent: primary buttons, footer background, hover |

Expose these as theme settings (colour pickers) with these defaults. No other colours, no gradients, no shadows, no rounded corners.

## Typography
- Family: **Jost** only (Shopify font library: `jost_n3`, `jost_n4`, `jost_n5`), fallback `'Helvetica Neue', sans-serif`.
- Body: 17px, weight 300, line-height 1.7.
- Page titles (h1): 50px, weight 300, line-height 1.2. Section titles (h2): 34px, weight 300.
- Logo/wordmark: "ANDREA BOWMAN", 15px, weight 400, letter-spacing 0.34em.
- Navigation: 14px, letter-spacing 0.06em.
- Buttons: 13px, weight 400, uppercase, letter-spacing 0.18em, padding about 20px 40px, square corners.
- Scale headings down on mobile (h1 to about 34px, h2 to about 26px).
- Sentence case for all headings. No italics. No serif fonts.

## Layout
- Content max-width 1320px, horizontal padding 48px (20px on mobile).
- Section vertical padding 130 to 150px on desktop (about 80px on mobile).
- Fully responsive. Grids collapse to 2 columns on tablet and 1 on mobile; header nav collapses to a simple menu on mobile.

## The painting image rule (critical)
Every painting, everywhere on the site, is displayed the same size so grids look balanced:
- A **square mount** (aspect-ratio 1:1, background `mount` #EFEAE2).
- The painting image sits centred inside it with `object-fit: contain`, its longest side at 76% of the mount.
- This applies to collection grids, the product page main image, thumbnails and "more works".
- Lifestyle and installation photos (Features page, homepage feature block, in-room views) are NOT mounted: they fill their frame with `object-fit: cover` at the ratio shown in the mockups.
- Use Shopify `image_url` with appropriate widths and `srcset`, lazy load below the fold, always output alt text.

## Enquiry only: remove all commerce
- No cart icon, cart page link, cart drawer, quantity selector, add to cart, buy now, dynamic checkout buttons or quick-add anywhere.
- Product page primary button: "ENQUIRE ABOUT THIS PAINTING", scrolls to the enquiry form on the same page.
- Secondary button: "RESERVE FOR A DESIGN PROJECT", same form with the message pre-filled with "I would like to reserve this painting for a design project."
- Enquiry form uses Shopify's native `{% form 'contact' %}` with fields: Painting (read-only, auto-filled with product title and price, submitted as `contact[Painting]`), Name, Email, Phone (optional), Message. Show success and error states in the same style.
- Prices are shown in ZAR on the product page and grids.
- Nothing in the theme may link to /cart or /checkout. Redirect /cart to the works collection if possible.

## Sold works
- A painting is sold when it has the product tag `sold`.
- Sold paintings: show a small "Sold" label instead of the price, no enquire buttons, and the copy "This painting has found a home. Enquire about commissions or similar works." with a link to the contact form.
- Works page has two tabs: Available and Sold (two collections: `available-works`, `sold-works`, created in the admin as automated collections by tag).

## Product data (metafields, namespace `custom`)
Render these in the product page details list, skipping any that are empty:
- `custom.medium` (single line text), label "Medium"
- `custom.dimensions` (single line text, e.g. "120 x 120 x 4 cm"), label "Dimensions"
- `custom.year` (single line text), shown under the title
- `custom.framing` (single line text), label "Framing"
- `custom.signature` (single line text), label "Signed"
- `custom.in_room_image` (file, image), used as the "In a room, for scale" thumbnail
Product description = "About this work". Product images: first image is the full straight-on photo, second is the surface detail.

## Features content (metaobjects, so Andrea can edit in the admin)
- `press_article`: publication (text), headline (text), date (date), url (url), image (file)
- `home_installation`: title e.g. "Private residence, Constantia" (text), painting (product reference), designer (text), image (file)
- `event`: name (text), venue (text), date (date), image (file)
- `testimonial`: quote (multi-line text), name (text), role (text)
The Features page sections read these metaobjects. Each section also has theme editor settings for its heading and how many items to show.

## Pages and templates
1. **Homepage** (`templates/index.json`): header; full-width hero image (image picker, caption text); intro (heading + paragraph + link); available works grid (6 items from a chosen collection, with Available/Sold tabs linking to the collections); feature block on oatmeal (image + heading + text + button to Features); For interior designers block; moss footer with newsletter sign-up (Shopify `customer` form), contact details and Instagram link.
2. **Works** (`templates/collection.json`): same grid as homepage, tabs for Available/Sold, pagination.
3. **Painting** (`templates/product.json`): breadcrumb; mounted main image with three thumbnails (full view, surface detail, in room); title, year, price, details list, two buttons, shipping note, About this work; enquiry form section on oatmeal; "More available works" (3 items).
4. **Features** (`templates/page.features.json`): intro with anchor links; In homes grid (4:5 photos, captions with home and designer); testimonial band on oatmeal; Press list; Exhibitions and events (3:2 photos).
5. **My story** (`templates/page.about.json`): portrait (4:5) with title and opening paragraphs; How I work on oatmeal (narrow column, rich text, pull quote); In the studio (3 square images with captions); Background (exhibitions, collections, training lists, editable as blocks); closing call to action.
6. **For interior designers** (`templates/page.designers.json`): intro, what designers get (trade pack, reservations, sizes), and a contact form with fields for studio name, project and timeline.
7. **Contact** (`templates/page.contact.json`): simple contact form in the same style.

Navigation (from the admin menu, max 5 items): Works, Features, My story, For designers, Contact. Active page shows a 1px underline.

## Copy rules
- Never use em dashes in any text or code comments. Use commas, colons or plain hyphens.
- Placeholder text goes in brackets, e.g. [Artist introduction], so it is obvious what Andrea must replace.
- Do not invent facts about Andrea, her exhibitions, press or prices.

## Accessibility and performance
- WCAG AA contrast, visible keyboard focus (1px ink outline, offset 4px), real buttons and links, labelled form fields, alt text on all images.
- Respect `prefers-reduced-motion`. No animations beyond subtle hover colour changes.
- No external JS libraries. Keep JS minimal and vanilla.
- Run `shopify theme check` and fix all errors before every PR.

## How we work
- Base: initialise with `shopify theme init` (Shopify's starter theme), then build up. Do not use Dawn or Horizon as the base.
- Git: `main` is protected and will later be connected to the live store. Work on feature branches (`feature/<page-or-section>`), commit in small steps with clear messages, and open a pull request for each page or section. Never push directly to `main` after the initial setup commit.
- Preview with `shopify theme dev --store <store>.myshopify.com`. Never run `shopify theme publish` and never push to the live theme. Only use `shopify theme push --unpublished` when asked.
- Use the shopify-dev-mcp server to check Liquid, schema and Online Store 2.0 conventions instead of guessing.
- Build order: global settings, header and footer, product card with the mount rule, product page and enquiry form, collection page, homepage, Features, My story, For designers, Contact.
- After each page, list what Andrea needs to set up in the admin for it (metafields, metaobjects, collections, menus, pages).

## Done means
- Every page matches the mockup at 1440px and works at 390px.
- No route to a cart or checkout exists anywhere.
- An enquiry from any painting arrives in the store's contact email with the painting name included.
- Marking a painting `sold` updates it everywhere without code changes.
- Andrea can change every image and piece of text from the admin or theme editor.
