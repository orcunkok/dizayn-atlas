(() => {
  const { REGIONS, KINDS, E, PICKS } = window.ATLAS;

  const entries = E.map(([name, region, kind, era, feel, traits, look, cols, q], i) => ({
    id: "e" + i, name, region, kind, era, feel, traits, look, cols: cols.split(",").map((c) => "#" + c), q: q || name,
  }));
  const byName = new Map(entries.map((e) => [e.name, e]));

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const stripe = (cols, cls) => {
    const s = el("div", cls);
    s.setAttribute("aria-hidden", "true");
    for (const c of cols) {
      const i = el("i");
      i.style.background = c;
      i.dataset.hex = c;
      s.append(i);
    }
    return s;
  };
  const link = (href, text) => {
    const a = el("a", null, text);
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    return a;
  };

  // Cards are built once; filtering only toggles `hidden`.
  const grid = document.getElementById("grid");
  for (const e of entries) {
    const li = el("li", "card");
    li.id = e.id;
    // The colour strip is also the keyboard control for "use these colours"; a click anywhere on the card does the same.
    const use = el("button", "use");
    use.type = "button";
    use.setAttribute("aria-label", `Use the colours of ${e.name} for this page`);
    use.append(stripe(e.cols, "stripe"));
    li.append(use);
    li.addEventListener("click", (ev) => { if (!ev.target.closest("a")) usePalette(e); });
    const b = el("div", "card-body");
    b.append(el("p", "meta", `${REGIONS[e.region]} · ${e.era}`));
    b.append(el("h3", null, e.name));
    b.append(el("p", "feel", e.feel));
    b.append(el("p", "traits", e.traits));
    const look = el("p", "look");
    look.append(el("em", null, "Look up: "), document.createTextNode(e.look));
    b.append(look);
    const links = el("p", "links");
    links.append(
      link("https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(e.q), "Wikipedia"),
      link("https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(e.q + " " + e.look.split(",")[0]), "Images"),
    );
    b.append(links);
    li.append(b);
    e.node = li;
    grid.append(li);
  }

  // Start-here shelf
  const picks = document.getElementById("picks");
  for (const [name, why] of PICKS) {
    const e = byName.get(name);
    if (!e) continue;
    const li = el("li");
    const btn = el("button", "pick");
    btn.type = "button";
    btn.append(stripe(e.cols, "pick-stripe"));
    const body = el("span", "pick-body");
    body.append(el("b", null, e.name), el("span", null, why));
    btn.append(body);
    btn.addEventListener("click", () => jumpTo(e));
    li.append(btn);
    picks.append(li);
  }

  // Filters
  const state = { region: "all", kind: "all" };
  const regionRow = document.getElementById("regions");
  const kindRow = document.getElementById("kinds");
  const count = document.getElementById("count");
  const count2 = document.getElementById("count2");
  const empty = document.getElementById("empty");
  const filtersReset = document.getElementById("filters-reset");
  filtersReset.addEventListener("click", () => { state.region = "all"; state.kind = "all"; apply(); });

  function chips(row, key, labels, onPick) {
    const all = { all: "All", ...labels };
    for (const [k, label] of Object.entries(all)) {
      const n = k === "all" ? entries.length : entries.filter((e) => e[key] === k).length;
      const b = el("button", "chip", label);
      b.type = "button";
      b.dataset.k = k;
      b.append(el("small", null, String(n)));
      b.setAttribute("aria-pressed", String(k === "all"));
      b.addEventListener("click", () => { state[key] = k; apply(); if (onPick) onPick(); });
      row.append(b);
    }
  }
  chips(regionRow, "region", REGIONS);
  chips(kindRow, "kind", KINDS);

  // Sticky bar: sits under the filters and sticks to the top; its Filters button opens
  // a copy of the filters inside the bar instead of jumping back up the page.
  const bar = document.getElementById("bar");
  const barFilters = document.getElementById("bar-filters");
  const barFiltersBtn = document.getElementById("bar-filters-btn");
  const regionRow2 = document.getElementById("regions2");
  const kindRow2 = document.getElementById("kinds2");
  function setFiltersOpen(open) {
    barFilters.hidden = !open;
    barFiltersBtn.setAttribute("aria-expanded", String(open));
    barFiltersBtn.textContent = open ? "Close filters" : "Filters";
  }
  // Picking a filter here never moves the page; the panel stays open until closed.
  chips(regionRow2, "region", REGIONS);
  chips(kindRow2, "kind", KINDS);
  barFiltersBtn.addEventListener("click", () => setFiltersOpen(barFilters.hidden));
  // The bar's Filters button only shows once the static filters are out of view.
  const controls = document.querySelector(".controls");
  const toTop = document.getElementById("to-top");
  toTop.addEventListener("click", () => {
    setFiltersOpen(false);
    scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  function updateFiltersBtn() {
    const staticVisible = controls.getBoundingClientRect().bottom > 0;
    if (barFiltersBtn.hidden === staticVisible) return;
    barFiltersBtn.hidden = toTop.hidden = staticVisible;
    if (staticVisible) setFiltersOpen(false);
  }
  addEventListener("scroll", updateFiltersBtn, { passive: true });
  updateFiltersBtn();
  addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !barFilters.hidden) setFiltersOpen(false); });
  document.addEventListener("click", (ev) => { if (!barFilters.hidden && !bar.contains(ev.target)) setFiltersOpen(false); });

  function apply() {
    let shown = 0;
    for (const e of entries) {
      const ok = (state.region === "all" || e.region === state.region)
        && (state.kind === "all" || e.kind === state.kind);
      e.node.hidden = !ok;
      if (ok) shown++;
    }
    for (const b of document.querySelectorAll("#regions .chip, #regions2 .chip")) b.setAttribute("aria-pressed", String(b.dataset.k === state.region));
    for (const b of document.querySelectorAll("#kinds .chip, #kinds2 .chip")) b.setAttribute("aria-pressed", String(b.dataset.k === state.kind));
    count.textContent = count2.textContent = shown === entries.length ? `${shown} entries` : `${shown} of ${entries.length}`;
    empty.hidden = shown > 0;
    filtersReset.hidden = state.region === "all" && state.kind === "all";
  }
  document.getElementById("reset").addEventListener("click", () => {
    state.region = "all"; state.kind = "all"; apply();
  });

  let flashed = null;
  function jumpTo(e) {
    state.region = "all"; state.kind = "all";
    apply();
    if (flashed) flashed.classList.remove("flash");
    e.node.classList.add("flash");
    flashed = e.node;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    e.node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  // Page colours follow the chosen entry, and only its four colours are ever used: lightest = background,
  // darkest = text, and the two in between share the sticky bar and the accent, whichever way round reads best.
  // Text on any colour is whichever of the four reads best on it; nothing outside the four is introduced.
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
    const accentOk = contrast(accent, paper) >= 3;
    return {
      paper, ink, second, onSecond, accent,
      title: accentOk ? accent : ink,
      // Selected filter text: always a palette colour different from the unselected text,
      // the one of the remaining two that reads best on the bar.
      onSecondAccent: bestOn(second, cols.filter((c) => c !== onSecond)),
      roles: new Map([[paper, "Background"], [ink, "Text"], [accent, "Titles, highlights & lines"], [second, "Filters & sticky bar"]]),
    };
  }

  // Default: the Saz style (its olive deepened so it reads on the parchment).
  const SAZ = byName.get("Saz style");
  const DEFAULT_ROLES = new Map([["#1b1b1b", "Text"], ["#6c7a3a", "Titles, highlights & lines (deepened)"], ["#c9b78f", "Background"], ["#efe8d8", "Filters & sticky bar"]]);

  const root = document.documentElement.style;
  const band = document.getElementById("band");
  const rail = document.getElementById("rail");
  const paletteName = document.getElementById("palette-name");
  const swatches = document.querySelectorAll("[data-hex]");
  let chosen = null;

  function paint(cols, roles) {
    rail.replaceChildren(...cols.map((c) => { const i = el("i"); i.style.background = c; return i; }));
    band.replaceChildren();
    for (const c of cols) {
      const cell = el("div", "band-cell");
      cell.style.background = c;
      cell.style.color = bestOn(c, cols);
      cell.append(el("b", null, c.toUpperCase()), el("span", null, roles.get(c) || ""));
      band.append(cell);
    }
    // Hex labels on every swatch use the active palette's colours too
    for (const i of swatches) i.style.setProperty("--label", bestOn(i.dataset.hex, cols));
  }

  function usePalette(e) {
    const p = paletteFor(e.cols);
    // Only the roles are set; style.css derives every other colour from them (see :root.picked)
    const roles = { "--paper": p.paper, "--ink": p.ink, "--accent": p.accent, "--title": p.title,
      "--second": p.second, "--on-second": p.onSecond, "--on-second-accent": p.onSecondAccent };
    for (const [k, v] of Object.entries(roles)) root.setProperty(k, v);
    document.documentElement.classList.add("picked");
    paint(e.cols, p.roles);
    if (chosen) chosen.node.classList.remove("chosen");
    e.node.classList.add("chosen");
    chosen = e;
    paletteName.textContent = e.name;
    try { localStorage.setItem("atlas-palette", e.name); } catch {}
  }

  apply();
  paint(SAZ.cols, DEFAULT_ROLES);
  try { const saved = byName.get(localStorage.getItem("atlas-palette")); if (saved) usePalette(saved); } catch {}
})();
