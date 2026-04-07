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

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
      // Added: prevent body scroll when menu is open
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Click outside to close 
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.textContent = '☰';
        document.body.style.overflow = 'auto';
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
