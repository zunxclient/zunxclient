/* Zunx ads - ad codes for pdddev.github.io only.
   popunder  = "Popunder_1"  (JS SYNC script, loaded as a script tag)
   smartlink = "Smartlink_1" (a plain link, shown as a clearly labelled "Sponsored" button)
   social    = social bar script. NOTE: no new social bar code was given yet, so this is still the old one.
               Paste the new anti ad blocker social bar URL here when you have it. */
(function () {
  var OLD_SOCIAL = "https://bellnewyork.org/14/ef0aea3bf3300a8d488bd8d5740f7524";
  var site = {
    popunder: "https://accountut.com/1/44fde60c6d710a1dd6a7a34dfe3511c0",
    smartlink: "https://ardance.org/4/a03474a07f2cc35f9097fc3eb74f825c",
    social: OLD_SOCIAL
  }, popped = false;

  function forHost() { return site; } // kept so the page code is the same in both repos

  window.ZUNX_TAGS = {
    forHost: forHost,
    popunder: site.popunder,
    smartlink: site.smartlink,
    social: site.social,

    /* the popunder script (data-cfasync="false" keeps Cloudflare from touching it); only added once per page */
    loadPopunder: function () {
      if (popped) return; popped = true;
      var s = document.createElement("script");
      s.setAttribute("data-cfasync", "false");
      s.src = site.popunder;
      (document.body || document.documentElement).appendChild(s);
    },

    /* the smartlink as a labelled button; opens in a new tab */
    sponsorLink: function (text) {
      var a = document.createElement("a");
      a.className = "sponsor";
      a.href = site.smartlink;
      a.target = "_blank";
      a.rel = "noopener sponsored";
      a.setAttribute("data-own", "1");
      a.textContent = text || "Sponsored – tap to open";
      return a;
    }
  };
})();
