/* Design Language Atlas: the entry and "Start here" markup, as HTML text, in one language.
   build.js uses it to write the entries into each language's page (so search engines see them without running scripts),
   and app.js uses it only if the page has not been built. One source, so both always match.
   Entry ids and colours are the same in every language; only the words change. */
window.ATLAS_MAKE_RENDER = (lang) => {
  const { REGIONS: REGIONS_EN, KINDS: KINDS_EN, E, PICKS, DEFAULT } = window.ATLAS;
  const T = window.ATLAS_I18N[lang];
  const X = lang === "tr" ? window.ATLAS_TR : null;      // translated content, or null for English
  const REGIONS = X ? { ...REGIONS_EN, ...X.REGIONS } : REGIONS_EN;
  const KINDS = X ? { ...KINDS_EN, ...X.KINDS } : KINDS_EN;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Readable, stable ids for links like #saz-style (Turkish letters folded to plain ASCII); always from the English name
  const slug = (s) => s.replace(/ı/g, "i").replace(/İ/g, "I").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const used = new Set();
  const entries = E.map(([key, region, kind, era, feel, traits, look, cols, q]) => {
    let id = slug(key), n = 2;
    while (used.has(id)) id = slug(key) + "-" + n++;
    used.add(id);
    const t = X && X.E[key];                              // [name, feel, traits, look] in this language, if translated
    return {
      id, key, region, kind,
      name: t ? t[0] : key,
      era: X ? X.era(era) : era,
      feel: t ? t[1] : feel,
      traits: t ? t[2] : traits,
      look: t ? t[3] : look,
      q: t ? t[0] : (q || key),
      cols: cols.split(",").map((c) => "#" + c),
    };
  });
  const byKey = new Map(entries.map((e) => [e.key, e]));

  const stripe = (cols, cls) =>
    `<div class="${cls}" aria-hidden="true">${cols.map((c) => `<i style="background:${c}" data-hex="${c}"></i>`).join("")}</div>`;

  const card = (e) => {
    const wiki = T.wikipediaSearch + encodeURIComponent(e.q);
    const images = "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(e.q + " " + e.look.split(",")[0]);
    return `<li class="card" id="${e.id}">` +
      `<button class="use" type="button" aria-label="${esc(T.useColours(e.name, e.cols))}">${stripe(e.cols, "stripe")}</button>` +
      `<div class="card-body">` +
      `<p class="meta">${esc(REGIONS[e.region])} · ${esc(e.era)}</p>` +
      `<h3>${esc(e.name)}</h3>` +
      `<p class="feel">${esc(e.feel)}</p>` +
      `<p class="traits">${esc(e.traits)}</p>` +
      `<p class="look"><em>${esc(T.lookUp)}</em>${esc(e.look)}</p>` +
      `<p class="links"><a href="${esc(wiki)}" target="_blank" rel="noopener">${esc(T.wikipedia)}</a><a href="${esc(images)}" target="_blank" rel="noopener">${esc(T.images)}</a></p>` +
      `</div></li>`;
  };

  const pick = ([key, why]) => {
    const e = byKey.get(key);
    if (!e) return "";
    const note = (X && X.PICKS[key]) || why;
    return `<li><button class="pick" type="button" data-id="${e.id}">${stripe(e.cols, "pick-stripe")}` +
      `<span class="pick-body"><b>${esc(e.name)}</b><span>${esc(note)}</span></span></button></li>`;
  };

  // Colour roles. Only the palette's four colours are ever used: lightest = background, darkest = text,
  // and the two in between share the sticky bar and the accent, whichever way round reads best.
  const rgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
  const lum = (h) => {
    const [r, g, b] = rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const bestOn = (bg, colors) => colors.filter((c) => c !== bg).sort((a, b) => contrast(b, bg) - contrast(a, bg))[0];

  function paletteFor(cols) {
    const byLum = [...cols].sort((a, b) => lum(b) - lum(a));
    const paper = byLum[0], ink = byLum[3];
    let best = null;
    for (const [second, accent] of [[byLum[1], byLum[2]], [byLum[2], byLum[1]]]) {
      const onSecond = bestOn(second, cols);
      const score = Math.min(contrast(onSecond, second), 4.5) * 10 + Math.min(contrast(accent, paper), 4.5);
      if (!best || score > best.score) best = { second, accent, onSecond, score };
    }
    const { second, accent, onSecond } = best;
    return {
      paper, ink, second, onSecond, accent,
      title: contrast(accent, paper) >= 3 ? accent : ink,
      // Selected filter text: always a palette colour different from the unselected text
      onSecondAccent: bestOn(second, cols.filter((c) => c !== onSecond)),
      roles: new Map([[paper, T.roles.paper], [ink, T.roles.ink], [accent, T.roles.accent], [second, T.roles.second]]),
    };
  }
  // The CSS variables a palette sets; style.css derives every other colour from these (see :root.picked)
  const cssVars = (p) => ({ "--paper": p.paper, "--ink": p.ink, "--accent": p.accent, "--title": p.title,
    "--second": p.second, "--on-second": p.onSecond, "--on-second-accent": p.onSecondAccent });

  return {
    lang, T, REGIONS, KINDS, entries, byKey, paletteFor, cssVars, bestOn, esc,
    defaultEntry: byKey.get(DEFAULT) || entries[0],
    cardsHTML: () => entries.map(card).join("\n"),
    picksHTML: () => PICKS.map(pick).filter(Boolean).join("\n"),
  };
};

// In the browser: render in the page's own language
if (typeof document !== "undefined") window.ATLAS_RENDER = window.ATLAS_MAKE_RENDER(document.documentElement.lang);
