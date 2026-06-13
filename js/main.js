// Main Application Controller - Lina Maouche Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentLang = localStorage.getItem('portfolio-lang') || 'fr';
  let projectsData = [];
  let skillsData = [];
  let certsData = [];
  
  // Typewriter variables
  let typewriterTimeout = null;
  let currentSubtitleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;

  // DOM Elements
  const navMenu = document.getElementById('nav-menu');
  const hamburger = document.getElementById('hamburger');
  const langToggleBtn = document.getElementById('lang-toggle');
  const langText = document.getElementById('lang-text');
  const backToTopBtn = document.getElementById('back-to-top');
  const navbar = document.getElementById('navbar');
  const typewriterText = document.getElementById('typewriter-text');
  
  // Lightbox DOM Elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Initialize Language Toggle UI
  function updateLangToggleUI(lang) {
    if (lang === 'fr') {
      langText.textContent = 'EN 🇬🇧';
      langToggleBtn.setAttribute('title', 'Switch to English');
    } else {
      langText.textContent = 'FR 🇫🇷';
      langToggleBtn.setAttribute('title', 'Passer en Français');
    }
  }

  // 1. i18n Translation Runner
  function translatePage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    updateLangToggleUI(lang);
    
    // Translate static HTML strings
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (window.portfolioTranslations[lang] && window.portfolioTranslations[lang][key]) {
        // If it's an input or textarea, translate placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', window.portfolioTranslations[lang][key]);
        } else {
          el.innerHTML = window.portfolioTranslations[lang][key];
        }
      }
    });

    // Translate attributes (like downloading buttons)
    const downloadButtons = document.querySelectorAll('[data-i18n-attr]');
    downloadButtons.forEach(el => {
      const attrConfig = el.getAttribute('data-i18n-attr').split(':');
      const attrName = attrConfig[0];
      const key = attrConfig[1];
      if (window.portfolioTranslations[lang] && window.portfolioTranslations[lang][key]) {
        el.setAttribute(attrName, window.portfolioTranslations[lang][key]);
      }
    });

    // Re-render components with translated dynamic data
    renderSkills();
    renderProjects();
    renderCertifications();

    // Restart typewriter for new language
    initTypewriter();
  }

  // Language Click Handler
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'fr' ? 'en' : 'fr';
      translatePage(nextLang);
    });
  }

  // 2. Typewriter Effect
  function initTypewriter() {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
    }
    currentCharIndex = 0;
    currentSubtitleIndex = 0;
    isDeleting = false;
    if (typewriterText) {
      typewriterText.textContent = '';
      runTypewriter();
    }
  }

  function runTypewriter() {
    const subtitles = window.portfolioTranslations[currentLang]['hero.subtitles'];
    if (!subtitles || subtitles.length === 0) return;

    const currentString = subtitles[currentSubtitleIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriterText.textContent = currentString.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      // Writing characters
      typewriterText.textContent = currentString.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    let typingSpeed = isDeleting ? 40 : 100;

    // Handle end of typing / deletion cycles
    if (!isDeleting && currentCharIndex === currentString.length) {
      // Finished typing, pause before delete
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      // Finished deleting, shift to next subtitle
      isDeleting = false;
      currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitles.length;
      typingSpeed = 500; // brief pause before writing next word
    }

    typewriterTimeout = setTimeout(runTypewriter, typingSpeed);
  }

  // 3. Hamburger Menu logic
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Scroll Reveal Intersection Observer
  const scrollElements = document.querySelectorAll('.reveal');
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // Unobserve after revealing to prevent repeated triggering
        elementObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  scrollElements.forEach(el => {
    elementObserver.observe(el);
  });

  // 5. Sticky Navbar & Back-to-Top Toggle
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Navbar visual contraction
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll top button activation
    if (scrollPos > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }

    // Active Section Link Highlighting
    highlightActiveNavSection();
  });

  function highlightActiveNavSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120; // offset for navbar height
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (activeLink && scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    });
  }

  // 6. Skills Renderer
  function renderSkills() {
    const container = document.getElementById('skills-render-container');
    if (!container || skillsData.length === 0) return;

    container.innerHTML = '';

    skillsData.forEach((categoryData, catIdx) => {
      const categoryCard = document.createElement('div');
      categoryCard.className = 'skills-category reveal';
      categoryCard.className += ` delay-${(catIdx + 1) * 100}`;
      
      // Select appropriate folder icon depending on category
      let iconClass = 'fa-code';
      if (categoryData.category === 'frontend') iconClass = 'fa-laptop-code';
      else if (categoryData.category === 'databases') iconClass = 'fa-database';
      else if (categoryData.category === 'devops') iconClass = 'fa-toolbox';
      else if (categoryData.category === 'security') iconClass = 'fa-shield-halved';

      const titleText = categoryData.title[currentLang] || categoryData.title.fr;

      let html = `
        <div class="skills-category-title">
          <i class="fa-solid ${iconClass}"></i>
          <span>${titleText}</span>
        </div>
        <div class="skills-list ${categoryData.colorClass || ''}">
      `;

      categoryData.skills.forEach(skill => {
        const skillDesc = skill.desc[currentLang] || skill.desc.fr;
        html += `
          <div class="skill-badge" data-tooltip="${skillDesc}">
            ${skill.name}
          </div>
        `;
      });

      html += `</div>`;
      categoryCard.innerHTML = html;
      container.appendChild(categoryCard);
      
      // Observe newly added elements for scrolling reveal
      elementObserver.observe(categoryCard);
    });
  }

  // 7. Projects Filter and Renderer
  let activeFilter = 'All';

  function renderProjects() {
    const container = document.getElementById('projects-render-container');
    if (!container || projectsData.length === 0) return;

    container.innerHTML = '';

    // Filter projects based on active filter button
    const filtered = projectsData.filter(project => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Full-Stack') return project.category === 'Full-Stack';
      if (activeFilter === 'Security') return project.category === 'Security';
      if (activeFilter === 'Automation') return project.category === 'Automation';
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No projects found.</p>`;
      return;
    }

    filtered.forEach((project, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.className += ` delay-${(idx % 2 + 1) * 100}`;

      const descText = project.desc[currentLang] || project.desc.fr;
      const subtitleText = project.subtitle ? (project.subtitle[currentLang] || project.subtitle.fr) : '';
      const dateText = typeof project.date === 'object' ? (project.date[currentLang] || project.date.fr) : project.date;
      const btnText = window.portfolioTranslations[currentLang]['projects.btn.github'];

      let tagsHtml = '';
      project.tags.forEach(tag => {
        tagsHtml += `<span class="project-tag">${tag}</span>`;
      });

      let subtitleHtml = subtitleText ? `<div class="project-subtitle">${subtitleText}</div>` : '';

      // Collaboration HTML logic
      let collaborationHtml = '';
      if (project.collaboration) {
        let collabText = '';
        if (project.collaborators) {
          const label = window.portfolioTranslations[currentLang]['projects.collab.team'];
          collabText = `${label} ${project.collaborators}`;
        } else if (project.collaborator) {
          const label = window.portfolioTranslations[currentLang]['projects.collab.with'];
          collabText = `${label} ${project.collaborator}`;
        }
        
        let roleText = '';
        if (project.myRole) {
          const roleLabel = window.portfolioTranslations[currentLang]['projects.role.label'];
          const roleValue = project.myRole[currentLang] || project.myRole.fr;
          roleText = `<div class="project-role"><span class="role-label">${roleLabel}</span> ${roleValue}</div>`;
        }
        
        collaborationHtml = `
          <div class="project-collab-wrapper">
            <div class="project-collab-badge">
              <span>👥</span>
              <span>${collabText}</span>
            </div>
            ${roleText}
          </div>
        `;
      }

      // GitHub vs Private Repo HTML logic
      let actionHtml = '';
      if (project.github) {
        actionHtml = `
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
            <span>${btnText}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        `;
      } else if (project.privateRepo) {
        const privateText = window.portfolioTranslations[currentLang]['projects.repo.private'];
        actionHtml = `
          <div class="project-private-badge">
            <i class="fa-solid fa-lock"></i>
            <span>${privateText}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${project.image}" alt="${project.title}" class="project-card-img" loading="lazy">
          <div class="project-img-overlay"></div>
        </div>
        <div class="project-card-content">
          <div>
            <div class="project-card-header">
              <span class="project-category">${project.category}</span>
              <span class="project-date code-label">${dateText}</span>
            </div>
            <h3 class="project-title">${project.title}</h3>
            ${subtitleHtml}
            <p class="project-desc">${descText}</p>
            ${collaborationHtml}
          </div>
          <div class="project-card-footer">
            <div class="project-tags">
              ${tagsHtml}
            </div>
            ${actionHtml}
          </div>
        </div>
      `;

      container.appendChild(card);
      
      // Observe new project card
      elementObserver.observe(card);
    });
  }

  // Setup project filter tabs click listeners
  function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderProjects();
      });
    });
  }

  // 8. Certifications Renderer
  function renderCertifications() {
    const container = document.getElementById('certs-render-container');
    if (!container || certsData.length === 0) return;

    container.innerHTML = '';

    certsData.forEach((cert, idx) => {
      const card = document.createElement('div');
      card.className = 'cert-card reveal';
      card.className += ` delay-${(idx % 4 + 1) * 100}`;

      const certName = cert.name[currentLang] || cert.name.fr;
      const btnText = window.portfolioTranslations[currentLang]['certs.btn.view'];

      card.innerHTML = `
        <div class="cert-img-wrapper">
          <img src="${cert.photo}" alt="${certName}" class="cert-img" loading="lazy">
        </div>
        <div class="cert-content">
          <div class="cert-info">
            <h3 class="cert-name">${certName}</h3>
            <span class="cert-issuer">${cert.issuer}</span>
          </div>
          <button class="btn-cert btn-view-cert" data-img="${cert.photo}" data-title="${certName}">
            <i class="fa-regular fa-image"></i>
            <span>${btnText}</span>
          </button>
        </div>
      `;

      container.appendChild(card);
      elementObserver.observe(card);
    });

    // Add click listeners to View Certificate buttons
    const viewButtons = container.querySelectorAll('.btn-view-cert');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const imgPath = btn.getAttribute('data-img');
        const imgTitle = btn.getAttribute('data-title');
        openLightbox(imgPath, imgTitle);
      });
    });
  }

  // Lightbox Modal functions
  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock body scroll

    // Accessiblity close button translation
    if (lightboxClose) {
      lightboxClose.setAttribute('title', window.portfolioTranslations[currentLang]['lightbox.close']);
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    // Close on click outside of the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close on ESC keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // 9. Load JSON Data asynchronously
  async function loadData() {
    try {
      const [projectsRes, skillsRes, certsRes] = await Promise.all([
        fetch('data/projects.json').then(r => r.json()),
        fetch('data/skills.json').then(r => r.json()),
        fetch('data/certifications.json').then(r => r.json())
      ]);

      projectsData = projectsRes;
      skillsData = skillsRes;
      certsData = certsRes;

      // Translate page immediately (this triggers renders as well)
      translatePage(currentLang);
      setupProjectFilters();
    } catch (err) {
      console.error("Failed to load portfolio database assets:", err);
    }
  }

  // Load database assets on startup
  loadData();
});
