import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { products, site, storeUrl } from "../site.config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const updated = "2026-08-05";
const siteUpdated = "2026-08-06";
const privacyUpdated = "2026-08-05";

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

const productDisplayOrder = ["sitereport", "captionmeta", "cloud-music", "geolens", "pixora"];
const orderedProducts = productDisplayOrder.map((slug) => products.find((product) => product.slug === slug));

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

function updatedLabel(locale) {
  const date = new Date(`${updated}T00:00:00Z`);
  if (locale === "zh") {
    return `最后更新：${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
  }
  return `Last updated: ${new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date)}`;
}

function localizedPath(locale, type, slug = "") {
  const prefix = locale === "zh" ? "/zh-cn" : "";
  if (type === "home") return `${prefix}/`;
  if (type === "products") return `${prefix}/products/`;
  if (type === "product") return `${prefix}/products/${slug}/`;
  return `${prefix}/${type}.html`;
}

function localizedProductPagePath(locale, product, page) {
  const prefix = locale === "zh" ? "/zh-cn" : "";
  return `${prefix}/products/${product.slug}/${page}.html`;
}

function head({ locale, title, description, path, alternatePath, image, imageAlt = title, schemas = [], type = "website", robots = "index,follow,max-image-preview:large", productStyles = false, keywords = [] }) {
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
  <meta name="author" content="${esc(site.company[locale])}">
  <meta name="robots" content="${robots}">
${keywords.length ? `  <meta name="keywords" content="${esc(keywords.join(", "))}">\n` : ""}  <meta name="theme-color" content="#ffffff">
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
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta property="og:locale:alternate" content="${locale === "en" ? "zh_CN" : "en_US"}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="/css/styles.css">
${productStyles ? '  <link rel="stylesheet" href="/css/product-pages.css">\n' : ""}  <script src="/js/main.js" defer></script>
${schemas.length ? `  ${schemas.map(jsonLd).join("\n  ")}\n` : ""}</head>`;
}

function header(locale, active, alternatePath) {
  const c = copy[locale];
  const home = localizedPath(locale, "home");
  const productHref = localizedPath(locale, "products");
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
          <li><a href="${localizedPath(locale, "products")}">${c.products}</a></li>
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
    "@id": `${site.domain}/#organization`,
    name: site.company[locale],
    alternateName: site.name,
    legalName: site.company[locale],
    url: site.domain,
    email: site.email,
    logo: `${site.domain}/favicon.svg`,
    founder: { "@type": "Person", name: site.developer },
    brand: { "@type": "Brand", name: site.name },
    knowsAbout: [
      "Android application development",
      "field inspection software",
      "photo metadata workflows",
      "offline photo AI",
      "mobile music libraries"
    ],
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.email, availableLanguage: ["en", "zh-CN"] },
    sameAs: orderedProducts.map((product) => storeUrl(product, locale))
  };
}

function websiteSchema(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    name: site.name,
    alternateName: site.alternateName,
    url: `${site.domain}${localizedPath(locale, "home")}`,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: { "@id": `${site.domain}/#organization` }
  };
}

function breadcrumbSchema(locale, product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy[locale].breadcrumbHome, item: `${site.domain}${localizedPath(locale, "home")}` },
      { "@type": "ListItem", position: 2, name: copy[locale].breadcrumbProducts, item: `${site.domain}${localizedPath(locale, "products")}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${site.domain}${localizedPath(locale, "product", product.slug)}` }
    ]
  };
}

function productsPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "products");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "products");
  const title = isZh
    ? "Android 应用产品组合 | 上海促动科技有限公司 | FlowTools"
    : "Android App Portfolio | Shanghai Cudong Technology | FlowTools";
  const description = isZh
    ? "浏览上海促动科技有限公司 FlowTools 产品组合：现场检查、照片元数据、现场摄影、离线 AI 和音乐管理 Android 应用。"
    : "Explore FlowTools Android products from Shanghai Cudong Technology: site inspection, photo metadata, field photography, offline AI and music tools.";
  const items = products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.storeName,
    url: `${site.domain}${localizedPath(locale, "product", product.slug)}`
  }));
  const cards = products.map((product) => {
    const content = product[locale];
    return `<article class="product-card">
      <div class="product-card-top"><img class="app-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon" loading="lazy"><span class="availability">${isZh ? "已发布" : "Published"}</span></div>
      <p class="product-category">${content.category}</p><h2>${product.name}</h2><p>${content.description}</p>
      <ul class="tag-list" aria-label="${esc(product.name)} ${isZh ? "功能" : "features"}">${content.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <a class="text-action" href="${localizedPath(locale, "product", product.slug)}">${isZh ? "查看项目详情" : "View project details"}<span aria-hidden="true">→</span></a>
    </article>`;
  }).join("\n");
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `${site.domain}${path}`, isPartOf: { "@id": `${site.domain}/#website` }, publisher: { "@id": `${site.domain}/#organization` }, mainEntity: { "@type": "ItemList", itemListElement: items } };
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", imageAlt: isZh ? "FlowTools Android 应用产品组合" : "FlowTools Android app portfolio", schemas: [organizationSchema(locale), collectionSchema] })}
${header(locale, "products", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "产品组合" : "Product portfolio", isZh ? "为具体工作场景打造的 Android 产品。" : "Android products for specific situations.", isZh ? "从现场检查到照片工作流，了解 FlowTools 的完整产品组合。" : "Explore the complete FlowTools portfolio, from field inspection to photo workflows.")}
    <section class="section products-section"><div class="container"><div class="product-grid">${cards}</div></div></section>
  </main>
${footer(locale)}`;
}

function homePage(locale) {
  const c = copy[locale];
  const isZh = locale === "zh";
  const path = localizedPath(locale, "home");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "home");
  const title = isZh
    ? "FlowTools | 面向现场与照片工作的 Android 工具"
    : "FlowTools | Android Tools for Field Work and Photos";
  const description = isZh
    ? "FlowTools 提供面向现场检查、照片元数据、离线 AI 与音乐管理的 Android 应用，帮助你用更少步骤完成具体任务。"
    : "FlowTools builds focused Android apps for field inspection, photo metadata, offline AI and music management, helping you finish specific tasks with fewer steps.";
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isZh ? "FlowTools Android 应用" : "FlowTools Android apps",
    itemListElement: orderedProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.domain}${localizedPath(locale, "product", product.slug)}`,
      name: product.storeName
    }))
  };
  const appFaq = isZh ? [
    ["FlowTools 应用可以离线使用吗？", "多款应用支持离线或端侧核心工作流，包括 SiteReport 现场记录、CaptionMeta 元数据编辑、Pixora 照片 AI 与本地音乐播放。上传、分享、云端来源或模型下载等功能仍可能需要网络。"],
    ["需要注册 FlowTools 账号吗？", "这些应用不共用一个必须注册的 FlowTools 账号。使用你主动选择的云端来源或外部服务时，对方可能要求登录。"],
    ["应用免费吗？", "价格、免费功能与应用内购买可能随产品和地区不同。请在下载前查看对应 Google Play 页面上的当前价格与购买说明。"],
    ["支持哪些 Android 版本？", "每款应用均通过 Google Play 提供 Android 版本。Google Play 会根据你的设备显示当前兼容性，具体要求以各应用的商店页面为准。"],
    ["我的照片或工作数据会自动上传吗？", "核心工作流优先在设备上处理数据。只有当你主动使用上传、分享、云端来源或外部交付功能时，相关内容才可能发送到你选择的服务；请同时查看各产品隐私页与 Google Play 数据安全说明。"],
    ["如何下载安装？", "选择下面的应用并点击对应的 Google Play 徽章，即可打开官方商店页面查看兼容性、价格、权限并安装。"]
  ] : [
    ["Can FlowTools apps work offline?", "Several apps support offline or on-device core workflows, including SiteReport field records, CaptionMeta metadata editing, Pixora photo AI and local music playback. Uploads, sharing, cloud sources or model downloads may still require a connection."],
    ["Do I need a FlowTools account?", "The apps do not share a required FlowTools account. A cloud source or external service you choose to use may require its own sign-in."],
    ["Are the apps free?", "Pricing, free features and in-app purchases may vary by product and region. Check the relevant Google Play listing for current pricing and purchase details before installing."],
    ["Which Android versions are supported?", "Each app is distributed for Android through Google Play. Google Play shows current compatibility for your device; check the individual store listing for the latest requirements."],
    ["Are my photos or work records uploaded automatically?", "Core workflows prioritize processing on the device. Content may be sent to a service you select only when you use an upload, sharing, cloud-source or external-delivery feature. Review each product privacy page and its Google Play Data safety disclosure."],
    ["How do I install an app?", "Choose an app below and select its Google Play badge to open the official store listing, where you can review compatibility, pricing, permissions and install it."]
  ];
  const appFaqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: appFaq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  const homeDescriptions = isZh ? {
    sitereport: "适用于巡检人员、施工与设施团队。通过清单完成检查，把照片证据和可选 GPS 与发现保持关联，最后生成可分享的 PDF 报告。",
    captionmeta: "适用于摄影师与内容团队。在 Android 上批量编辑 IPTC、EXIF 与 XMP 信息，让照片在上传、交付或归档前更快整理到位。",
    "cloud-music": "适用于管理个人曲库的用户。在一个简洁音乐库中浏览本地歌曲和自选云端来源，并让设备上的音乐保持离线可听。",
    geolens: "适用于现场技术与拍摄团队。在照片中保留位置和结构化元数据，并把整理好的现场影像交付到指定工作流。",
    pixora: "适用于照片较多、重视隐私的用户。通过端侧 AI 查找相似图片并完成常用照片处理，无需把整个图库交给远程搜索服务。"
  } : {
    sitereport: "For inspectors, contractors and facilities teams. Follow checklists, keep photos and optional GPS with each finding, then turn a site visit into a shareable PDF report.",
    captionmeta: "For photographers and content teams. Batch-edit IPTC, EXIF and XMP details on Android so photos are organized sooner for upload, delivery or archive.",
    "cloud-music": "For people who manage their own music collection. Browse local tracks and selected cloud sources in one focused library, with device music available offline.",
    geolens: "For field technicians and photo teams. Keep location and structured metadata with each image, then deliver prepared field media into a configured workflow.",
    pixora: "For large photo libraries and privacy-conscious users. Find similar images and use practical photo tools with on-device AI, without sending the full library to a remote search service."
  };
  const featuredProduct = orderedProducts[0];
  const cards = orderedProducts.map((product) => {
    const content = product[locale];
    return `<article class="product-card">
      <div class="product-card-top">
        <img class="app-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon" loading="lazy">
      </div>
      <p class="product-category">${content.category}</p>
      <h3>${product.name}</h3>
      <p>${homeDescriptions[product.slug]}</p>
      <ul class="tag-list" aria-label="${esc(product.name)} ${isZh ? "功能" : "features"}">${content.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <div class="product-card-actions"><a class="text-action" href="${localizedPath(locale, "product", product.slug)}">${c.viewProduct}<span aria-hidden="true">→</span></a>${googlePlayBadge(locale, product, "card")}</div>
    </article>`;
  }).join("\n");
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", imageAlt: isZh ? "FlowTools Android 应用组合" : "FlowTools Android app portfolio", schemas: [organizationSchema(locale), websiteSchema(locale), listSchema, appFaqSchema] })}
${header(locale, "home", alternatePath)}
  <main id="main-content">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">FlowTools · ${isZh ? "专注的 Android 应用" : "Focused Android apps"}</p>
          <h1 id="home-title">${isZh ? "为真实工作而生的 Android 工具。" : "Android tools built for real work."}</h1>
          <p>${isZh ? "从现场检查、照片元数据到离线 AI 与个人音乐，每款应用都专注一个明确任务，帮助你用更少步骤完成工作。" : "From field inspections and photo metadata to offline AI and personal music, each app focuses on a defined task and helps you finish it with fewer steps."}</p>
          <div class="button-row hero-actions">
            ${googlePlayBadge(locale, featuredProduct, "hero")}
            <a class="button button-ghost" href="#products">${isZh ? "查看全部应用" : "View all apps"}<span aria-hidden="true">↓</span></a>
          </div>
          <p class="hero-meta">${isZh ? "5 款 Google Play 应用 · 支持离线工作流 · 持续维护" : "5 apps on Google Play · Offline-ready workflows · Actively maintained"}</p>
        </div>
        <div class="hero-product" aria-hidden="true">
          <div class="hero-product-heading"><img src="${featuredProduct.icon}" width="192" height="192" alt=""><div><span>${isZh ? "主推应用" : "Featured app"}</span><strong>SiteReport</strong></div></div>
          <p>${isZh ? "检查、取证、生成报告，一次现场任务完整交付。" : "Inspect, document and deliver a complete site report."}</p>
          <div class="hero-screens"><img src="/assets/apps/sitereport/screen-1.webp" width="333" height="592" alt=""><img src="/assets/apps/sitereport/screen-3.webp" width="333" height="592" alt=""></div>
        </div>
      </div>
    </section>

    <section class="section products-section" id="products" aria-labelledby="products-title">
      <div class="container">
        <div class="section-heading heading-row">
          <div><p class="eyebrow">${isZh ? "选择应用" : "Choose an app"}</p><h2 id="products-title">${isZh ? "找到适合当前任务的工具。" : "Find the right tool for the job."}</h2></div>
          <p>${isZh ? "先看使用场景和结果，再进入产品页了解完整功能、隐私边界与 Google Play 安装信息。" : "Start with the situation and outcome, then open a product page for complete features, privacy details and Google Play installation."}</p>
        </div>
        <div class="product-grid">${cards}</div>
      </div>
    </section>

    <section class="section faq-section app-faq" aria-labelledby="app-faq-title">
      <div class="container faq-layout"><div class="section-heading"><p class="eyebrow">FAQ</p><h2 id="app-faq-title">${isZh ? "下载前，你可能想了解。" : "What to know before you install."}</h2><p>${isZh ? "具体价格、兼容性与权限以 Google Play 当前页面为准。" : "Current pricing, compatibility and permissions are shown on Google Play."}</p></div><div class="faq-list">${appFaq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></div>
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
    <a href="${localizedPath(locale, "products")}">${c.breadcrumbProducts}</a><span aria-hidden="true">/</span>
    <span aria-current="page">${product.name}</span>
  </nav>`;
}

function googlePlayBadge(locale, product, placement) {
  const isZh = locale === "zh";
  const asset = isZh ? "/assets/badges/google-play-zh-cn.png" : "/assets/badges/google-play-en.png";
  const label = isZh ? `在 Google Play 获取 ${product.name}` : `Get ${product.name} on Google Play`;
  return `<a class="google-play-badge ${placement}-play-badge" href="${storeUrl(product, locale)}" target="_blank" rel="noopener" aria-label="${esc(label)}"><img src="${asset}" width="323" height="125" alt="${esc(label)}"${placement === "card" ? ' loading="lazy"' : ""}></a>`;
}

const relatedProductSlugs = {
  captionmeta: ["geolens", "pixora", "sitereport"],
  "cloud-music": ["pixora", "captionmeta", "geolens"],
  geolens: ["captionmeta", "sitereport", "pixora"],
  pixora: ["captionmeta", "cloud-music", "geolens"],
  sitereport: ["geolens", "captionmeta", "pixora"]
};

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
    applicationCategory: product.schemaCategory,
    applicationSubCategory: content.category,
    inLanguage: c.lang,
    keywords: [...content.tags, ...content.searchTerms].join(", "),
    featureList: content.features.map(([name]) => name),
    audience: content.audiences.map(([name]) => ({ "@type": "Audience", audienceType: name })),
    url: `${site.domain}${path}`,
    downloadUrl: storeUrl(product, locale),
    image: `${site.domain}${product.icon}`,
    publisher: { "@id": `${site.domain}/#organization` }
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
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isZh ? `如何使用 ${product.name}` : `How to use ${product.name}`,
    description: content.tagline,
    step: content.workflow.map(([name, text], index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name,
      text
    }))
  };
  const signals = content.tags.map((tag) => `<li>${tag}</li>`).join("");
  const overview = content.overview.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const audienceNames = content.audiences.map(([name]) => `<li>${name}</li>`).join("");
  const useCases = content.useCases.map(([name, text]) => `<article><h3>${name}</h3><p>${text}</p></article>`).join("");
  const workflow = content.workflow.map(([name, text], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${text}</p></li>`).join("");
  const features = content.features.map(([name, text], index) => `<article class="feature-item"><span>${String(index + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${text}</p></article>`).join("");
  const faqs = content.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("");
  const related = relatedProductSlugs[product.slug].map((slug) => products.find((item) => item.slug === slug)).map((item) => `<a class="related-product" href="${localizedPath(locale, "product", item.slug)}"><img src="${item.icon}" width="512" height="512" alt="" loading="lazy"><span><strong>${item.name}</strong><small>${item[locale].category}</small></span><span aria-hidden="true">→</span></a>`).join("");
  return `${head({ locale, title, description: content.description, path, alternatePath, image: `/assets/social/${product.slug}.png`, imageAlt: `${product.name} Android app`, schemas: [schema, howToSchema, faqSchema, breadcrumbSchema(locale, product)], type: "product", productStyles: true, keywords: [...content.tags, ...content.searchTerms] })}
${header(locale, "products", alternatePath)}
  <main class="product-page product-${product.slug}" id="main-content">
    <section class="product-hero" aria-labelledby="product-title">
      <div class="container product-hero-inner">
        ${breadcrumb(locale, product)}
        <div class="product-hero-layout">
          <div class="product-identity">
            <div class="product-lockup">
              <img class="product-hero-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon">
              <div><p class="eyebrow">${content.category}</p><h1 id="product-title">${product.name}</h1></div>
            </div>
            <p class="product-tagline">${content.tagline}</p>
            <p class="product-description">${content.description}</p>
            <ul class="product-signals" aria-label="${esc(product.name)} ${isZh ? "产品特点" : "product highlights"}">${signals}</ul>
            <div class="button-row product-actions">${googlePlayBadge(locale, product, "product")}<a class="button button-ghost" href="${localizedPath(locale, "support")}?product=${product.slug}">${c.contact}</a></div>
            <p class="package-name">${product.packageName}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section product-overview-section" aria-labelledby="overview-title">
      <div class="container product-overview-layout">
        <div class="overview-copy"><p class="eyebrow">${isZh ? "产品用途" : "Product purpose"}</p><h2 id="overview-title">${isZh ? `${product.name} 能帮你完成什么` : `What ${product.name} helps you do`}</h2>${overview}</div>
        <aside class="product-fact-panel" aria-label="${isZh ? "产品信息" : "Product information"}">
          <p class="eyebrow">${isZh ? "产品信息" : "Product facts"}</p>
          <dl class="product-facts"><div><dt>${isZh ? "平台" : "Platform"}</dt><dd>Android</dd></div><div><dt>${isZh ? "类别" : "Category"}</dt><dd>${content.category}</dd></div><div><dt>${isZh ? "获取方式" : "Availability"}</dt><dd>Google Play</dd></div><div><dt>${isZh ? "开发者" : "Developer"}</dt><dd>${site.developer}</dd></div></dl>
          <div class="product-audience-summary"><h3>${isZh ? "适合人群" : "Best for"}</h3><ul>${audienceNames}</ul></div>
          <div class="product-trust"><h3>${isZh ? "数据与隐私边界" : "Data and privacy context"}</h3><p>${content.trust}</p></div>
        </aside>
      </div>
    </section>

    <section class="section workflow-section" aria-labelledby="workflow-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "使用流程" : "Workflow"}</p><h2 id="workflow-title">${isZh ? `使用 ${product.name} 完成一次任务` : `A clear path through ${product.name}`}</h2></div><ol class="workflow-grid">${workflow}</ol></div>
    </section>

    <section class="section use-case-section" aria-labelledby="use-cases-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "实际应用" : "Practical scenarios"}</p><h2 id="use-cases-title">${isZh ? `${product.name} 的常见使用场景` : `Common use cases for ${product.name}`}</h2></div><div class="use-case-grid">${useCases}</div></div>
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
  </main>
${footer(locale)}`;
}

function pageIntro(locale, eyebrow, title, description) {
  return `<header class="page-intro"><div class="container page-intro-inner"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div></header>`;
}

function productPolicyPage(locale, product) {
  const isZh = locale === "zh";
  const content = product[locale];
  const page = "privacy";
  const path = localizedProductPagePath(locale, product, page);
  const alternatePath = localizedProductPagePath(isZh ? "en" : "zh", product, page);
  const title = `${product.name} ${isZh ? "隐私政策" : "Privacy Policy"} | FlowTools`;
  const description = isZh ? `了解 ${product.name} 如何处理照片、媒体、位置和应用数据。` : `Learn how ${product.name} handles photos, media, location and app data.`;
  const sections = isZh ? [
    ["scope", "适用范围", `本页面适用于 ${product.name} Android 应用及其相关功能。不同版本的实际权限和数据处理方式，以应用内提示及 Google Play 数据安全说明为准。`],
    ["data", "应用数据", `为了提供${content.category}功能，应用可能处理你主动选择的照片、媒体、项目记录、元数据、位置上下文或导出内容。应用不会把这些内容用于广告画像。`],
    ["permissions", "设备权限", "应用只在相关功能需要时请求相机、照片和媒体、音频、存储或位置权限。你可以在 Android 系统设置中拒绝或撤销权限；对应功能可能因此不可用。"],
    ["network", "网络与分享", "当你主动使用上传、分享、云端来源或导出功能时，内容可能发送到你选择或配置的服务。未主动触发时，应用不会为了广告目的上传你的内容。"],
    ["deletion", "删除与联系", `本地数据通常保留在设备上，直到你在应用中删除、清除应用数据或卸载应用。如有隐私问题，请发送邮件至 <a href="mailto:${site.email}">${site.email}</a> 并注明 ${product.name}。`]
  ] : [
    ["scope", "Scope", `This page applies to the ${product.name} Android app and its related features. Actual permissions and data practices may vary by version; the in-app notice and Google Play Data safety disclosure also apply.`],
    ["data", "App data", `To provide its ${content.category} features, the app may process photos, media, project records, metadata, location context or exports that you actively select. We do not use this content to build advertising profiles.`],
    ["permissions", "Device permissions", "The app requests camera, photos and media, audio, storage or location access only when a related feature needs it. You can deny or revoke access in Android settings; the related feature may then be unavailable."],
    ["network", "Network and sharing", "When you actively use uploads, sharing, cloud sources or exports, content may be sent to a service you select or configure. The app does not upload your content for advertising purposes when you have not initiated such a feature."],
    ["deletion", "Deletion and contact", `Local data normally remains on your device until you delete it, clear app data or uninstall the app. For privacy questions, email <a href="mailto:${site.email}">${site.email}</a> and name ${product.name}.`]
  ];
  return `${head({ locale, title, description, path, alternatePath, image: product.icon, robots: "noindex,follow", schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.domain}${path}`, dateModified: updated }] })}
${header(locale, "products", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "项目协议" : "Project policy", isZh ? `${product.name} 隐私政策` : `${product.name} privacy policy`, updatedLabel(locale))}
    <div class="container section legal-layout"><aside class="legal-nav" aria-label="${isZh ? "隐私政策章节" : "Privacy policy sections"}"><strong>${isZh ? "本页内容" : "On this page"}</strong>${sections.map(([id, name]) => `<a href="#${id}">${name}</a>`).join("")}</aside><article class="prose legal-copy">${sections.map(([id, name, text]) => `<section id="${id}"><h2>${name}</h2><p>${text}</p></section>`).join("")}</article></div>
  </main>
${footer(locale)}`;
}

function productTermsPage(locale, product) {
  const isZh = locale === "zh";
  const page = "terms";
  const path = localizedProductPagePath(locale, product, page);
  const alternatePath = localizedProductPagePath(isZh ? "en" : "zh", product, page);
  const title = `${product.name} ${isZh ? "使用条款" : "Terms of Use"} | FlowTools`;
  const description = isZh ? `使用 ${product.name} Android 应用前需要了解的条款。` : `Terms that apply when using the ${product.name} Android app.`;
  const sections = isZh ? [
    ["use", "合理使用", `你可以在拥有或获授权的 Android 设备上使用 ${product.name}。请遵守适用法律、Google Play 规则以及你所在地区对照片、位置和媒体内容的要求。`],
    ["content", "你的内容", "你对使用应用处理、导入、上传或分享的照片、文件、文字和其他内容负责。请确认你拥有必要的权利，并在分享他人信息时取得适当授权。"],
    ["network", "第三方服务", "Google Play、云端音乐来源、服务器、地图或其他第三方服务可能有自己的条款和隐私政策。使用这些功能时，你也需要遵守相关服务的规则。"],
    ["availability", "功能与更新", "应用功能可能随版本更新而调整。我们会尽量保持产品稳定，但不承诺每项功能在所有设备、系统版本或网络环境中始终可用。"],
    ["contact", "联系我们", `如需反馈、支持或说明问题，请发送邮件至 <a href="mailto:${site.email}">${site.email}</a>，并注明 ${product.name}。`]
  ] : [
    ["use", "Acceptable use", `You may use ${product.name} on an Android device that you own or are authorized to use. Follow applicable law, Google Play rules and local requirements for photos, location and media content.`],
    ["content", "Your content", "You are responsible for photos, files, text and other content that you process, import, upload or share through the app. Make sure you have the necessary rights and permissions when sharing other people's information."],
    ["network", "Third-party services", "Google Play, cloud music sources, servers, maps and other third-party services may have their own terms and privacy policies. You must follow those rules when using related features."],
    ["availability", "Features and updates", "Features may change as the app is updated. We work to keep the product stable, but cannot promise that every feature will be available on every device, system version or network."],
    ["contact", "Contact", `For feedback, support or product questions, email <a href="mailto:${site.email}">${site.email}</a> and name ${product.name}.`]
  ];
  return `${head({ locale, title, description, path, alternatePath, image: product.icon, robots: "noindex,follow", schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.domain}${path}`, dateModified: updated }] })}
${header(locale, "products", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "项目协议" : "Project terms", isZh ? `${product.name} 使用条款` : `${product.name} terms of use`, updatedLabel(locale))}
    <div class="container section legal-layout"><aside class="legal-nav" aria-label="${isZh ? "使用条款章节" : "Terms sections"}"><strong>${isZh ? "本页内容" : "On this page"}</strong>${sections.map(([id, name]) => `<a href="#${id}">${name}</a>`).join("")}</aside><article class="prose legal-copy">${sections.map(([id, name, text]) => `<section id="${id}"><h2>${name}</h2><p>${text}</p></section>`).join("")}</article></div>
  </main>
${footer(locale)}`;
}

function productActivityPage(locale, product) {
  const isZh = locale === "zh";
  const content = product[locale];
  const page = "activity";
  const path = localizedProductPagePath(locale, product, page);
  const alternatePath = localizedProductPagePath(isZh ? "en" : "zh", product, page);
  const title = `${product.name} ${isZh ? "产品活动" : "Product activity"} | FlowTools`;
  const description = isZh ? `${product.name} 的项目介绍、功能亮点和最新产品动态。` : `Product highlights, feature notes and updates for ${product.name}.`;
  const highlights = content.features.map(([name, text], index) => `<article class="feature-item"><span>${String(index + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${text}</p></article>`).join("");
  return `${head({ locale, title, description, path, alternatePath, image: `/assets/social/${product.slug}.png`, robots: "noindex,follow", schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.domain}${path}`, dateModified: updated }] })}
${header(locale, "products", alternatePath)}
  <main id="main-content">
    <section class="product-hero activity-hero" aria-labelledby="activity-title"><div class="container product-hero-inner"><div class="product-identity"><img class="product-hero-icon" src="${product.icon}" width="512" height="512" alt="${esc(product.name)} app icon"><div><p class="eyebrow">${isZh ? "产品活动页" : "Product activity"}</p><h1 id="activity-title">${product.name}</h1><p class="product-tagline">${content.tagline}</p><p class="product-description">${content.description}</p><div class="button-row"><a class="button button-primary" href="${storeUrl(product, locale)}" target="_blank" rel="noopener">${copy[locale].getPlay}<span aria-hidden="true">↗</span></a><a class="button button-ghost" href="${localizedPath(locale, "product", product.slug)}">${isZh ? "返回项目详情" : "Back to project"}</a></div></div></div></div></section>
    <section class="section feature-section" aria-labelledby="activity-features-title"><div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "功能亮点" : "Feature highlights"}</p><h2 id="activity-features-title">${isZh ? "为真实场景而设计" : "Built for real situations"}</h2></div><div class="feature-grid">${highlights}</div></div></section>
  </main>
${footer(locale)}`;
}

function aboutPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "about");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "about");
  const title = isZh ? "关于 FlowTools | AndroidManTou" : "About FlowTools | AndroidManTou";
  const description = isZh ? "了解 FlowTools、AndroidManTou 与上海促动科技有限公司。" : "Learn about FlowTools, AndroidManTou and Shanghai Cudong Technology Co., Ltd.";
  const schema = { "@context": "https://schema.org", "@type": "AboutPage", name: title, url: `${site.domain}${path}`, about: organizationSchema(locale) };
  const portfolio = orderedProducts.map((product) => `<a class="portfolio-item" href="${localizedPath(locale, "product", product.slug)}"><img src="${product.icon}" width="512" height="512" alt="" loading="lazy"><span><strong>${product.name}</strong><small>${product[locale].category}</small><span>${product[locale].description}</span></span><span class="portfolio-arrow" aria-hidden="true">→</span></a>`).join("");
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [schema] })}
${header(locale, "about", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "关于我们" : "About", isZh ? "为明确任务打造实用的 Android 工具。" : "Practical Android tools for defined tasks.", isZh ? "FlowTools 汇集 AndroidManTou 开发的专业工作与个人媒体应用。" : "FlowTools brings together professional workflow and personal media apps developed by AndroidManTou.")}
    <section class="section"><div class="container about-layout"><div><p class="eyebrow">${isZh ? "我们的方向" : "What we build"}</p><h2>${isZh ? "每款 App 独立解决一个具体问题。" : "Each app addresses a distinct problem."}</h2></div><div class="prose"><p>${isZh ? "我们的产品覆盖照片元数据、现场摄影、检查报告、离线照片 AI 与个人音乐管理。每款 App 都有独立的产品页面、功能边界和获取入口，用户可以直接了解与自己任务相关的工具。" : "Our products cover photo metadata, field photography, inspection reports, offline photo AI and personal music management. Each app has its own product page, functional scope and installation path so people can evaluate the tool relevant to their work."}</p><p>${isZh ? "设计与开发围绕清晰的工作流程展开：减少与任务无关的界面，让数据处理方式和需要的权限更容易理解。产品能力与可用性以各自页面、应用内提示和 Google Play 信息为准。" : "Design and development follow clear workflows: reduce interface elements unrelated to the task and make data handling and required permissions easier to understand. Product capabilities and availability are described on each product page, in the app and on Google Play."}</p></div></div></section>
    <section class="section portfolio-section" aria-labelledby="portfolio-title"><div class="container"><div class="section-heading"><p class="eyebrow">${isZh ? "产品组合" : "Product portfolio"}</p><h2 id="portfolio-title">${isZh ? "五款独立访问的 Android App" : "Five independently accessible Android apps"}</h2><p>${isZh ? "选择产品即可查看用途、工作流程、隐私边界和安装入口。" : "Choose a product to review its purpose, workflow, privacy context and installation link."}</p></div><div class="portfolio-list">${portfolio}</div></div></section>
    <section class="company-band"><div class="container company-layout"><div><p class="eyebrow">${isZh ? "公司主体" : "Company"}</p><h2>${site.company[locale]}</h2></div><div><dl class="identity-list"><div><dt>${isZh ? "品牌" : "Brand"}</dt><dd>FlowTools</dd></div><div><dt>${isZh ? "开发者" : "Developer"}</dt><dd>${site.developer}</dd></div><div><dt>${isZh ? "地区" : "Region"}</dt><dd>${isZh ? "中国" : "China"}</dd></div><div><dt>${isZh ? "联系" : "Contact"}</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div></dl><p class="company-note">${isZh ? "FlowTools 是产品品牌；AndroidManTou 是 Google Play 使用的开发者名称；上海促动科技有限公司是网站与品牌的运营主体。" : "FlowTools is the product brand, AndroidManTou is the developer name used on Google Play, and Shanghai Cudong Technology Co., Ltd. operates the website and brand."}</p></div></div></section>
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
    <section class="section"><div class="container support-layout"><div class="contact-panel"><p class="eyebrow">${isZh ? "电子邮件" : "Email support"}</p><h2>${isZh ? "联系 FlowTools" : "Contact FlowTools"}</h2><div class="field-group"><label for="support-product">${isZh ? "产品" : "Product"}</label><select id="support-product" data-support-product><option value="FlowTools">FlowTools</option>${orderedProducts.map((product) => `<option value="${product.name}" data-slug="${product.slug}">${product.name}</option>`).join("")}</select></div><a class="button button-primary support-email" href="mailto:${site.email}?subject=FlowTools%20Support" data-support-link>${isZh ? "发送邮件" : "Email support"}<span aria-hidden="true">↗</span></a><p class="contact-address">${site.email}</p></div><div class="support-notes"><article><span>01</span><h3>${isZh ? "说明产品和版本" : "Name the app and version"}</h3><p>${isZh ? "提供应用名称、版本号与 Android 版本。" : "Include the app name, app version and your Android version."}</p></article><article><span>02</span><h3>${isZh ? "描述复现步骤" : "Describe the steps"}</h3><p>${isZh ? "说明问题发生前执行的操作，以及你预期的结果。" : "Tell us what you did before the issue and what you expected to happen."}</p></article><article><span>03</span><h3>${isZh ? "保护私人内容" : "Protect private content"}</h3><p>${isZh ? "除非支持人员明确要求，请不要发送私人照片或文档。" : "Do not send private photos or documents unless support specifically requests them."}</p></article></div></div></section>
  </main>
${footer(locale)}`;
}

function privacyPage(locale) {
  const isZh = locale === "zh";
  const path = localizedPath(locale, "privacy");
  const alternatePath = localizedPath(isZh ? "en" : "zh", "privacy");
  const title = isZh ? "隐私政策 | FlowTools" : "Privacy Policy | FlowTools";
  const description = isZh ? "了解 FlowTools Android 应用如何处理照片、媒体、位置、检查记录和诊断信息。" : "Learn how FlowTools Android apps handle photos, media, location, inspection records and diagnostic information.";
  const sections = isZh ? [
    ["principles", "我们的原则", "FlowTools 由上海促动科技有限公司运营。我们不会出售个人信息，也不会把你在应用中处理的内容用于广告画像。应用会尽可能减少不必要的数据传输，并在适合的功能中优先采用本地处理。"],
    ["data", "应用数据", "不同产品处理的数据取决于其功能，可能包括你选择的照片、音频文件、IPTC/EXIF/XMP 元数据、检查清单、报告内容、位置上下文或导出文件。具体处理行为应同时以相应应用的 Google Play“数据安全”说明和应用内提示为准。"],
    ["permissions", "设备权限", "应用仅在功能需要时请求 Android 权限。这可能包括相机、用户选择的照片和媒体、音频文件、存储空间或位置。拒绝或撤销权限可能会让相应功能无法工作，但不会影响不依赖该权限的功能。"],
    ["network", "网络、上传与分享", "当你主动使用上传、云端音乐、分享或导出功能时，相关内容可能发送到你选择或配置的服务。GeoLens 的服务器上传、SiteReport 的报告分享以及 Cloud Music 的网络来源都由用户主动触发；第三方服务的数据处理同时受其自身政策约束。"],
    ["retention", "保留与删除", "本地项目与媒体通常保留在设备上，直到你在应用中删除、清除应用数据或卸载应用。发送到第三方或用户配置服务器的内容需要在对应服务中管理。你也可以通过支持邮箱提出与 FlowTools 可控数据有关的访问或删除请求。"],
    ["children", "儿童隐私", "FlowTools 的专业工具并非面向 13 岁以下儿童设计。我们不会故意收集儿童的个人信息；如发现相关情况，请联系我们处理。"],
    ["changes", "政策变更", "当产品功能、法律要求或数据实践发生变化时，我们可能更新本政策。页面顶部的日期表示当前版本。"],
    ["contact", "联系我们", `隐私问题或数据请求请发送邮件至 <a href="mailto:${site.email}">${site.email}</a>，并注明涉及的 FlowTools 产品。`]
  ] : [
    ["principles", "Our principles", "FlowTools is operated by Shanghai Cudong Technology Co., Ltd. We do not sell personal information or use content processed in our apps to build advertising profiles. Our apps minimize unnecessary transfers and prefer local processing where the feature allows it."],
    ["data", "App data", "The data handled by each product depends on its function and may include photos you select, audio files, IPTC/EXIF/XMP metadata, inspection records, report content, location context or exported files. The relevant Google Play Data safety disclosure and in-app notice also apply to each app."],
    ["permissions", "Device permissions", "Apps request Android permissions only when a feature needs them. These may include the camera, user-selected photos and media, audio files, storage or location. Refusing or revoking permission may disable the related feature without affecting features that do not depend on it."],
    ["network", "Network, uploads and sharing", "When you actively use upload, cloud music, sharing or export features, related content may be sent to a service you select or configure. GeoLens server uploads, SiteReport report sharing and Cloud Music network sources are user-initiated. Third-party services process data under their own policies."],
    ["retention", "Retention and deletion", "Local projects and media normally remain on the device until you delete them, clear app data or uninstall the app. Content sent to a third party or user-configured server must be managed through that service. You may email us with access or deletion requests for data controlled by FlowTools."],
    ["children", "Children's privacy", "FlowTools professional tools are not designed for children under 13. We do not knowingly collect personal information from children. Contact us if you believe this has occurred."],
    ["changes", "Changes to this policy", "We may update this policy when product features, legal requirements or data practices change. The date at the top of this page identifies the current version."],
    ["contact", "Contact", `For privacy questions or data requests, email <a href="mailto:${site.email}">${site.email}</a> and name the FlowTools product involved.`]
  ];
  const privacyRows = isZh ? [
    ["sitereport", "SiteReport", "检查清单、照片证据、报告内容及可选位置", "相机、照片与媒体；启用定位时需要位置", "PDF 导出、分享或其他交付操作由用户发起"],
    ["captionmeta", "CaptionMeta", "用户选择的照片及 IPTC、EXIF、XMP 元数据", "照片与媒体；使用拍摄功能时可能需要相机", "核心任务是读取或写入所选文件；交付或分享由用户发起"],
    ["cloud-music", "Cloud Music", "设备音频文件、音乐库信息及用户选择的云端来源", "音乐与音频文件；兼容系统可能使用媒体或存储访问", "本地扫描留在设备端；打开云端来源时需要网络"],
    ["geolens", "GeoLens", "照片、任务元数据及启用时的位置上下文", "相机、照片与媒体；启用位置功能时需要位置", "上传由用户发起，并发送到任务配置的服务器"],
    ["pixora", "Pixora", "用户选择的照片及搜索或处理产生的结果", "照片与媒体", "核心流程以设备端处理为主；可选下载或外部功能会另行提示"]
  ] : [
    ["sitereport", "SiteReport", "Inspection checklists, photo evidence, report content and optional location", "Camera, photos and media; location when enabled", "PDF export, sharing and other delivery actions are user-initiated"],
    ["captionmeta", "CaptionMeta", "Selected photos and their IPTC, EXIF and XMP metadata", "Photos and media; camera when capture is used", "Core work reads or writes selected files; delivery or sharing is user-initiated"],
    ["cloud-music", "Cloud Music", "Device audio files, library information and a user-selected cloud source", "Music and audio; compatible systems may use media or storage access", "Local scanning stays on the device; network is used when a cloud source is opened"],
    ["geolens", "GeoLens", "Photos, job metadata and optional location context", "Camera, photos and media; location when that feature is enabled", "Uploads are user-initiated and sent to the server configured for the job"],
    ["pixora", "Pixora", "Selected photos and results produced by search or processing", "Photos and media", "Core workflows are designed for on-device processing; optional downloads or external features provide separate context"]
  ];
  const privacyMatrix = `<section id="app-context"><h2>${isZh ? "各应用的数据处理范围" : "Data context by app"}</h2><p>${isZh ? "下表用于解释功能可能涉及的数据与权限，不表示每项权限会在所有设备或所有使用场景中启用。Android 版本、已启用功能和系统文件选择器会影响实际权限请求。" : "This table explains data and permissions that may be relevant to a feature. It does not mean every permission is enabled on every device or in every workflow. Actual requests depend on the Android version, enabled feature and system file picker."}</p><div class="privacy-table-wrap"><table class="privacy-table"><thead><tr><th>App</th><th>${isZh ? "处理的内容" : "Content handled"}</th><th>${isZh ? "相关功能可能使用的权限" : "Permissions relevant to features"}</th><th>${isZh ? "联网、导出与分享" : "Network, export and sharing"}</th></tr></thead><tbody>${privacyRows.map(([slug, name, data, permissions, network]) => `<tr><th scope="row"><a href="${localizedPath(locale, "product", slug)}">${name}</a></th><td>${data}</td><td>${permissions}</td><td>${network}</td></tr>`).join("")}</tbody></table></div></section>`;
  const navItems = sections.flatMap(([id, name], index) => index === 1 ? [[id, name], ["app-context", isZh ? "各应用说明" : "By app"]] : [[id, name]]);
  return `${head({ locale, title, description, path, alternatePath, image: "/assets/social/home.png", schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.domain}${path}`, dateModified: privacyUpdated }] })}
${header(locale, "", alternatePath)}
  <main class="page-main" id="main-content">
    ${pageIntro(locale, isZh ? "隐私" : "Privacy", isZh ? "清楚说明数据如何参与工作。" : "Clear about how data supports the work.", updatedLabel(locale))}
    <div class="container section legal-layout"><aside class="legal-nav" aria-label="${isZh ? "隐私政策章节" : "Privacy policy sections"}"><strong>${isZh ? "本页内容" : "On this page"}</strong>${navItems.map(([id, name]) => `<a href="#${id}">${name}</a>`).join("")}</aside><article class="prose legal-copy">${sections.map(([id, name, text]) => `<section id="${id}"><h2>${name}</h2><p>${text}</p></section>${id === "data" ? privacyMatrix : ""}`).join("")}</article></div>
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
  ["products/index.html", productsPage("en")],
  ["zh-cn/products/index.html", productsPage("zh")],
  ["about.html", aboutPage("en")],
  ["zh-cn/about.html", aboutPage("zh")],
  ["support.html", supportPage("en")],
  ["zh-cn/support.html", supportPage("zh")],
  ["privacy.html", privacyPage("en")],
  ["zh-cn/privacy.html", privacyPage("zh")],
  ["404.html", notFoundPage("en")],
  ["zh-cn/404.html", notFoundPage("zh")]
];

for (const product of orderedProducts) {
  pages.push([`products/${product.slug}/index.html`, productPage("en", product)]);
  pages.push([`products/${product.slug}/privacy.html`, productPolicyPage("en", product)]);
  pages.push([`products/${product.slug}/terms.html`, productTermsPage("en", product)]);
  pages.push([`products/${product.slug}/activity.html`, productActivityPage("en", product)]);
  pages.push([`zh-cn/products/${product.slug}/index.html`, productPage("zh", product)]);
  pages.push([`zh-cn/products/${product.slug}/privacy.html`, productPolicyPage("zh", product)]);
  pages.push([`zh-cn/products/${product.slug}/terms.html`, productTermsPage("zh", product)]);
  pages.push([`zh-cn/products/${product.slug}/activity.html`, productActivityPage("zh", product)]);
}

for (const [path, content] of pages) await output(path, content);

const sitemapPaths = ["home", "products", "about", "support", "privacy"];
const sitemapEntries = sitemapPaths.map((type) => [localizedPath("en", type), localizedPath("zh", type)]);
for (const product of orderedProducts) sitemapEntries.push([localizedPath("en", "product", product.slug), localizedPath("zh", "product", product.slug)]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.flatMap(([en, zh]) => [[en, zh], [zh, en]]).map(([path, alternate]) => `  <url>
    <loc>${site.domain}${path}</loc>
    <xhtml:link rel="alternate" hreflang="${path.startsWith("/zh-cn") ? "zh-CN" : "en"}" href="${site.domain}${path}"/>
    <xhtml:link rel="alternate" hreflang="${path.startsWith("/zh-cn") ? "en" : "zh-CN"}" href="${site.domain}${alternate}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${path.startsWith("/zh-cn") ? alternate : path}"/>
    <lastmod>${siteUpdated}</lastmod>
  </url>`).join("\n")}
</urlset>`;

await output("sitemap.xml", sitemap);
await output("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml`);

console.log(`Built ${pages.length} HTML pages and sitemap.xml`);
