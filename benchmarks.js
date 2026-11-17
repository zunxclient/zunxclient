/* ==========================================================================
   Zunx benchmark data - the ONLY place you need to edit to change the charts.

   !! The numbers below are SAMPLE / PLACEHOLDER values, not real measurements. !!
   Before you rely on them (especially because other launchers are named),
   run your own tests on the same PC, same Minecraft version, same world,
   same settings for every launcher, then replace the values and set
       sample: false
   and fill in "setup" so the page says how it was measured.
   ========================================================================== */
window.ZUNX_BENCH = {
  sample: true,
  setup: "Mid-range laptop, Minecraft 1.20.1, same world and settings in every launcher",
  avgFps: [
    { name: "Zunx",             v: 210, me: true },
    { name: "Lunar Client",     v: 188 },
    { name: "Badlion Client",   v: 171 },
    { name: "Prism Launcher",   v: 146 },
    { name: "Official Launcher", v: 98 }
  ],
  lowFps: [
    { name: "Zunx",             v: 128, me: true },
    { name: "Lunar Client",     v: 112 },
    { name: "Badlion Client",   v: 97 },
    { name: "Prism Launcher",   v: 79 },
    { name: "Official Launcher", v: 52 }
  ],
  steps: [
    { name: "Zunx",          v: 3, me: true },
    { name: "Typical setup", v: 7 }
  ]
};
