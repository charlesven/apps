# apps — pages de présentation des apps (GitHub Pages)

Un seul dépôt public, servi par GitHub Pages à `https://charlesven.github.io/apps/`, pour les pages d'atterrissage
des publicités (Meta, etc.). Pourquoi : Meta refuse un lien `apps.apple.com` dans une campagne Trafic, et une
campagne « Installations d'apps » sur iOS 14.5+ exige le SDK Meta dans l'app. La pub pointe donc ici, et la page
renvoie vers l'App Store avec le lien de campagne suivi.

## Convention

```
<slug-app>/index.html        page unique, pensée iPhone (bouton visible sans défiler), sans dépendance externe
<slug-app>/icon.png          icône 256 px
<slug-app>/<video>.mp4/.jpg  vidéo validée allégée (720 px, sans son, faststart) + image d'attente
<slug-app>/badge-app-store.svg  badge officiel (Video/regles/marques/)
```

- Lien App Store : `https://apps.apple.com/app/apple-store/id<ID>?pt=625184&ct=<source>&mt=8` ; `ct` par défaut
  `fb-pub`, remplacé par le paramètre `?ct=` de l'adresse de la page (ex. `…/puzzle/?ct=reels`).
- Règles de texte : celles des vidéos (`Video/regles/REGLES-GLOBALES.md`) — **aucune mention d'IA** (G63 ; exception `carburant` : l'IA spécialisée de l'app se nomme, jamais « généré par IA »), aucun
  prix, même registre que l'app ; **aucune mention de gratuit, payant, prix ou offre** (règle de Charles du 03/10/2026).
- Pied de page : liens CGU + confidentialité de l'app, mention « Apple et le logo Apple sont des marques d'Apple Inc. »
- Mise en ligne : `git add -A && git commit -m "puzzle: page" && git push` ; vérifier `curl -I` → 200.

## Apps

| Slug | App | Adresse |
|---|---|---|
| `puzzle` | Puzzle Contest | https://charlesven.github.io/apps/puzzle/ |
| `predisport` | Pêche en Mer - Predisport | https://charlesven.github.io/apps/predisport/ |
| `envie` | Envies : réveille ton couple | https://charlesven.github.io/apps/envie/ |
| `ceramist` | Ceramist : poterie, tournage | https://charlesven.github.io/apps/ceramist/ |
| `carburant` | Je fais le plein ? Analyse IA | https://charlesven.github.io/apps/carburant/ (visuel provisoire : capture App Store, à remplacer par une vidéo validée) |
| `antidepense` | Anti-Dépense | https://charlesven.github.io/apps/antidepense/ (visuel provisoire : capture App Store, à remplacer par une vidéo validée) |

## Mesure des publicités (`suivi.js`)

Chaque page charge `../suivi.js` : un bandeau demande l'accord du visiteur ; seulement après « Accepter », le pixel Meta (jeu de données « Pages d'atterrissage des apps », 1071613332406077) envoie PageView et Lead au clic App Store. Refus ou pas de réponse : rien n'est chargé. Une nouvelle page doit inclure `<script src="../suivi.js" defer></script>` avant `</body>`.

Le même script mesure aussi l'audience **sans cookie ni consentement** (P-018) : à chaque chargement, un identifiant de
visite tiré au hasard (jamais conservé : ni cookie, ni localStorage), un `landing_view` à l'ouverture et un `store_click`
au clic sur `a.store`, envoyés à la fonction `analytics-ingest` de l'app (canal web, table `landing_events` du projet
Supabase de l'app, conservation 13 mois ; contrat PlatformKit `docs/CONTRACT-analytics.md`, « Canal web »). Rien ne
part si le navigateur demande « Ne pas me pister ». Une nouvelle page doit être ajoutée à la table `PAGES` de
`suivi.js` (slug → fonction, app, clé d'app publique de `~/.supabase/platformkit-secrets.json`), sinon elle n'est pas
mesurée. Lecture des chiffres : RPC `analytics_landing(app, début, fin exclue)` (jour × `ct`).
