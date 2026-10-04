(() => {
  const { REGIONS, KINDS } = window.ATLAS;
  const R = window.ATLAS_RENDER;
  const entries = R.entries.map((e) => ({ ...e }));
  const byName = new Map(entries.map((e) => [e.name, e]));
  const byId = new Map(entries.map((e) => [e.id, e]));

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Entries and the start-here list are already in the HTML (written by build.js); fill them only if the page was not built.
  const grid = document.getElementById("grid");
  const picks = document.getElementById("picks");
  if (!grid.querySelector(".card")) grid.innerHTML = R.cardsHTML();
  if (!picks.querySelector(".pick")) picks.innerHTML = R.picksHTML();

  // A click anywhere on a card (except its links) uses its colours; the colour strip is the keyboard control for the same.
  for (const e of entries) {
    e.node = document.getElementById(e.id);
    e.node.addEventListener("click", (ev) => { if (!ev.target.closest("a")) usePalette(e); });
  }
  for (const btn of picks.querySelectorAll(".pick")) btn.addEventListener("click", () => jumpTo(byId.get(btn.dataset.id)));

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

  // Page colours follow the chosen entry (roles are worked out in render.js)
  const { paletteFor, cssVars, bestOn } = R;

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
    for (const [k, v] of Object.entries(cssVars(p))) root.setProperty(k, v);
    document.documentElement.classList.add("picked");
    paint(e.cols, p.roles);
    if (chosen) chosen.node.classList.remove("chosen");
    e.node.classList.add("chosen");
    chosen = e;
    paletteName.textContent = e.name;
  }

  // Everyone opens on the same palette (data.js DEFAULT); a pick is not remembered between visits
  apply();
  usePalette(byId.get(R.defaultEntry.id));
})();
