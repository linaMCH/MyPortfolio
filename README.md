# MyPortfolio

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black) ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-%23121011.svg?style=flat&logo=github) ![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat) ![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat)

[Voir la démo en ligne](https://linamch.github.io/MyPortfolio/)

## Aperçu

MyPortfolio est un site de présentation personnelle construit pour les recruteurs et les clients freelance. Le site expose les projets, les compétences techniques et le parcours académique de Lina Maouche. Le contenu est rendu côté client avec HTML, CSS et JavaScript, et il est conçu pour être déployé sur GitHub Pages.

## Fonctionnalités

- Navigation ancrée avec menu mobile responsive
- Thème sombre / clair et contenu bilingue français / anglais
- Sections dynamiques de compétences, projets et certifications chargées depuis des fichiers JSON
- Filtrage de projets et affichage de cartes projet
- Lightbox pour les certificats et lien de téléchargement du CV

## Stack technique

| Technologie | Usage |
| --- | --- |
| HTML5 | Structure sémantique et contenu du portfolio |
| CSS3 | Mise en page responsive, animations et thèmes |
| JavaScript | Rendu dynamique, traduction i18n et comportements UI |
| GitHub Pages | Hébergement statique du site |

## Projets mis en avant

- **Compilateur C → Java** — parseur et analyseur syntaxique/sémantique en Java. https://github.com/linaMCH/Compilateur-C
- **StegaCrypt** — application de cryptographie et stéganographie en Python. https://github.com/ImeneeSh/StegaCrypt
- **PharmaGO** — application JavaFX pour la gestion de livraisons pharmaceutiques. https://github.com/ImeneeSh/PharmaGo
- **Assirem Natation** — plateforme club en Vue.js 3 + Spring Boot. Site en production : https://www.assirem-natation.com/

## Exécution locale (recommandé)

Ce site charge des fichiers JSON via `fetch()` (dans `js/main.js`) et doit être servi via HTTP. Ouvrir
`index.html` directement avec le protocole `file://` provoquera des erreurs de chargement (CORS/origine).

Clonez le dépôt puis lancez un serveur HTTP local :

```bash
git clone https://github.com/linaMCH/MyPortfolio.git
cd MyPortfolio

# Option 1 — Python 3 (intégré)
python -m http.server 8000

# Option 2 — script fourni (no-cache)
python serve.py

# Option 3 — Node.js (si installé)
npx http-server -p 8000

# Ensuite, ouvrez http://localhost:8000 dans votre navigateur
```

Le dépôt contient également une démo publique : [Voir la démo en ligne](https://linamch.github.io/MyPortfolio/).

Notes :
- `serve.py` démarre un serveur HTTP sur le port `8000` et ajoute des en-têtes `no-cache` utiles pour
	le développement (voir la description plus bas).
- Pour la production, GitHub Pages ou tout hébergeur HTTP statique convient.

## Optimisation des assets

- Le fichier `logoLM.png` est actuellement committé à la racine du dépôt. Pour une meilleure organisation,
  il est recommandé de le placer dans `assets/img/` et d'optimiser sa taille (WebP/AVIF ou compression PNG).
- Exemples de commandes pour convertir / compresser (localement) :

```bash
# installer cwebp (Google) ou utiliser un outil GUI en local
cwebp -q 80 logoLM.png -o assets/img/logoLM.webp
# ou avec ImageMagick pour réduire la résolution et qualité
magick convert logoLM.png -resize 300x300 -quality 85 assets/img/logoLM.png
```

Après optimisation, mettez à jour les références d'image dans `index.html` si nécessaire.

## Contact

- LinkedIn : https://linkedin.com/in/lina-maouche-774510334
- GitHub : https://github.com/linaMCH
- Email : linamaouchedev@gmail.com

## Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](./LICENSE) pour plus de détails.
