# BRANDED Fashion — Storefront Child Theme

Custom Storefront child theme that brings the WooCommerce store in line with
the Figma UI Kit, so the hand-coded corporate site and the store feel like a
single integrated system.

**Bachelor thesis project** — Vytautas Magnus University, Faculty of Informatics.
Author: Orest Polavskyi · Supervisor: Rita Marčiulynienė

---

## What this theme does

- Loads Inter font from Google Fonts (matches Figma)
- Imports the same `tokens.css` used on the corporate site — single source of truth
- Replaces Storefront's header with a custom one (logo + nav + search/account/cart icons + promo bar)
- Restyles every WooCommerce component to match the Figma UI Kit:
  - Buttons (square, uppercase, primary black / outline secondary)
  - Form inputs (square, thick border on focus)
  - Product cards (3:4 aspect ratio, name + price + swatches)
  - Single product page (large title, color/size selectors, full-width add-to-cart)
  - Cart, checkout, account pages
- Hides Storefront's secondary nav, search bar, and credit
- Registers a "Primary Menu" location for the new header
- Includes AJAX cart counter (updates badge live)

---

## Installation

1. **Make sure the parent theme (Storefront) is installed and activated** in WordPress.
   - WP Admin → Appearance → Themes → if Storefront is missing, click "Add New Theme" → search "Storefront" by Automattic → Install.

2. **Upload this theme:**
   - WP Admin → Appearance → Themes → **Add New Theme** → **Upload Theme**
   - Choose `branded-fashion.zip` → Install Now → **Activate**

3. **Set the navigation menu:**
   - WP Admin → Appearance → Menus
   - Create a new menu called e.g. "Primary"
   - Add these items:
     - Shop (custom link → /shop/ or WooCommerce Shop page)
     - About (custom link → /about/ — for now points back to corporate site URL)
     - Guides (custom link → /guides/ — corporate site URL)
     - Contact (custom link → /contact/ — corporate site URL)
   - Under "Menu Settings", check **Primary Menu** as Display location
   - Save

4. **Disable Storefront's homepage hero (optional):**
   - WP Admin → Appearance → Customize → Homepage Settings
   - Make sure "Your homepage displays" is set to "A static page" (not "Your latest posts")
   - Set the homepage to a blank page or your Shop page

5. **Hide Storefront's secondary navigation:**
   - Already handled by CSS — nothing to do.

---

## File structure

```
branded-fashion/
├── style.css                          ← Theme header (WordPress requirement)
├── functions.php                      ← Style enqueueing, hooks, AJAX cart count
├── header.php                         ← Custom Figma-matching header
├── footer.php                         ← Minimal branded footer
├── screenshot.png                     ← Theme preview shown in admin
├── assets/
│   └── css/
│       ├── tokens.css                 ← Design tokens (shared with corporate site)
│       └── branded.css                ← All Storefront/WooCommerce overrides
└── README.md
```

---

## Cross-site links

Header nav links pointing to About / Guides / Contact go to the hand-coded
corporate site. Update those URLs from the WP Menu editor if you change the
corporate site domain.

The corporate site's "Shop" CTA in turn points to this WooCommerce store.

---

## Customising

- **Change a color or font:** edit `assets/css/tokens.css`. Both the store and
  corporate site use the same token file — keep them in sync by editing in
  one place and copying to the other, or use a symlink during development.
- **Change header layout:** edit `header.php`.
- **Add a real footer:** edit `footer.php`. The current footer is intentionally
  minimal (one line of credit) to match the Figma prototype.

---

## Known limitations

- The custom header uses inline `onclick` handlers for the mobile menu and
  search overlay. For production these should move to a dedicated JS file.
- Search overlay is referenced in the markup but not implemented — when you
  need search, drop in a WP Search widget or build a custom overlay.
- The footer is plain. Expand it before final defense if you want to show
  more brand polish (links, newsletter, social, payment icons).
