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
