<?php
/**
 * Custom footer — replaces Storefront's default.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

        </div><!-- .col-full -->
    </div><!-- #content -->

    <footer id="colophon" class="site-footer" role="contentinfo">
        <div class="site-footer__inner">

            <!-- Column 1: Brand -->
            <div class="site-footer__col site-footer__col--brand">
                <a href="http://127.0.0.1:5500/Website/index.html" class="site-footer__logo">
                    <span class="site-footer__logo-mark"></span>
                    <span>FASHION</span>
                </a>
                <p class="site-footer__tagline">Clothing made to last, designed in Vilnius.</p>
            </div>

            <!-- Column 2: Shop -->
            <div class="site-footer__col">
                <h3 class="site-footer__col-heading">Shop</h3>
                <ul class="site-footer__links">
                    <li><a href="http://diploma.local/shop/">All Products</a></li>
                    <li><a href="http://diploma.local/shop/">New In</a></li>
                    <li><a href="http://diploma.local/shop/">Sale</a></li>
                    <li><a href="#">Gift Cards</a></li>
                </ul>
            </div>

            <!-- Column 3: Help -->
            <div class="site-footer__col">
                <h3 class="site-footer__col-heading">Help</h3>
                <ul class="site-footer__links">
                    <li><a href="http://127.0.0.1:5500/Website/pages/shipping-returns.html">Shipping &amp; Returns</a></li>
                    <li><a href="http://127.0.0.1:5500/Website/pages/guides/finding-fit.html">Size Guide</a></li>
                    <li><a href="http://127.0.0.1:5500/Website/pages/contact.html">Contact</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>

            <!-- Column 4: Newsletter -->
            <div class="site-footer__col">
                <h3 class="site-footer__col-heading">Stay in the loop</h3>
                <p class="site-footer__newsletter-text">Quiet emails. New collections and seasonal guides.</p>
                <form class="site-footer__newsletter-form" id="store-newsletter" action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="193f96a7-51e1-47ae-9db4-fbc549298836">
                    <input type="hidden" name="subject" value="New newsletter signup — BRANDED (store)">
                    <input class="site-footer__newsletter-input" type="email" name="email" placeholder="your@email.com" required>
                    <button type="submit" class="btn btn--primary">Subscribe</button>
                </form>
                <p class="site-footer__newsletter-success" id="store-newsletter-success" hidden>Thanks — you're subscribed.</p>
            </div>

        </div><!-- .site-footer__inner -->

        <div class="site-footer__bottom">
            <p class="site-footer__copyright">&copy; 2026 BRANDED &mdash; Bachelor Thesis Project, Vytautas Magnus University</p>
            <nav class="site-footer__bottom-links">
                <a href="http://127.0.0.1:5500/Website/pages/privacy-cookies.html">Privacy &amp; Cookies</a>
                <a href="#">Terms</a>
                <a href="http://127.0.0.1:5500/Website/pages/privacy-cookies.html">Cookie Settings</a>
            </nav>
        </div><!-- .site-footer__bottom -->

    </footer>

</div><!-- #page -->

<script>
(function () {
  var form = document.getElementById('store-newsletter');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
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
        form.hidden = true;
        var msg = document.getElementById('store-newsletter-success');
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
})();
</script>

<?php wp_footer(); ?>
</body>
</html>
