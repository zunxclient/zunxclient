/* Zunx - loads the social bar and reports when it is really on screen.
   zunxSocialBar(cb) calls cb("open") when a bar appears, cb("gone") when it is removed and cb("seen")
   for every new bar element that gets drawn. Needs tags.js first.
   Elements marked data-own="1" belong to the page itself and are never counted as an ad. */
window.zunxSocialBar = function (cb) {
  var seen = new WeakSet(), open = false;

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
        if (el.hasAttribute("data-own")) return;
        roots.push(el);
      });
    });
    roots.forEach(function (el) {
      if (!drawn(el)) return;
      any = true;
      if (!seen.has(el)) { seen.add(el); fresh = true; }
    });
    if (any && !open) { open = true; cb("open"); }
    if (!any && open) { open = false; cb("gone"); }
    if (fresh) cb("seen");
  }

  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 900); })
    .observe(document.documentElement, { childList: true, subtree: true });
  setInterval(scan, 2500);

  // the social bar script (data-cfasync="false" keeps Cloudflare from touching it)
  var s = document.createElement("script");
  s.setAttribute("data-cfasync", "false");
  s.src = ZUNX_TAGS.social;
  s.async = true;
  document.body.appendChild(s);
};
