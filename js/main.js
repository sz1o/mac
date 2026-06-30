/* ============================================================
   SPLASH SCREEN
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const site   = document.getElementById('site');

  setTimeout(() => {
    splash.classList.add('fade-out');
    site.classList.remove('hidden');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        site.classList.add('visible');
      });
    });

    splash.addEventListener('transitionend', () => splash.remove(), { once: true });

    initReveal();
    initScrollHint();
  }, 3000);
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   SCROLL HINT (arrow pointing DOWN — hides on scroll/hover)
   ============================================================ */
function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  let hidden = false;

  function hideHint() {
    if (!hidden) {
      hint.classList.add('hidden');
      hidden = true;
    }
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) hideHint();
  }, { passive: true });

  // Also hide when user moves mouse anywhere on the hero
  const hero = document.getElementById('hero');
  if (hero) hero.addEventListener('mousemove', hideHint, { once: true });
}

/* ============================================================
   COPY BUTTONS
   ============================================================ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;

  const targetId = btn.dataset.target;
  const pre = document.getElementById(targetId);
  if (!pre) return;

  const text = pre.innerText;

  const doSuccess = () => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doSuccess).catch(() => fallbackCopy(text, doSuccess));
  } else {
    fallbackCopy(text, doSuccess);
  }
});

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch {}
  document.body.removeChild(ta);
}

/* ============================================================
   ORBIT ICONS
   -- Real logos are wired into index.html (#orbit-ring), one
   -- <img> per .orbit-icon div, with --i:0..17 set inline.
   -- CSS handles sizing, spacing, and counter-rotation off --i.
   --
   -- To add/remove icons: add/remove an .orbit-icon div with
   -- the next --i value, then update --num-icons in style.css
   -- to match the new total count (and bump --orbit-radius if
   -- things start to overlap — see the comment next to it).
   ============================================================ */
