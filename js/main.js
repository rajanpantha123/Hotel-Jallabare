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

  // ============================================
  // HERO BACKGROUND VIDEOS — Dual Player & Switcher
  // ============================================
  const heroVideo1 = document.getElementById('heroVideo1');
  const heroVideo2 = document.getElementById('heroVideo2');
  const videoTab1 = document.getElementById('videoTab1');
  const videoTab2 = document.getElementById('videoTab2');
  const videoToggle = document.getElementById('heroVideoToggle');
  const iconPause = videoToggle ? videoToggle.querySelector('.icon-pause') : null;
  const iconPlay = videoToggle ? videoToggle.querySelector('.icon-play') : null;

  if (heroVideo1 && heroVideo2) {
    let currentVideo = 1;
    let isPaused = false;
    let autoSwitchTimer = null;

    function playVideoSafely(video) {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback handled smoothly by poster image if autoplay restricted
        });
      }
    }

    function switchHeroVideo(targetNum, manual = false) {
      if (targetNum === currentVideo && !manual) return;

      const outgoing = currentVideo === 1 ? heroVideo1 : heroVideo2;
      const incoming = targetNum === 1 ? heroVideo1 : heroVideo2;
      const activeTab = targetNum === 1 ? videoTab1 : videoTab2;
      const inactiveTab = targetNum === 1 ? videoTab2 : videoTab1;

      currentVideo = targetNum;

      if (activeTab && inactiveTab) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
      }

      if (!isPaused) {
        incoming.currentTime = 0;
        playVideoSafely(incoming);
      }

      incoming.classList.add('active');
      outgoing.classList.remove('active');

      setTimeout(() => {
        if (currentVideo !== (outgoing === heroVideo1 ? 1 : 2)) {
          outgoing.pause();
        }
      }, 1200);

      resetAutoSwitchTimer();
    }

    function resetAutoSwitchTimer() {
      clearTimeout(autoSwitchTimer);
      if (isPaused) return;

      const activeVideo = currentVideo === 1 ? heroVideo1 : heroVideo2;
      const duration = (activeVideo.duration && !isNaN(activeVideo.duration) && activeVideo.duration > 3)
        ? Math.max(activeVideo.duration * 1000 - 800, 7000)
        : 12000;

      autoSwitchTimer = setTimeout(() => {
        const next = currentVideo === 1 ? 2 : 1;
        switchHeroVideo(next, false);
      }, duration);
    }

    if (videoTab1) {
      videoTab1.addEventListener('click', () => switchHeroVideo(1, true));
    }
    if (videoTab2) {
      videoTab2.addEventListener('click', () => switchHeroVideo(2, true));
    }

    if (videoToggle) {
      videoToggle.addEventListener('click', () => {
        isPaused = !isPaused;
        const activeVideo = currentVideo === 1 ? heroVideo1 : heroVideo2;

        if (isPaused) {
          activeVideo.pause();
          clearTimeout(autoSwitchTimer);
          if (iconPause) iconPause.style.display = 'none';
          if (iconPlay) iconPlay.style.display = 'block';
          videoToggle.setAttribute('aria-label', 'Play background video');
        } else {
          playVideoSafely(activeVideo);
          resetAutoSwitchTimer();
          if (iconPause) iconPause.style.display = 'block';
          if (iconPlay) iconPlay.style.display = 'none';
          videoToggle.setAttribute('aria-label', 'Pause background video');
        }
      });
    }

    heroVideo1.addEventListener('ended', () => {
      if (!isPaused && currentVideo === 1) switchHeroVideo(2, false);
    });
    heroVideo2.addEventListener('ended', () => {
      if (!isPaused && currentVideo === 2) switchHeroVideo(1, false);
    });

    playVideoSafely(heroVideo1);
    heroVideo1.addEventListener('loadedmetadata', resetAutoSwitchTimer);
    resetAutoSwitchTimer();

    document.addEventListener('visibilitychange', () => {
      const activeVideo = currentVideo === 1 ? heroVideo1 : heroVideo2;
      if (document.hidden) {
        activeVideo.pause();
        clearTimeout(autoSwitchTimer);
      } else if (!isPaused) {
        playVideoSafely(activeVideo);
        resetAutoSwitchTimer();
      }
    });
  }

  // ============================================
  // BOOK A ROOM & CTA SMOOTH SCROLL HANDLER
  // ============================================
    document.querySelectorAll('a[href="#contact"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const guestNameInput = document.getElementById('guestName');
            if (guestNameInput) {
              guestNameInput.focus();
            }
          }, 600);
        }
      });
    });

    document.querySelectorAll('a[href="#about"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
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

    if (response.ok && (data.success === "true" || data.success === true)) {
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
      statusBox.innerHTML = `Unable to send right now${error.message ? `: ${error.message}` : ''}. Please call us directly or email <a href="mailto:jallabirerestpoint@gmail.com" style="color: inherit; text-decoration: underline;">jallabirerestpoint@gmail.com</a>.`;
    }
  } finally {
    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 5000);
  }
}

