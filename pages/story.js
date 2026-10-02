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
      Shery.mouseFollower();

      Shery.makeMagnet("nav .logo", {
        skew: true,
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });

      Shery.makeMagnet("a, .btn", {
        skew: true,
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });
      Shery.makeMagnet(".magnet", {
        skew: true,
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
      });
    }

    /* ============================================================
       4. GSAP SCROLL ANIMATIONS
       ============================================================ */
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Hero Text Reveal
    const heroTitle = new SplitText(".hero-title", { type: "chars, words" });
    gsap.from(heroTitle.chars, {
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

    gsap.from(".hero-desc", {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 1.2,
      ease: "power3.out"
    });

    // Section Titles Reveal
    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
      const split = new SplitText(title, { type: "lines, words" });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
      });
    });

    // Section Descriptions & Tags Fade Up
    const fadeElements = document.querySelectorAll(".small-tag, .section-desc, .script-text, .pagination, .bottom-note, .btn-group");
    fadeElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    // Image Parallax Effect
    const parallaxImages = document.querySelectorAll(".parallax-img");
    parallaxImages.forEach((img) => {
      gsap.fromTo(img, 
        { y: -30 },
        {
          y: 30,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });

    // Image Stack Animation
    gsap.from(".stack-img", {
      scrollTrigger: {
        trigger: ".people-behind",
        start: "top 70%",
      },
      opacity: 0,
      y: 100,
      rotation: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Grid Images Animation
    gsap.from(".grid-img-1", {
      scrollTrigger: {
        trigger: ".our-mission",
        start: "top 70%",
      },
      opacity: 0,
      x: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".grid-img-2", {
      scrollTrigger: {
        trigger: ".our-mission",
        start: "top 70%",
      },
      opacity: 0,
      x: -50,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });
