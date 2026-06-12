# Website — BRANDED Corporate Site

Hand-coded corporate front-end matching the Figma UI Kit.
Pairs with the WooCommerce store running at http://diploma.local/

## Folder structure

```
Website/
├── index.html                  ← Home page (entry)
├── pages/
│   ├── about.html
│   ├── guides.html
│   ├── shipping-returns.html
│   ├── privacy-cookies.html
│   └── contact.html
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← design tokens (single source of truth)
│   │   └── main.css            ← all component styles
│   ├── js/
│   │   └── main.js             ← mobile menu, active link, lazy load
│   └── images/                 ← drop product/hero photos here
└── README.md
```

## How to preview

1. Open the project in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. The site opens at http://127.0.0.1:5500/Website/

## How to swap placeholders for real images

In any HTML, replace `[Hero Image Placeholder]` / `[Product Image]` text
inside `.hero__image` or `.product-card__media` with an `<img>`:

```html
<div class="hero__image">
  <img src="assets/images/hero.webp" alt="" />
</div>
```

For lazy-loading below-the-fold images, use `data-src` instead of `src`:

```html
<img data-src="assets/images/product1.webp" alt="Classic Wool Coat" />
```

The JS in `main.js` will load it when it enters the viewport.

## How to change design

All colors, fonts, spacing are CSS custom properties in `assets/css/tokens.css`.
Change one value there and every page updates automatically.

## Cross-site links

Links to the WooCommerce store use absolute URLs (`http://diploma.local/shop/`,
`/cart/`, `/my-account/`). When the WordPress side is on a different host,
update these in all `*.html` files (search + replace).
