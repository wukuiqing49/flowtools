import { access, readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirectories = new Set([".git", ".idea", "node_modules"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function localTarget(url) {
  const withoutFragment = url.split("#")[0].split("?")[0];
  if (!withoutFragment || /^(https?:|mailto:|tel:)/.test(withoutFragment)) return null;
  const normalized = withoutFragment.startsWith("/") ? withoutFragment.slice(1) : withoutFragment;
  if (!normalized) return "index.html";
  return normalized.endsWith("/") ? `${normalized}index.html` : normalized;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => extname(file) === ".html");
const errors = [];
let linksChecked = 0;
let schemasChecked = 0;
const titles = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relativeFile = file.slice(root.length).replaceAll("\\", "/");
  if (!/<html lang="(en|zh-CN)">/.test(html)) errors.push(`${file}: missing valid lang attribute`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  if (!title) errors.push(`${file}: missing title`);
  else if (titles.has(title)) errors.push(`${file}: duplicate title with ${titles.get(title)}`);
  else titles.set(title, file);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${file}: missing meta description`);
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  if (!/<link rel="canonical"/.test(html)) errors.push(`${file}: missing canonical`);
  if (!/hreflang="en"/.test(html) || !/hreflang="zh-CN"/.test(html) || !/hreflang="x-default"/.test(html)) errors.push(`${file}: incomplete hreflang set`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) errors.push(`${file}: incomplete social metadata`);

  if (/[\\/]products[\\/][^\\/]+[\\/]index\.html$/.test(file)) {
    if (!/<main class="product-page product-[a-z0-9-]+" id="main-content">/.test(html)) {
      errors.push(`${file}: missing independent product theme`);
    }
    if (/(?:shot-button|screenshots-section|image-dialog)/.test(html)) errors.push(`${file}: obsolete product gallery returned`);
    const badgeAsset = relativeFile.startsWith("zh-cn/") ? "/assets/badges/google-play-zh-cn.png" : "/assets/badges/google-play-en.png";
    if ((html.match(/class="google-play-badge product-play-badge"/g) || []).length !== 1 || !html.includes(`src="${badgeAsset}"`)) {
      errors.push(`${file}: missing localized Google Play badge`);
    }
    if (!/assets\/apps\/[a-z0-9-]+\/icon-192\.png/.test(html)) errors.push(`${file}: missing optimized product icon`);
    if (!/<meta name="keywords" content="[^"]+">/.test(html)) errors.push(`${file}: missing product search keywords`);
    if (!/"@type":"HowTo"/.test(html)) errors.push(`${file}: missing HowTo structured data`);
    if (!/class="use-case-grid"/.test(html)) errors.push(`${file}: missing practical use cases`);
    if ((html.match(/class="feature-item"/g) || []).length < 6) errors.push(`${file}: incomplete feature coverage`);
    if ((html.match(/<details>/g) || []).length < 5) errors.push(`${file}: incomplete product FAQ`);
    if (!/(?:offline|离线)/i.test(html)) errors.push(`${file}: missing offline usage context`);
  }

  if (/loading="(?:eager|lazy)>/.test(html)) errors.push(`${file}: malformed image loading attribute`);
  if (relativeFile === "index.html" || relativeFile === "zh-cn/index.html") {
    if (/class="hero-(?:app-grid|shot|media)/.test(html)) errors.push(`${file}: oversized homepage hero media returned`);
    if ((html.match(/class="google-play-badge hero-play-badge"/g) || []).length !== 1) errors.push(`${file}: missing featured Google Play CTA`);
    if ((html.match(/class="google-play-badge card-play-badge"/g) || []).length !== 5) errors.push(`${file}: incomplete Google Play product badges`);
    if ((html.match(/class="app-icon" src="\/assets\/apps\/[a-z0-9-]+\/icon-192\.png/g) || []).length !== 5) errors.push(`${file}: incomplete optimized app icons`);
    if ((html.match(/<section class="section faq-section app-faq"[\s\S]*?<details>/g) || []).length !== 1 || (html.match(/<details>/g) || []).length !== 6) errors.push(`${file}: incomplete pre-install FAQ`);
    if (!/<div class="product-grid"><article class="product-card">[\s\S]*?assets\/apps\/sitereport\/icon-192\.png/.test(html)) errors.push(`${file}: SiteReport is not the first product`);
  }
  if (relativeFile === "about.html" || relativeFile === "zh-cn/about.html") {
    if ((html.match(/class="portfolio-item"/g) || []).length !== 5) errors.push(`${file}: incomplete product portfolio`);
    if (!/<div class="portfolio-list"><a class="portfolio-item" href="\/(?:zh-cn\/)?products\/sitereport\/">/.test(html)) errors.push(`${file}: SiteReport is not first in portfolio`);
  }
  if (relativeFile === "privacy.html" || relativeFile === "zh-cn/privacy.html") {
    if (!/class="privacy-table"/.test(html) || (html.match(/<tr><th scope="row">/g) || []).length !== 5) errors.push(`${file}: incomplete app privacy matrix`);
    if (!/<tbody><tr><th scope="row"><a href="\/(?:zh-cn\/)?products\/sitereport\/">SiteReport<\/a>/.test(html)) errors.push(`${file}: SiteReport is not first in privacy matrix`);
  }
  if (relativeFile === "support.html" || relativeFile === "zh-cn/support.html") {
    if (!/<option value="FlowTools">FlowTools<\/option><option value="SiteReport"/.test(html)) errors.push(`${file}: SiteReport is not first in support products`);
  }

  for (const match of html.matchAll(/<(?:a|link)[^>]+href="([^"]+)"/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    linksChecked += 1;
    try {
      await access(join(root, target));
    } catch {
      errors.push(`${file}: missing link target ${match[1]}`);
    }
  }

  for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    linksChecked += 1;
    try {
      await access(join(root, target));
    } catch {
      errors.push(`${file}: missing image ${match[1]}`);
    }
  }

  for (const match of html.matchAll(/<meta property="og:image" content="https:\/\/flowtools\.app([^\"]+)"/g)) {
    const target = localTarget(match[1]);
    linksChecked += 1;
    try {
      await access(join(root, target));
    } catch {
      errors.push(`${file}: missing social image ${match[1]}`);
    }
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
      schemasChecked += 1;
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML pages, ${linksChecked} local references and ${schemasChecked} JSON-LD blocks`);
}
