/* =========================================================
   Dhruv — Portfolio interactions
   ========================================================= */

// --- Nav scroll state ---
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// --- Mobile menu ---
(() => {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();

// --- Reveal on scroll ---
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const sibs = [...e.target.parentElement.children].indexOf(e.target);
        const delay = Math.min(Math.max(sibs, 0), 5) * 75;
        setTimeout(() => e.target.classList.add('in'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach((el) => io.observe(el));
})();

// --- Scroll-spy: highlight active nav link ---
(() => {
  const links = [...document.querySelectorAll('.nav-links a')];
  const map = new Map();
  links.forEach((l) => {
    const id = l.getAttribute('href');
    const sec = id && id.length > 1 ? document.querySelector(id) : null;
    if (sec) map.set(sec, l);
  });
  if (!map.size || !('IntersectionObserver' in window)) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove('active'));
        map.get(e.target)?.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, sec) => spy.observe(sec));
})();

// --- Copy email ---
(() => {
  const btn = document.getElementById('copyEmail');
  if (!btn) return;
  const label = btn.querySelector('.chip-label');
  const original = label ? label.textContent : 'Copy';
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email || '';
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const t = document.createElement('textarea');
      t.value = email; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    btn.classList.add('copied');
    if (label) label.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = original;
    }, 1600);
  });
})();

// --- Footer year ---
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// --- Smooth anchor scroll with nav offset ---
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 28;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});
