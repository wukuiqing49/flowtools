import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { products, site, storeUrl } from "../site.config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const updated = "2026-08-04";

const copy = {
  en: {
    lang: "en",
    locale: "en_US",
    home: "Home",
    products: "Products",
    about: "About",
    support: "Support",
    privacy: "Privacy",
    language: "Language",
    switchLabel: "简体中文",
    skip: "Skip to content",
    nav: "Primary navigation",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    viewProduct: "Explore product",
    getPlay: "Get it on Google Play",
    screenshots: "Product screenshots",
    features: "Built for focused work",
    faq: "Frequently asked questions",
    related: "Explore more Android tools",
    contact: "Contact support",
    footerLine: "Practical Android software for work, media and everyday life.",
    rights: "All rights reserved.",
    legal: "Developed by AndroidManTou",
    breadcrumbHome: "Home",
    breadcrumbProducts: "Products"
  },
  zh: {
    lang: "zh-CN",
    locale: "zh_CN",
    home: "首页",
    products: "产品",
    about: "关于我们",
    support: "支持",
    privacy: "隐私",
    language: "语言",
    switchLabel: "English",
    skip: "跳到主要内容",
    nav: "主导航",
    menuOpen: "打开导航",
    menuClose: "关闭导航",
    viewProduct: "查看产品",
    getPlay: "前往 Google Play",
    screenshots: "产品截图",
    features: "为专注工作而设计",
    faq: "常见问题",
    related: "探索更多 Android 工具",
    contact: "联系支持",
    footerLine: "面向工作、媒体与日常生活的实用 Android 软件。",
    rights: "保留所有权利。",
    legal: "开发者：AndroidManTou",
    breadcrumbHome: "首页",
    breadcrumbProducts: "产品"
  }
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
}

function localizedPath(locale, type, slug = "") {
  const prefix = locale === "zh" ? "/zh-cn" : "";
  if (type === "home") return `${prefix}/`;
  if (type === "product") return `${prefix}/products/${slug}/`;
  return `${prefix}/${type}.html`;
}

function head({ locale, title, description, path, alternatePath, image, schemas = [], type = "website" }) {
  const c = copy[locale];
  const canonical = `${site.domain}${path}`;
  const alternate = `${site.domain}${alternatePath}`;
  const english = locale === "en" ? canonical : alternate;
  const chinese = locale === "zh" ? canonical : alternate;
  const socialImage = image.startsWith("http") ? image : `${site.domain}${image}`;
  return `<!doctype html>
<html lang="${c.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#ffffff">
  <meta name="color-scheme" content="light">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${english}">
  <link rel="alternate" hreflang="zh-CN" href="${chinese}">
  <link rel="alternate" hreflang="x-default" href="${english}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:locale" content="${c.locale}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/main.js" defer></script>
${schemas.length ? `  ${schemas.map(jsonLd).join("\n  ")}\n` : ""}</head>`;
}

function header(locale, active, alternatePath) {
  const c = copy[locale];
  const home = localizedPath(locale, "home");
  const productHref = `${home}#products`;
  return `<body>
  <a class="skip-link" href="#main-content">${c.skip}</a>
  <header class="site-header" data-header>
    <div class="container nav-wrap">
      <a class="brand" href="${home}" aria-label="FlowTools ${c.home}">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span></span>
        <span>FlowTools</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${c.menuOpen}" data-open-label="${c.menuOpen}" data-close-label="${c.menuClose}">
        <span class="nav-toggle-lines" aria-hidden="true"></span>
      </button>
      <nav class="site-nav" id="primary-navigation" aria-label="${c.nav}">
        <ul class="nav-list">
          <li><a class="nav-link" href="${home}"${active === "home" ? ' aria-current="page"' : ""}>${c.home}</a></li>
          <li><a class="nav-link" href="${productHref}"${active === "products" ? ' aria-current="page"' : ""}>${c.products}</a></li>
          <li><a class="nav-link" href="${localizedPath(locale, "about")}"${active === "about" ? ' aria-current="page"' : ""}>${c.about}</a></li>
          <li><a class="nav-link" href="${localizedPath(locale, "support")}"${active === "support" ? ' aria-current="page"' : ""}>${c.support}</a></li>
        </ul>
        <div class="language-switch" aria-label="${c.language}">
          <span aria-current="true">${locale === "en" ? "EN" : "中文"}</span>
          <a href="${alternatePath}" lang="${locale === "en" ? "zh-CN" : "en"}" data-language-choice="${locale === "en" ? "zh" : "en"}">${c.switchLabel}</a>
        </div>
      </nav>
    </div>
  </header>`;
}

function footer(locale) {
  const c = copy[locale];
  const home = localizedPath(locale, "home");
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${home}" aria-label="FlowTools ${c.home}">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span></span><span>FlowTools</span>
        </a>
        <p>${c.footerLine}</p>
      </div>
      <nav aria-label="${locale === "zh" ? "页脚导航" : "Footer navigation"}">
        <ul class="footer-links">
          <li><a href="${home}#products">${c.products}</a></li>
          <li><a href="${localizedPath(locale, "about")}">${c.about}</a></li>
          <li><a href="${localizedPath(locale, "privacy")}">${c.privacy}</a></li>
          <li><a href="${localizedPath(locale, "support")}">${c.support}</a></li>
        </ul>
      </nav>
    </div>
    <div class="container footer-bottom">
      <span>&copy; <span data-year>2026</span> ${site.company[locale]}. ${c.rights}</span>
      <span>${c.legal}</span>
    </div>
  </footer>
</body>
</html>`;
}

function organizationSchema(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.company[locale],
    url: site.domain,
    email: site.email,
    founder: { "@type": "Person", name: site.developer },
    sameAs: products.map((product) => storeUrl(product, locale))
  };
}

function homePage(locale) {
  const c = copy[locale];
  const isZh = locale === "zh";
  const path = localizedPath(locale, "home");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "home");
  const title = isZh
    ? "FlowTools | 专业实用的 Android 软件"
    : "FlowTools | Practical Android Apps for Real Work";
  const description = isZh
    ? "FlowTools 由上海屹和科技有限公司打造，提供照片元数据、现场检查、离线 AI、现场摄影和音乐管理等 Android 应用。"
    : "FlowTools builds practical Android apps for photo metadata, field inspection, offline AI, field photography and music libraries.";
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isZh ? "FlowTools Android 应用" : "FlowTools Android apps",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.domain}${localizedPath(locale, "product", product.slug)}`,
      name: product.storeName
    }))
  };
  const cards = products.map((product) => {
    const content = product[locale];
    return `<article class="product-card">
      <div class="product-card-top">
        <img class="app-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon" loading="lazy">
        <span class="availability">Google Play</span>
      </div>
      <p class="product-category">${content.category}</p>
      <h3>${product.name}</h3>
      <p>${content.description}</p>
      <ul class="tag-list" aria-label="${esc(product.name)} ${isZh ? "功能" : "features"}">${content.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <a class="text-action" href="${localizedPath(locale, "product", product.slug)}">${c.viewProduct}<span aria-hidden="true">→</span></a>
    </article>`;
  }).join("\n");
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [organizationSchema(locale), listSchema] })}
${header(locale, "home", alternatePath)}
  <main id="main-content">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="hero-media" aria-hidden="true">
        <img class="hero-shot hero-shot-one" src="/assets/apps/captionmeta/screen-1.webp" width="592" height="1052" alt="">
        <img class="hero-shot hero-shot-two" src="/assets/apps/sitereport/screen-1.webp" width="592" height="1052" alt="">
        <img class="hero-shot hero-shot-three" src="/assets/apps/pixora/screen-1.webp" width="592" height="1052" alt="">
      </div>
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">${isZh ? "Android 应用工作室" : "Independent Android studio"}</p>
          <h1 id="home-title">${isZh ? "FlowTools，专注实用的 Android 软件" : "FlowTools for Android"}</h1>
          <p>${isZh ? "从照片元数据与现场检查，到离线 AI 和音乐管理。我们打造目标清晰、尊重隐私、真正解决问题的移动工具。" : "From photo metadata and site inspections to offline AI and music libraries. Focused mobile tools that solve a clear problem and respect your work."}</p>
          <div class="button-row">
            <a class="button button-primary" href="#products">${isZh ? "浏览全部应用" : "Browse all apps"}</a>
            <a class="button button-ghost" href="${localizedPath(locale, "about")}">${isZh ? "了解开发团队" : "Meet the studio"}</a>
          </div>
          <div class="hero-facts" aria-label="${isZh ? "产品特点" : "Product highlights"}">
            <span>5 ${isZh ? "款已确认应用" : "published apps"}</span>
            <span>${isZh ? "Android 原生" : "Android native"}</span>
            <span>${isZh ? "独立开发" : "Independently built"}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section products-section" id="products" aria-labelledby="products-title">
      <div class="container">
        <div class="section-heading heading-row">
          <div><p class="eyebrow">${c.products}</p><h2 id="products-title">${isZh ? "每一款应用，只解决真正重要的问题。" : "One focused job. Done properly."}</h2></div>
          <p>${isZh ? "覆盖摄影、现场工作、离线 AI 与个人媒体管理，所有应用均面向 Android。" : "A growing collection for photography, field work, offline AI and personal media, built specifically for Android."}</p>
        </div>
        <div class="product-grid">${cards}</div>
      </div>
    </section>

    <section class="section principles" aria-labelledby="principles-title">
      <div class="container">
        <div class="section-heading"><p class="eyebrow">${isZh ? "产品原则" : "Product principles"}</p><h2 id="principles-title">${isZh ? "软件应当让工作更清楚。" : "Software should make the work clearer."}</h2></div>
        <div class="principle-grid">
          <article><span>01</span><h3>${isZh ? "专注" : "Focused"}</h3><p>${isZh ? "每个应用围绕明确任务设计，不堆砌无关功能。" : "Each app is built around a defined task, without unrelated clutter."}</p></article>
          <article><span>02</span><h3>${isZh ? "端侧优先" : "Device first"}</h3><p>${isZh ? "在适合的场景中优先使用本地和离线处理。" : "Local and offline processing is preferred where the workflow allows it."}</p></article>
          <article><span>03</span><h3>${isZh ? "可交付" : "Ready to deliver"}</h3><p>${isZh ? "从元数据到 PDF，输出结果可以直接进入下一步工作。" : "From metadata to PDF, outputs are prepared for the next step."}</p></article>
        </div>
      </div>
    </section>

    <section class="company-band" aria-labelledby="company-title">
      <div class="container company-layout">
        <div><p class="eyebrow">${isZh ? "开发团队" : "The studio"}</p><h2 id="company-title">${site.company[locale]}</h2></div>
        <div><p>${isZh ? "FlowTools 是 AndroidManTou 打造的 Android 软件品牌，持续发布面向专业工作与日常使用的独立应用。" : "FlowTools is the Android software brand of AndroidManTou, publishing independent tools for professional workflows and everyday use."}</p><a class="text-action light" href="${localizedPath(locale, "about")}">${isZh ? "关于我们" : "About the studio"}<span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  </main>
${footer(locale)}`;
}

function breadcrumb(locale, product) {
  const c = copy[locale];
  return `<nav class="breadcrumb" aria-label="${locale === "zh" ? "面包屑" : "Breadcrumb"}">
    <a href="${localizedPath(locale, "home")}">${c.breadcrumbHome}</a><span aria-hidden="true">/</span>
    <a href="${localizedPath(locale, "home")}#products">${c.breadcrumbProducts}</a><span aria-hidden="true">/</span>
    <span aria-current="page">${product.name}</span>
  </nav>`;
}

function productPage(locale, product) {
  const c = copy[locale];
  const isZh = locale === "zh";
  const content = product[locale];
  const path = localizedPath(locale, "product", product.slug);
  const alternatePath = localizedPath(isZh ? "en" : "zh", "product", product.slug);
  const title = `${product.storeName} | ${isZh ? "Android 应用" : "Android App"} | FlowTools`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: product.storeName,
    description: content.description,
    operatingSystem: "Android",
    applicationCategory: content.category,
    url: `${site.domain}${path}`,
    downloadUrl: storeUrl(product, locale),
    image: `${site.domain}${product.icon}`,
    screenshot: product.screenshots.map((image) => `${site.domain}${image}`),
    publisher: { "@type": "Organization", name: site.name, legalName: site.company[locale], url: site.domain }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };
  const screenshots = product.screenshots.map((image, index) => `<button class="shot-button" type="button" data-lightbox-src="${image}" aria-label="${esc(product.name)} ${isZh ? `截图 ${index + 1}` : `screenshot ${index + 1}`}"><img src="${image}" width="592" height="1052" alt="${esc(product.name)} ${isZh ? `应用界面截图 ${index + 1}` : `app interface screenshot ${index + 1}`}" loading="${index === 0 ? "eager" : "lazy"}"></button>`).join("");
  const features = content.features.map(([name, text], index) => `<article class="feature-item"><span>${String(index + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${text}</p></article>`).join("");
  const faqs = content.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("");
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3).map((item) => `<a class="related-product" href="${localizedPath(locale, "product", item.slug)}"><img src="${item.icon}" width="512" height="512" alt="" loading="lazy"><span><strong>${item.name}</strong><small>${item[locale].category}</small></span><span aria-hidden="true">→</span></a>`).join("");
  return `${head({ locale, title, description: content.description, path, alternatePath, image: `/assets/social/${product.slug}.png`, schemas: [schema, faqSchema], type: "product" })}
${header(locale, "products", alternatePath)}
  <main id="main-content">
    <section class="product-hero" aria-labelledby="product-title">
      <img class="product-backdrop" src="${product.screenshots[0]}" width="592" height="1052" alt="" aria-hidden="true">
      <div class="container product-hero-inner">
        ${breadcrumb(locale, product)}
        <div class="product-identity">
          <img class="product-hero-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon">
          <div>
            <p class="eyebrow">${content.category}</p>
            <h1 id="product-title">${product.name}</h1>
            <p class="product-tagline">${content.tagline}</p>
            <p class="product-description">${content.description}</p>
            <div class="button-row"><a class="button button-primary store-button" href="${storeUrl(product, locale)}" target="_blank" rel="noopener">${c.getPlay}<span aria-hidden="true">↗</span></a><a class="button button-ghost" href="${localizedPath(locale, "support")}?product=${product.slug}">${c.contact}</a></div>
            <p class="package-name">${product.packageName}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section screenshots-section" aria-labelledby="screenshots-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "真实应用界面" : "Inside the app"}</p><h2 id="screenshots-title">${c.screenshots}</h2></div><div class="screenshot-strip">${screenshots}</div></div>
    </section>

    <section class="section feature-section" aria-labelledby="features-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "核心能力" : "Core capabilities"}</p><h2 id="features-title">${c.features}</h2></div><div class="feature-grid">${features}</div></div>
    </section>

    <section class="section faq-section" aria-labelledby="faq-title">
      <div class="container faq-layout"><div class="section-heading"><p class="eyebrow">FAQ</p><h2 id="faq-title">${c.faq}</h2></div><div class="faq-list">${faqs}</div></div>
    </section>

    <section class="section related-section" aria-labelledby="related-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">FlowTools</p><h2 id="related-title">${c.related}</h2></div><div class="related-grid">${related}</div></div>
    </section>
    <dialog class="image-dialog" data-image-dialog><button class="dialog-close" type="button" aria-label="${isZh ? "关闭图片" : "Close image"}" title="${isZh ? "关闭" : "Close"}">×</button><img src="" alt=""></dialog>
  </main>
${footer(locale)}`;
}

function pageIntro(locale, eyebrow, title, description) {
  return `<header class="page-intro"><div class="container page-intro-inner"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div></header>`;
}

function aboutPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "about");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "about");
  const title = isZh ? "关于 FlowTools | AndroidManTou" : "About FlowTools | AndroidManTou";
  const description = isZh ? "了解 FlowTools、AndroidManTou 与上海屹和科技有限公司。" : "Learn about FlowTools, AndroidManTou and Shanghai Yihe Technology Co., Ltd.";
  const schema = { "@context": "https://schema.org", "@type": "AboutPage", name: title, url: `${site.domain}${path}`, about: organizationSchema(locale) };
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [schema] })}
${header(locale, "about", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "关于我们" : "About", isZh ? "独立开发，认真解决真实问题。" : "Independent software for real-world work.", isZh ? "FlowTools 是 AndroidManTou 打造的 Android 软件品牌。" : "FlowTools is the Android software brand built by AndroidManTou.")}
    <section class="section"><div class="container about-layout"><div><p class="eyebrow">${isZh ? "我们的方向" : "What we build"}</p><h2>${isZh ? "面向专业工作与日常使用的 Android 工具。" : "Android tools for professional workflows and everyday use."}</h2></div><div class="prose"><p>${isZh ? "我们关注照片元数据、现场检查、现场摄影、离线 AI 和个人媒体管理等具体场景。每款应用都围绕明确的问题展开，并尽可能减少不必要的复杂度。" : "We focus on concrete needs across photo metadata, site inspection, field photography, offline AI and personal media. Each app starts with a defined problem and removes unnecessary complexity."}</p><p>${isZh ? "FlowTools 由上海屹和科技有限公司运营，Google Play 开发者名称为 AndroidManTou。" : "FlowTools is operated by Shanghai Yihe Technology Co., Ltd. and publishes on Google Play under the developer name AndroidManTou."}</p></div></div></section>
    <section class="company-band"><div class="container company-layout"><div><p class="eyebrow">${isZh ? "公司主体" : "Company"}</p><h2>${site.company[locale]}</h2></div><div><dl class="identity-list"><div><dt>${isZh ? "品牌" : "Brand"}</dt><dd>FlowTools</dd></div><div><dt>${isZh ? "开发者" : "Developer"}</dt><dd>${site.developer}</dd></div><div><dt>${isZh ? "地区" : "Region"}</dt><dd>${isZh ? "中国" : "China"}</dd></div><div><dt>${isZh ? "联系" : "Contact"}</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div></dl></div></div></section>
  </main>
${footer(locale)}`;
}

function supportPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "support");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "support");
  const title = isZh ? "FlowTools 支持 | 联系我们" : "FlowTools Support | Contact Us";
  const description = isZh ? "获取 FlowTools Android 应用的购买、技术、隐私与使用支持。" : "Get purchase, technical, privacy and product support for FlowTools Android apps.";
  const schema = { "@context": "https://schema.org", "@type": "ContactPage", name: title, url: `${site.domain}${path}`, mainEntity: { "@type": "Organization", name: site.name, email: site.email } };
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [schema] })}
${header(locale, "support", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "支持" : "Support", isZh ? "告诉我们发生了什么。" : "Tell us what happened.", isZh ? "我们为 FlowTools 产品的技术问题、购买、隐私请求和反馈提供支持。" : "We help with technical questions, purchases, privacy requests and feedback across FlowTools products.")}
    <section class="section"><div class="container support-layout"><div class="contact-panel"><p class="eyebrow">${isZh ? "电子邮件" : "Email support"}</p><h2>${isZh ? "联系 FlowTools" : "Contact FlowTools"}</h2><div class="field-group"><label for="support-product">${isZh ? "产品" : "Product"}</label><select id="support-product" data-support-product><option value="FlowTools">FlowTools</option>${products.map((product) => `<option value="${product.name}" data-slug="${product.slug}">${product.name}</option>`).join("")}</select></div><a class="button button-primary support-email" href="mailto:${site.email}?subject=FlowTools%20Support" data-support-link>${isZh ? "发送邮件" : "Email support"}<span aria-hidden="true">↗</span></a><p class="contact-address">${site.email}</p></div><div class="support-notes"><article><span>01</span><h3>${isZh ? "说明产品和版本" : "Name the app and version"}</h3><p>${isZh ? "提供应用名称、版本号与 Android 版本。" : "Include the app name, app version and your Android version."}</p></article><article><span>02</span><h3>${isZh ? "描述复现步骤" : "Describe the steps"}</h3><p>${isZh ? "说明问题发生前执行的操作，以及你预期的结果。" : "Tell us what you did before the issue and what you expected to happen."}</p></article><article><span>03</span><h3>${isZh ? "保护私人内容" : "Protect private content"}</h3><p>${isZh ? "除非支持人员明确要求，请不要发送私人照片或文档。" : "Do not send private photos or documents unless support specifically requests them."}</p></article></div></div></section>
  </main>
${footer(locale)}`;
}

function privacyPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "privacy");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "privacy");
  const title = isZh ? "隐私政策 | FlowTools" : "Privacy Policy | FlowTools";
  const description = isZh ? "了解 FlowTools Android 应用如何处理照片、媒体、位置、检查记录和诊断信息。" : "Learn how FlowTools Android apps handle photos, media, location, inspection records and diagnostic information.";
  const labels = isZh ? ["原则", "应用数据", "权限", "网络与分享", "保留与删除", "儿童隐私", "变更", "联系"] : ["Principles", "App data", "Permissions", "Network and sharing", "Retention and deletion", "Children", "Changes", "Contact"];
  const sections = isZh ? [
    ["principles", "我们的原则", "FlowTools 由上海屹和科技有限公司运营。我们不会出售个人信息，也不会把你在应用中处理的内容用于广告画像。应用会尽可能减少不必要的数据传输，并在适合的功能中优先采用本地处理。"],
    ["data", "应用数据", "不同产品处理的数据取决于其功能，可能包括你选择的照片、音频文件、IPTC/EXIF/XMP 元数据、检查清单、报告内容、位置上下文或导出文件。具体处理行为应同时以相应应用的 Google Play“数据安全”说明和应用内提示为准。"],
    ["permissions", "设备权限", "应用仅在功能需要时请求 Android 权限。这可能包括相机、用户选择的照片和媒体、音频文件、存储空间或位置。拒绝或撤销权限可能会让相应功能无法工作，但不会影响不依赖该权限的功能。"],
    ["network", "网络、上传与分享", "当你主动使用上传、云端音乐、分享或导出功能时，相关内容可能发送到你选择或配置的服务。GeoLens 的服务器上传、SiteReport 的报告分享以及 Cloud Music 的网络来源都由用户主动触发；第三方服务的数据处理同时受其自身政策约束。"],
    ["retention", "保留与删除", "本地项目与媒体通常保留在设备上，直到你在应用中删除、清除应用数据或卸载应用。发送到第三方或用户配置服务器的内容需要在对应服务中管理。你也可以通过支持邮箱提出与 FlowTools 可控数据有关的访问或删除请求。"],
    ["children", "儿童隐私", "FlowTools 的专业工具并非面向 13 岁以下儿童设计。我们不会故意收集儿童的个人信息；如发现相关情况，请联系我们处理。"],
    ["changes", "政策变更", "当产品功能、法律要求或数据实践发生变化时，我们可能更新本政策。页面顶部的日期表示当前版本。"],
    ["contact", "联系我们", `隐私问题或数据请求请发送邮件至 <a href="mailto:${site.email}">${site.email}</a>，并注明涉及的 FlowTools 产品。`]
  ] : [
    ["principles", "Our principles", "FlowTools is operated by Shanghai Yihe Technology Co., Ltd. We do not sell personal information or use content processed in our apps to build advertising profiles. Our apps minimize unnecessary transfers and prefer local processing where the feature allows it."],
    ["data", "App data", "The data handled by each product depends on its function and may include photos you select, audio files, IPTC/EXIF/XMP metadata, inspection records, report content, location context or exported files. The relevant Google Play Data safety disclosure and in-app notice also apply to each app."],
    ["permissions", "Device permissions", "Apps request Android permissions only when a feature needs them. These may include the camera, user-selected photos and media, audio files, storage or location. Refusing or revoking permission may disable the related feature without affecting features that do not depend on it."],
    ["network", "Network, uploads and sharing", "When you actively use upload, cloud music, sharing or export features, related content may be sent to a service you select or configure. GeoLens server uploads, SiteReport report sharing and Cloud Music network sources are user-initiated. Third-party services process data under their own policies."],
    ["retention", "Retention and deletion", "Local projects and media normally remain on the device until you delete them, clear app data or uninstall the app. Content sent to a third party or user-configured server must be managed through that service. You may email us with access or deletion requests for data controlled by FlowTools."],
    ["children", "Children's privacy", "FlowTools professional tools are not designed for children under 13. We do not knowingly collect personal information from children. Contact us if you believe this has occurred."],
    ["changes", "Changes to this policy", "We may update this policy when product features, legal requirements or data practices change. The date at the top of this page identifies the current version."],
    ["contact", "Contact", `For privacy questions or data requests, email <a href="mailto:${site.email}">${site.email}</a> and name the FlowTools product involved.`]
  ];
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.domain}${path}`, dateModified: updated }] })}
${header(locale, "", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "隐私" : "Privacy", isZh ? "清楚说明数据如何参与工作。" : "Clear about how data supports the work.", isZh ? "最后更新：2026 年 8 月 4 日" : "Last updated: August 4, 2026")}
    <div class="container section legal-layout"><aside class="legal-nav" aria-label="${isZh ? "隐私政策章节" : "Privacy policy sections"}"><strong>${isZh ? "本页内容" : "On this page"}</strong>${sections.map((section, index) => `<a href="#${section[0]}">${labels[index]}</a>`).join("")}</aside><article class="prose legal-copy">${sections.map(([id, name, text]) => `<section id="${id}"><h2>${name}</h2><p>${text}</p></section>`).join("")}</article></div>
  </main>
${footer(locale)}`;
}

function notFoundPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "404");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "404");
  const title = isZh ? "页面未找到 | FlowTools" : "Page Not Found | FlowTools";
  const description = isZh ? "无法找到请求的 FlowTools 页面。" : "The requested FlowTools page could not be found.";
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png" }).replace("<meta name=\"description\"", "<meta name=\"robots\" content=\"noindex\">\n  <meta name=\"description\"")}
${header(locale, "", alternatePath)}
  <main class="not-found" id="main-content"><div class="container"><span class="not-found-code">404</span><h1>${isZh ? "页面不存在" : "Page not found"}</h1><p>${isZh ? "地址可能有误，或者页面已经移动。" : "The address may be incorrect, or the page may have moved."}</p><div class="button-row"><a class="button button-primary" href="${localizedPath(locale, "home")}">${isZh ? "返回首页" : "Return home"}</a><a class="button button-ghost" href="${localizedPath(locale, "support")}">${copy[locale].support}</a></div></div></main>
${footer(locale)}`;
}

async function output(relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${content.trim()}\n`, "utf8");
}

const pages = [
  ["index.html", homePage("en")],
  ["zh-cn/index.html", homePage("zh")],
  ["about.html", aboutPage("en")],
  ["zh-cn/about.html", aboutPage("zh")],
  ["support.html", supportPage("en")],
  ["zh-cn/support.html", supportPage("zh")],
  ["privacy.html", privacyPage("en")],
  ["zh-cn/privacy.html", privacyPage("zh")],
  ["404.html", notFoundPage("en")],
  ["zh-cn/404.html", notFoundPage("zh")]
];

for (const product of products) {
  pages.push([`products/${product.slug}/index.html`, productPage("en", product)]);
  pages.push([`zh-cn/products/${product.slug}/index.html`, productPage("zh", product)]);
}

for (const [path, content] of pages) await output(path, content);

const sitemapPaths = ["home", "about", "support", "privacy"];
const sitemapEntries = sitemapPaths.map((type) => [localizedPath("en", type), localizedPath("zh", type)]);
for (const product of products) sitemapEntries.push([localizedPath("en", "product", product.slug), localizedPath("zh", "product", product.slug)]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.flatMap(([en, zh]) => [[en, zh], [zh, en]]).map(([path, alternate]) => `  <url>
    <loc>${site.domain}${path}</loc>
    <xhtml:link rel="alternate" hreflang="${path.startsWith("/zh-cn") ? "zh-CN" : "en"}" href="${site.domain}${path}"/>
    <xhtml:link rel="alternate" hreflang="${path.startsWith("/zh-cn") ? "en" : "zh-CN"}" href="${site.domain}${alternate}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${path.startsWith("/zh-cn") ? alternate : path}"/>
    <lastmod>${updated}</lastmod>
  </url>`).join("\n")}
</urlset>`;

await output("sitemap.xml", sitemap);
await output("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml`);

console.log(`Built ${pages.length} HTML pages and sitemap.xml`);
