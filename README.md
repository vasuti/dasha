# Dasha Vasuti portfolio

Static HTML build ready for GitHub Pages / production hosting.

Entry point: `index.html`. Case pages: `bulk-payment-registries.html`, `ai-workflows.html`.

Shared sidebar: `assets/sidebar.css` + `assets/sidebar.js`, included on every page.

Case preview images: `assets/cases/`. Screens for the payment registries case:
`assets/cases/payment-registries/`.

No build step — paths are relative, so `assets/` must keep its structure.
To preview locally, open `index.html` in a browser or run a local static server.


## Access gate

The site is protected by a 5-digit access code. Current code: **77577**

`assets/gate.js` runs first in `<head>` on every page, hides the content and shows
the code screen. After a correct code it stores a flag in `localStorage`
(`siteAccess`) and does not ask again on that browser.

To change the code, replace `GATE_HASH` in `assets/gate.js` with the SHA-256 of
`"dv:" + code`, for example in the browser console:

    crypto.subtle.digest('SHA-256', new TextEncoder().encode('dv:12345'))
      .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))

Changing the hash also invalidates every stored unlock, so everyone re-enters the code.

Note: this is a client-side gate. It keeps the site away from casual visitors and
search engines, but anyone who opens the page source can read the markup.
For real protection use hosting-level auth (Netlify/Vercel password protection,
Cloudflare Access or HTTP Basic Auth).
