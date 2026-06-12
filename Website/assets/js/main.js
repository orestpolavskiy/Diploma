(function () {
  "use strict";

  // mobile menu toggle
  const toggle = document.querySelector(".menu-toggle");
  const desktopNav = document.querySelector(".site-nav");
  let mobileNavEl = null;

  function buildMobileNav() {
    if (mobileNavEl || !desktopNav) return;
    mobileNavEl = document.createElement("nav");
    mobileNavEl.id = "mobile-nav";
    mobileNavEl.className = "site-nav-mobile";
    mobileNavEl.setAttribute("aria-label", "Mobile primary");
    mobileNavEl.hidden = true;

    desktopNav.querySelectorAll(".site-nav__link").forEach(function (link) {
      const a = link.cloneNode(true);
      a.classList.add("site-nav-mobile__link");
      mobileNavEl.appendChild(a);
    });

    // inject styles inline so this works without a separate stylesheet
    const style = document.createElement("style");
    style.textContent = "" +
      ".site-nav-mobile{display:flex;flex-direction:column;gap:var(--space-m);" +
      "padding:var(--space-l) var(--container-padding-mobile);" +
      "border-top:var(--border-width) solid var(--color-border);" +
      "background:var(--color-bg);}" +
      ".site-nav-mobile__link{font-size:var(--fs-body);font-weight:var(--fw-medium);" +
      "letter-spacing:var(--ls-button);text-transform:uppercase;color:var(--color-text);" +
      "padding:var(--space-s) 0;}" +
      "@media(min-width:768px){.site-nav-mobile{display:none!important;}}";
    document.head.appendChild(style);

    const header = document.querySelector(".site-header");
    if (header) header.appendChild(mobileNavEl);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      buildMobileNav();
      if (!mobileNavEl) return;
      const isOpen = !mobileNavEl.hidden;
      mobileNavEl.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    });
  }

  // mark active nav link based on current URL
  const path = window.location.pathname.toLowerCase();
  document.querySelectorAll(".site-nav__link").forEach(function (link) {
    const href = link.getAttribute("href") || "";
    if (!href) return;
    // works for both /pages/about.html and /shop/ type paths
    const fileName = href.split("/").filter(Boolean).pop() || "";
    if (path.endsWith(fileName) && fileName !== "") {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // lazy load images that use data-src
  if ("IntersectionObserver" in window) {
    const lazyImgs = document.querySelectorAll("img[data-src]");
    if (lazyImgs.length) {
      const io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute("data-src");
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      }, { rootMargin: "200px" });
      lazyImgs.forEach(function (img) { io.observe(img); });
    }
  }

})();
