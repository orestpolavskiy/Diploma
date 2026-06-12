(function () {
  'use strict';

  var base = (window.location.pathname.match(/\/pages\/guides\//) ? '../../' :
              window.location.pathname.match(/\/pages\//)          ? '../'    : '');

  var p = base;

  var html =
    '<div class="site-footer__inner">' +

      '<div class="site-footer__col site-footer__col--brand">' +
        '<a href="' + p + 'index.html" class="site-footer__logo" aria-label="BRANDED — home">' +
          '<span class="site-footer__logo-mark" aria-hidden="true"></span>' +
          '<span>FASHION</span>' +
        '</a>' +
        '<p class="site-footer__tagline">Clothing made to last, designed in Vilnius.</p>' +
      '</div>' +

      '<div class="site-footer__col">' +
        '<h3 class="site-footer__col-heading">Shop</h3>' +
        '<ul class="site-footer__links">' +
          '<li><a href="http://diploma.local/shop/">All Products</a></li>' +
          '<li><a href="http://diploma.local/shop/">New In</a></li>' +
          '<li><a href="http://diploma.local/shop/">Sale</a></li>' +
          '<li><a href="#">Gift Cards</a></li>' +
        '</ul>' +
      '</div>' +

      '<div class="site-footer__col">' +
        '<h3 class="site-footer__col-heading">Help</h3>' +
        '<ul class="site-footer__links">' +
          '<li><a href="' + p + 'pages/shipping-returns.html">Shipping &amp; Returns</a></li>' +
          '<li><a href="' + p + 'pages/guides/finding-fit.html">Size Guide</a></li>' +
          '<li><a href="' + p + 'pages/contact.html">Contact</a></li>' +
          '<li><a href="#">FAQ</a></li>' +
        '</ul>' +
      '</div>' +

      '<div class="site-footer__col">' +
        '<h3 class="site-footer__col-heading">Stay in the loop</h3>' +
        '<p class="site-footer__newsletter-text">Quiet emails. New collections and seasonal guides.</p>' +
        '<form class="site-footer__newsletter-form" id="footer-newsletter" ' +
            'action="https://api.web3forms.com/submit" method="POST">' +
          '<input type="hidden" name="access_key" value="193f96a7-51e1-47ae-9db4-fbc549298836">' +
          '<input type="hidden" name="subject" value="New newsletter signup — BRANDED">' +
          '<input type="email" name="email" class="site-footer__newsletter-input" ' +
            'placeholder="your@email.com" aria-label="Your email address" required />' +
          '<button type="submit" class="btn btn--primary">Subscribe</button>' +
        '</form>' +
        '<p class="site-footer__newsletter-success" id="footer-newsletter-success" hidden>' +
          "You're in. Quiet emails only." +
        '</p>' +
      '</div>' +

    '</div>' +

    '<div class="site-footer__bottom">' +
      '<p class="site-footer__copyright">© 2026 BRANDED — Bachelor Thesis Project, Vytautas Magnus University</p>' +
      '<div class="site-footer__bottom-links">' +
        '<a href="' + p + 'pages/privacy-cookies.html">Privacy &amp; Cookies</a>' +
        '<a href="#">Terms</a>' +
        '<button class="site-footer__cookie-reset" type="button" id="cookie-settings-btn">Cookie Settings</button>' +
      '</div>' +
    '</div>';

  var footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = html;

  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'footer-newsletter') return;
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type="submit"]');
    var original = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.success) {
        form.style.display = 'none';
        var msg = document.getElementById('footer-newsletter-success');
        if (msg) msg.hidden = false;
      } else {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        alert('Sorry, could not subscribe. Please try again.');
      }
    })
    .catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = original; }
      alert('Network error. Please try again.');
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'cookie-settings-btn') {
      localStorage.removeItem('branded_cookie_consent');
      localStorage.removeItem('branded_cookie_consent_date');
      window.location.reload();
    }
  });
})();
