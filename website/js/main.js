document.addEventListener('DOMContentLoaded', () => {
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
