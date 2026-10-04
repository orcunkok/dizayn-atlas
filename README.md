# dizayn-atlas

A field index of design languages. Each entry has its feel, materials and a four-colour palette. Pick one and the whole page recolours itself using only those four colours.

Static HTML, CSS and JS. No framework, no dependencies.

## Use

```sh
node build.js            # after editing data.js
node build.js --preview  # also retake preview.png (needs Chrome/Chromium)
```

Set `SITE_URL` in `build.js` before publishing, then upload the folder to any static host.

## Files

| File | Purpose |
|---|---|
| `data.js` | All content, and `DEFAULT`, the palette every visitor opens with |
| `render.js` | Entry markup and colour roles, shared by the build and the page |
| `app.js` | Filters, palette switching, sticky bar |
| `build.js` | Writes entries, meta tags and structured data into `index.html`; generates the files below |

## SEO

`build.js` takes care of it:

- Entries are written into `index.html` as real HTML, so crawlers see them without running JavaScript and nothing shifts on load.
- Readable anchors (`#saz-style`, `#iznik-cini`).
- Title, meta description, canonical URL, Open Graph and Twitter tags.
- JSON-LD `CollectionPage` + `ItemList` of every entry.
- `sitemap.xml`, `robots.txt`, `favicon.svg`, `preview.png` (1200×630).
- Asset links versioned by content hash, so browsers never serve a stale copy.

**AI assistants (ChatGPT, Claude, Perplexity, Gemini):**

- `robots.txt` explicitly allows their crawlers (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, …).
- `llms.txt` summarises the site; `llms-full.txt` has every entry as Markdown, palette hex codes included.
- Palettes are also in the structured data and accessible labels, not only shown as colour.

After publishing, submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools (ChatGPT search uses Bing).
