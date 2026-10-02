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
     1. LENIS
     ============================================================ */
      // Initialize Lenis
      const lenis = new Lenis({
        duration: 1.2, // Scroll duration (higher = slower/smoother)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth ease-out curve
        direction: "vertical", // Scroll direction
        gestureDirection: "vertical", // Touch gesture direction
        smooth: true, // Enable smooth scrolling
        mouseMultiplier: 1, // Mouse wheel speed multiplier
        smoothTouch: false, // Disable smooth scrolling on touch devices (better for mobile UX)
        touchMultiplier: 2, // Touch speed multiplier
        infinite: false, // Enable infinite scrolling (set to true if needed)
      });

      // Animation frame loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Menu Toggle Functionality
      const menuToggle = document.querySelector(".hamburger input");
      const fullMenu = document.querySelector(".full-menu");

      menuToggle.addEventListener("change", () => {
        fullMenu.classList.toggle("menu-open", menuToggle.checked);
      });

      /* ============================================================
   10. SHERY.JS (Desktop Only > 1024px)
   ============================================================ */

        Shery.mouseFollower();


      if (window.innerWidth > 1024) {
        // Initialize Shery mouse follower
        Shery.mouseFollower();

        // Magnet effect for the logo
        Shery.makeMagnet("nav .logo", {
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          duration: 1,
        });

        // Magnet effect for links
        Shery.makeMagnet("a", {
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          duration: 1,
        });

        // Magnet effect for .magnet class
        Shery.makeMagnet(".magnet", {
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          duration: 1,
        });
      }


      Shery.hoverWithMediaCircle(".menu-category" /* Element to target.*/, {
  images: ["../components/images/dish2.jpg", "../components/images/dish1.jpg", "../components/images/dish5.jpg"] /*OR*/,
  //videos: ["video1.mp4", "video2.mp4"],
})




// --- Hero Section Animation ---
      const heroTl = gsap.timeline({ delay: 0.2 });

      // SplitText for Hero Title
      const heroTitleSplit = new SplitText(".hero-title", { type: "chars, words" });
      
      heroTl.from(heroTitleSplit.chars, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out"
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        rotation: -10,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-desc", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5");

      // --- Menu Categories Animation ---
      const categories = document.querySelectorAll(".menu-category");

      categories.forEach((category) => {
        const title = category.querySelector(".category-title");
        const link = category.querySelector(".category-link");
        const line = category.querySelector(".line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: category,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });

        // Title slides in from left
        tl.from(title, {
          opacity: 0,
          x: -60,
          duration: 0.8,
          ease: "power3.out"
        })
        // Link slides in from right
        .from(link, {
          opacity: 0,
          x: 60,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        // Line draws from left to right (only if visible/desktop)
        .from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4");
      });

      // --- Footer Animation ---
      gsap.from("footer .f-top, footer .f-mid, footer .f-bottom", {
        scrollTrigger: {
          trigger: "footer",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });