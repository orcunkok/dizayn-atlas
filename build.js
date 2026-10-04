// Design Language Atlas build. Run after editing template.html or the data (or before publishing):  node build.js
// Writes one page per language from template.html: Turkish at index.html, English at en/index.html.
// Each page gets its entries as real HTML, title, description, canonical, hreflang links to the other
// language, preview tags and structured data (JSON-LD). Also writes sitemap.xml (with language alternates),
// robots.txt, llms.txt and llms-full.txt (English only) for AI assistants, and the favicon.
// Asset links are versioned by content, so browsers never use a stale copy. Safe to run any number of times.
//   node build.js --preview   also retakes preview.png / preview-en.png (needs Chrome or Chromium)

// ← The address you publish at (keep the trailing slash).
const SITE_URL = "https://orcunkok.github.io/dizayn-atlas/";

// Languages: the first one is the default (served at the site root and used as x-default)
const LANGS = [
  { code: "tr", dir: "" },
  { code: "en", dir: "en/" },
];

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const vm = require("vm");

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), s); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const version = (f) => crypto.createHash("sha1").update(read(f)).digest("hex").slice(0, 8);
const today = new Date().toISOString().slice(0, 10);

// Load the data and renderer exactly as the browser does
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["data.js", "data.tr.js", "i18n.js", "render.js"]) vm.runInContext(read(f), ctx);
const make = ctx.window.ATLAS_MAKE_RENDER;

const urlOf = (L) => SITE_URL + L.dir;
const template = read("template.html");
const builds = LANGS.map((L) => ({ L, R: make(L.code) }));

for (const { L, R } of builds) {
  const { T } = R;
  const n = R.entries.length;
  const url = urlOf(L);
  const root = L.dir ? "../".repeat(L.dir.split("/").filter(Boolean).length) : "";
  const other = builds.find((b) => b.L !== L);
  const start = R.defaultEntry;
  const startPalette = R.paletteFor(start.cols);
  const title = T.seoTitle(n), description = T.seoDescription(n);
  const previewFile = L.code === LANGS[0].code ? "preview.png" : `preview-${L.code}.png`;
  const preview = fs.existsSync(path.join(dir, previewFile)) ? previewFile : fs.existsSync(path.join(dir, "preview.png")) ? "preview.png" : null;
  const llmsFull = "llms-full.txt";                // one plain-text file, in English, linked from every language

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": SITE_URL + "#website", name: ctx.window.ATLAS_I18N.en.title, url: SITE_URL, inLanguage: LANGS.map((x) => x.code) },
      {
        "@type": "CollectionPage", "@id": url + "#page", url, name: title, description, dateModified: today,
        isPartOf: { "@id": SITE_URL + "#website" }, inLanguage: L.code,
        mainEntity: {
          "@type": "ItemList", numberOfItems: n,
          itemListElement: R.entries.map((e, i) => ({
            "@type": "ListItem", position: i + 1, name: e.name, url: url + "#" + e.id,
            description: `${e.feel} ${R.REGIONS[e.region]}, ${e.era}. ${T.llms.palette}: ${e.cols.join(", ")}.`,
          })),
        },
      },
    ],
  };

  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    // Each language points to every version of the page, including itself; x-default is the root
    ...builds.map((b) => `<link rel="alternate" hreflang="${b.L.code}" href="${esc(urlOf(b.L))}">`),
    `<link rel="alternate" hreflang="x-default" href="${esc(urlOf(LANGS[0]))}">`,
    `<link rel="alternate" type="text/markdown" title="${esc(T.allEntries)}" href="${root}${llmsFull}">`,
    `<meta name="theme-color" content="${startPalette.paper}">`,
    // Opening colours in the page itself, so there is no flash of other colours before the script runs
    `<style>html:root{${Object.entries(R.cssVars(startPalette)).map(([k, v]) => `${k}:${v}`).join(";")}}</style>`,
    `<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(T.title)}">`,
    `<meta property="og:locale" content="${T.locale}">`,
    ...builds.filter((b) => b.L !== L).map((b) => `<meta property="og:locale:alternate" content="${b.R.T.locale}">`),
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    ...(preview ? [
      `<meta property="og:image" content="${esc(SITE_URL + preview)}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
    ] : []),
    `<meta name="twitter:card" content="${preview ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    ...(preview ? [`<meta name="twitter:image" content="${esc(SITE_URL + preview)}">`] : []),
    `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");

  const scripts = ["data.js", ...(L.code === "tr" ? ["data.tr.js"] : []), "i18n.js", "render.js", "app.js"]
    .map((f) => `<script src="${root}${f}?v=${version(f)}"></script>`).join("\n");

  const more = T.more.map((col) => [
    "      <div>", `        <h3>${esc(col.h)}</h3>`, "        <ul>",
    ...col.items.map(([href, label, note]) =>
      `          <li>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>` : esc(label)}<span>${esc(note)}</span></li>`),
    "        </ul>", "      </div>",
  ].join("\n")).join("\n");

  const values = {
    head, scripts, more, root, lang: L.code,
    picks: R.picksHTML(), entries: R.cardsHTML(),
    defaultName: esc(start.name),
    switchHref: root + other.L.dir, switchLang: other.L.code,
    llmsHref: root + llmsFull,
  };
  let html = template.replace(/\{\{([\w.:-]+)\}\}/g, (m, key) => {
    if (key.startsWith("t.")) { const v = T[key.slice(2)]; if (typeof v !== "string") throw new Error(`i18n.${L.code}.${key.slice(2)} missing`); return esc(v); }
    if (key.startsWith("v:")) return version(key.slice(2));
    if (!(key in values)) throw new Error(`template.html: unknown {{${key}}}`);
    return values[key];
  });
  html = html.replace("<!-- Source for index.html and en/index.html. Edit this, then run: node build.js -->",
    "<!-- Generated by build.js from template.html. Do not edit; edit template.html and run: node build.js -->");
  write(L.dir + "index.html", html);

  // Plain-text version of every entry for AI assistants (English only)
  const W = T.llms;
  if (L.code === "en") write(llmsFull, [
    `# ${T.title}`, "", `> ${T.llmsIntro}`, "", `${W.source}: ${url}  ·  ${W.updated}: ${today}`, "",
    ...R.entries.flatMap((e) => [
      `## ${e.name}`, "",
      `- ${W.region}: ${R.REGIONS[e.region]}`, `- ${W.kind}: ${R.KINDS[e.kind]}`, `- ${W.era}: ${e.era}`,
      `- ${W.palette}: ${e.cols.join(", ")}`, `- ${W.link}: ${url}#${e.id}`, "",
      e.feel, "", `${W.traits}: ${e.traits}`, "", `${W.lookUp}: ${e.look}`, "",
    ]),
  ].join("\n"));
}

// llms.txt: a short guide for AI assistants, pointing to every language
const en = builds.find((b) => b.L.code === "en").R;
write("llms.txt", [
  `# ${en.T.title}`, "", `> ${en.T.llmsIntro}`, "",
  `${en.entries.length} entries across ${Object.values(en.REGIONS).join(", ")}. Available in English and Turkish.`, "",
  "## Content", "",
  ...builds.map(({ L, R }) => `- [${R.T.title}](${urlOf(L)}): ${L.code === "en" ? "the interactive page in English" : "the interactive page in Turkish"}`),
  `- [${en.T.allEntries}](${SITE_URL}llms-full.txt): every entry with its palette, as plain text`, "",
].join("\n"));

// Favicon: the opening palette's four colours as four bars
const start = en.defaultEntry;
write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
  start.cols.map((c, i) => `<rect width="8" height="32" x="${i * 8}" fill="${c}"/>`).join("") + `</svg>\n`);

// Sitemap with language alternates, so search engines pair the English and Turkish pages
write("sitemap.xml", [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...LANGS.map((L) => [
    `  <url>`, `    <loc>${esc(urlOf(L))}</loc>`, `    <lastmod>${today}</lastmod>`,
    ...LANGS.map((A) => `    <xhtml:link rel="alternate" hreflang="${A.code}" href="${esc(urlOf(A))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(urlOf(LANGS[0]))}"/>`,
    `  </url>`,
  ].join("\n")),
  `</urlset>`, "",
].join("\n"));

// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Apple, Common Crawl) are all welcome
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];
write("robots.txt", ["User-agent: *", "Allow: /", "", ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`, "Allow: /", ""]),
  `Sitemap: ${SITE_URL}sitemap.xml`, ""].join("\n"));

// Link preview images (1200x630 of the top of each page)
if (process.argv.includes("--preview")) {
  const { execFileSync } = require("child_process");
  const browser = ["google-chrome", "chromium", "chromium-browser"].find((b) => {
    try { execFileSync("which", [b], { stdio: "ignore" }); return true; } catch { return false; }
  });
  if (!browser) console.warn("No Chrome/Chromium found; preview images not updated");
  else for (const { L } of builds) {
    const out = L.code === LANGS[0].code ? "preview.png" : `preview-${L.code}.png`;
    execFileSync(browser, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--window-size=1200,630",
      "--virtual-time-budget=6000", `--screenshot=${path.join(dir, out)}`, "file://" + path.join(dir, L.dir, "index.html")], { stdio: "ignore" });
    console.log(`Updated ${out}`);
  }
}

// Translation coverage: entries without a Turkish version fall back to English
const missing = ctx.window.ATLAS.E.map((r) => r[0]).filter((k) => !ctx.window.ATLAS_TR.E[k]);
if (missing.length) console.warn(`Turkish missing for ${missing.length} entr${missing.length === 1 ? "y" : "ies"} (shown in English): ${missing.join(", ")}`);

console.log(`Built ${LANGS.map((L) => L.code).join(" + ")}, ${en.entries.length} entries each, for ${SITE_URL}`);
