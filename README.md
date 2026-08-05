# FlowTools Website

Official bilingual website for the FlowTools Android app portfolio.

## Structure

- `/` - English homepage
- `/zh-cn/` - Simplified Chinese homepage
- `/products/<slug>/` - English product pages
- `/zh-cn/products/<slug>/` - Simplified Chinese product pages
- `site.config.mjs` - company and product content
- `scripts/build-site.mjs` - static page generator
- `scripts/check-site.mjs` - local link, metadata and JSON-LD validation

Generated HTML is committed so the site can be deployed on any static host.

## Build

```powershell
npm run build
npm run check
```

The build has no third-party runtime dependencies. Node.js 18 or newer is recommended.

PWA and social images can be regenerated on Windows with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
powershell -ExecutionPolicy Bypass -File scripts/generate-app-web-icons.ps1
powershell -ExecutionPolicy Bypass -File scripts/generate-social-images.ps1
```

## Content Updates

Edit product names, descriptions, package IDs and localized content in `site.config.mjs`, then run the build and check commands. Original assets under `assets/apps/` are retained as source material. Verify product names, screenshots, permissions and offline behavior against the current app and Google Play listing before publishing them.

## Launch Checklist

- Confirm that `flowtools.app` is connected to the selected static host.
- Verify `flowtools.app` in Google Play Console and update each app website URL.
- Confirm that `wukuiqing@gmail.com` is intended as the public support address.
- Compare the privacy policy with every app's actual permissions, SDKs and Google Play Data safety disclosure.
- Submit `https://flowtools.app/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Test the production response headers, custom 404 routing and service worker over HTTPS.
