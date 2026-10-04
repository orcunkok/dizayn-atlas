/* Design Language Atlas: the entry and "Start here" markup, as HTML text.
   build.js uses it to write the entries into index.html (so search engines see them without running scripts),
   and app.js uses it only if the page has not been built. One source, so both always match. */
window.ATLAS_RENDER = (() => {
  const { REGIONS, E, PICKS } = window.ATLAS;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Readable, stable ids for links like #saz-style (Turkish letters folded to plain ASCII)
  const slug = (s) => s.replace(/ı/g, "i").replace(/İ/g, "I").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const used = new Set();
  const entries = E.map(([name, region, kind, era, feel, traits, look, cols, q]) => {
    let id = slug(name), n = 2;
    while (used.has(id)) id = slug(name) + "-" + n++;
    used.add(id);
    return { id, name, region, kind, era, feel, traits, look, cols: cols.split(",").map((c) => "#" + c), q: q || name };
  });
  const byName = new Map(entries.map((e) => [e.name, e]));

  const stripe = (cols, cls) =>
    `<div class="${cls}" aria-hidden="true">${cols.map((c) => `<i style="background:${c}" data-hex="${c}"></i>`).join("")}</div>`;

  const card = (e) => {
    const wiki = "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(e.q);
    const images = "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(e.q + " " + e.look.split(",")[0]);
    return `<li class="card" id="${e.id}">` +
      `<button class="use" type="button" aria-label="Use the colours of ${esc(e.name)} (${e.cols.join(", ")}) for this page">${stripe(e.cols, "stripe")}</button>` +
      `<div class="card-body">` +
      `<p class="meta">${esc(REGIONS[e.region])} · ${esc(e.era)}</p>` +
      `<h3>${esc(e.name)}</h3>` +
      `<p class="feel">${esc(e.feel)}</p>` +
      `<p class="traits">${esc(e.traits)}</p>` +
      `<p class="look"><em>Look up: </em>${esc(e.look)}</p>` +
      `<p class="links"><a href="${esc(wiki)}" target="_blank" rel="noopener">Wikipedia</a><a href="${esc(images)}" target="_blank" rel="noopener">Images</a></p>` +
      `</div></li>`;
  };

  const pick = ([name, why]) => {
    const e = byName.get(name);
    if (!e) return "";
    return `<li><button class="pick" type="button" data-id="${e.id}">${stripe(e.cols, "pick-stripe")}` +
      `<span class="pick-body"><b>${esc(e.name)}</b><span>${esc(why)}</span></span></button></li>`;
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
      roles: new Map([[paper, "Background"], [ink, "Text"], [accent, "Titles, highlights & lines"], [second, "Filters & sticky bar"]]),
    };
  }
  // The CSS variables a palette sets; style.css derives every other colour from these (see :root.picked)
  const cssVars = (p) => ({ "--paper": p.paper, "--ink": p.ink, "--accent": p.accent, "--title": p.title,
    "--second": p.second, "--on-second": p.onSecond, "--on-second-accent": p.onSecondAccent });

  return {
    entries, byName, paletteFor, cssVars, bestOn,
    defaultEntry: byName.get(window.ATLAS.DEFAULT) || entries[0],
    cardsHTML: () => entries.map(card).join("\n"),
    picksHTML: () => PICKS.map(pick).filter(Boolean).join("\n"),
  };
})();
