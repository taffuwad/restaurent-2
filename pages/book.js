// ============================================================
// NAV LOGO REDIRECT TO HOME
// ============================================================
const navLogo = document.querySelector("nav .logo");

if (navLogo) {
  // Change cursor to pointer so it looks clickable
  navLogo.style.cursor = "pointer";
  
  // Add click event to redirect to index.html
  navLogo.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

/* ============================================================
       1. LENIS SMOOTH SCROLLING
       ============================================================ */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ============================================================
       2. MENU TOGGLE FUNCTIONALITY
       ============================================================ */
    const menuToggle = document.querySelector(".hamburger input");
    const fullMenu = document.querySelector(".full-menu");

    menuToggle.addEventListener("change", () => {
      fullMenu.classList.toggle("menu-open", menuToggle.checked);
      
      // Stop/Start Lenis based on menu state
      if (menuToggle.checked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    /* ============================================================
       3. SHERY.JS INTERACTIONS (Desktop Only > 1024px)
       ============================================================ */
    if (window.innerWidth > 1024) {
      Shery.mouseFollower({
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });

      Shery.makeMagnet("nav .logo", {
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });

      Shery.makeMagnet("a, .magnet", {
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });
    }

    /* ============================================================
       4. GSAP ANIMATIONS
       ============================================================ */
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Hero Text Reveal
    const heroTitleSplit = new SplitText(".hero-title", { type: "chars, words" });
    gsap.from(heroTitleSplit.chars, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.05,
      ease: "power3.out",
      delay: 0.2
    });

    gsap.from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.8,
      ease: "power3.out"
    });

    // Form Elements Scroll Animation
    const formElements = document.querySelectorAll(".form-title, .form-subtitle, .form-row, .submit-btn");
    formElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    // Image Parallax Effect
    gsap.fromTo(".booking-image img", 
      { y: -30 },
      {
        y: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".booking-image",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    // Info Blocks Animation
    gsap.from(".info-block", {
      scrollTrigger: {
        trigger: ".info-section",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });