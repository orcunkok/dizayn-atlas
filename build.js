// Design Language Atlas build. Run after editing data.js (or before publishing):  node build.js
// Writes into index.html: the entries and "Start here" list as real HTML, the page title, description,
// canonical and preview tags, and structured data (JSON-LD). Also writes sitemap.xml, robots.txt, and
// llms.txt / llms-full.txt (plain-text versions for AI assistants such as ChatGPT and Claude),
// and versions the CSS/JS links so browsers never use a stale copy. Safe to run any number of times.

// ← Set this to the address you publish at (keep the trailing slash).
const SITE_URL = "https://example.com/";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const vm = require("vm");

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");
const write = (f, s) => fs.writeFileSync(path.join(dir, f), s);

// Load data.js and render.js exactly as the browser does
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(read("data.js"), ctx);
vm.runInContext(read("render.js"), ctx);
const R = ctx.window.ATLAS_RENDER;
const n = R.entries.length;
const { REGIONS, KINDS } = ctx.window.ATLAS;
const today = new Date().toISOString().slice(0, 10);
const start = R.defaultEntry;                  // the palette everyone opens with (data.js DEFAULT)
const startPalette = R.paletteFor(start.cols);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fill = (html, name, content) => {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the build:${name} slot`);
  return html.replace(re, `$1\n${content}\n$2`);
};

const title = `Design Language Atlas: ${n} design styles & colour palettes`;
const description = `Explore ${n} design languages, from Turkish saz style and İznik tiles to wabi-sabi and Bauhaus. ` +
  `Each has its feel, its materials and a four-colour palette you can try on the page.`;
const hasPreview = fs.existsSync(path.join(dir, "preview.png"));

const structured = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": SITE_URL + "#website", name: "Design Language Atlas", url: SITE_URL, inLanguage: "en" },
    {
      "@type": "CollectionPage", "@id": SITE_URL + "#page", url: SITE_URL, name: title, description, dateModified: today,
      isPartOf: { "@id": SITE_URL + "#website" }, inLanguage: "en",
      mainEntity: {
        "@type": "ItemList", numberOfItems: n,
        itemListElement: R.entries.map((e, i) => ({
          "@type": "ListItem", position: i + 1, name: e.name, url: SITE_URL + "#" + e.id,
          description: `${e.feel} ${REGIONS[e.region]}, ${e.era}. Palette: ${e.cols.join(", ")}.`,
        })),
      },
    },
  ],
};

const head = [
  `<title>${esc(title)}</title>`,
  `<meta name="description" content="${esc(description)}">`,
  `<link rel="canonical" href="${esc(SITE_URL)}">`,
  `<link rel="alternate" type="text/markdown" title="All entries as plain text" href="llms-full.txt">`,
  `<meta name="theme-color" content="${startPalette.paper}">`,
  // Opening colours in the page itself, so there is no flash of other colours before the script runs
  `<style>html:root{${Object.entries(R.cssVars(startPalette)).map(([k, v]) => `${k}:${v}`).join(";")}}</style>`,
  `<link rel="icon" href="favicon.svg" type="image/svg+xml">`,
  `<meta property="og:type" content="website">`,
  `<meta property="og:site_name" content="Design Language Atlas">`,
  `<meta property="og:title" content="${esc(title)}">`,
  `<meta property="og:description" content="${esc(description)}">`,
  `<meta property="og:url" content="${esc(SITE_URL)}">`,
  ...(hasPreview ? [
    `<meta property="og:image" content="${esc(SITE_URL)}preview.png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
  ] : []),
  `<meta name="twitter:card" content="${hasPreview ? "summary_large_image" : "summary"}">`,
  `<meta name="twitter:title" content="${esc(title)}">`,
  `<meta name="twitter:description" content="${esc(description)}">`,
  ...(hasPreview ? [`<meta name="twitter:image" content="${esc(SITE_URL)}preview.png">`] : []),
  `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>`,
].join("\n");

let html = read("index.html");
html = html.replace(/<html[^>]*>/, '<html lang="en" class="picked">');
html = fill(html, "head", head);
html = fill(html, "picks", R.picksHTML());
html = fill(html, "entries", R.cardsHTML());

// Version each local file by its content, so a change always reaches the browser
for (const f of ["style.css", "data.js", "render.js", "app.js"]) {
  const v = crypto.createHash("sha1").update(read(f)).digest("hex").slice(0, 8);
  html = html.replace(new RegExp(`(${f.replace(".", "\\.")})\\?v=[^"]*`), `$1?v=${v}`);
}
write("index.html", html);

// Favicon: the opening palette's four colours as four bars
write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
  start.cols.map((c, i) => `<rect width="8" height="32" x="${i * 8}" fill="${c}"/>`).join("") + `</svg>\n`);

// Link preview image (1200x630 of the top of the page): only with  node build.js --preview  (needs Chrome or Chromium)
if (process.argv.includes("--preview")) {
  const { execFileSync } = require("child_process");
  const browser = ["google-chrome", "chromium", "chromium-browser"].find((b) => {
    try { execFileSync("which", [b], { stdio: "ignore" }); return true; } catch { return false; }
  });
  if (!browser) console.warn("No Chrome/Chromium found; preview.png not updated");
  else {
    execFileSync(browser, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--window-size=1200,630",
      "--virtual-time-budget=6000", `--screenshot=${path.join(dir, "preview.png")}`, "file://" + path.join(dir, "index.html")], { stdio: "ignore" });
    console.log("Updated preview.png");
  }
}

write("sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `  <url><loc>${esc(SITE_URL)}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`);
// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Apple, Common Crawl) are all welcome
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];
write("robots.txt", ["User-agent: *", "Allow: /", "", ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`, "Allow: /", ""]),
  `Sitemap: ${SITE_URL}sitemap.xml`, ""].join("\n"));

// llms.txt: a short plain-text guide for AI assistants; llms-full.txt: every entry, palette included, as Markdown
const intro = "A field index of design languages: visual traditions from art, craft, architecture and graphic design, " +
  "with a deep section on Türkiye and Anatolia. Each entry has its feel, its materials, a four-colour palette and names to look up next.";
write("llms.txt", [
  "# Design Language Atlas", "", `> ${intro}`, "",
  `${n} entries across ${Object.values(REGIONS).join(", ")}.`, "",
  "## Content", "",
  `- [All ${n} entries, with palettes](${SITE_URL}llms-full.txt): every design language as plain text`,
  `- [The Atlas](${SITE_URL}): the interactive page; pick an entry and the page recolours to its palette`, "",
].join("\n"));
write("llms-full.txt", [
  "# Design Language Atlas", "", `> ${intro}`, "", `Source: ${SITE_URL}  ·  Updated: ${today}`, "",
  ...R.entries.flatMap((e) => [
    `## ${e.name}`, "",
    `- Region: ${REGIONS[e.region]}`, `- Kind: ${KINDS[e.kind]}`, `- Era: ${e.era}`,
    `- Palette: ${e.cols.join(", ")}`, `- Link: ${SITE_URL}#${e.id}`, "",
    e.feel, "", `Traits: ${e.traits}`, "", `Look up: ${e.look}`, "",
  ]),
].join("\n"));

console.log(`Built ${n} entries for ${SITE_URL}${SITE_URL.includes("example.com") ? "  (set SITE_URL in build.js before publishing)" : ""}`);
