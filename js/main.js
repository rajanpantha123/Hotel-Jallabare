/* ============================================
   JALLABIRE GUEST HOUSE — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // NAVBAR — Scroll Effect & Active Link
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ============================================
  // MOBILE HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ============================================
  // GALLERY — Filter & Lightbox
  // ============================================
  const filterBtns = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentImageIndex = 0;
  let visibleImages = [];

  // Gallery filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          // Re-trigger animation
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox open
  function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleImages();
      currentImageIndex = visibleImages.indexOf(item);
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery__item-overlay span');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function nextImage() {
    updateVisibleImages();
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    openLightbox(visibleImages[currentImageIndex]);
  }

  function prevImage() {
    updateVisibleImages();
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    openLightbox(visibleImages[currentImageIndex]);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // ============================================
  // SMOOTH SCROLL for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // BOOKING FORM — Set min date to today
  // ============================================
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);

    checkInInput.addEventListener('change', () => {
      checkOutInput.setAttribute('min', checkInInput.value);
      if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
        checkOutInput.value = checkInInput.value;
      }
    });
  }

});

// ============================================
// BOOKING FORM SUBMIT HANDLER
// ============================================
async function handleBookingSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusBox = document.getElementById('bookingFormStatus');
  const originalHtml = submitBtn.innerHTML;

  const name = form.querySelector('#guestName').value.trim();
  const phone = form.querySelector('#guestPhone').value.trim();
  const email = form.querySelector('#guestEmail').value.trim();
  const checkIn = form.querySelector('#checkIn').value;
  const checkOut = form.querySelector('#checkOut').value;
  const guests = form.querySelector('#numGuests').value;
  const rooms = form.querySelector('#numRooms').value;
  const message = form.querySelector('#guestMessage').value.trim();

  // Validate dates
  if (new Date(checkOut) <= new Date(checkIn)) {
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.style.backgroundColor = '#FEE2E2';
      statusBox.style.color = '#991B1B';
      statusBox.style.border = '1px solid #F87171';
      statusBox.innerHTML = '⚠️ Check-out date must be after check-in date.';
    } else {
      alert('Check-out date must be after check-in date.');
    }
    return;
  }

  // Show loading UI
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px;">
      <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"></circle>
    </svg>
    Sending Request...
  `;
  if (statusBox) {
    statusBox.style.display = 'none';
  }

  const payload = {
    "Guest Name": name,
    "Phone Number": phone,
    "Email Address": email || "Not provided",
    "Check-in Date": checkIn,
    "Check-out Date": checkOut,
    "Number of Guests": guests,
    "Number of Rooms": rooms,
    "Message / Special Requests": message || "None",
    "_subject": `New Booking Request from ${name} - Jallabire Guest House`,
    "_template": "table",
    "_captcha": "false"
  };

  try {
    const response = await fetch('https://formsubmit.co/ajax/jallabirerestpoint@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && (data.success === "true" || data.success === true || response.status === 200)) {
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
        Request Sent Successfully!
      `;
      submitBtn.style.background = '#2E7D32';

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.backgroundColor = '#E8F5E9';
        statusBox.style.color = '#1B5E20';
        statusBox.style.border = '1px solid #81C784';
        statusBox.innerHTML = '<strong>Thank you!</strong> Your booking request has been forwarded to our team at <strong>jallabirerestpoint@gmail.com</strong>. We will get back to you shortly.';
      }

      form.reset();
    } else {
      throw new Error(data.message || 'Server error');
    }
  } catch (error) {
    console.error('Submission error:', error);
    submitBtn.innerHTML = `⚠️ Submission Failed`;
    submitBtn.style.background = '#C62828';

    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.style.backgroundColor = '#FFEBEE';
      statusBox.style.color = '#B71C1C';
      statusBox.style.border = '1px solid #EF9A9A';
      statusBox.innerHTML = 'Unable to send right now. Please call us directly or email <a href="mailto:jallabirerestpoint@gmail.com" style="color: inherit; text-decoration: underline;">jallabirerestpoint@gmail.com</a>.';
    }
  } finally {
    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 5000);
  }
}

