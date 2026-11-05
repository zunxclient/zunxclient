/* Zunx Client - social bar page (the small corner frame in the launcher).
   Loads the social bar and tells the launcher (parent window) when an ad is really on screen,
   so the launcher can give the player 1 coin per 3 social bars seen. */
(function () {
  function post(t) { try { window.parent.postMessage({ zunx: t }, "*"); } catch (e) {} }
  zunxSocialBar(function (e) { post("ad-" + e); }); // ad-open, ad-gone, ad-seen
})();
