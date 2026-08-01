# MyPortfolio

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black) ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-%23121011.svg?style=flat&logo=github) ![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)

MyPortfolio est un portfolio personnel statique construit avec HTML, CSS et JavaScript vanilla. Il présente le parcours, les projets, les compétences et les certifications de Lina Maouche, avec une version française et anglaise et un thème sombre/clair.

## Aperçu

Démo en ligne : https://linamch.github.io/MyPortfolio/

## Fonctionnalités

- Navigation responsive avec menu hamburger
- Thème sombre et clair persistant via localStorage
- Site bilingue français/anglais
- Contenu chargé depuis des fichiers JSON pour les projets, compétences et certifications
- Hero avec effet de machine à écrire
- Apparition progressive des sections avec IntersectionObserver
- Filtrage des projets par catégorie
- Lightbox pour afficher les certificats en plein écran

## Stack technique

- HTML5 pour la structure du site
- CSS3 pour la mise en page, le thème et les animations
- JavaScript vanilla pour le rendu dynamique, la traduction et les interactions
- GitHub Pages pour le déploiement statique

## Structure du projet

```text
.
├── index.html
├── serve.py
├── LICENSE
├── assets/
│   ├── certs/
│   ├── cv/
│   └── img/
├── css/
│   ├── animations.css
│   ├── style.css
│   └── themes.css
├── data/
│   ├── certifications.json
│   ├── projects.json
│   └── skills.json
└── js/
    ├── i18n.js
    ├── main.js
    └── theme.js
```

## Installation et lancement local

Le site charge ses données JSON via fetch. Pour éviter les erreurs liées à l'origine des fichiers, il doit être servi via un serveur HTTP local.

Depuis la racine du dépôt, l'une des commandes suivantes peut être utilisée :

```bash
git clone https://github.com/linaMCH/MyPortfolio.git
cd MyPortfolio

python -m http.server 8000
```

ou

```bash
python serve.py
```

ou, si Node.js est installé :

```bash
npx http-server -p 8000
```

Ensuite, ouvrir http://localhost:8000 dans le navigateur.

## Automatisations n8n

Cinq workflows ont été construits dans le cadre d'une formation intensive de 7 jours autour de n8n et de l'architecture d'agents IA :

- Formulaire → Notion : capture de contacts depuis un formulaire et création d'une entrée structurée dans Notion
- IA à sortie structurée : appel à l'API Google Gemini avec une réponse JSON structurée
- Trieur d'e-mails intelligent : analyse de messages Gmail avec Gemini puis branchements vers Slack et brouillon Gmail
- Agent conversationnel : agent IA avec mémoire de conversation et outils personnalisés
- Assistant RAG : agent répondant à partir d'une base de connaissances indexée par embeddings

## Projets présentés

- Compilateur C → Java : compilateur fonctionnel avec analyse syntaxique et sémantique
- StegaCrypt : application de chiffrement et stéganographie
- PharmaGO : application destinée à l'optimisation des flux pharmaceutiques avec une interface ergonomique
- Assirem Natation : plateforme web pour un club de natation

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier LICENSE pour les détails.

## Contact

- LinkedIn : https://linkedin.com/in/lina-maouche-774510334
- GitHub : https://github.com/linaMCH
- Email : linamaouchedev@gmail.com
