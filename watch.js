/* Zunx Client - "See ads" page (opened inside the launcher's Decoration > See ads).
   It shows the social bar (plus the popunder and the sponsored link). When the social bar is really on screen it
   tells the launcher (parent window), which counts that load as 1 social bar visit (3 visits = 1 coin).
   The launcher's Refresh button reloads this page (every 5 seconds at most). */
(function () {
  function post(t, n) { try { window.parent.postMessage({ zunx: t, n: n }, "*"); } catch (e) {} }
  var status = document.getElementById("status"), sent = false;

  ZUNX_TAGS.loadPopunder();
  document.getElementById("sponsor").appendChild(ZUNX_TAGS.sponsorLink("Sponsored – tap to open"));

  zunxSocialBar(function (e) {
    if (e === "gone" && !sent) status.textContent = "Loading the social bar…";
    if (e !== "seen" || sent) return;
    sent = true; // one visit per page load
    status.textContent = "Social bar visited ✓ Press Refresh for the next one.";
    // n stays 3 on purpose: launchers older than 1.1.19 only count the page when n >= 3
    post("watch-ready", 3);
  });

  setTimeout(function () {
    if (!sent) status.textContent = "No social bar yet. If it does not show up, press Refresh.";
  }, 15000);
})();
