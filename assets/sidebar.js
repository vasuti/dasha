/* ============================================================
   DV SIDEBAR — тема (persist) + reveal-on-scroll (общие для всех страниц)
   ============================================================ */
(function(){
  var root = document.documentElement;
  var saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  document.querySelectorAll('.dv-theme').forEach(function(btn){
    btn.addEventListener('click', function(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
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
