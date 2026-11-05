/* Zunx advertising: banner/iframe + native + social bar. Popunder and Smartlink are intentionally excluded. */
(function () {
  "use strict";

  const ADS = [
    {name:"160x300", key:"1cb608172de4d558f60a99d79013ff02", w:160, h:300},
    {name:"160x600", key:"e8535a3762a367ddf579a10c2a4bfa79", w:160, h:600},
    {name:"300x250", key:"41bcbf3791e3ef47f818ee34ffa0a4e9", w:300, h:250},
    {name:"320x50", key:"b9f243ac21adf91a9f0ea42b65cbe416", w:320, h:50},
    {name:"468x60", key:"683dd6f34417c90b35d447d0b280f77a", w:468, h:60},
    {name:"728x90", key:"70456101fe259f5168ea1e8b236e3dec", w:728, h:90}
  ];

  function style() {
    if (document.getElementById("zunx-ads-style")) return;
    const s = document.createElement("style");
    s.id = "zunx-ads-style";
    s.textContent = `
      .zunx-ad-slot { display:flex; justify-content:center; align-items:center; overflow:hidden; margin:14px auto; min-height:0; }
      .zunx-top-ad-row { display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:14px; margin:16px auto 24px; width:100%; }
      .zunx-top-ad-row .zunx-ad-slot { margin:0; }
      .zunx-side-ad { position:fixed; top:50%; transform:translateY(-50%); z-index:50; width:160px; background:transparent; border:0; }
      .zunx-side-ad.left { left:4px; }
      .zunx-side-ad.right { right:4px; }
      .zunx-side-ad iframe { display:block; }
      .zunx-native-ad { width:100%; max-width:728px; margin:18px auto; text-align:center; }
      @media(max-width:1200px){ .zunx-side-ad{display:none!important;} }
      @media(max-width:700px){ .zunx-top-ad-row{gap:8px;} }
    `;
    document.head.appendChild(s);
  }

  function banner(slot, ad) {
    slot.innerHTML = "";
    slot.className = "zunx-ad-slot";
    slot.style.width = ad.w + "px";
    slot.style.minHeight = ad.h + "px";

    const script = document.createElement("script");
    script.text = `
      atOptions = {
        'key' : '${ad.key}',
        'format' : 'iframe',
        'height' : ${ad.h},
        'width' : ${ad.w},
        'params' : {}
      };
    `;
    const loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://bellnewyork.org/22/" + ad.key;
    slot.appendChild(script);
    slot.appendChild(loader);
  }

  function nativeAd(parent) {
    const wrap = document.createElement("div");
    wrap.className = "zunx-native-ad";
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync","false");
    script.src = "https://bellnewyork.org/21/5225e45e87ed1937698b62df85aac61a";
    const box = document.createElement("div");
    box.id = "container-5225e45e87ed1937698b62df85aac61a-" + Math.random().toString(36).slice(2);
    wrap.append(script, box);
    parent.appendChild(wrap);
  }

  function socialBar() {
    if (document.getElementById("zunx-socialbar-loader")) return;
    const s = document.createElement("script");
    s.id = "zunx-socialbar-loader";
    s.async = true;
    s.setAttribute("data-cfasync","false");
    s.src = "https://bellnewyork.org/14/ef0aea3bf3300a8d488bd8d5740f7524";
    document.body.appendChild(s);
  }

  function makeAds() {
    style();

    // Preserve any existing site ad containers, but populate them with real supplied formats.
    const existing = [...document.querySelectorAll(".ad")];
    const left = existing.find(x => /left/i.test(x.dataset.pos || ""));
    const right = existing.find(x => /right/i.test(x.dataset.pos || ""));

    if (left) { left.classList.add("zunx-side-ad","left"); banner(left, ADS[0]); }
    if (right) { right.classList.add("zunx-side-ad","right"); banner(right, ADS[1]); }

    if (!document.getElementById("zunx-top-ad-row")) {
      const row = document.createElement("div");
      row.id = "zunx-top-ad-row";
      row.className = "zunx-top-ad-row";
      const a = document.createElement("div");
      const b = document.createElement("div");
      banner(a, ADS[2]);
      banner(b, ADS[3]);
      row.append(a,b);

      const main = document.querySelector("main");
      const target = [...document.querySelectorAll("section,article,h1,h2,h3")].find(e =>
        /first game|built[- ]in tool|your first game/i.test(e.textContent || "")
      );
      if (target) (target.closest("section,article") || target).after(row);
      else if (main) main.prepend(row);
      else document.body.prepend(row);
    }

    // Add larger banner/native placements without breaking page structure.
    if (!document.getElementById("zunx-extra-ads")) {
      const wrap = document.createElement("div");
      wrap.id = "zunx-extra-ads";
      const a = document.createElement("div");
      const b = document.createElement("div");
      banner(a, ADS[4]);
      banner(b, ADS[5]);
      wrap.append(a,b);
      const main = document.querySelector("main") || document.body;
      main.appendChild(wrap);
      nativeAd(main);
    }

    socialBar();
  }

  function run() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", makeAds, {once:true});
    } else makeAds();
  }
  run();
})();


// Shared Zunx site behavior
(function () {
  const getJSON = u =>
    fetch(u).then(r => {
      if (!r.ok) throw 0;
      return r.json();
    });

  window.zunxGetJSON = getJSON;

  function setupAds(c) {
    const boxes = document.querySelectorAll('.ad');

    // Keep existing ad placeholders working if no ad configuration exists.
    if (!c.adsenseClient) {
      if (/[?&]ads=preview/.test(location.search)) {
        boxes.forEach(b => {
          b.classList.add('ph');
          b.textContent = 'Ad space (' + b.dataset.pos + ')';
        });
      }
      return;
    }

    // Existing Google AdSense support.
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
        encodeURIComponent(c.adsenseClient);
      document.head.appendChild(s);
    }

    boxes.forEach(b => {
      if (b.querySelector('.adsbygoogle')) return;

      const pos = b.dataset.pos;
      const vertical = pos === 'left' || pos === 'right';

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'inline-block';
      ins.style.width = vertical ? '270px' : '300px';
      ins.style.height = vertical ? '800px' : '50px';
      ins.setAttribute('data-ad-client', c.adsenseClient);
      ins.setAttribute('data-ad-slot', '5446185138');

      b.appendChild(ins);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    });
  }

  const root =
    (document.currentScript && document.currentScript.src || '')
      .replace(/site\.js.*$/, '');

  window.zunxReady = getJSON('/api/config')
    .catch(() => getJSON(root + 'config.json'))
    .catch(() => ({}))
    .then(c => {
      window.ZUNX_CFG = c;

      document.querySelectorAll('[data-contact]').forEach(a => {
        if (c.contact) {
          a.textContent = c.contact;
          a.href = 'mailto:' + c.contact;
        }
      });

      document.querySelectorAll('[data-year]').forEach(e => {
        e.textContent = new Date().getFullYear();
      });

      setupAds(c);
      return c;
    });
})();


document.addEventListener('DOMContentLoaded', function () {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;


  // Prevent accidental selection/copy while preserving inputs and links.
  document.addEventListener('dragstart', e => {
    e.preventDefault();
  });

  document.addEventListener('copy', e => {
    if (e.target.closest('input,textarea,[contenteditable="true"]')) return;
    e.preventDefault();
  });

  document.addEventListener('contextmenu', e => {
    if (!e.target.closest('input,textarea,[contenteditable="true"]')) {
      e.preventDefault();
    }
  });


  // Animated counters.
  const count = el => {
    const to = +el.dataset.count;
    const suf = el.dataset.suf || '';

    if (calm) {
      el.textContent = to + suf;
      return;
    }

    const from = +(el.dataset.current || 0);
    const t0 = performance.now();

    (function tick(t) {
      const p = Math.min(1, (t - t0) / 900);
      const eased = 1 - Math.pow(1 - p, 3);

      el.textContent =
        Math.round(from + (to - from) * eased) + suf;

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.dataset.current = to;
      }
    })(t0);
  };


  // Scroll reveal animations.
  const io = new IntersectionObserver(
    es => es.forEach(e => {
      const el = e.target;

      if (e.isIntersecting) {
        el.classList.remove('in');

        void el.offsetWidth;

        el.classList.add('in');

        if (el.dataset.count) {
          count(el);
        }

        el.querySelectorAll('.fill').forEach(b => {
          b.style.width = '0%';

          requestAnimationFrame(() => {
            b.style.width = b.dataset.w + '%';
          });
        });
      } else {
        el.classList.remove('in');
      }
    }),
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  document.querySelectorAll('.rv,[data-count]').forEach(el => {
    io.observe(el);
  });


  // Comparison bar animations.
  const tracks = new IntersectionObserver(
    es => es.forEach(e => {
      if (!e.isIntersecting) {
        e.target.dataset.played = '0';
        return;
      }

      e.target.querySelectorAll('.fill').forEach(b => {
        b.style.width = '0%';

        requestAnimationFrame(() => {
          b.style.width = b.dataset.w + '%';
        });
      });
    }),
    {
      threshold: 0.35
    }
  );

  document.querySelectorAll('.track').forEach(el => {
    tracks.observe(el);
  });


  // =========================================================
  // FPS COUNTER: 1 -> 500 -> 500+
  // =========================================================

  const f = document.getElementById('fpsNum');

  if (f) {
    let fpsFrame = null;
    let fpsRunning = false;
    let fpsVisible = false;

    const animateFPS = () => {
      if (fpsRunning) return;

      fpsRunning = true;

      if (fpsFrame !== null) {
        cancelAnimationFrame(fpsFrame);
        fpsFrame = null;
      }

      const start = performance.now();
      const duration = 1800;

      f.textContent = '1';

      const tick = now => {
        const progress = Math.min(
          1,
          (now - start) / duration
        );

        const eased =
          1 - Math.pow(1 - progress, 3);

        const value =
          Math.round(1 + 499 * eased);

        if (progress >= 1) {
          f.textContent = '500+';
          fpsFrame = null;
          fpsRunning = false;
          return;
        }

        f.textContent = value;

        fpsFrame = requestAnimationFrame(tick);
      };

      fpsFrame = requestAnimationFrame(tick);
    };


    if (calm) {
      f.textContent = '500+';
    } else {
      const fpsIO = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!fpsVisible) {
                fpsVisible = true;
                animateFPS();
              }
            } else {
              fpsVisible = false;

              if (fpsFrame !== null) {
                cancelAnimationFrame(fpsFrame);
                fpsFrame = null;
              }

              fpsRunning = false;
            }
          });
        },
        {
          threshold: 0.5
        }
      );

      fpsIO.observe(f);
    }
  }


  // FAQ press animation.
  document.querySelectorAll('details').forEach((d, i) => {
    d.addEventListener('click', () => {
      if (calm) return;

      d.style.setProperty(
        '--press-delay',
        (i * 20) + 'ms'
      );

      d.animate(
        [
          { transform: 'scale(.99)' },
          { transform: 'scale(1.012)' },
          { transform: 'scale(1)' }
        ],
        {
          duration: 380,
          easing: 'cubic-bezier(.2,.8,.2,1)'
        }
      );
    });
  });


  // Scroll progress.
  const updateProgress = () => {
    const max =
      document.documentElement.scrollHeight -
      innerHeight;

    document.body.style.setProperty(
      '--scroll-progress',
      max > 0
        ? ((scrollY / max) * 100).toFixed(2) + '%'
        : '0%'
    );
  };

  addEventListener(
    'scroll',
    updateProgress,
    { passive: true }
  );

  addEventListener(
    'resize',
    updateProgress,
    { passive: true }
  );

  updateProgress();
});

/* Zunx dense PC ad layout: fills unused desktop side space without affecting normal content. */
(function(){
  "use strict";

  const ADS = [
    ["160x300","1cb608172de4d558f60a99d79013ff02",160,300],
    ["160x600","e8535a3762a367ddf579a10c2a4bfa79",160,600],
    ["300x250","41bcbf3791e3ef47f818ee34ffa0a4e9",300,250],
    ["320x50","b9f243ac21adf91a9f0ea42b65cbe416",320,50],
    ["468x60","683dd6f34417c90b35d447d0b280f77a",468,60],
    ["728x90","70456101fe259f5168ea1e8b236e3dec",728,90]
  ];

  function addCSS(){
    if(document.getElementById("zunx-dense-ad-css")) return;
    const s=document.createElement("style");
    s.id="zunx-dense-ad-css";
    s.textContent=`
      .zunx-pc-ad-rail{
        position:fixed; top:12px; bottom:12px; width:170px;
        overflow:hidden; z-index:40; pointer-events:auto;
        display:flex; flex-direction:column; align-items:center;
        gap:12px; padding:4px 2px; box-sizing:border-box;
      }
      .zunx-pc-ad-rail.left{left:0}
      .zunx-pc-ad-rail.right{right:0}
      .zunx-pc-ad-box{
        width:160px; flex:0 0 auto; display:flex;
        justify-content:center; align-items:center; overflow:hidden;
      }
      .zunx-pc-ad-box iframe{max-width:100%; border:0}
      .zunx-inline-ad{
        display:flex; justify-content:center; align-items:center;
        margin:18px auto; overflow:hidden;
      }
      @media(max-width:1200px){
        .zunx-pc-ad-rail{display:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  function addBanner(parent, ad){
    const box=document.createElement("div");
    box.className="zunx-pc-ad-box";
    box.style.minHeight=ad[3]+"px";
    const cfg=document.createElement("script");
    cfg.textContent=`atOptions={key:'${ad[1]}',format:'iframe',height:${ad[3]},width:${ad[2]},params:{}};`;
    const loader=document.createElement("script");
    loader.async=true;
    loader.src="https://bellnewyork.org/22/"+ad[1];
    box.append(cfg,loader);
    parent.appendChild(box);
  }

  function rail(side){
    const r=document.createElement("aside");
    r.className="zunx-pc-ad-rail "+side;
    r.setAttribute("aria-label","Advertisements");
    // Repeat safe banner formats to use otherwise-empty desktop side space.
    addBanner(r, ADS[1]); // 160x600
    addBanner(r, ADS[0]); // 160x300
    addBanner(r, ADS[2]); // 300x250 network will scale/clip to rail
    addBanner(r, ADS[1]); // another 160x600
    addBanner(r, ADS[0]); // another 160x300
    document.body.appendChild(r);
  }

  function inlineAds(){
    const main=document.querySelector("main")||document.body;
    const blocks=[
      ["728x90",5], ["468x60",4], ["300x250",2],
      ["320x50",3], ["728x90",5], ["300x250",2]
    ];
    const wrap=document.createElement("div");
    wrap.id="zunx-dense-inline-ads";
    blocks.forEach(([_,i])=>{
      const box=document.createElement("div");
      box.className="zunx-inline-ad";
      addBanner(box, ADS[i]);
      wrap.appendChild(box);
    });
    main.appendChild(wrap);
  }

  function run(){
    addCSS();
    if(!document.querySelector(".zunx-pc-ad-rail.left")) rail("left");
    if(!document.querySelector(".zunx-pc-ad-rail.right")) rail("right");
    if(!document.getElementById("zunx-dense-inline-ads")) inlineAds();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();

/* end dense ads */
