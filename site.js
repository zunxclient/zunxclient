/* Zunx Client website behaviour: theme, ads, animations. Loaded in <head> on every page. */

/* ---- theme: runs first so the page never flashes the wrong colours ---- */
(function () {
  var KEY = "zunx-site-theme", root = document.documentElement;
  var mq = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  function saved() { try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; } catch (e) { return null; } }
  function current() { return saved() || (mq && mq.matches ? "light" : "dark"); }
  function apply(animate) {
    var t = current();
    if (animate) { root.classList.add("theme-anim"); setTimeout(function () { root.classList.remove("theme-anim"); }, 500); }
    root.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "light" ? "#f5f4fc" : "#07070d");
    var b = document.querySelector(".theme-toggle");
    if (b) { b.setAttribute("aria-checked", String(t === "light")); b.title = t === "light" ? "Light mode - switch to dark" : "Dark mode - switch to light"; b.setAttribute("aria-label", b.title); }
  }
  window.zunxTheme = {
    toggle: function () { try { localStorage.setItem(KEY, current() === "light" ? "dark" : "light"); } catch (e) {} apply(true); },
    apply: apply
  };
  if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (!saved()) apply(true); });
  apply(false);
})();

/* ---- shared helpers (used by the inline scripts on the pages) ---- */
(function () {
  var getJSON = function (u) { return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  window.zunxGetJSON = getJSON;
  var root = ((document.currentScript && document.currentScript.src) || "").replace(/site\.js.*$/, "");
  window.zunxReady = getJSON("/api/config").catch(function () { return getJSON(root + "config.json"); }).catch(function () { return {}; })
    .then(function (c) {
      window.ZUNX_CFG = c;
      document.querySelectorAll("[data-contact]").forEach(function (a) { if (c.contact) { a.textContent = c.contact; a.href = "mailto:" + c.contact; } });
      document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
      return c;
    });
})();

/* ---- ads: ONE system. Every banner is its own small iframe (the ad scripts share a global, so two on one page would
   overwrite each other), loaded when it is about to scroll into view, sized to fit the screen so nothing overflows. ---- */
(function () {
  "use strict";
  var AD = {
    "160x600": ["e8535a3762a367ddf579a10c2a4bfa79", 160, 600],
    "300x250": ["41bcbf3791e3ef47f818ee34ffa0a4e9", 300, 250],
    "320x50":  ["b9f243ac21adf91a9f0ea42b65cbe416", 320, 50],
    "468x60":  ["683dd6f34417c90b35d447d0b280f77a", 468, 60],
    "728x90":  ["70456101fe259f5168ea1e8b236e3dec", 728, 90]
  };
  var NATIVE = "5225e45e87ed1937698b62df85aac61a", SOCIAL = "ef0aea3bf3300a8d488bd8d5740f7524";

  function bannerDoc(a) {
    return '<!doctype html><html><head><meta charset="utf-8"><style>:root{color-scheme:normal}html,body{margin:0;background:transparent;overflow:hidden}</style></head><body>' +
      '<script>atOptions={"key":"' + a[0] + '","format":"iframe","height":' + a[2] + ',"width":' + a[1] + ',"params":{}};<\/script>' +
      '<script data-cfasync="false" src="https://bellnewyork.org/22/' + a[0] + '"><\/script></body></html>';
  }
  function nativeDoc() {
    return '<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>html,body{margin:0;background:transparent}</style></head><body>' +
      '<script async="async" data-cfasync="false" src="https://bellnewyork.org/21/' + NATIVE + '"><\/script><div id="container-' + NATIVE + '"></div></body></html>';
  }
  function slot(box, w, h, srcdoc) {
    var s = document.createElement("div"); s.className = "ad-slot";
    var l = document.createElement("small"); l.textContent = "Advertisement";
    var f = document.createElement("iframe");
    f.width = w; f.height = h; f.scrolling = "no"; f.title = "Advertisement"; f.loading = "lazy";
    f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    f.style.width = w + "px"; f.style.height = h + "px";
    f.srcdoc = srcdoc;
    s.appendChild(l); s.appendChild(f); box.appendChild(s); return s;
  }
  // which formats go where: the format is picked from the room that is really there
  function plan(box) {
    var pos = box.dataset.pos, room = (box.parentElement ? box.parentElement.clientWidth : innerWidth) - 8;
    if (pos === "left" || pos === "right") return [["160x600"]];
    if (pos === "middle") return [["300x250"]];
    var line = room >= 740 ? "728x90" : room >= 480 ? "468x60" : "320x50";
    if (pos === "bottom") return [[line], ["native"]];
    return [[line]];
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } });
  }, { rootMargin: "350px 0px" }) : null;
  function fill(box) {
    if (box.dataset.filled) return; box.dataset.filled = "1";
    plan(box).forEach(function (p) {
      if (p[0] === "native") { var n = slot(box, Math.min(box.clientWidth || 560, 728), 230, nativeDoc()); n.firstChild.style.display = "none"; return; }
      var a = AD[p[0]]; slot(box, a[1], a[2], bannerDoc(a));
    });
  }
  function init() {
    document.querySelectorAll(".ad").forEach(function (box) {
      var side = box.dataset.pos === "left" || box.dataset.pos === "right";
      if (side) { // the side rails only exist on wide screens; they load if the window is widened later
        var want = function () { return matchMedia("(min-width:1440px)").matches; };
        if (want()) io ? io.observe(box) : fill(box);
        else addEventListener("resize", function r() { if (want()) { removeEventListener("resize", r); io ? io.observe(box) : fill(box); } });
      } else io ? io.observe(box) : fill(box);
    });
    if (!document.getElementById("zunx-socialbar")) { // social bar
      var s = document.createElement("script"); s.id = "zunx-socialbar"; s.async = true; s.setAttribute("data-cfasync", "false");
      s.src = "https://bellnewyork.org/14/" + SOCIAL; document.body.appendChild(s);
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();

/* ---- page behaviour ---- */
document.addEventListener("DOMContentLoaded", function () {
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches, $ = function (s, r) { return (r || document).querySelector(s); };

  // background glow
  var au = document.createElement("div"); au.className = "aurora"; au.setAttribute("aria-hidden", "true"); au.innerHTML = "<i></i><i></i><i></i>"; document.body.prepend(au);

  // header: theme switch + mobile menu
  var nav = $("header .site-nav") || $("header nav"), hdr = $("header");
  if (nav && !$(".theme-toggle")) {
    var t = document.createElement("button"); t.type = "button"; t.className = "theme-toggle"; t.setAttribute("role", "switch");
    t.innerHTML = '<svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><i class="knob"></i>';
    t.addEventListener("click", function () { zunxTheme.toggle(); });
    nav.appendChild(t); zunxTheme.apply(false);
    var links = nav.querySelectorAll("a");
    if (links.length) {
      var mb = document.createElement("button"); mb.type = "button"; mb.className = "menu-btn"; mb.setAttribute("aria-label", "Menu"); mb.innerHTML = "<span></span>";
      var panel = document.createElement("div"); panel.className = "mobile-panel";
      links.forEach(function (a) { var c = a.cloneNode(true); c.addEventListener("click", function () { hdr.classList.remove("open"); }); panel.appendChild(c); });
      nav.appendChild(mb); hdr.appendChild(panel);
      mb.addEventListener("click", function () { hdr.classList.toggle("open"); });
    }
  }

  // keep casual copying off (same as before); inputs and links still work
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });
  document.addEventListener("copy", function (e) { if (!e.target.closest || !e.target.closest("input,textarea")) e.preventDefault(); });
  document.addEventListener("contextmenu", function (e) { if (!e.target.closest || !e.target.closest("input,textarea")) e.preventDefault(); });

  // cursor spotlight on cards
  if (!calm) document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".card,.loader-card,.info-card,.box,.steps div,.tbl,.dl,details,.related a");
    if (!c) return; var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  // hero window follows the mouse a little
  var stage = $(".stage"), win = $(".stage .win");
  if (stage && win && !calm && matchMedia("(hover:hover) and (min-width:821px)").matches) {
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      win.style.animation = "none"; win.style.transform = "rotateY(" + (-7 + x * 12) + "deg) rotateX(" + (3 - y * 10) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { win.style.transform = ""; win.style.animation = ""; });
  }

  // counters
  function count(el) {
    var to = +el.dataset.count, suf = el.dataset.suf || "";
    if (calm) { el.textContent = to + suf; return; }
    var t0 = performance.now();
    (function tick(t) { var p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }
  // scroll reveal (animates every time it comes back into view)
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) {
        el.classList.add("in");
        if (el.dataset.count) count(el);
        el.querySelectorAll(".fill").forEach(function (b) { b.style.width = "0%"; requestAnimationFrame(function () { b.style.width = b.dataset.w + "%"; }); });
      } else el.classList.remove("in");
    });
  }, { threshold: .18, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv,[data-count]").forEach(function (el) { io.observe(el); });

  // FPS counter 1 -> 500+
  var f = document.getElementById("fpsNum");
  if (f) {
    if (calm) f.textContent = "500+";
    else {
      var raf = null, shown = false;
      var run = function () {
        var s = performance.now(); f.textContent = "1";
        (function tick(n) { var p = Math.min(1, (n - s) / 1800), v = Math.round(1 + 499 * (1 - Math.pow(1 - p, 3))); if (p >= 1) { f.textContent = "500+"; raf = null; return; } f.textContent = v; raf = requestAnimationFrame(tick); })(s);
      };
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!shown) { shown = true; run(); } } else { shown = false; if (raf) cancelAnimationFrame(raf); raf = null; } }); }, { threshold: .5 }).observe(f);
    }
  }

  // scroll progress
  var prog = function () { var m = document.documentElement.scrollHeight - innerHeight; document.body.style.setProperty("--scroll-progress", m > 0 ? (scrollY / m * 100).toFixed(2) + "%" : "0%"); };
  addEventListener("scroll", prog, { passive: true }); addEventListener("resize", prog, { passive: true }); prog();
});
