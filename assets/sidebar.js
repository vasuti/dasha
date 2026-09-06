/* ============================================================
   DV SIDEBAR — бургер-меню + reveal-on-scroll (общие для всех страниц)
   ============================================================ */

/* ================= MOBILE BURGER MENU ================= */
(function(){
  var burger = document.querySelector('.dv-burger');
  var sidebar = document.querySelector('.dv-sidebar');
  var backdrop = document.querySelector('.dv-backdrop');
  if (!burger || !sidebar) return;

  function closeMenu(){
    sidebar.classList.remove('open');
    burger.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('dv-noscroll');
  }
  function openMenu(){
    sidebar.classList.add('open');
    burger.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('dv-noscroll');
  }
  burger.addEventListener('click', function(){
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  sidebar.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', function(){
    if (window.innerWidth > 960) closeMenu();
  });
})();

/* Reveal по документу (для страниц без своего IntersectionObserver) */
if (!window.__dvRevealInit) {
  window.__dvRevealInit = true;
  document.addEventListener('DOMContentLoaded', function(){
    if (window.__dvRevealBound) return;
    window.__dvRevealBound = true;
    var els = document.querySelectorAll('.rv:not(.in)');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function(el){ io.observe(el); });
  });
}
