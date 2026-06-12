(function () {
  'use strict';

  var STORAGE_KEY = 'branded_cookie_consent';
  var DATE_KEY    = 'branded_cookie_consent_date';

  // if user already made a choice, skip the banner
  var existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return;
  }

  var style = document.createElement('style');
  style.textContent = [
    '.branded-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    'background:var(--color-bg);border-top:2px solid var(--color-border);',
    'box-shadow:0 -2px 20px rgba(0,0,0,.08);padding:var(--space-l) var(--space-m);',
    'font-family:var(--font-body);font-size:var(--fs-small);color:var(--color-text);',
    'opacity:1;transition:opacity .3s ease;}',
    '@media(prefers-reduced-motion:reduce){.branded-cookie-banner{transition:none;}}',
    '.branded-cookie-banner--hidden{opacity:0;pointer-events:none;}',
    '.branded-cookie-banner__inner{max-width:var(--container-max);margin:0 auto;',
    'display:flex;flex-direction:column;gap:var(--space-m);align-items:flex-start;}',
    '@media(min-width:768px){.branded-cookie-banner__inner{flex-direction:row;',
    'align-items:center;justify-content:space-between;gap:var(--space-xl);}}',
    '.branded-cookie-banner__text{flex:1;margin:0;line-height:1.6;color:var(--color-text-muted);}',
    '.branded-cookie-banner__text a{color:var(--color-text);text-decoration:underline;}',
    '.branded-cookie-banner__text a:hover{color:var(--color-accent);}',
    '.branded-cookie-banner__actions{display:flex;flex-direction:column;',
    'gap:var(--space-s);width:100%;flex-shrink:0;}',
    '@media(min-width:768px){.branded-cookie-banner__actions{flex-direction:row;',
    'width:auto;gap:var(--space-s);align-items:center;}}',
    '.branded-cookie-banner__btn{display:block;width:100%;padding:var(--space-s) var(--space-l);',
    'font-family:var(--font-body);font-size:var(--fs-small);font-weight:500;',
    'letter-spacing:.04em;text-align:center;white-space:nowrap;cursor:pointer;',
    'border-radius:var(--radius-sm);',
    'transition:background-color .2s ease,color .2s ease,border-color .2s ease;}',
    '@media(prefers-reduced-motion:reduce){.branded-cookie-banner__btn{transition:none;}}',
    '@media(min-width:768px){.branded-cookie-banner__btn{width:auto;display:inline-block;}}',
    '.branded-cookie-banner__btn--primary{background:var(--color-primary);',
    'color:var(--color-bg);border:1px solid var(--color-primary);}',
    '.branded-cookie-banner__btn--primary:hover,',
    '.branded-cookie-banner__btn--primary:focus-visible{background:var(--color-accent);',
    'border-color:var(--color-accent);}',
    '.branded-cookie-banner__btn--secondary{background:transparent;',
    'color:var(--color-text);border:1px solid var(--color-primary);}',
    '.branded-cookie-banner__btn--secondary:hover,',
    '.branded-cookie-banner__btn--secondary:focus-visible{border-color:var(--color-accent);',
    'color:var(--color-accent);}',
    '.branded-cookie-banner__btn:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px;}'
  ].join('');
  document.head.appendChild(style);

  var depth = (window.location.pathname.match(/\/pages\/guides\//) ? '../../' :
               window.location.pathname.match(/\/pages\//)         ? '../'    : '');
  var privacyHref = depth + 'pages/privacy-cookies.html';
  if (depth === '../') privacyHref = 'privacy-cookies.html';
  if (depth === '../../') privacyHref = '../privacy-cookies.html';

  var banner = document.createElement('div');
  banner.className = 'branded-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-label', 'Cookie consent');

  banner.innerHTML =
    '<div class="branded-cookie-banner__inner">' +
      '<p class="branded-cookie-banner__text">' +
        'We use cookies to improve your experience. Essential cookies are always active. ' +
        'Read our <a href="' + privacyHref + '">Privacy &amp; Cookies</a> policy.' +
      '</p>' +
      '<div class="branded-cookie-banner__actions">' +
        '<button class="branded-cookie-banner__btn branded-cookie-banner__btn--primary" ' +
          'data-consent="all" type="button">Accept all</button>' +
        '<button class="branded-cookie-banner__btn branded-cookie-banner__btn--secondary" ' +
          'data-consent="denied" type="button">Deny</button>' +
        '<button class="branded-cookie-banner__btn branded-cookie-banner__btn--secondary" ' +
          'data-consent="essential" type="button">View preferences</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    localStorage.setItem(DATE_KEY, new Date().toISOString());

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      banner.remove();
    } else {
      banner.classList.add('branded-cookie-banner--hidden');
      banner.addEventListener('transitionend', function () { banner.remove(); }, { once: true });
    }
  }

  banner.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-consent]');
    if (btn) dismiss(btn.getAttribute('data-consent'));
  });
})();
