/* Zunx Client - social bar page.
   Loads the social bar ad and tells the launcher (parent window) when an ad is really on screen,
   so the launcher can give the player 1 coin per ad seen. */
(function () {
  var seen = new WeakSet(), open = false;
  function post(t) { try { window.parent.postMessage({ zunx: t }, "*"); } catch (e) {} }

  // is this element (or something inside it) drawn on screen with a real size?
  function drawn(el) {
    var list = [el].concat(Array.prototype.slice.call(el.querySelectorAll("*"), 0, 60));
    for (var i = 0; i < list.length; i++) {
      var r = list[i].getBoundingClientRect();
      if (r.width < 80 || r.height < 30) continue;
      var cs = getComputedStyle(list[i]);
      if (cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.2) return true;
    }
    return false;
  }
  function scan() {
    var any = false, fresh = false, roots = [];
    [document.body, document.documentElement].forEach(function (p) {
      Array.prototype.forEach.call(p.children, function (el) {
        if (/^(SCRIPT|STYLE|LINK|NOSCRIPT|META|TITLE|HEAD|BODY)$/.test(el.tagName)) return;
        roots.push(el);
      });
    });
    roots.forEach(function (el) {
      if (!drawn(el)) return;
      any = true;
      if (!seen.has(el)) { seen.add(el); fresh = true; }
    });
    if (any && !open) { open = true; post("ad-open"); }
    if (!any && open) { open = false; post("ad-gone"); }
    if (fresh) post("ad-seen");
  }

  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 900); })
    .observe(document.documentElement, { childList: true, subtree: true });
  setInterval(scan, 2500);

  // the social bar script (data-cfasync="false" keeps Cloudflare from touching it)
  var s = document.createElement("script");
  s.setAttribute("data-cfasync", "false");
  s.src = "https://bellnewyork.org/14/ef0aea3bf3300a8d488bd8d5740f7524";
  s.async = true;
  document.body.appendChild(s);
})();
