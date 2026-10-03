const t = {
  fr: {
    nav: ["À propos", "Projets", "Certifs", "Compétences", "Contact"],
    roles: [
      "Étudiante Ingénieure en Génie Logiciel",
      "Se forme aux agents IA",
      "Passionnée par la sécurité de l'IA agentique"
    ],
    desc: "Je construis des logiciels solides, avec un œil sur l'IA de demain : utile, fiable, sécurisée.",
    pageTitle: "LM | Lina Maouche – Développeuse Full-Stack",
    metaDescription: "Portfolio de Lina Maouche, développeuse full-stack : projets web, logiciels, automatisation et intelligence artificielle.",
    cta: "Explorer mon univers",
    cv: "Mon CV",
    quote: "« Concevoir des systèmes intelligents, c'est bien. Les rendre dignes de confiance, c'est mon ambition. »",
    keywords: [
      "Curieuse", "Dévouée", "Esprit d'équipe", "Apprentissage continu",
      "Rigoureuse", "Adaptable", "Autonome", "Force de proposition"
    ],
    aboutLabel: "Éducation & parcours",
    philoTitle: "Qualités",
    expLabel: "Expérience professionnelle",
    expJob: "Stagiaire DSI",
    expCompany: "Cevital, Béjaïa",
    expYears: "20/09/2026 - 10/10/2026",
    expSkillsKey: "Infrastructure réseau · Cybersécurité (SIEM, pfSense) · SAP S/4HANA · Sage X3 · Power BI · Data Warehouse · n8n · Docker",
    projLabel: "Portfolio de réalisations",
    projTitle: "Projets sélectionnés",
    filterAll: "Tous",
    explore: "Explorer le projet",
    code: "Code",
    demo: "Démo",
    certLabel: "Certifications",
    certTitle: "Apprentissage continu",
    certFilterAll: "Tous",
    certFilterAlgorithms: "Algorithmique",
    certFilterDevelopment: "Développement",
    certFilterLanguages: "Langues",
    certFilterAiAgents: "IA / Agents",
    certFilterLabel: "Filtrer les certifications",
    certPagesLabel: "Pages des certifications",
    certPrevious: "Certifications précédentes",
    certNext: "Certifications suivantes",
    certVerify: "Vérifier le certificat",
    certTraining: "Source de la formation",
    certIdLabel: "ID du certificat",
    seeCert: "Voir le certificat",
    skillsLabel: "Expertise technique",
    skillsTitle: "Compétences techniques",
    langLabel: "Langues & centres d'intérêt",
    langTitle: "Au-delà du code",
    langsSub: "Langues",
    intSub: "Centres d'intérêt",
    together: "Ouverte aux opportunités professionnelles.",
    rights: "Tous droits réservés."
  },
  en: {
    nav: ["About", "Projects", "Certs", "Skills", "Contact"],
    roles: [
      "Software Engineering student",
      "Learning to build AI agents",
      "Passionate about agentic AI security"
    ],
    desc: "I build solid software with an eye on tomorrow's AI: useful, reliable, secure.",
    pageTitle: "LM | Lina Maouche – Full-Stack Developer",
    metaDescription: "Lina Maouche's full-stack developer portfolio: web projects, software, automation and artificial intelligence.",
    cta: "Explore my world",
    cv: "My resume",
    quote: "“Building intelligent systems is good. Making them trustworthy is my ambition.”",
    keywords: [
      "Curious", "Dedicated", "Team player", "Lifelong learner",
      "Rigorous", "Adaptable", "Autonomous", "Proactive"
    ],
    aboutLabel: "Education & journey",
    philoTitle: "Qualities",
    expLabel: "Professional experience",
    expJob: "IT Department Intern",
    expCompany: "Cevital, Bejaïa",
    expYears: "20/09/2026 - 10/10/2026",
    expSkillsKey: "Network Infrastructure · Cybersecurity (SIEM, pfSense) · SAP S/4HANA · Sage X3 · Power BI · Data Warehouse · n8n · Docker",
    projLabel: "Selected portfolio",
    projTitle: "Featured projects",
    filterAll: "All",
    explore: "Explore project",
    code: "Code",
    demo: "Demo",
    certLabel: "Certifications",
    certTitle: "Continuous learning",
    certFilterAll: "All",
    certFilterAlgorithms: "Algorithms",
    certFilterDevelopment: "Development",
    certFilterLanguages: "Languages",
    certFilterAiAgents: "AI / Agents",
    certFilterLabel: "Filter certifications",
    certPagesLabel: "Certification pages",
    certPrevious: "Previous certifications",
    certNext: "Next certifications",
    certVerify: "Verify certificate",
    certTraining: "Training source",
    certIdLabel: "Certificate ID",
    seeCert: "View certificate",
    skillsLabel: "Technical expertise",
    skillsTitle: "Technical skills",
    langLabel: "Languages & interests",
    langTitle: "Beyond code",
    langsSub: "Languages",
    intSub: "Interests",
    together: "Open to professional opportunities.",
    rights: "All rights reserved."
  }
};

const educationData = [
  {
    years: "2023 — Présent",
    yearsEn: "2023 — Present",
    fr: ["Cycle Ingénieur d'État en Informatique, Spécialité Génie Logiciel", "Univ. Abderrahmane Mira, Bejaïa"],
    en: ["State Engineering Degree in Computer Science, Software Engineering", "Abderrahmane Mira University, Bejaïa"]
  },
  {
    years: "2022 — 2023",
    yearsEn: "2022 — 2023",
    fr: ["Bac Mathématiques", "Mention Très Bien"],
    en: ["Baccalaureate in Mathematics", "Highest honors"]
  },
  {
    years: "Primaire · Collège · Lycée",
    yearsEn: "Primary · Middle · High school",
    fr: ["Scolarité", "École Privée Les Iris"],
    en: ["Schooling", "Les Iris Private School"]
  }
];

const languagesData = [
  { name: { fr: "Kabyle", en: "Kabyle" }, level: { fr: "Maternelle", en: "Native" } },
  { name: { fr: "Darija", en: "Darija" }, level: { fr: "Maternelle", en: "Native" } },
  { name: { fr: "Français", en: "French" }, level: { fr: "Courant", en: "Fluent" } },
  { name: { fr: "Arabe", en: "Arabic" }, level: { fr: "Courant", en: "Fluent" } },
  { name: { fr: "Anglais", en: "English" }, level: { fr: "C2 · Avancé", en: "C2 · Advanced" } },
  { name: { fr: "Espagnol", en: "Spanish" }, level: { fr: "Débutant · en apprentissage", en: "Beginner · learning" } }
];

const interestsData = [
  { icon: "book-open", fr: "Lecture", en: "Reading" },
  { icon: "pen-line", fr: "Journaling", en: "Journaling" },
  { icon: "plane", fr: "Voyages", en: "Travel" },
  { icon: "film", fr: "Cinématographie", en: "Cinematography" },
  { icon: "utensils", fr: "Cuisine", en: "Cooking" },
  { icon: "shirt", fr: "Mode", en: "Fashion" }
];
