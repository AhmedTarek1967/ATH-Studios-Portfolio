(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, body = document.body;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ICON = (id, cls = "") => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ================= core (works without any motion) ================= */
  const toggle = $("#menu-toggle");
  const setMenu = open => { body.classList.toggle("menu-open", open); toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); body.style.overflow = open ? "hidden" : ""; };
  if (toggle) { toggle.addEventListener("click", () => setMenu(!body.classList.contains("menu-open"))); $$("#menu-panel a").forEach(a => a.addEventListener("click", () => setMenu(false))); addEventListener("keydown", e => e.key === "Escape" && setMenu(false)); }

  const form = $("#contact-form");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form)); let ok = true;
    const check = (k, bad, msg) => { const el = form.elements[k], out = $("#e-" + k); const fail = bad(String(d[k] || "").trim()); out.textContent = fail ? msg : ""; el.setAttribute("aria-invalid", fail); if (fail && ok) { el.focus(); ok = false; } };
    check("name", v => !v, "Enter your name."); check("email", v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address, like name@example.com."); check("message", v => v.length < 10, "Write a message of at least 10 characters.");
    if (!ok) return;
    $("#form-status").textContent = "Opening your email app with the message ready to send.";
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Project enquiry from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " (" + d.email + ")")}`;
  });

  // scroll spy
  const links = $$(".nav a[href^='#'], #menu-panel a[href^='#']");
  if (links.length) {
    const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => { const on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("active", on); on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"); }); }), { rootMargin: "-40% 0px -55% 0px" });
    links.map(a => $(a.getAttribute("href"))).filter(Boolean).forEach(s => spy.observe(s));
  }

  /* ================= data driven content ================= */
  const list = typeof projects !== "undefined" ? projects : [];
  const count = $("#project-count"); if (count) count.textContent = `${list.length} projects`;

  const marqueeA = ["Workflow automation", "AI assistants", "Conversational services", "Software engineering"];
  const marqueeB = ["n8n", "Google Gemini", "Google Workspace", "Docker", "Telegram", "Spring Boot"].filter(t => t !== "Spring Boot");
  $$(".mq").forEach((mq, i) => {
    const items = (i ? marqueeB : marqueeA).map(t => `<span class="mq-item">${t}${ICON("plus")}</span>`).join("");
    const group = `<div class="mq-group">${items}</div>`;
    $(".mq-track", mq).innerHTML = group + group.replace('class="mq-group"', 'class="mq-group" aria-hidden="true"') + group.replace('class="mq-group"', 'class="mq-group" aria-hidden="true"');
  });

  const orbits = p => `<svg viewBox="0 0 400 400" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#e0b52f" stroke-opacity=".45"><g class="ring-a"><ellipse cx="200" cy="200" rx="148" ry="72" transform="rotate(-25 200 200)"/></g><g class="ring-b" stroke="#f0d36c"><ellipse cx="200" cy="200" rx="204" ry="98" transform="rotate(55 200 200)"/></g></g></svg>`;
  const mark = p => `<svg viewBox="0 0 400 400" role="img" aria-label="${p.title} illustration">${p.theme === "health" ? '<circle cx="200" cy="200" r="66" fill="#e0b52f"/>' : '<rect x="134" y="134" width="132" height="132" rx="30" fill="#e0b52f"/>'}<text x="200" y="${p.theme === "health" ? 222 : 220}" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="700" font-size="${p.theme === "health" ? 64 : 50}" fill="#17130a">${p.mark}</text></svg>`;

  const track = $("#track");
  if (track) {
    const panels = [`<article class="panel panel-intro" aria-labelledby="projects-title"><p class="eyebrow caption-3" style="--k:0">Selected work</p><h2 class="display-2" id="projects-title" style="--k:1">Featured projects</h2><p class="body-3 muted" style="--k:2;max-width:480px">Open each project to see its purpose, capabilities, stack and implementation details.</p><p class="hint-row caption-3" style="--k:3">${list.length} projects ${ICON("arrow-right")}</p></article>`];
    list.forEach((p, i) => panels.push(`<article class="panel panel-project${i % 2 ? " alt" : ""}" data-idx="${i}"><div class="panel-in">
      <div class="art-wrap" data-h="-0.1"><a class="art" href="${p.appUrl || p.github}" target="_blank" rel="noopener noreferrer" aria-label="Open ${p.title}" data-cursor="Open">
        <span class="art-cover"></span><span class="art-layer art-orbits" data-depth="10">${orbits(p)}</span><span class="art-layer art-mark" data-depth="22">${mark(p)}</span><span class="art-cap caption-3">${p.caption}</span></a></div>
      <div class="p-text" data-h="0.05"><span class="big-outline" aria-hidden="true">${p.number}</span>
        <div class="p-top caption-3" style="--k:0"><span class="cat">${p.category}</span></div>
        <h3 class="display-2 p-title" style="--k:1">${p.title}</h3><p class="body-3" style="--k:2">${p.description}</p>
        <ul class="p-tags" style="--k:3">${p.tags.map(t => `<li class="tag caption-4">${t}</li>`).join("")}</ul>
        <div class="p-actions" style="--k:4">${p.appUrl ? `<a class="button button-primary button-sm" href="${p.appUrl}" target="_blank" rel="noopener noreferrer" data-magnetic>Launch application ${ICON("arrow-ur")}</a>` : `<span class="caption-4 muted">Application not deployed yet</span>`}
        <a class="text-link button-sm" href="projects/${p.id}/">Project details</a><a class="text-link button-sm" href="${p.github}" target="_blank" rel="noopener noreferrer">Source on GitHub ${ICON("arrow-ur")}</a></div></div></div></article>`));
    panels.push(`<article class="panel panel-end"><div class="panel-in"><p class="eyebrow caption-3" style="--k:0">What is next</p><h3 class="display-2" style="--k:1">More in the works.</h3><p class="body-3 muted" style="--k:2;max-width:480px">New projects are added here as they ship.</p><div style="--k:3"><a class="text-link button-sm" href="https://github.com/AhmedTarek1967" target="_blank" rel="noopener noreferrer">Follow along on GitHub ${ICON("arrow-ur")}</a></div></div></article>`);
    track.innerHTML = panels.join("");
    const total = $("#show-total"); if (total) total.textContent = String(list.length).padStart(2, "0");
  }

  /* ================= motion ================= */
  try { motion(); } catch (err) { root.classList.add("no-motion"); body.classList.add("is-ready"); const i = $("#intro"); if (i) i.remove(); console.error(err); }

  function motion() {
    if (reduce) {
      root.classList.add("no-motion"); body.classList.add("is-ready");
      $$("[data-split]").forEach(el => el.classList.add("in")); $$(".panel").forEach(p => p.classList.add("in"));
      const t = $("#tagline"); if (t) wordify(t, true);
      $$(".orbit-svg").forEach(s => s.pauseAnimations && s.pauseAnimations());
      return;
    }

    /* ---- text splitting ---- */
    function splitText(el, chars) {
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      let wi = 0, ci = 0;
      const walk = node => [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
            const sw = document.createElement("span"); sw.className = "sw"; sw.setAttribute("aria-hidden", "true");
            const si = document.createElement("span"); si.className = "si"; si.style.setProperty("--i", wi++);
            if (chars) si.innerHTML = [...tok].map(c => `<span class="ch" style="--i:${ci++}">${c}</span>`).join(""); else si.textContent = tok;
            sw.appendChild(si); frag.appendChild(sw);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
      walk(el);
    }
    function wordify(el, on) {
      const text = el.textContent.trim(); el.setAttribute("aria-label", text);
      const gold = new Set(["real", "problem", "working", "application"]);
      el.innerHTML = text.split(" ").map(w => `<span class="w${on ? " on" : ""}${gold.has(w.replace(/[^a-z]/gi, "").toLowerCase()) ? " gold" : ""}" aria-hidden="true">${w}</span>`).join(" ");
    }
    $$("[data-split]").forEach(el => splitText(el, el.dataset.split === "chars"));
    const tag = $("#tagline"); wordify(tag, false); const words = $$(".w", tag);

    // hero heading: left to right gradient on text (#FFFFFF to #9B9B9B), accent words stay brand gold
    const h1 = $("#hero-title");
    const paintHero = () => { const box = h1.getBoundingClientRect(); $$(".ch", h1).forEach(c => { if (c.closest(".accent")) { c.style.setProperty("--cc", "#e0b52f"); return; } const r = c.getBoundingClientRect(); const f = clamp((r.left - box.left) / Math.max(box.width * .75, 1), 0, 1); const v = Math.round(255 + (155 - 255) * f); c.style.setProperty("--cc", `rgb(${v} ${v} ${v})`); }); };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(paintHero); let rt1; addEventListener("resize", () => { clearTimeout(rt1); rt1 = setTimeout(paintHero, 150); });

    /* ---- reveal observers (once) ---- */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2, rootMargin: "0px 0px -8% 0px" });
    $$("[data-split]:not([data-split=chars]), [data-fade], [data-row]").forEach((el, i) => { if (el.matches("[data-fade]")) el.style.setProperty("--fd", (i % 3) * 80); io.observe(el); });
    const rowEnd = $(".row-end .rule"); if (rowEnd) rowEnd.classList.add("in");

    /* ---- magnetic buttons + cursor ---- */
    const cur = $("#cursor"), label = cur && $(".cursor-label", cur);
    let cx = -100, cy = -100, tx = -100, ty = -100, seen = false;
    if (fine) {
      addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; if (!seen) { seen = true; cx = tx; cy = ty; cur.classList.add("on"); } hero.px = e.clientX / innerWidth * 2 - 1; hero.py = e.clientY / innerHeight * 2 - 1; }, { passive: true });
      document.addEventListener("mouseleave", () => cur.classList.remove("on")); document.addEventListener("mouseenter", () => seen && cur.classList.add("on"));
      document.addEventListener("pointerover", e => { const t = e.target.closest("[data-cursor]"), l = e.target.closest("a,button,summary,.filter"); cur.classList.toggle("label", !!t); cur.classList.toggle("link", !t && !!l); if (t) label.textContent = t.dataset.cursor; });
      $$("[data-magnetic]").forEach(b => {
        b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.setProperty("--mx", (e.clientX - (r.left + r.width / 2)) * .3 + "px"); b.style.setProperty("--my", (e.clientY - (r.top + r.height / 2)) * .3 + "px"); });
        b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
      });
    }

    /* ---- measurements ---- */
    const S = { y: scrollY, vh: innerHeight, vw: innerWidth, v: 0 };
    const hero = { px: 0, py: 0, cx: 0, cy: 0 };
    const heroEl = $("#hero"), heroMain = $("#hero-main"), orbit = $("#orbit"), chips = $$(".chip-pos");
    const progress = $("#progress");
    const showcase = $("#showcase") || $("#projects"), pin = $(".pin", showcase), panels = $$(".panel", track);
    const stmt = $("#statement"), process = $("#process"), steps = $$(".step"), stepsEl = $("#steps");
    const showNow = $("#show-now"), showFill = $("#show-fill");
    let pinned = false, sTop = 0, dist = 0, cx2 = 0, panelGeo = [];
    const measure = () => {
      S.vh = innerHeight; S.vw = innerWidth;
      const want = S.vw >= 1000 && showcase && track;
      showcase.classList.toggle("is-pinned", !!want); pinned = !!want;
      if (pinned) { track.style.transform = ""; const tw = track.scrollWidth; dist = Math.max(0, tw - S.vw); showcase.style.height = dist + S.vh + "px"; sTop = showcase.getBoundingClientRect().top + scrollY; panelGeo = panels.map(p => ({ l: p.offsetLeft, w: p.offsetWidth })); }
      else { showcase.style.height = ""; track.style.transform = ""; }
    };
    let rt2; addEventListener("resize", () => { clearTimeout(rt2); rt2 = setTimeout(measure, 120); });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure); measure(); addEventListener("load", measure);

    /* ---- marquee ---- */
    const mqs = $$(".mq").map(el => { const t = $(".mq-track", el); return { el, t, dir: +el.dataset.dir, x: 0, w: 0, vis: false }; });
    const mio = new IntersectionObserver(es => es.forEach(e => { const m = mqs.find(m => m.el === e.target); if (m) m.vis = e.isIntersecting; }));
    mqs.forEach(m => mio.observe(m.el));
    const mqW = () => mqs.forEach(m => { m.w = m.t.firstElementChild.offsetWidth; }); (document.fonts ? document.fonts.ready : Promise.resolve()).then(mqW); addEventListener("resize", mqW);

    /* ---- generic parallax for visible elements ---- */
    const pxEls = $$("[data-parallax]");

    /* ---- the loop ---- */
    let last = performance.now(), mqx = 0;
    const frame = now => {
      const dt = Math.min(64, now - last); last = now;
      const y = scrollY, dy = y - S.y; S.y = y; S.v = lerp(S.v, dy, .1);
      const max = document.documentElement.scrollHeight - S.vh; progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      // hero: pointer depth + scroll fade
      if (y < S.vh * 1.2) {
        hero.cx = lerp(hero.cx, hero.px, .06); hero.cy = lerp(hero.cy, hero.py, .06);
        orbit.style.transform = `translate3d(${(-hero.cx * 24).toFixed(2)}px,${(-hero.cy * 18 + y * .12).toFixed(2)}px,0) scale(${(1 + y * .0004).toFixed(4)})`;
        chips.forEach(c => { const d = +c.dataset.depth; c.style.transform = `translate3d(${(hero.cx * d * 14).toFixed(2)}px,${(hero.cy * d * 10 - y * .05 * d).toFixed(2)}px,0)`; });
        heroMain.style.transform = `translate3d(${(hero.cx * 6).toFixed(2)}px,${(y * .18).toFixed(2)}px,0)`; heroMain.style.opacity = clamp(1 - y / (S.vh * .8), 0, 1).toFixed(3);
      }

      // marquee: constant drift plus scroll velocity
      mqs.forEach(m => { if (!m.vis || !m.w) return; m.x += -m.dir * (.045 * dt + S.v * .6); m.x = ((m.x % m.w) + m.w) % m.w; const skew = clamp(S.v * -.1, -4, 4); m.t.style.transform = `translate3d(${(-m.x).toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`; });

      // pinned horizontal showcase
      if (pinned) {
        const p = clamp((y - sTop) / Math.max(dist, 1), 0, 1); cx2 = lerp(cx2, p * dist, .12); if (Math.abs(cx2 - p * dist) < .1) cx2 = p * dist;
        track.style.transform = `translate3d(${(-cx2).toFixed(2)}px,0,0)`;
        panels.forEach((pn, i) => {
          const g = panelGeo[i]; if (!g) return; const rel = (g.l + g.w / 2 - cx2 - S.vw / 2) / S.vw;
          if (Math.abs(rel) < .62) pn.classList.add("in");
          $$("[data-h]", pn).forEach(el => { el.style.transform = `translate3d(${(rel * S.vw * +el.dataset.h).toFixed(1)}px,0,0)`; });
        });
        const projPos = panelGeo.length > 1 ? clamp(p * (panels.length - 1), 0, panels.length - 1) : 0;
        const idx = clamp(Math.round(projPos), 0, list.length); if (showNow) showNow.textContent = String(clamp(idx, 0, list.length)).padStart(2, "0");
        if (showFill) showFill.style.transform = `scaleX(${p.toFixed(4)})`;
      } else if (!pinned) { panels.forEach(pn => { if (!pn.classList.contains("in")) { const r = pn.getBoundingClientRect(); if (r.top < S.vh * .85 && r.bottom > 0) pn.classList.add("in"); } }); }

      // art layers: mouse depth inside hovered project art
      if (fine) $$(".art").forEach(a => { const r = a.getBoundingClientRect(); if (r.right < 0 || r.left > S.vw) return; const inside = tx > r.left && tx < r.right && ty > r.top && ty < r.bottom; const nx = inside ? (tx - (r.left + r.width / 2)) / r.width : 0, ny = inside ? (ty - (r.top + r.height / 2)) / r.height : 0; a._x = lerp(a._x || 0, nx, .08); a._y = lerp(a._y || 0, ny, .08); $$(".art-layer", a).forEach(l => { const d = +l.dataset.depth || 0; l.style.transform = `translate3d(${(a._x * d * -2).toFixed(2)}px,${(a._y * d * -2).toFixed(2)}px,0)`; }); });

      // statement: words activate one at a time with scroll progress
      if (stmt) { const r = stmt.getBoundingClientRect(); const p = clamp(-r.top / Math.max(r.height - S.vh, 1), 0, 1); const n = words.length; const lit = Math.floor(clamp((p - .08) / .74, 0, 1) * n + (p > .82 ? n : 0)); words.forEach((w, i) => w.classList.toggle("on", i < lit)); }

      // process line fills as you scroll
      if (process) { const r = stepsEl.getBoundingClientRect(); const p = clamp((S.vh * .8 - r.top) / Math.max(r.height + S.vh * .15, 1), 0, 1); stepsEl.style.setProperty("--p", p.toFixed(3)); steps.forEach((s, i) => { const sr = s.getBoundingClientRect(); s.classList.toggle("on", sr.top < S.vh * .78); }); }

      // cursor
      if (fine && seen) { cx = lerp(cx, tx, .2); cy = lerp(cy, ty, .2); cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`; }

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    /* ---- entrance sequence ---- */
    const intro = $("#intro"); let seenIntro = false; try { seenIntro = sessionStorage.getItem("ath-intro") === "1"; } catch (e) {}
    const go = () => { body.classList.remove("is-loading"); body.classList.add("is-ready"); };
    if (seenIntro) { intro.remove(); setTimeout(go, 80); }
    else {
      body.classList.add("is-loading"); try { sessionStorage.setItem("ath-intro", "1"); } catch (e) {}
      setTimeout(() => { intro.classList.add("out"); setTimeout(go, 350); setTimeout(() => intro.classList.add("gone"), 1100); }, 1300);
    }
  }
})();
