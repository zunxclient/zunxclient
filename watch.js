/* Zunx Client - "See ads" page (opened inside the launcher's Decoration > See ads).
   Shows the social bar. When the social bar is really on screen it tells the launcher (parent window),
   which counts that load as 1 social bar visit (3 visits = 1 coin).
   The launcher's Refresh button reloads this page (every 5 seconds at most). */
(function () {
  function post(t, n) { try { window.parent.postMessage({ zunx: t, n: n }, "*"); } catch (e) {} }
  var status = document.getElementById("status"), seen = new WeakSet(), sent = false;

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
    var fresh = false;
    [document.body, document.documentElement].forEach(function (p) {
      Array.prototype.forEach.call(p.children, function (el) {
        if (/^(SCRIPT|STYLE|LINK|NOSCRIPT|META|TITLE|HEAD|BODY)$/.test(el.tagName)) return;
        if (el.hasAttribute("data-own")) return; // the page's own text is not an ad
        if (drawn(el) && !seen.has(el)) { seen.add(el); fresh = true; }
      });
    });
    if (fresh && !sent) {
      sent = true; // one visit per page load
      status.textContent = "Social bar visited ✓ Press Refresh for the next one.";
      post("watch-ready", 3); // n stays 3: launchers check n >= 3
    }
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

  setTimeout(function () {
    if (!sent) status.textContent = "No social bar yet. If it does not show up, press Refresh.";
  }, 15000);
})();
