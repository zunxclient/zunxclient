/* Zunx Client (website) - 160x600 banner + popunder + sponsored link */
(function () {
  var ad = document.createElement("div");
  ad.id = "zunx-ad";
  ad.setAttribute("aria-label", "Advertisement");

  var code = document.createElement("script");
  code.text = `
    atOptions = {
      'key' : 'e8535a3762a367ddf579a10c2a4bfa79',
      'format' : 'iframe',
      'height' : 600,
      'width' : 160,
      'params' : {}
    };
  `;

  var loader = document.createElement("script");
  loader.src = "https://bellnewyork.org/22/e8535a3762a367ddf579a10c2a4bfa79";
  loader.async = true;

  ad.appendChild(code);
  ad.appendChild(loader);
  document.body.appendChild(ad);

  /* zunxclient.github.io only: Popunder_1 (JS SYNC) and Smartlink_1 */
  var pop = document.createElement("script");
  pop.setAttribute("data-cfasync", "false");
  pop.src = "https://accountut.com/1/fb369fcfb4e56cd77265a8917fb5ee7e";
  document.body.appendChild(pop);

  var link = document.createElement("a");
  link.className = "sponsor";
  link.href = "https://ardance.org/4/4dab4e25b6439994189eed3a5bdda81f";
  link.target = "_blank";
  link.rel = "noopener sponsored";
  link.textContent = "Sponsored \u2013 tap to open";
  document.body.appendChild(link);
})();
