# dizayn-atlas

A field index of design languages. Each entry has its feel, materials and a four-colour palette. Pick one and the whole page recolours itself using only those four colours.

Static HTML, CSS and JS. No framework, no dependencies. Turkish and English.
Live: https://orcunkok.github.io/dizayn-atlas/ (Türkçe) · English: https://orcunkok.github.io/dizayn-atlas/en/

## Use

```sh
node build.js            # after editing template.html or any data
node build.js --preview  # also retake the preview images (needs Chrome/Chromium)
```

Set `SITE_URL` in `build.js` before publishing, then upload the folder to any static host.

## Files

| File | Purpose |
|---|---|
| `template.html` | Page source. `index.html` (Turkish) and `en/index.html` (English) are generated from it; don't edit those |
| `data.js` | All content in English, and `DEFAULT`, the palette every visitor opens with |
| `data.tr.js` | Turkish content, keyed by English entry name. Missing entries fall back to English; eras translate by rule |
| `i18n.js` | Interface text for each language |
| `render.js` | Entry markup and colour roles, shared by the build and the page |
| `app.js` | Filters, palette switching, sticky bar |
| `build.js` | Builds one page per language, with entries, meta tags and structured data; generates the files below |
| `sitemap.xml`, `robots.txt` | For search engines (generated) |
| `llms.txt`, `llms-full.txt` | For AI assistants, in English (generated) |
| `favicon.svg`, `preview.png`, `preview-en.png` | Icon and link previews, in the `DEFAULT` palette (generated) |

## SEO

- Entries are written into `index.html` as real HTML, so crawlers see them without running JavaScript and nothing shifts on load.
- Readable anchors (`#saz-style`, `#iznik-cini`), the same in both languages.
- Two languages on their own URLs (Turkish at `/`, English at `/en/`), each linked to the other with `hreflang` (plus `x-default`), in the sitemap too, with `og:locale`.
- Title, meta description, canonical URL, Open Graph and Twitter tags.
- JSON-LD `CollectionPage` + `ItemList` of every entry, with palettes and `dateModified`.
- Asset links versioned by content hash, so browsers never serve a stale copy.

## AI assistants

For ChatGPT, Claude, Perplexity and Gemini, which mostly don't run JavaScript and prefer plain text:

- `llms.txt`: a short Markdown guide to the site, following the [llms.txt](https://llmstxt.org) convention.
- `llms-full.txt`: every entry as Markdown, with region, era, palette hex codes and a link. Linked from the page head and from the bottom of both pages.
- `robots.txt` names and allows their crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot.
- Palettes are also in the structured data and accessible labels, not only shown as colour.

## After publishing

Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools. ChatGPT search uses Bing's index.
