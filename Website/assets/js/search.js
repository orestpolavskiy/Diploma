(function () {
  'use strict';

  var CORP = "http://127.0.0.1:5500/Website/";

  var index = [
    { type: 'page', title: 'Home',               desc: 'BRANDED Fashion — clothing made to last, designed in Vilnius.',                            href: CORP + 'index.html' },
    { type: 'page', title: 'About',              desc: 'Our story, values, and commitment to thoughtful design.',                                   href: CORP + 'pages/about.html' },
    { type: 'page', title: 'Style Guides',       desc: 'Editorial content for thoughtful dressing — fabric care, fit advice, seasonal trends.',     href: CORP + 'pages/guides.html' },
    { type: 'page', title: 'Contact',            desc: 'Send us a message about an order, sizing, or anything else.',                               href: CORP + 'pages/contact.html' },
    { type: 'page', title: 'Shipping & Returns', desc: 'Delivery times, costs, and our 30-day return window.',                                      href: CORP + 'pages/shipping-returns.html' },
    { type: 'page', title: 'Privacy & Cookies',  desc: 'How we handle your data and manage cookie preferences.',                                    href: CORP + 'pages/privacy-cookies.html' },
    { type: 'page', title: 'Transitional Dressing',          desc: 'Layering between seasons — fabric weights, order, and the pieces that work March-May and September-November.', href: CORP + 'pages/guides/transitional-dressing.html' },
    { type: 'page', title: 'How to Care for Natural Fibres', desc: 'Washing, drying, and storing wool, cashmere, linen, and cotton so they last years, not seasons.',             href: CORP + 'pages/guides/care-natural-fibres.html' },
    { type: 'page', title: 'Building a Tonal Wardrobe',      desc: 'How a narrow colour palette makes every morning easier and every outfit more considered.',                    href: CORP + 'pages/guides/tonal-wardrobe.html' },
    { type: 'page', title: 'Finding Your Fit',               desc: 'How to read our size guide, where each cut lands on the body, and when to size up or down.',                  href: CORP + 'pages/guides/finding-fit.html' },
    { type: 'page', title: 'What We Are Wearing This Season',desc: 'Quiet tailoring, relaxed trousers, and why the most versatile colour is still a good grey.',                  href: CORP + 'pages/guides/this-season.html' },
    { type: 'page', title: 'Buying Less, Choosing Better',   desc: 'A practical approach to reducing wardrobe waste — asking the right questions and caring for what you own.',    href: CORP + 'pages/guides/buying-less.html' },
    { type: 'page', title: 'The Capsule Wardrobe',           desc: 'Ten pieces that cover almost every occasion. How to choose them, what to look for, and what to skip.',        href: CORP + 'pages/guides/capsule-wardrobe.html' },
  ];

  // fetch live products from WooCommerce and add them to the index
  // if WP is unreachable the search still works with pages only
  fetch('http://diploma.local/wp-json/branded-search/v1/products')
    .then(function (res) {
      if (!res.ok) throw new Error('non-200');
      return res.json();
    })
    .then(function (products) {
      if (!Array.isArray(products)) return;
      products.forEach(function (p) {
        if (p && p.title && p.href) {
          index.push({
            type:  'product',
            title: String(p.title),
            desc:  String(p.desc || ''),
            href:  String(p.href),
          });
        }
      });
    })
    .catch(function () {});

  var quickTerms = ['Wool', 'Linen', 'Shirt', 'Trouser', 'Knitwear', 'Leather'];

  var css = [
    '.bsearch{position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;',
      'z-index:9999;background:#fff;display:flex;flex-direction:column;',
      'opacity:0;visibility:hidden;transition:opacity .22s ease;}',
    '.bsearch--open{opacity:1;visibility:visible;}',
    '@media(prefers-reduced-motion:reduce){.bsearch{transition:none;}}',

    '.bsearch__bar{display:flex;align-items:center;gap:16px;',
      'padding:22px 32px;border-bottom:1px solid #e5e5e5;flex-shrink:0;}',
    '.bsearch__mag{flex-shrink:0;width:24px;height:24px;color:#999;}',
    '.bsearch__mag svg{width:24px;height:24px;stroke:currentColor;stroke-width:1.5;fill:none;display:block;}',
    '.bsearch__input{flex:1;border:0 !important;outline:0 !important;background:transparent !important;',
      'box-shadow:none !important;border-radius:0 !important;padding:0 !important;',
      'font-family:inherit;font-size:26px !important;font-weight:300;color:#1a1a1a;letter-spacing:-0.01em;}',
    '.bsearch__input::placeholder{color:#bbb !important;opacity:1 !important;font-size:26px !important;}',
    '.bsearch__input:focus::placeholder{color:#bbb !important;opacity:1 !important;}',
    '.bsearch__close{flex-shrink:0;width:44px;height:44px;border:0 !important;',
      'background:transparent !important;cursor:pointer;color:#1a1a1a !important;',
      'font-size:1.4rem;line-height:1;border-radius:50% !important;min-height:0 !important;',
      'box-shadow:none !important;padding:0 !important;letter-spacing:normal !important;',
      'display:inline-flex;align-items:center;justify-content:center;transition:background .15s ease;}',
    '.bsearch__close:hover{background:#f2f2f2 !important;color:#1a1a1a !important;}',
    '.bsearch__close:focus-visible{outline:2px solid #8b7355;outline-offset:2px;}',

    '.bsearch__body{flex:1;overflow-y:auto;padding:32px;}',
    '.bsearch__inner{max-width:760px;margin:0 auto;}',

    '.bsearch__meta{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;',
      'color:#999;margin:0 0 20px;}',

    '.bsearch__group-title{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;',
      'color:#999;font-weight:600;margin:28px 0 4px;padding-bottom:8px;',
      'border-bottom:1px solid #ededed;}',
    '.bsearch__group-title:first-child{margin-top:0;}',

    '.bsearch__item{display:flex;align-items:baseline;gap:12px;',
      'padding:15px 0;border-bottom:1px solid #f0f0f0;text-decoration:none;color:inherit;}',
    '.bsearch__item:last-child{border-bottom:0;}',
    '.bsearch__item-main{flex:1;min-width:0;}',
    '.bsearch__item-title{font-size:1.06rem;font-weight:500;color:#1a1a1a;margin-bottom:3px;}',
    '.bsearch__item:hover .bsearch__item-title,',
    '.bsearch__item:focus-visible .bsearch__item-title{color:#8b7355;}',
    '.bsearch__item:focus-visible{outline:2px solid #8b7355;outline-offset:2px;}',
    '.bsearch__item-title mark{background:#f0e9dd;color:inherit;padding:0 1px;}',
    '.bsearch__item-desc{font-size:.86rem;color:#888;line-height:1.45;}',
    '.bsearch__tag{flex-shrink:0;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;',
      'color:#999;border:1px solid #e0e0e0;border-radius:2px;padding:3px 7px;}',
    '.bsearch__arrow{flex-shrink:0;color:#ccc;font-size:1rem;align-self:center;}',
    '.bsearch__item:hover .bsearch__arrow{color:#8b7355;}',

    '.bsearch__empty{padding:48px 0;text-align:center;color:#999;font-size:.95rem;}',

    '.bsearch__quick{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;}',
    '.bsearch__chip{font-size:.82rem;color:#1a1a1a !important;background:#f4f4f4 !important;',
      'border:0 !important;padding:9px 16px !important;border-radius:999px !important;',
      'cursor:pointer;transition:background .15s ease;min-height:0 !important;',
      'letter-spacing:normal !important;text-transform:none !important;',
      'font-weight:400 !important;font-family:inherit !important;box-shadow:none !important;}',
    '.bsearch__chip:hover{background:#e9e4d9 !important;color:#1a1a1a !important;}',
    '.bsearch__chip:focus-visible{outline:2px solid #8b7355;outline-offset:2px;}',
    '.bsearch__hint-label{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:#999;}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var magSvg = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/>' +
               '<path d="m20 20-3.5-3.5" stroke-linecap="round"/></svg>';

  var overlay = document.createElement('div');
  overlay.className = 'bsearch';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Site search');
  overlay.innerHTML =
    '<div class="bsearch__bar">' +
      '<span class="bsearch__mag" aria-hidden="true">' + magSvg + '</span>' +
      '<input class="bsearch__input" type="search" autocomplete="off" spellcheck="false" ' +
        'placeholder="Search products and pages…" aria-label="Search products and pages" />' +
      '<button class="bsearch__close" type="button" aria-label="Close search">✕</button>' +
    '</div>' +
    '<div class="bsearch__body"><div class="bsearch__inner" id="bsearch-results"></div></div>';
  document.body.appendChild(overlay);

  var input    = overlay.querySelector('.bsearch__input');
  var closeBtn = overlay.querySelector('.bsearch__close');
  var box      = overlay.querySelector('#bsearch-results');

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                     .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function highlight(text, q) {
    var t = esc(text);
    if (!q) return t;
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return t;
    return esc(text.slice(0,i)) + '<mark>' + esc(text.slice(i,i+q.length)) +
           '</mark>' + esc(text.slice(i+q.length));
  }

  function itemHtml(item, q) {
    var tag = item.type === 'product' ? 'Product' : 'Page';
    return '<a class="bsearch__item" href="' + item.href + '">' +
      '<div class="bsearch__item-main">' +
        '<div class="bsearch__item-title">' + highlight(item.title, q) + '</div>' +
        '<div class="bsearch__item-desc">' + esc(item.desc) + '</div>' +
      '</div>' +
      '<span class="bsearch__tag">' + tag + '</span>' +
      '<span class="bsearch__arrow" aria-hidden="true">→</span>' +
    '</a>';
  }

  function renderEmpty() {
    var chips = quickTerms.map(function (t) {
      return '<button class="bsearch__chip" type="button" data-term="' + esc(t) + '">' +
             esc(t) + '</button>';
    }).join('');
    box.innerHTML =
      '<p class="bsearch__hint-label">Popular searches</p>' +
      '<div class="bsearch__quick">' + chips + '</div>';
    box.querySelectorAll('.bsearch__chip').forEach(function (c) {
      c.addEventListener('click', function () {
        input.value = c.getAttribute('data-term');
        render(input.value);
        input.focus();
      });
    });
  }

  function render(q) {
    q = q.trim();
    if (!q) { renderEmpty(); return; }

    var ql = q.toLowerCase();
    var hits = index.filter(function (it) {
      return it.title.toLowerCase().indexOf(ql) !== -1 ||
             it.desc.toLowerCase().indexOf(ql) !== -1;
    });

    if (!hits.length) {
      box.innerHTML = '<div class="bsearch__empty">No results for &ldquo;' +
                      esc(q) + '&rdquo;.</div>';
      return;
    }

    var products = hits.filter(function (h) { return h.type === 'product'; });
    var pages    = hits.filter(function (h) { return h.type === 'page'; });

    var html = '<p class="bsearch__meta">' + hits.length +
               (hits.length === 1 ? ' result' : ' results') + '</p>';

    if (products.length) {
      html += '<p class="bsearch__group-title">Products</p>';
      html += products.map(function (p) { return itemHtml(p, q); }).join('');
    }
    if (pages.length) {
      html += '<p class="bsearch__group-title">Pages &amp; Guides</p>';
      html += pages.map(function (p) { return itemHtml(p, q); }).join('');
    }
    box.innerHTML = html;
  }

  function open() {
    overlay.classList.add('bsearch--open');
    document.body.style.overflow = 'hidden';
    if (!input.value) renderEmpty();
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    overlay.classList.remove('bsearch--open');
    document.body.style.overflow = '';
    input.value = '';
  }

  var debounce;
  input.addEventListener('input', function () {
    clearTimeout(debounce);
    var v = this.value;
    debounce = setTimeout(function () { render(v); }, 120);
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('bsearch--open')) close();
  });
  // close when clicking the backdrop
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  // bind the search button in the header (works on corporate site and store)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[aria-label="Search"]');
    if (!btn) return;
    if (btn.classList.contains('bsearch__close')) return;
    if (btn.classList.contains('icon-btn') ||
        btn.classList.contains('branded-header__icon')) {
      e.preventDefault();
      open();
    }
  });
})();
