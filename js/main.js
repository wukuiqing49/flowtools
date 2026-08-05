(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  document.querySelectorAll("[data-year]").forEach(function (year) {
    year.textContent = new Date().getFullYear();
  });

  function menuIsOpen() {
    return Boolean(toggle && toggle.getAttribute("aria-expanded") === "true");
  }

  function closeMenu(restoreFocus) {
    if (!toggle || !nav || !menuIsOpen()) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", toggle.dataset.openLabel);
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    if (restoreFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const shouldOpen = !menuIsOpen();
      toggle.setAttribute("aria-expanded", String(shouldOpen));
      toggle.setAttribute("aria-label", shouldOpen ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
      nav.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("menu-open", shouldOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuIsOpen()) closeMenu(true);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 700) closeMenu(false);
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("[data-language-choice]").forEach(function (link) {
    link.addEventListener("click", function () {
      try {
        localStorage.setItem("flowtools-language", link.dataset.languageChoice);
      } catch (_) {
        // Language navigation still works when storage is unavailable.
      }
    });
  });

  const supportProduct = document.querySelector("[data-support-product]");
  const supportLink = document.querySelector("[data-support-link]");
  if (supportProduct && supportLink) {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    if (requested) {
      const matchingOption = Array.from(supportProduct.options).find(function (option) {
        return option.dataset.slug === requested;
      });
      if (matchingOption) supportProduct.value = matchingOption.value;
    }

    function updateSupportLink() {
      const subject = encodeURIComponent(supportProduct.value + " Support");
      supportLink.href = "mailto:wukuiqing@gmail.com?subject=" + subject;
    }

    updateSupportLink();
    supportProduct.addEventListener("change", updateSupportLink);
  }

  if ("serviceWorker" in navigator && window.location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
})();
