/* ═══════════════════════════════════════════════════════════
   NOIR COFFEE — SCRIPT.JS
   Scroll animations · Typewriter · Booking Modal · Counters · Menu filter
═══════════════════════════════════════════════════════════ */

/* ─── MENU DATA ─── */
const menuItems = [
  {
    category: 'espresso',
    name: 'Velvet Noir',
    desc: 'A double ristretto pulled at 9-bar precision. Dark chocolate and tobacco notes linger long.',
    price: '₹320',
    origin: 'Ethiopia Yirgacheffe',
    img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80'
  },
  {
    category: 'cold',
    name: 'Midnight Brew',
    desc: 'Cold-steeped for 32 hours in volcanic spring water. Smooth, almost silky — never bitter.',
    price: '₹390',
    origin: 'Colombia Huila',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80'
  },
  {
    category: 'specialty',
    name: 'Gold Ceremony',
    desc: 'Ceremonial Yemeni Mocha prepared in a hand-hammered dallah. A ritual in a cup.',
    price: '₹680',
    origin: 'Yemen Haraaz',
    img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=80'
  },
  {
    category: 'espresso',
    name: 'Obsidian Cortado',
    desc: 'Equal parts espresso and steamed oat milk. Intense, balanced, utterly precise.',
    price: '₹360',
    origin: 'Guatemala Antigua',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'
  },
  {
    category: 'cold',
    name: 'Amber Cascade',
    desc: 'Taiwanese-style honey-processed pour-over over crystal ice. Floral, sweet, electrifying.',
    price: '₹420',
    origin: 'Taiwan Ali Shan',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80'
  },
  {
    category: 'specialty',
    name: 'The Roastery Flight',
    desc: 'Three single-origin espresso shots served side-by-side with tasting notes. A connoisseur\'s journey.',
    price: '₹890',
    origin: 'Multi-origin',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80'
  }
];

/* ─── RENDER MENU ─── */
function renderMenu(filter = 'all') {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  const items = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
  grid.innerHTML = '';
  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'menu-card scroll-reveal';
    card.style.transitionDelay = `${idx * 80}ms`;
    card.innerHTML = `
      <div style="overflow:hidden; border-radius: 16px 16px 0 0;">
        <img src="${item.img}" alt="${item.name}" class="menu-card-img" loading="lazy" />
      </div>
      <div class="menu-card-body">
        <p class="menu-card-tag">${item.category}</p>
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${item.price}</span>
          <span class="menu-card-origin">${item.origin}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  // Re-observe new cards
  observeScrollReveal();
}

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
let mobileOpen = false;

hamburger.addEventListener('click', () => {
  mobileOpen = !mobileOpen;
  mobileNav.classList.toggle('open', mobileOpen);
  const spans = hamburger.querySelectorAll('span');
  if (mobileOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMobileNav() {
  mobileOpen = false;
  mobileNav.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

/* ─── HERO ENTRANCE ─── */
window.addEventListener('DOMContentLoaded', () => {
  // Set video class after load
  const video = document.getElementById('hero-video');
  if (video) {
    video.addEventListener('loadeddata', () => video.classList.add('loaded'));
    // Fallback if already loaded
    if (video.readyState >= 3) video.classList.add('loaded');
  }

  // Set min date for booking
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Staggered hero reveal
  setTimeout(() => document.getElementById('hero-eyebrow')?.classList.add('visible'), 300);
  setTimeout(() => document.getElementById('hero-title')?.classList.add('visible'), 500);
  setTimeout(() => document.getElementById('hero-sub')?.classList.add('visible'), 700);
  setTimeout(() => document.getElementById('hero-search-wrap')?.classList.add('visible'), 900);

  // Render menu
  renderMenu('all');

  // Start typewriter
  startTypewriter();
});

/* ─── TYPEWRITER EFFECT ─── */
const phrases = [
  'single origin Ethiopia Yirgacheffe...',
  'strongest black espresso...',
  'vegan cold brew options...',
  'ceremonial Yemeni Mocha...',
  'Saturday masterclass...',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('search-typewriter');
const inputEl = document.getElementById('hero-search-input');

function startTypewriter() {
  if (!typeEl) return;
  typeLoop();
}

function typeLoop() {
  if (!typeEl) return;

  // Only show typewriter when input is empty and not focused
  if (document.activeElement === inputEl || (inputEl && inputEl.value)) {
    setTimeout(typeLoop, 500);
    return;
  }

  const current = phrases[phraseIdx];

  if (!deleting && charIdx <= current.length) {
    typeEl.textContent = current.slice(0, charIdx);
    charIdx++;
    const speed = 45 + Math.random() * 30;
    setTimeout(typeLoop, charIdx === 1 ? 600 : speed);
  } else if (!deleting && charIdx > current.length) {
    deleting = true;
    setTimeout(typeLoop, 2200);
  } else if (deleting && charIdx > 0) {
    typeEl.textContent = current.slice(0, charIdx);
    charIdx--;
    setTimeout(typeLoop, 22);
  } else {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}

// Position typewriter in search bar
(function positionTypewriter() {
  const wrap = document.querySelector('.hero-search');
  const icon = document.querySelector('.search-icon');
  if (typeEl && wrap && icon) {
    const iconW = icon.offsetWidth + 12 + 24; // icon + gap + padding
    typeEl.style.position = 'absolute';
    typeEl.style.left = (wrap.offsetLeft + iconW + 12) + 'px';
    typeEl.style.top = '50%';
    typeEl.style.transform = 'translateY(-50%)';
  }
})();

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
function observeScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + (target === 12 ? '' : '');
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

// Initial scroll reveal setup
document.addEventListener('DOMContentLoaded', () => setTimeout(observeScrollReveal, 100));

/* ─── MENU FILTER ─── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const grid = document.getElementById('menu-grid');
    if (grid) {
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => {
        renderMenu(btn.dataset.filter);
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 250);
    }
  });
});

/* ─── BOOKING MODAL ─── */
let currentStep = 1;
let selectedTime = null;
let guestCount = 2;

function openModal() {
  document.getElementById('modal-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  currentStep = 1;
  selectedTime = null;
  guestCount = 2;
  document.getElementById('guest-count').textContent = '2';
  resetSteps();
  showStep(1);
  updateProgress(1);
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modal-backdrop')) return;
  document.getElementById('modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// Allow close button to always close
document.getElementById('modal-close-btn').addEventListener('click', () => {
  document.getElementById('modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
});

function resetSteps() {
  ['modal-step-1', 'modal-step-2', 'modal-step-3', 'modal-success'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  // Reset time slots
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  document.getElementById('step2-next').disabled = true;
}

function showStep(n) {
  resetSteps();
  const step = document.getElementById(`modal-step-${n}`);
  if (step) step.classList.remove('hidden');
  currentStep = n;
}

function updateProgress(step) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (i < step) dot.classList.add('done');
    else if (i === step) dot.classList.add('active');
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById(`progress-line-${i}`);
    if (!line) continue;
    line.classList.toggle('done', i < step);
  }
}

function goToStep(n) {
  if (n === 3) {
    // Populate confirm summary
    const dateVal = document.getElementById('booking-date').value;
    const dateFormatted = dateVal ? new Date(dateVal + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—';
    document.getElementById('sum-date').textContent = dateFormatted;
    document.getElementById('sum-time').textContent = selectedTime || '—';
    document.getElementById('sum-guests').textContent = guestCount + (guestCount === 1 ? ' person' : ' people');
  }
  showStep(n);
  updateProgress(n);
}

function selectTime(btn) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  selectedTime = btn.dataset.time;
  document.getElementById('step2-next').disabled = false;
}

function changeGuests(delta) {
  guestCount = Math.max(1, Math.min(12, guestCount + delta));
  document.getElementById('guest-count').textContent = guestCount;
}

function confirmBooking() {
  const name = document.getElementById('booking-name').value.trim();
  const email = document.getElementById('booking-email').value.trim();
  if (!name || !email) {
    document.getElementById('booking-name').style.borderColor = !name ? '#e05' : '';
    document.getElementById('booking-email').style.borderColor = !email ? '#e05' : '';
    setTimeout(() => {
      document.getElementById('booking-name').style.borderColor = '';
      document.getElementById('booking-email').style.borderColor = '';
    }, 1500);
    return;
  }
  // Show success
  resetSteps();
  const success = document.getElementById('modal-success');
  success.classList.remove('hidden');
  document.getElementById('success-message').textContent =
    `Your table is confirmed, ${name}. We'll see you on ${document.getElementById('sum-date').textContent}.`;
}

/* ─── KEYBOARD ESC TO CLOSE MODAL ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─── SMOOTH NAV LINK SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── PARALLAX ON HERO VIDEO ─── */
window.addEventListener('scroll', () => {
  const video = document.getElementById('hero-video');
  if (video) {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      video.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }
}, { passive: true });
