(function() {
  "use strict";

  /* ==========================================================================
     Lenis Smooth Scroll Setup
     ========================================================================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
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

  // Sync GSAP ScrollTrigger with Lenis
  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* ==========================================================================
     Custom Cursor
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });

    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .service-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ==========================================================================
     Magnetic Buttons
     ========================================================================== */
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  /* ==========================================================================
     Header & Mobile Nav
     ========================================================================== */
  const header = document.querySelector('.premium-header');
  const scrollProgress = document.getElementById('scroll-progress');
  let lastScrollY = window.scrollY;

  lenis.on('scroll', (e) => {
    // Scroll Progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / scrollHeight) * 100;
    if(scrollProgress) scrollProgress.style.width = `${progress}%`;

    // Hide/Show Header
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
  });

  const mobileToggle = document.querySelector('.mobile-toggle');
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('nav-open');
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('nav-open');
    });
  });



  /* ==========================================================================
     Typing Effect for Hero
     ========================================================================== */
  const typedTextSpan = document.querySelector(".typed-text");
  if(typedTextSpan) {
    const textArray = ["AI Engineer", "Software Developer", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    setTimeout(type, newTextDelay);
  }

  /* ==========================================================================
     GSAP Scroll Animations
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  // Hero Parallax
  gsap.to('.hero-visual', {
    y: 100,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Fade Up Elements
  gsap.utils.toArray('.fade-up').forEach(element => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Slide In Elements (Hero)
  gsap.utils.toArray('.slide-in').forEach((element, i) => {
    gsap.fromTo(element,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: i * 0.1,
        ease: "power3.out"
      }
    );
  });

  /* ==========================================================================
     Project Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          gsap.fromTo(card, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
        } else {
          card.style.display = 'none';
        }
      });
      
      // Refresh ScrollTrigger after DOM layout changes so animations for elements below trigger correctly
      ScrollTrigger.refresh();
    });
  });

  /* ==========================================================================
     Modal Logic
     ========================================================================== */
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
      modal.classList.add('active');
      lenis.stop(); // Stop scrolling while modal is open
    }
  }

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
      modal.classList.remove('active');
      lenis.start(); // Resume scrolling
    }
  }

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('project-modal')) {
      e.target.classList.remove('active');
      lenis.start();
    }
  });



})();