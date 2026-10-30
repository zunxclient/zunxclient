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