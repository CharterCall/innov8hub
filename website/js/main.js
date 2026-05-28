const GSHEET_URL = 'https://script.google.com/macros/s/AKfycbzL1yjLml9UCbBy9FL8Zh6WcQ8vnWkF90-LQi_OhKwOkv0mBUYwVIx4AgTpyXJNi9kGQw/exec';
const N8N_URL    = 'https://n8n.chartercall.com.au/webhook/innov8hub-lead';

document.addEventListener('DOMContentLoaded', () => {

  // Cascading dropdown logic
  const industrySelect = document.getElementById('industry');
  const businessSelect = document.getElementById('business');
  const otherIndustryGroup = document.getElementById('other-industry-group');
  const otherBusinessGroup = document.getElementById('other-business-group');

  const industryData = {
    trades: [
      { value: 'plumbing', text: 'Plumbing' },
      { value: 'electrical', text: 'Electrical' },
      { value: 'carpentry', text: 'Carpentry' },
      { value: 'hvac', text: 'HVAC' },
      { value: 'landscaping', text: 'Landscaping/Gardening' },
      { value: 'cleaning', text: 'Cleaning Services' },
      { value: 'other', text: 'Other Trades' }
    ],
    health: [
      { value: 'clinic', text: 'Medical/Dental Clinic' },
      { value: 'salon', text: 'Hair/Beauty Salon' },
      { value: 'fitness', text: 'Gym/Fitness Center' },
      { value: 'massage', text: 'Massage/Physio' },
      { value: 'other', text: 'Other Health & Beauty' }
    ],
    professional: [
      { value: 'accounting', text: 'Accounting/Finance' },
      { value: 'legal', text: 'Legal Services' },
      { value: 'consulting', text: 'Consulting' },
      { value: 'realestate', text: 'Real Estate' },
      { value: 'other', text: 'Other Professional' }
    ],
    retail: [
      { value: 'ecommerce', text: 'Online Store (E-commerce)' },
      { value: 'brickmortar', text: 'Brick & Mortar Store' },
      { value: 'wholesale', text: 'Wholesale/Distribution' },
      { value: 'other', text: 'Other Retail' }
    ]
  };

  if (industrySelect && businessSelect) {
    industrySelect.addEventListener('change', function() {
      const selectedIndustry = this.value;
      
      if (selectedIndustry === 'other') {
        otherIndustryGroup.style.display = 'block';
        document.getElementById('other-industry').required = true;
        
        businessSelect.innerHTML = '<option value="other" selected>Other</option>';
        otherBusinessGroup.style.display = 'block';
        document.getElementById('other-business').required = true;
      } else {
        otherIndustryGroup.style.display = 'none';
        document.getElementById('other-industry').required = false;
        
        businessSelect.innerHTML = '<option value="" disabled selected>Select your business type</option>';
        if (industryData[selectedIndustry]) {
          industryData[selectedIndustry].forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            businessSelect.appendChild(option);
          });
        }
        
        otherBusinessGroup.style.display = 'none';
        document.getElementById('other-business').required = false;
      }
    });

    businessSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        otherBusinessGroup.style.display = 'block';
        document.getElementById('other-business').required = true;
      } else {
        otherBusinessGroup.style.display = 'none';
        document.getElementById('other-business').required = false;
      }
    });
  }

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

      const indVal = document.getElementById('industry').value;
      const indText = indVal !== 'other' && industrySelect.options[industrySelect.selectedIndex] 
        ? industrySelect.options[industrySelect.selectedIndex].text 
        : document.getElementById('other-industry').value;

      const busVal = document.getElementById('business').value;
      const busText = busVal !== 'other' && businessSelect.options[businessSelect.selectedIndex]
        ? businessSelect.options[businessSelect.selectedIndex].text
        : document.getElementById('other-business').value;

      const toolsEl   = document.getElementById('tools');
      const painEl    = document.getElementById('pain');
      const volumeEl  = document.getElementById('volume');

      const payload = {
        name:     document.getElementById('name').value,
        email:    document.getElementById('email').value,
        mobile:   document.getElementById('mobile').value,
        industry: indText,
        business: busText,
        tools:    toolsEl    ? toolsEl.options[toolsEl.selectedIndex]?.text   || '' : '',
        pain:     painEl     ? painEl.options[painEl.selectedIndex]?.text     || '' : '',
        volume:   volumeEl   ? volumeEl.options[volumeEl.selectedIndex]?.text || '' : '',
        notes:    document.getElementById('message').value,
      };

      try {
        await Promise.all([
          fetch(GSHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload),
          }),
          fetch(N8N_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }),
        ]);
        successMsg.style.display = 'block';
        form.reset();
        
        // Reset dynamic fields
        if (otherIndustryGroup) otherIndustryGroup.style.display = 'none';
        if (otherBusinessGroup) otherBusinessGroup.style.display = 'none';
        if (businessSelect) businessSelect.innerHTML = '<option value="" disabled selected>Select your industry first</option>';
      } catch {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Book Free Automation Plan';
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

  // ROI Calculator Logic
  const sliderInquiries = document.getElementById('slider-inquiries');
  const sliderJob = document.getElementById('slider-job');
  const sliderConversion = document.getElementById('slider-conversion');
  const valTotal = document.getElementById('val-total');

  if (sliderInquiries && sliderJob && sliderConversion && valTotal) {
    const calculateROI = () => {
      const inquiries = parseInt(sliderInquiries.value) || 0;
      const jobValue = parseInt(sliderJob.value) || 0;
      const conversionRate = (parseInt(sliderConversion.value) || 0) / 100;
      
      const lostJobsPerWeek = inquiries * conversionRate;
      const lostRevenuePerWeek = lostJobsPerWeek * jobValue;
      const lostRevenuePerMonth = lostRevenuePerWeek * 4;
      
      valTotal.textContent = '$' + lostRevenuePerMonth.toLocaleString();
    };

    sliderInquiries.addEventListener('input', calculateROI);
    sliderJob.addEventListener('input', calculateROI);
    sliderConversion.addEventListener('input', calculateROI);
    calculateROI(); // init
  }

  // SMS Demo Logic
  const triggerSmsBtn = document.getElementById('trigger-sms-demo');
  const chatWindow = document.getElementById('demo-chat-window');
  const industryPicker = document.getElementById('demo-industry');

  const scenarios = {
    'plumber': {
      formText: 'Web Inquiry: Leaking Pipe Under Sink',
      aiReply: "Hi John! Mike's Plumbing here. Thanks for reaching out. We handle leaks all the time. Need someone out to take a look tomorrow morning?",
      userReply: 'Yes please, 9 AM would be great. Thanks for getting back to me so quickly!',
      actionText: 'Job secured without a phone call.'
    },
    'gardener': {
      formText: 'Web Inquiry: Lawn Mowing Quote',
      aiReply: 'Hi Sarah! This is Green Thumb Landscaping. We can definitely help with your lawn. Could you quickly text over a photo of the yard so we can give an accurate estimate?',
      userReply: 'Sure, here is a photo. How much would it be?',
      actionText: 'Lead engaged while you are busy.'
    },
    'cleaner': {
      formText: 'Web Inquiry: End of Lease Clean',
      aiReply: 'Hi Mike, Sparkle Clean here! We have availability this week for an end-of-lease clean. Does Thursday at 1 PM work for you?',
      userReply: 'Thursday 1 PM is perfect. Please book it in.',
      actionText: 'Appointment booked automatically.'
    }
  };

  if (triggerSmsBtn && chatWindow) {
    triggerSmsBtn.addEventListener('click', () => {
      triggerSmsBtn.disabled = true;
      triggerSmsBtn.textContent = 'Simulating...';
      chatWindow.innerHTML = ''; // reset
      
      const industry = industryPicker ? industryPicker.value : 'plumber';
      const currentScenario = scenarios[industry];
      
      // Step 1: Customer submits form
      setTimeout(() => {
        chatWindow.innerHTML += `
          <div style="align-self: center; background: #E5E7EB; color: #4B5563; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-bottom: 0.5rem; text-align: center;">
            ${currentScenario.formText}
          </div>
        `;
      }, 500);

      // Step 2: Instant Automated SMS out
      setTimeout(() => {
        chatWindow.innerHTML += `
          <div style="background: #E5E7EB; color: #111827; padding: 12px; border-radius: 12px 12px 12px 0; max-width: 85%; align-self: flex-start; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 0.95rem;">
            ${currentScenario.aiReply}
          </div>
          <div style="font-size: 0.7rem; color: #9CA3AF; margin-top: 4px; margin-left: 4px;">Sent instantly via Automation</div>
        `;
      }, 1500);

      // Step 3: Customer replies
      setTimeout(() => {
        chatWindow.innerHTML += `
          <div style="background: #2563EB; color: white; padding: 12px; border-radius: 12px 12px 0 12px; max-width: 85%; align-self: flex-end; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 0.95rem; margin-top: 1rem;">
            ${currentScenario.userReply}
          </div>
          <div style="font-size: 0.7rem; color: #9CA3AF; margin-top: 4px; text-align: right; margin-right: 4px;">${currentScenario.actionText}</div>
        `;
        triggerSmsBtn.textContent = 'Restart Demo';
        triggerSmsBtn.disabled = false;
      }, 3500);
    });
  }

});
