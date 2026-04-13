document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MODULAR FOOTER LOADING
     ========================================================================== */
  async function initFooter() {
    try {
      const response = await fetch('footer.html');
      const html = await response.text();
      const footerContainer = document.getElementById('main-footer');

      if (footerContainer) {
        footerContainer.innerHTML = html;
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
      }
    } catch (error) {
      console.error("Footer error:", error);
    }
  }

  initFooter();

  /* ==========================================================================
     2. NAVIGATION: ACTIVE LINK LOGIC
     ========================================================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ==========================================================================
     3. NAVIGATION: MOBILE HAMBURGER LOGIC
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');

  if (hamburger && mobileMenu) {
    const toggleMenu = (forceState) => {
      const isOpening = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpening);
      hamburger.textContent = isOpening ? '✕' : '☰';
      hamburger.setAttribute('aria-expanded', isOpening);
      document.body.style.overflow = isOpening ? 'hidden' : 'auto';
    };

    // Event Listeners
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 850 && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ==========================================================================
     4. SCROLL PROGRESS BAR
     ========================================================================== */
  const progressBar = document.getElementById('progress-bar');

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    });
  }

  /* ==========================================================================
     5. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  const revealTargets = document.querySelectorAll('.timeline-item, .card, .project-card, .cert-card');

  revealTargets.forEach(target => {
    target.classList.add('reveal-init');
    revealObserver.observe(target);
  });

  /* ==========================================================================
     6. TIMELINE FILLER LOGIC
     ========================================================================== */
  const timeline = document.querySelector('.timeline-container');
  const filler = document.querySelector('.timeline-filler');

  if (timeline && filler) {
    const handleTimelineScroll = () => {
      const rect = timeline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      let progress = (viewHeight - rect.top) / (rect.height + viewHeight / 3) * 100;
      filler.style.height = `${Math.min(Math.max(progress, 0), 100)}%`;
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleTimelineScroll);
        } else {
          window.removeEventListener('scroll', handleTimelineScroll);
        }
      });
    }, { threshold: 0 });

    timelineObserver.observe(timeline);
  }
});
