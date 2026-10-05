/* Mesure des publicités Meta sur les pages d'atterrissage (P-001, accord de Charles du 01/10/2026).
 *
 * Le pixel Meta dépose des cookies publicitaires : il ne se charge qu'après un « Accepter » explicite du visiteur
 * (règles CNIL). Sans réponse ou après « Refuser », rien n'est chargé et la page fonctionne à l'identique.
 * Événements envoyés : PageView à l'ouverture, Lead au clic sur le bouton App Store (app, lien ct).
 * Jeu de données « Pages d'atterrissage des apps », compte publicitaire 13251932.
 */
(function () {
  var PIXEL = "1071613332406077";
  var CLE = "suivi-meta";
  var app = (location.pathname.split("/").filter(Boolean).slice(-1)[0] || "").replace(/\.html$/, "");
  var ct = "";
  try { ct = new URLSearchParams(location.search).get("ct") || ""; } catch (e) {}

  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) {} }

  function charger() {
    /* Code de base du pixel Meta, tel que Meta le fournit. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", PIXEL);
    fbq("track", "PageView");
    document.querySelectorAll("a.store").forEach(function (a) {
      a.addEventListener("click", function () {
        try { fbq("track", "Lead", { content_name: app, content_category: "App Store", ct: ct || "aucun" }); } catch (e) {}
      });
    });
  }

  function bandeau() {
    var b = document.createElement("div");
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Mesure des publicités");
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:50;max-width:520px;margin:0 auto;" +
      "background:#fff;color:#1d1d1f;border:1px solid rgba(0,0,0,.12);border-radius:14px;padding:12px 14px;" +
      "box-shadow:0 6px 24px rgba(0,0,0,.12);font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      "display:flex;flex-wrap:wrap;align-items:center;gap:10px";
    var t = document.createElement("span");
    t.style.cssText = "flex:1 1 240px";
    t.textContent = "Nous mesurons l'efficacité de nos publicités avec le pixel de Meta, qui dépose des cookies. D'accord ?";
    function bouton(texte, plein, v) {
      var x = document.createElement("button");
      x.type = "button"; x.textContent = texte;
      x.style.cssText = "font:inherit;font-weight:600;border-radius:10px;padding:8px 14px;cursor:pointer;" +
        (plein ? "background:#1d1d1f;color:#fff;border:1px solid #1d1d1f" : "background:#fff;color:#1d1d1f;border:1px solid rgba(0,0,0,.25)");
      x.addEventListener("click", function () { ecrire(v); b.remove(); if (v === "oui") charger(); });
      return x;
    }
    b.append(t, bouton("Refuser", false, "non"), bouton("Accepter", true, "oui"));
    document.body.appendChild(b);
  }

  function demarrer() {
    var choix = lire();
    if (choix === "oui") charger();
    else if (choix !== "non") bandeau();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

/* Mesure d'audience des pages, sans cookie (P-018, accord de Charles du 01/10/2026).
 *
 * Indépendante du bandeau : aucun cookie, aucun localStorage ni sessionStorage, aucun identifiant persistant.
 * Un visit_id tiré au hasard à chaque chargement (jamais conservé) relie l'affichage et le clic d'une même visite.
 * Envoie « landing_view » à l'ouverture et « store_click » au clic sur le bouton App Store, avec la page, le lien
 * ct, l'appareil (iPhone / iPad / autre), la langue et le domaine d'origine (ex. l.instagram.com), vers la fonction
 * analytics-ingest de l'app (canal web, table landing_events, jamais mêlée aux statistiques de l'app ;
 * PlatformKit docs/CONTRACT-analytics.md, « Canal web »). Rien n'est envoyé si le navigateur demande
 * « Ne pas me pister ». Un échec d'envoi est silencieux.
 * Les clés d'app sont publiques par conception (comme dans l'app) : elles écartent seulement le bruit.
 */
(function () {
  var CENTRAL = "https://wmobudvkpofvtfmzehoi.supabase.co/functions/v1/analytics-ingest";
  var PAGES = {
    predisport: { url: CENTRAL, app: "predisport", cle: "21df2c20-6c75-41a7-907b-5d29c8187097" },
    antidepense: { url: CENTRAL, app: "antidepense", cle: "0adf7ad3-cdcc-401f-ae84-52fda14f0cc9" },
    carburant: { url: CENTRAL, app: "carburant", cle: "4c1f0b2e-7d3a-4a9e-9f61-2b8c5d0e7a13" },
    puzzle: { url: "https://hukhymphvuyduftogcpz.supabase.co/functions/v1/analytics-ingest", app: "puzzle", cle: "6c0902e0-729d-4470-b794-7272b1280126" },
    ceramist: { url: "https://mannxvoyxbfbnuyitmou.supabase.co/functions/v1/analytics-ingest", app: "ceramist", cle: "33baa170-a139-4f45-b84e-3774edbafd5c" },
    envie: { url: "https://rxsqbdsdifepwigrqldz.supabase.co/functions/v1/analytics-ingest", app: "envie", cle: "42203294-b7ed-43a0-8a71-57e1197df5a0" }
  };

  try {
    if (navigator.doNotTrack === "1" || typeof fetch !== "function") return;
    var morceaux = location.pathname.split("/").filter(function (m) { return m && m !== "index.html"; });
    var page = (morceaux.slice(-1)[0] || "").replace(/\.html$/, "");
    // Pages par langue : /apps/<app>/<langue>/ (ex. predisport/es/) comptent pour l'app (05/10/2026)
    if (!PAGES.hasOwnProperty(page) && /^[a-z]{2}$/.test(page) && morceaux.length > 1) page = morceaux[morceaux.length - 2];
    var cible = PAGES.hasOwnProperty(page) ? PAGES[page] : null;
    if (!cible) return;

    var visite = uuid();
    if (!visite) return;
    var ct = "aucun";
    try {
      var brut = new URLSearchParams(location.search).get("ct");
      if (brut && /^[\w-]{1,40}$/.test(brut)) ct = brut;
    } catch (e) {}
    var origine = null;
    try {
      var h = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
      if (h && h !== location.hostname) origine = h.slice(0, 100);
    } catch (e) {}
    var ua = navigator.userAgent || "";
    var appareil = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "ipad"
      : /iPhone|iPod/.test(ua) ? "iphone" : "other";
    var langue = (navigator.language || "").slice(0, 16);

    var envoyer = function (evenement) {
      var id = uuid();
      if (!id) return;
      var props = { page: page, ct: ct };
      if (origine) props.referrer_host = origine;
      var corps = {
        app: cible.app,
        sent_at: new Date().toISOString(),
        device: { install_id: visite, channel: "web", platform: appareil, language: langue },
        events: [{ id: id, occurred_at: new Date().toISOString(), session_id: visite, event: evenement, props: props }]
      };
      try {
        fetch(cible.url, {
          method: "POST",
          keepalive: true,
          credentials: "omit",
          headers: { "content-type": "application/json", "x-app-key": cible.cle },
          body: JSON.stringify(corps)
        }).catch(function () {});
      } catch (e) {}
    };

    var demarrer = function () {
      envoyer("landing_view");
      document.querySelectorAll("a.store").forEach(function (a) {
        a.addEventListener("click", function () { envoyer("store_click"); });
      });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
    else demarrer();
  } catch (e) {}

  function uuid() {
    try {
      if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
      var o = crypto.getRandomValues(new Uint8Array(16));
      o[6] = (o[6] & 15) | 64; o[8] = (o[8] & 63) | 128;
      var x = Array.prototype.map.call(o, function (b) { return (b + 256).toString(16).slice(1); }).join("");
      return x.slice(0, 8) + "-" + x.slice(8, 12) + "-" + x.slice(12, 16) + "-" + x.slice(16, 20) + "-" + x.slice(20);
    } catch (e) { return null; }
  }
})();
