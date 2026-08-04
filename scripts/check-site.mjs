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
