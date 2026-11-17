/* Renders every <div class="chart" data-chart="avgFps|lowFps|steps" data-unit=" FPS"> from benchmarks.js */
(function () {
  var B = window.ZUNX_BENCH || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  document.querySelectorAll(".chart[data-chart]").forEach(function (el) {
    var rows = B[el.dataset.chart]; if (!rows || !rows.length) return;
    var unit = el.dataset.unit || "", max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    el.innerHTML = rows.map(function (r) {
      var w = Math.max(8, Math.round(r.v / max * 100));
      return '<div class="row2' + (r.me ? " me" : "") + '"><span>' + esc(r.name) + '</span><div class="track"><div class="fill ' + (r.me ? "z" : "o") + '" data-w="' + w + '">' + r.v + unit + "</div></div></div>";
    }).join("");
  });
  var note = B.sample
    ? "Example figures for illustration. Your results will vary with your PC, Minecraft version and settings."
    : "Measured on: " + (B.setup || "our test PC") + ". Your results will vary with your PC and settings.";
  document.querySelectorAll("[data-bench-note]").forEach(function (n) { n.textContent = note; });
})();
