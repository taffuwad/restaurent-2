
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* ============================================================
     1. LENIS
     ============================================================ */
  const lenis = new Lenis({
    lerp: 0.07,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  lenis.stop();

  /* ============================================================
     2. PAGE LOADER
     ============================================================ */
  (function () {
    'use strict';

    const CONFIG = {
      minDuration: 2.4,
      holdAfter: 0.8,
      exitTextDuration: 0.55,
      exitCurtainDuration: 1.0,
      failsafeTimeout: 8000,
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const html       = document.documentElement;
    const body       = document.body;
    const loader     = document.getElementById('pageLoader');
    const percentage = document.getElementById('loaderPercentage');
    const numberEl   = document.getElementById('loaderNumber');
    const progressEl = document.getElementById('loaderProgressFill');

    if (!loader || !numberEl || !progressEl) {
      window.dispatchEvent(new CustomEvent('loader:complete'));
      return;
    }

    let finished = false;
    let started  = false;

    function animateCounter(duration, onComplete) {
      const counter = { value: 0 };
      const update = () => {
        numberEl.textContent = String(Math.floor(counter.value));
        progressEl.style.transform = 'scaleX(' + (counter.value / 100) + ')';
      };
      gsap.to(counter, {
        value: 100,
        duration: duration,
        ease: 'expo.out',
        onUpdate: update,
        onComplete: () => {
          numberEl.textContent = '100';
          progressEl.style.transform = 'scaleX(1)';
          onComplete && onComplete();
        }
      });
    }

    function animateLoaderOut(onComplete) {
      const cleanup = () => {
        html.classList.remove('is-loading');
        body.classList.remove('is-loading');
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        onComplete && onComplete();
      };

      if (prefersReducedMotion) {
        loader.style.transition = 'opacity .35s ease';
        loader.style.opacity = '0';
        setTimeout(cleanup, 500);
        return;
      }

      const tl = gsap.timeline({ onComplete: cleanup });
      tl.to(percentage, {
        yPercent: -22,
        opacity: 0,
        duration: CONFIG.exitTextDuration,
        ease: 'power3.inOut'
      });
      tl.to('.loader-progress', {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out'
      }, '-=' + (CONFIG.exitTextDuration - 0.15));
      tl.to(loader, {
        yPercent: -100,
        duration: CONFIG.exitCurtainDuration,
        ease: 'power4.inOut'
      }, '-=0.2');
    }

    function finishLoader() {
      if (finished) return;
      finished = true;

      numberEl.textContent = '100';
      progressEl.style.transform = 'scaleX(1)';

      // Refresh ScrollTrigger WHILE the curtain still covers the screen
      if (window.ScrollTrigger) ScrollTrigger.refresh();

      setTimeout(() => {
        animateLoaderOut(() => {
          window.dispatchEvent(new CustomEvent('loader:complete'));
        });
      }, CONFIG.holdAfter * 1000);
    }

    function initLoader() {
      if (started) return;
      started = true;

      html.classList.add('is-loading');
      body.classList.add('is-loading');

      if (prefersReducedMotion) {
        numberEl.textContent = '100';
        progressEl.style.transform = 'scaleX(1)';
        setTimeout(finishLoader, 120);
        return;
      }

      const failsafe = setTimeout(finishLoader, CONFIG.failsafeTimeout);
      const fontsReady = (document.fonts && document.fonts.ready)
        ? document.fonts.ready.catch(() => {})
        : Promise.resolve();

      Promise.all([fontsReady]).then(() => {
        clearTimeout(failsafe);
        animateCounter(CONFIG.minDuration, finishLoader);
      }).catch(() => {
        clearTimeout(failsafe);
        finishLoader();
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLoader, { once: true });
    } else {
      initLoader();
    }

    window.addEventListener('load', () => {
      setTimeout(() => { if (!finished) finishLoader(); }, 200);
    });
  })();

  /* ============================================================
     3. INTRO
     ============================================================ */
  let introPlayed = false;

  window.addEventListener('loader:complete', () => {
    if (introPlayed) return;
    introPlayed = true;

    lenis.start();

    const delay = isMobile ? 80 : 0;
    setTimeout(playIntro, delay);
  }, { once: true });

  function playIntro() {
    const tl = gsap.timeline();

    tl.from("nav", {
      y: isMobile ? -120 : -300,
      duration: isMobile ? 0.7 : 1,
      ease: "power3.out",
    }, 0);

    tl.fromTo(".home .hero-content h1",
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: isMobile ? 0.7 : 0.9,
        stagger: isMobile ? 0.08 : 0.12,
        ease: "power3.out"
      },
      0.1
    );

    tl.fromTo(".home .hero-content p",
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: isMobile ? 0.6 : 0.8,
        ease: "power3.out"
      },
      0.15
    );
  }

  /* ============================================================
     4. ABOUT
     ============================================================ */
  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: "(min-width: 769px)",
      mobile: "(max-width: 768px)"
    },
    (context) => {
      const { desktop } = context.conditions;
      const verySmall = window.innerWidth < 400;

      const aboutTL = gsap.timeline({
        scrollTrigger: {
          trigger: ".about",
          start: "top top",
          end: desktop ? "+=400%" : "+=11%",
          scrub: 1.2,
          pin: desktop,
          anticipatePin: 1,
        }
      });

      // Plate enter
      aboutTL.fromTo(
        ".about .about-content .a-middle .bbr",
        {
          x: desktop ? 1500 : (verySmall ? "60vw" : "100vw"),
          y: desktop ? 200 : 60,
          rotate: desktop ? 360 : 180,
          scale: desktop ? 0.5 : 0.9
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 2,
          ease: "none"
        }
      );

      // Side content reveal (desktop only — on mobile it's a stack)
      if (desktop) {
        aboutTL.fromTo(
          ".about .about-content .a-left, .about .about-content .a-right",
          { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.5,
            stagger: 0.25,
            ease: "none"
          },
          "-=0.5"
        );

        aboutTL.to(
          ".about .about-content .a-left, .about .about-content .a-right",
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            duration: 1.2,
            stagger: 0.25,
            ease: "none"
          }
        );
      }

      // Plate exit
      aboutTL.to(
        ".about .about-content .a-middle .bbr",
        {
          x: desktop ? -1200 : (verySmall ? "-60vw" : "-100vw"),
          y: desktop ? -100 : -50,
          rotate: desktop ? -720 : -180,
          scale: desktop ? 0.7 : 0.75,
          duration: 2,
          ease: "none"
        }
      );

      return () => { aboutTL.kill(); };
    }
  );

  /* ============================================================
     5. DRINK
     ============================================================ */
  const drunkH1 = new SplitText(".drink .text-area h1", {
    type: "chars, words",
    mask: "lines"
  });
  const drunkS1 = new SplitText(".drink .text-area span", {
    type: "chars, words",
    mask: "lines"
  });

  const drinkTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".drink",
      start: "top top",
      end: "+=250%",
      pin: true,
      anticipatePin: 1,
      scrub: true,
    }
  });

  drinkTl.from(drunkH1.chars, {
    yPercent: isMobile ? 150 : 300,
    opacity: 0,
    duration: 3,
    delay: isMobile ? 0.6 : 1.2,
    stagger: 0.5,
    ease: "power2.out"
  }, "dh");

  drinkTl.from(drunkS1.chars, {
    yPercent: 250,
    duration: 1,
    stagger: 0.5,
    ease: "sine.inOut",
  }, "dh");

  drinkTl.fromTo(".drink .text-area p",
    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    "dp"
  );

  drinkTl.fromTo(".drink .glass",
    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    "dp-=5.5"
  );

  gsap.from(".drink .lr", {
    left: "-100%",
    scale: 0,
    rotate: 45,
    delay: 4,
    ease: "circ.out",
    scrollTrigger: {
      trigger: ".drink",
      start: "40% 70%",
      end: "50% 50%",
      scrub: true,
    }
  });

  gsap.from(".drink .ll", {
    right: "-100%",
    scale: 0,
    rotate: 60,
    delay: 4,
    ease: "circ.out",
    scrollTrigger: {
      trigger: ".drink",
      start: "40% 70%",
      end: "50% 50%",
      scrub: true,
    }
  });

  /* ============================================================
     6. FOOD TIME
     ============================================================ */
  const foodTime = gsap.timeline({
    scrollTrigger: {
      trigger: ".food-time",
      start: "top top",
      end: "+=250%",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    }
  });

  foodTime.fromTo('.breakfast-page',
    { scale: 1.03, clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)' },
    { scale: 1, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }
  );
  foodTime.fromTo('.lunch-page',
    { scale: 1, clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)' },
    { scale: 1.03, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }
  );
  foodTime.fromTo('.dinner-page',
    { scale: 1.03 },
    { scale: 1 }
  );

  /* ============================================================
     7. FAMOUS FOODS
     ============================================================ */
  const dishName = document.querySelectorAll(".dish");
  const dishImage = document.querySelector(".dish-image");

  dishName.forEach((dish) => {
    dish.addEventListener('mouseenter', () => {
      const foodImage = dish.getAttribute("data-image");
      dishImage.style.background = `url(${foodImage})`;
      dishImage.style.backgroundPosition = "center";
      dishImage.style.backgroundSize = "cover";
      dishImage.style.scale = "1";
    });

    dish.addEventListener("mouseleave", () => {
      dishImage.style.background = `url("components/images/dish1.jpg")`;
      dishImage.style.backgroundPosition = "center";
      dishImage.style.backgroundSize = "cover";
    });
  });

  if (window.innerWidth < 768 && dishImage) {
    dishImage.style.backgroundPosition = "bottom";
  }

  /* ============================================================
     8. BOOKING CANVAS
     ============================================================ */
  (function () {
    'use strict';

    const canvas = document.getElementById('scene');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let W = 0, H = 0, dpr = 1;

    const pointer = {
      x: 0.5, y: 0.35,
      tx: 0.5, ty: 0.35,
      vx: 0, vy: 0,
      down: false,
      lastSpawnX: -9999,
      lastSpawnY: -9999,
    };

    let time = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const disturbances = [];
    const MAX_DISTURBANCES = 26;
    const rings = [];
    const MAX_RINGS = 18;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnDisturbance(sx, strength) {
      const life = 1.5 + strength * 1.1;
      const amp = 10 + strength * 62;
      const width = 55 + strength * 130;
      const freq = 0.024 + Math.random() * 0.012;
      const speed = 5.5 + Math.random() * 3.2;

      disturbances.push({ x: sx, t: time, life, amp, width, freq, speed, strength });
      if (disturbances.length > MAX_DISTURBANCES) disturbances.shift();
    }

    function spawnRing(sx, strength) {
      rings.push({
        x: sx, t: time,
        life: 1.5 + strength * 0.9,
        maxR: 90 + strength * 200,
        strength
      });
      if (rings.length > MAX_RINGS) rings.shift();
    }

    function splash(sx, strength) {
      spawnDisturbance(sx, strength);
      spawnRing(sx, strength);
    }

    function surfaceOffsetAt(x, t) {
      let offset = 0;
      for (let i = 0; i < disturbances.length; i++) {
        const d = disturbances[i];
        let age = t - d.t;
        if (age > d.life) continue;
        if (age < 0) age = 0;
        const decay = 1 - age / d.life;
        const dx = x - d.x;
        const env = Math.exp(-Math.pow(dx / d.width, 2));
        const wave = Math.sin(dx * d.freq - age * d.speed);
        offset += wave * env * d.amp * decay * decay;
      }
      return offset;
    }

    function waveY(x, t) {
      const u = x / W;
      const bigShape =
        Math.sin(u * Math.PI * 1.10 + 0.30) * H * 0.140
        - Math.pow(u, 2.20) * H * 0.320;
      const ripples =
        Math.sin(x * 0.0032 + t * 0.45) * H * 0.030
        + Math.sin(x * 0.0071 - t * 0.72) * H * 0.014
        + Math.sin(x * 0.0155 + t * 1.10) * H * 0.005
        + Math.sin(x * 0.0290 - t * 1.70) * H * 0.0018;

      const px = pointer.x * W;
      const speedBoost = Math.min(Math.abs(pointer.vx) * 0.12, 26);
      const lift =
        Math.exp(-Math.pow((x - px) / (W * 0.28), 2)) *
        (34 + speedBoost) * (1 - pointer.y);

      const base = H * 0.650;
      const interact = surfaceOffsetAt(x, t);
      return base + bigShape + ripples - lift + interact;
    }

    function drawRippleBands(t) {
      const bands = 20;
      const step = 4;
      for (let i = 1; i <= bands; i++) {
        const norm = i / bands;
        const offset = Math.pow(norm, 1.35) * H * 0.58 + 6;
        const alpha = 0.20 * (1 - norm) * (1 - norm) + 0.012;
        if (alpha <= 0.005) continue;
        ctx.beginPath();
        for (let x = 0; x <= W + step; x += step) {
          const y = waveY(x, t + i * 0.14) + offset
            + Math.sin(x * 0.0088 + i * 0.65 + t * 0.42) * 3.6
            + Math.sin(x * 0.0230 - i * 0.90 - t * 0.75) * 1.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(4)})`;
        ctx.lineWidth = 0.9;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    function drawShimmer(t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      const streaks = 38;
      for (let i = 0; i < streaks; i++) {
        const seed = i * 137.51;
        const x = (Math.sin(seed * 0.9) * 0.5 + 0.5) * W;
        const y = waveY(x, t) + 2 + (Math.sin(seed * 3.1 + t * 0.55) * 0.5 + 0.5) * 14;
        const len = 18 + (Math.sin(seed * 5.3 + t * 0.7) * 0.5 + 0.5) * 68;
        const a = 0.06 + (Math.sin(seed * 7.7 + t * 0.9) * 0.5 + 0.5) * 0.22;
        const grad = ctx.createLinearGradient(x, y, x + len, y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y + Math.sin(seed) * 2.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawRings(t) {
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        let age = t - r.t;
        if (age > r.life) continue;
        if (age < 0) age = 0;
        const p = age / r.life;
        const ease = 1 - Math.pow(1 - p, 2.4);
        const radius = r.maxR * ease;
        const alpha = (1 - p) * (1 - p) * 0.55 * (0.4 + r.strength * 0.6);
        if (alpha <= 0.008 || radius < 1) continue;
        const cy = waveY(r.x, t) + 6;
        ctx.beginPath();
        ctx.ellipse(r.x, cy, radius, radius * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(4)})`;
        ctx.lineWidth = 1.6 * (1 - p * 0.6);
        ctx.stroke();
        if (p < 0.6) {
          const innerAlpha = alpha * 0.45;
          ctx.beginPath();
          ctx.ellipse(r.x, cy, radius * 0.62, radius * 0.16, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${innerAlpha.toFixed(4)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawSurfaceLine(t) {
      const step = 3;
      ctx.beginPath();
      for (let x = 0; x <= W + step; x += step) {
        const y = waveY(x, t) + 0.8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.60)';
      ctx.lineWidth = 1.15;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    function drawHaze() {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0.00, 'rgba(255,255,255,0)');
      grad.addColorStop(0.40, 'rgba(255,255,255,0)');
      grad.addColorStop(0.52, 'rgba(255,255,255,0.11)');
      grad.addColorStop(0.62, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    function draw(t) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      const step = 3;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + step; x += step) {
        ctx.lineTo(x, waveY(x, t));
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, H * 0.22, 0, H);
      grad.addColorStop(0.00, '#63d192');
      grad.addColorStop(0.14, '#45bb73');
      grad.addColorStop(0.34, '#2f9e5c');
      grad.addColorStop(0.60, '#1f7c47');
      grad.addColorStop(0.82, '#155c34');
      grad.addColorStop(1.00, '#0e4526');
      ctx.fillStyle = grad;
      ctx.fill();

      drawRippleBands(t);
      drawShimmer(t);
      drawRings(t);
      drawSurfaceLine(t);
      drawHaze();
    }

    let startTime = performance.now();
    let rafId = 0;
    let lastFrame = performance.now();
    let bookingVisible = false;

    function loop(now) {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      time = (now - startTime) * 0.001;

      const prevX = pointer.x;
      const prevY = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * 0.055;
      pointer.y += (pointer.ty - pointer.y) * 0.055;
      pointer.vx = (pointer.x - prevX) / Math.max(dt, 0.001) * 0.02;
      pointer.vy = (pointer.y - prevY) / Math.max(dt, 0.001) * 0.02;

      if (pointer.down) {
        const sx = pointer.x * W;
        const sy = pointer.y * H;
        const dx = sx - pointer.lastSpawnX;
        const dy = sy - pointer.lastSpawnY;
        const dist = Math.hypot(dx, dy);
        if (dist > 14) {
          const strength = Math.min(0.35 + dist / 260, 1);
          splash(sx, strength);
          pointer.lastSpawnX = sx;
          pointer.lastSpawnY = sy;
        }
      }

      for (let i = disturbances.length - 1; i >= 0; i--) {
        if (time - disturbances[i].t > disturbances[i].life) disturbances.splice(i, 1);
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        if (time - rings[i].t > rings[i].life) rings.splice(i, 1);
      }

      draw(time);
      rafId = requestAnimationFrame(loop);
    }

    // Debounced resize (mobile URL bar hides/shows trigger many resizes)
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    }, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(resize, 250);
    }, { passive: true });

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.tx = x / rect.width;
      pointer.ty = y / rect.height;
      if (!pointer.down) {
        pointer.lastSpawnX = x;
        pointer.lastSpawnY = y;
      }
    }, { passive: true });

    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.tx = x / rect.width;
      pointer.ty = y / rect.height;
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
      pointer.down = true;
      pointer.lastSpawnX = x;
      pointer.lastSpawnY = y;
      splash(x, 1);
    });

    canvas.addEventListener('pointerup', (e) => {
      pointer.down = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointercancel', () => { pointer.down = false; });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (bookingVisible && !rafId) {
        lastFrame = performance.now();
        startTime = performance.now() - time * 1000;
        rafId = requestAnimationFrame(loop);
      }
    });

    // Only animate when booking is on/near screen
    const bookingEl = document.querySelector('.booking');
    if (bookingEl && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          bookingVisible = entry.isIntersecting;
          if (bookingVisible && !rafId) {
            lastFrame = performance.now();
            rafId = requestAnimationFrame(loop);
          } else if (!bookingVisible && rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        });
      }, { rootMargin: '200px' });
      io.observe(bookingEl);
    } else {
      // No IO → just run it
      if (!reducedMotion) rafId = requestAnimationFrame(loop);
    }

    resize();
    if (reducedMotion) draw(0);
  })();

  /* ============================================================
     9. FINAL REFRESH (fonts, images, etc.)
     ============================================================ */
  window.addEventListener('load', () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });