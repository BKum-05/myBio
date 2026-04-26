document.addEventListener('DOMContentLoaded', () => {
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const hasScrollSmoother = typeof window.ScrollSmoother !== 'undefined';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  updateDynamicDate();
  initFooter();
  initActiveNav();
  initMobileNav();
  initProgressBar();
  initRevealObserver();
  initAnnotationAnimation();
  initCinematicScroll();
  initEducationTimeline();

  function updateDynamicDate() {
    const dateEl = document.getElementById('dynamic-date');
    if (!dateEl) return;

    const now = new Date();
    const formatted = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    dateEl.textContent = `Updated ${formatted}`;
  }

  function initAnnotationAnimation() {
    const annotationText = document.querySelector('.annotation-text');
    if (!annotationText || annotationText.dataset.split === 'true') return;

    const originalText = annotationText.textContent.trim();
    if (!originalText) return;

    annotationText.setAttribute('aria-label', originalText);
    annotationText.textContent = '';

    [...originalText].forEach((character, index) => {
      const span = document.createElement('span');
      span.className = 'annotation-char';
      span.style.setProperty('--char-index', index);

      if (character === ' ') {
        span.classList.add('annotation-space');
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = character;
      }

      annotationText.appendChild(span);
    });

    annotationText.dataset.split = 'true';
  }

  function getFooterFallbackMarkup() {
    return `
      <div class="social-sidebar">
        <a href="https://github.com/BKum-05" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub profile">
          <i class="fa-brands fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/bryan-kum-11b184330" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn profile">
          <i class="fa-brands fa-linkedin"></i>
        </a>
        <a href="mailto:bryankzk-pm23@student.tarc.edu.my?subject=Bryan%20Kum%20Portfolio" title="Email" aria-label="Send email to Bryan Kum">
          <i class="fa-solid fa-envelope"></i>
        </a>
      </div>
      <p>© 2023 – <span id="current-year"></span> Bryan Kum — Built with Passion from Malaysia</p>
    `;
  }

  function syncFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  function mountSocialSidebarToBody(footerContainer) {
    const sidebar = footerContainer.querySelector('.social-sidebar');
    if (!sidebar) return;

    const existingGlobalSidebar = document.querySelector('.social-sidebar.global-social-sidebar');
    if (existingGlobalSidebar) {
      existingGlobalSidebar.remove();
    }

    const existingInlineSidebar = footerContainer.querySelector('.social-sidebar-inline');
    if (existingInlineSidebar) {
      existingInlineSidebar.remove();
    }

    const inlineSidebar = sidebar.cloneNode(true);
    inlineSidebar.classList.add('social-sidebar-inline');
    footerContainer.insertBefore(inlineSidebar, footerContainer.firstChild);

    sidebar.classList.add('global-social-sidebar');
    document.body.appendChild(sidebar);
  }

  async function initFooter() {
    const footerContainer = document.getElementById('main-footer');
    if (!footerContainer) return;

    try {
      const response = await fetch('footer.html');
      const footerMarkup = await response.text();

      footerContainer.innerHTML = footerMarkup.trim() || getFooterFallbackMarkup();
      syncFooterYear();
      mountSocialSidebarToBody(footerContainer);
    } catch (error) {
      footerContainer.innerHTML = getFooterFallbackMarkup();
      syncFooterYear();
      mountSocialSidebarToBody(footerContainer);

      console.error('Footer error:', error);
    }
  }

  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('#mobile-menu a');

    if (!hamburger || !mobileMenu) return;

    const toggleMenu = (forceState) => {
      const isOpening = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpening);
      hamburger.textContent = isOpening ? '✕' : '☰';
      hamburger.setAttribute('aria-expanded', String(isOpening));
      document.body.style.overflow = isOpening ? 'hidden' : 'auto';
    };

    hamburger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (event) => {
      const clickedOutside = !mobileMenu.contains(event.target) && !hamburger.contains(event.target);
      if (mobileMenu.classList.contains('open') && clickedOutside) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 850 && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    let current = 0;
    let target = 0;
    let ticking = false;

    const updateTarget = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      target = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    };

    const animateProgress = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.05) {
        current = target;
      }

      progressBar.style.width = `${current}%`;

      if (Math.abs(target - current) >= 0.05) {
        requestAnimationFrame(animateProgress);
      } else {
        ticking = false;
      }
    };

    const handleScrollProgress = () => {
      updateTarget();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(animateProgress);
      }
    };

    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    window.addEventListener('resize', handleScrollProgress);
    handleScrollProgress();
  }

  function initRevealObserver() {
    const revealTargets = document.querySelectorAll('.page-header, .card, .project-card, .cert-item');
    if (!revealTargets.length) return;

    const canObserve = 'IntersectionObserver' in window;
    if (prefersReducedMotion || !canObserve) {
      revealTargets.forEach((el) => el.classList.add('show'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    });

    revealTargets.forEach((el) => {
      el.classList.add('reveal-init');
      revealObserver.observe(el);
    });
  }

  function initCinematicScroll() {
    if (!hasGSAP || !hasScrollSmoother || prefersReducedMotion) return;

    const wrapper = document.getElementById('smooth-wrapper');
    const content = document.getElementById('smooth-content');
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const existingSmoother = ScrollSmoother.get();
    if (existingSmoother) {
      existingSmoother.kill();
    }

    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.45,
      smoothTouch: 0.2,
      normalizeScroll: true,
    });
  }

  function initEducationTimeline() {
    const timeline = document.querySelector('.timeline-container');
    const filler = document.querySelector('.timeline-filler');
    if (!timeline || !filler) return;

    if (!hasGSAP || prefersReducedMotion) {
      filler.style.height = '100%';
      document.querySelectorAll('.timeline-item').forEach((item) => item.classList.add('show'));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const timelineItems = gsap.utils.toArray('.timeline-item');
    gsap.set(filler, { height: '0%' });

    gsap.fromTo(
      filler,
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );

    timelineItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          autoAlpha: 0,
          x: index % 2 === 0 ? -72 : 72,
          y: 28,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top 84%',
            end: 'top 46%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
  }
});