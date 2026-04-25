// Paste your deployed Google Apps Script URL here after setup
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzL1yjLml9UCbBy9FL8Zh6WcQ8vnWkF90-LQi_OhKwOkv0mBUYwVIx4AgTpyXJNi9kGQw/exec';

document.addEventListener('DOMContentLoaded', () => {

  // Contact form → Google Sheet
  const form = document.getElementById('consultationForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const successMsg = document.getElementById('formSuccess');
      const errorMsg = document.getElementById('formError');

      btn.disabled = true;
      btn.textContent = 'Sending...';
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';

      const payload = {
        name:     document.getElementById('name').value,
        email:    document.getElementById('email').value,
        business: document.getElementById('business').value,
        message:  document.getElementById('message').value,
      };

      try {
        await fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        successMsg.style.display = 'block';
        form.reset();
      } catch {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Book Consultation';
      }
    });
  }
  // Sticky Navbar
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Highlight active nav link based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-link');
  
  navItems.forEach(item => {
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('active');
    }
  });

  // Sticky Scroll Logic for Process Tracker
  const scrollContainer = document.getElementById('scrollContainer');
  const stickySteps = document.querySelectorAll('.sticky-step');
  const stickyImage = document.getElementById('stickyImage');
  const images = [
    'img/flow_missed_call.png',
    'img/flow_ai_answers.png',
    'img/flow_details.png',
    'img/flow_job_secured.png'
  ];

  if (scrollContainer && stickySteps.length > 0 && stickyImage) {
    window.addEventListener('scroll', () => {
      // Disable sticky logic on mobile
      if (window.innerWidth <= 768) return;

      const rect = scrollContainer.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;
      
      // Calculate how far down the container we've scrolled (0 to 1)
      let progress = -rect.top / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      // Determine current step (0 to 3)
      const stepIndex = Math.min(Math.floor(progress * stickySteps.length), stickySteps.length - 1);
      
      // Update Active class
      stickySteps.forEach((step, index) => {
        if (index === stepIndex) {
          step.classList.add('active');
          step.classList.remove('out-top');
        } else if (index < stepIndex) {
          step.classList.remove('active');
          step.classList.add('out-top');
        } else {
          step.classList.remove('active');
          step.classList.remove('out-top');
        }
      });

      // Update tracking ball
      const trackingBall = document.getElementById('trackingBall');
      if (trackingBall) {
        trackingBall.style.top = `${progress * 100}%`;
      }

      // Update image seamlessly
      let currentSrc = stickyImage.getAttribute('src');
      let newSrc = images[stepIndex];
      if (currentSrc !== newSrc) {
        stickyImage.style.opacity = 0;
        setTimeout(() => {
          stickyImage.setAttribute('src', newSrc);
          stickyImage.style.opacity = 1;
        }, 300);
      }
    });
  }
});
