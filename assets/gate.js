/* ============================================================
   ACCESS GATE — 5-digit code
   Include as the FIRST script in <head> on every page:
     <script src="assets/gate.js"></script>
   Change the code: update GATE_HASH below (SHA-256 of "dv:" + code).
   ============================================================ */
(function () {
  'use strict';

  var GATE_HASH = '91dff30dcc2e29e7b8217bb1f731184c9636d7f66bf08f37cf69699d9743ce82';
  var STORE_KEY = 'siteAccess';
  var LEN = 5;

  /* Already unlocked in a previous visit — do nothing at all. */
  try {
    if (localStorage.getItem(STORE_KEY) === GATE_HASH) return;
  } catch (e) { /* storage blocked — show the gate */ }

  /* ---- 1. Hide the page immediately, before anything paints ---- */
  var root = document.documentElement;
  root.classList.add('gate-locked');

  var hideStyle = document.createElement('style');
  hideStyle.id = 'gate-hide';
  hideStyle.textContent =
    'html.gate-locked body > *:not(#accessGate){visibility:hidden !important}' +
    'html.gate-locked{overflow:hidden !important}' +
    'html.gate-locked body{overflow:hidden !important}';
  (document.head || root).appendChild(hideStyle);

  /* ---- 2. Gate styles ---- */
  var css = document.createElement('style');
  css.id = 'gate-style';
  css.textContent = [
    '#accessGate{',
    '  position:fixed; inset:0; z-index:2147483647;',
    '  display:flex; flex-direction:column; align-items:center; justify-content:center;',
    '  gap:0; padding:28px 20px calc(28px + env(safe-area-inset-bottom));',
    '  background:var(--gate-bg); color:var(--gate-ink);',
    "  font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;",
    '  font-weight:300; text-align:center;',
    '  opacity:0; transition:opacity .5s ease;',
    '  -webkit-font-smoothing:antialiased;',
    '}',
    '#accessGate.is-in{opacity:1}',
    '#accessGate.is-out{opacity:0; pointer-events:none}',

    '#accessGate{',
    '  --gate-bg:#f7f7f7; --gate-ink:#232323; --gate-muted:rgba(35,35,35,.5);',
    '  --gate-card:rgba(255,255,255,.72); --gate-line:rgba(28,28,35,.14);',
    '  --gate-field:#ffffff; --gate-field-line:rgba(28,28,35,.16);',
    '  --gate-shadow:0 22px 60px rgba(28,28,35,.10);',
    '  --gate-err:#e5484d;',
    '}',
    '#accessGate[data-gate-theme="dark"]{',
    '  --gate-bg:#0b0c0f; --gate-ink:#ecedf2; --gate-muted:rgba(236,237,242,.52);',
    '  --gate-card:rgba(255,255,255,.05); --gate-line:rgba(244,244,255,.12);',
    '  --gate-field:rgba(255,255,255,.06); --gate-field-line:rgba(244,244,255,.16);',
    '  --gate-shadow:0 22px 60px rgba(0,0,0,.55);',
    '  --gate-err:#ff6b6f;',
    '}',

    /* soft ambient glow */
    '#accessGate::before{',
    '  content:""; position:absolute; inset:0; pointer-events:none;',
    '  background:radial-gradient(60% 48% at 50% 34%, rgba(150,140,255,.16), transparent 70%);',
    '}',

    '.gate-card{',
    '  position:relative; width:min(100%, 420px);',
    '  display:flex; flex-direction:column; align-items:center;',
    '  padding:44px 34px 38px; border-radius:26px;',
    '  background:var(--gate-card); border:1px solid var(--gate-line);',
    '  box-shadow:var(--gate-shadow);',
    '  backdrop-filter:blur(18px) saturate(1.15); -webkit-backdrop-filter:blur(18px) saturate(1.15);',
    '  transform:translateY(14px); opacity:0;',
    '  transition:transform .7s cubic-bezier(.22,1,.36,1), opacity .7s ease;',
    '}',
    '#accessGate.is-in .gate-card{transform:none; opacity:1}',
    '.gate-card.shake{animation:gateShake .45s cubic-bezier(.36,.07,.19,.97)}',
    '@keyframes gateShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}' +
      '30%,50%,70%{transform:translateX(-7px)}40%,60%{transform:translateX(7px)}}',

    '.gate-brand{',
    '  font-size:17px; line-height:1; font-weight:600; letter-spacing:.14em;',
    '  text-transform:uppercase; margin-bottom:16px;',
    '}',
    '.gate-note{',
    '  font-size:14px; line-height:1.55; font-weight:300; color:var(--gate-muted);',
    '  max-width:270px; margin-bottom:30px;',
    '}',

    '.gate-fields{display:flex; align-items:center; justify-content:center; gap:10px}',
    '.gate-digit{',
    '  width:52px; height:62px; border-radius:14px;',
    '  border:1px solid var(--gate-field-line); background:var(--gate-field);',
    '  color:var(--gate-ink); font-family:inherit; font-size:24px; font-weight:500;',
    '  text-align:center; letter-spacing:0; caret-color:var(--gate-ink);',
    '  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;',
    '  -moz-appearance:textfield;',
    '}',
    '.gate-digit::-webkit-outer-spin-button,.gate-digit::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}',
    '.gate-digit:focus{',
    '  outline:none; border-color:var(--gate-ink);',
    '  box-shadow:0 0 0 3px rgba(140,130,240,.18); transform:translateY(-1px);',
    '}',
    '.gate-digit.filled{border-color:var(--gate-ink)}',
    '#accessGate.error .gate-digit{border-color:var(--gate-err)}',

    '.gate-msg{',
    '  min-height:18px; margin-top:16px;',
    '  font-size:12.5px; line-height:18px; letter-spacing:.02em; font-weight:400;',
    '  color:var(--gate-err); opacity:0; transition:opacity .25s ease;',
    '}',
    '#accessGate.error .gate-msg{opacity:1}',

    '.gate-socials{',
    '  position:relative; display:flex; align-items:center; justify-content:center;',
    '  gap:12px; margin-top:34px; line-height:0;',
    '  opacity:0; transform:translateY(10px);',
    '  transition:opacity .7s ease .18s, transform .7s cubic-bezier(.22,1,.36,1) .18s;',
    '}',
    '#accessGate.is-in .gate-socials{opacity:1; transform:none}',
    '.gate-social{',
    '  width:40px; height:40px; border-radius:9px; overflow:hidden;',
    '  display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto;',
    '  transition:transform .28s ease, opacity .25s ease, filter .25s ease;',
    '}',
    '.gate-social img{width:100%; height:100%; object-fit:cover; display:block}',
    '.gate-social:hover{opacity:.86; transform:translateY(-3px); filter:saturate(1.08)}',
    '.gate-social:focus-visible{outline:2px solid currentColor; outline-offset:3px}',

    '@media (max-width:480px){',
    '  .gate-card{padding:38px 22px 32px; border-radius:22px}',
    '  .gate-fields{gap:8px}',
    '  .gate-digit{width:46px; height:56px; font-size:21px; border-radius:12px}',
    '  .gate-note{margin-bottom:26px}',
    '  .gate-socials{margin-top:28px}',
    '}',
    '@media (max-width:360px){',
    '  .gate-digit{width:42px; height:52px; font-size:19px}',
    '  .gate-fields{gap:6px}',
    '}',
    '@media (prefers-reduced-motion:reduce){',
    '  #accessGate,.gate-card,.gate-socials{transition:none}',
    '  .gate-card.shake{animation:none}',
    '}'
  ].join('\n');
  (document.head || root).appendChild(css);

  /* ---- 3. Build the overlay once the body exists ---- */
  function build() {
    if (document.getElementById('accessGate')) return;

    var gate = document.createElement('div');
    gate.id = 'accessGate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', 'Access code required');

    var inputs = '';
    for (var i = 0; i < LEN; i++) {
      inputs +=
        '<input class="gate-digit" type="text" inputmode="numeric" pattern="[0-9]*" ' +
        'maxlength="1" autocomplete="off" aria-label="Digit ' + (i + 1) + ' of ' + LEN + '">';
    }

    gate.innerHTML =
      '<div class="gate-card">' +
        '<div class="gate-brand">Dasha Vasuti</div>' +
        '<p class="gate-note">This portfolio is private. Enter the 5-digit access code to continue.</p>' +
        '<div class="gate-fields">' + inputs + '</div>' +
        '<div class="gate-msg" role="alert">Wrong code — please try again</div>' +
      '</div>' +
      '<div class="gate-socials" aria-label="Social links">' +
        '<a class="gate-social" href="https://www.instagram.com/dariya_kudlai" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
          '<img src="' + base() + 'assets/social/instagram.png" alt=""></a>' +
        '<a class="gate-social" href="https://www.linkedin.com/in/dariya-kudlay/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' +
          '<img src="' + base() + 'assets/social/linkedin.png" alt=""></a>' +
        '<a class="gate-social" href="https://t.me/dariya_kudlai" target="_blank" rel="noopener noreferrer" aria-label="Telegram">' +
          '<img src="' + base() + 'assets/social/telegram.png" alt=""></a>' +
      '</div>';

    document.body.appendChild(gate);
    applyTheme(gate);

    var digits = [].slice.call(gate.querySelectorAll('.gate-digit'));
    var card = gate.querySelector('.gate-card');

    requestAnimationFrame(function () {
      gate.classList.add('is-in');
      setTimeout(function () { digits[0].focus(); }, 420);
    });

    function clearError() { gate.classList.remove('error'); }

    function value() {
      return digits.map(function (d) { return d.value; }).join('');
    }

    function reset() {
      digits.forEach(function (d) { d.value = ''; d.classList.remove('filled'); });
      digits[0].focus();
    }

    function fail() {
      gate.classList.add('error');
      card.classList.add('shake');
      setTimeout(function () { card.classList.remove('shake'); }, 480);
      setTimeout(reset, 260);
    }

    function unlock() {
      try { localStorage.setItem(STORE_KEY, GATE_HASH); } catch (e) {}
      gate.classList.add('is-out');
      root.classList.remove('gate-locked');
      var hidden = document.getElementById('gate-hide');
      if (hidden) hidden.remove();
      setTimeout(function () { gate.remove(); }, 520);
    }

    function submit() {
      var code = value();
      if (code.length !== LEN) return;
      sha256('dv:' + code).then(function (hash) {
        if (hash === GATE_HASH) unlock();
        else fail();
      });
    }

    digits.forEach(function (input, idx) {
      input.addEventListener('input', function () {
        clearError();
        var v = input.value.replace(/\D/g, '');
        input.value = v.slice(-1);
        input.classList.toggle('filled', !!input.value);
        if (input.value && idx < LEN - 1) digits[idx + 1].focus();
        if (value().length === LEN) submit();
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          e.preventDefault();
          digits[idx - 1].value = '';
          digits[idx - 1].classList.remove('filled');
          digits[idx - 1].focus();
          clearError();
        }
        if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); digits[idx - 1].focus(); }
        if (e.key === 'ArrowRight' && idx < LEN - 1) { e.preventDefault(); digits[idx + 1].focus(); }
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
      });

      input.addEventListener('focus', function () { input.select(); });

      input.addEventListener('paste', function (e) {
        e.preventDefault();
        clearError();
        var text = (e.clipboardData || window.clipboardData).getData('text') || '';
        var nums = text.replace(/\D/g, '').slice(0, LEN).split('');
        nums.forEach(function (n, i) {
          if (digits[i]) { digits[i].value = n; digits[i].classList.add('filled'); }
        });
        var next = Math.min(nums.length, LEN - 1);
        digits[next].focus();
        if (value().length === LEN) submit();
      });
    });

    /* Keep focus inside the gate */
    gate.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = [].slice.call(gate.querySelectorAll('.gate-digit, .gate-social'));
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    gate.addEventListener('mousedown', function (e) {
      if (e.target === gate || e.target === card) {
        e.preventDefault();
        digits[Math.min(value().length, LEN - 1)].focus();
      }
    });
  }

  /* Resolve asset paths whether the page sits at root or in a subfolder */
  function base() {
    var parts = location.pathname.split('/');
    parts.pop();
    var depth = parts.filter(Boolean).length;
    return depth > 0 ? new Array(depth + 1).join('../') : '';
  }

  function applyTheme(gate) {
    var theme = root.getAttribute('data-theme');
    try {
      theme = localStorage.getItem('theme') || theme;
    } catch (e) {}
    if (!theme) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
    }
    gate.setAttribute('data-gate-theme', theme === 'dark' ? 'dark' : 'light');
  }

  function sha256(str) {
    if (window.crypto && window.crypto.subtle && location.protocol !== 'file:') {
      return crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(str))
        .then(function (buf) {
          return [].map
            .call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); })
            .join('');
        });
    }
    return Promise.resolve(sha256Fallback(str));
  }

  /* Minimal SHA-256 for file:// previews where crypto.subtle is unavailable */
  function sha256Fallback(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mx = Math.pow, mf = Math.floor, h = [], k = [], primes = 2, i = 0, j, res = '';
    var w = [], words = [], asciiBitLength = ascii.length * 8;
    var hash = sha256Fallback.h = sha256Fallback.h || [];
    k = sha256Fallback.k = sha256Fallback.k || [];
    var maxWord = mx(2, 32);

    for (; i < 64; primes++) {
      var isComposite = false;
      for (var f = 2; f * f <= primes; f++) if (primes % f === 0) { isComposite = true; break; }
      if (!isComposite) {
        if (i < 8) hash[i] = (mx(primes, 0.5) * maxWord) | 0;
        k[i] = (mx(primes, 1 / 3) * maxWord) | 0;
        i++;
      }
    }

    h = hash.slice(0);
    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (j = 0; j < words.length; ) {
      var wChunk = words.slice(j, (j += 16));
      var oldHash = h.slice(0);
      for (i = 0; i < 64; i++) {
        var w15 = wChunk[i - 15], w2 = wChunk[i - 2];
        var a = h[0], e = h[4];
        var temp1 =
          h[7] +
          (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) +
          ((e & h[5]) ^ (~e & h[6])) +
          k[i] +
          (wChunk[i] =
            i < 16
              ? wChunk[i]
              : (wChunk[i - 16] +
                  (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) +
                  wChunk[i - 7] +
                  (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var temp2 =
          (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) +
          ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
        h = [(temp1 + temp2) | 0].concat(h);
        h[4] = (h[4] + temp1) | 0;
        h.pop();
      }
      for (i = 0; i < 8; i++) h[i] = (h[i] + oldHash[i]) | 0;
    }

    for (i = 0; i < 8; i++)
      for (j = 3; j + 1; j--) {
        var b = (h[i] >> (j * 8)) & 255;
        res += (b < 16 ? '0' : '') + b.toString(16);
      }
    return res;
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
