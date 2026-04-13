document.addEventListener('DOMContentLoaded', () => {

  // 1. MODULAR FOOTER LOADING
  async function initFooter() {
    try {
      const response = await fetch('footer.html');
      const html = await response.text();
      const footerContainer = document.getElementById('main-footer');

      if (footerContainer) {
        footerContainer.innerHTML = html;

        // Set the year after content is injected
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

  // 2. HAMBURGER LOGIC
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');

  if (hamburger && mobileMenu) {

    // Function to open/close menu
    const toggleMenu = (forceState) => {
      const isOpening = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('open');

      mobileMenu.classList.toggle('open', isOpening);

      // UI Updates
      hamburger.textContent = isOpening ? '✕' : '☰';
      hamburger.setAttribute('aria-expanded', isOpening);

      // Prevent background scrolling
      document.body.style.overflow = isOpening ? 'hidden' : 'auto';
    };

    // Hamburger Click Event
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents immediate close if clicking button
      toggleMenu();
    });

    // Close menu when clicking any mobile link (prevents staying open on navigation)
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu when clicking anywhere outside the menu links (on the overlay)
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu if window is resized above mobile breakpoint (cleanup)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 850 && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 3. SCROLL PROGRESS BAR 
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    });
  }

  // 4. ACTIVE NAV LINK 
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  // Updated selector to match your cleaned-up HTML class ".nav-links"
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
