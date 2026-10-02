
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