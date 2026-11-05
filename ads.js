/* Zunx Client - standalone ad page (index.html): the popunder and the sponsored link.
   This replaces the old 160x600 banner. The launcher itself uses social.html and watch.html. */
(function () {
  ZUNX_TAGS.loadPopunder();
  var box = document.createElement("div");
  box.id = "zunx-ad";
  box.setAttribute("aria-label", "Advertisement");
  box.appendChild(ZUNX_TAGS.sponsorLink("Sponsored – tap to open"));
  document.body.appendChild(box);
})();
