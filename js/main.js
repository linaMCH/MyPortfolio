/* ==========================================================================
   PORTFOLIO LINA MAOUCHE — MAIN SCRIPT
   Theme, i18n, Signal Canvas, Custom Cursor with Damped Ring & Instant Dot,
   Scroll Reveal, Interactive Project Filters, Multi-item Lightbox Carousel
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  let currentLang = "fr";
  let isDark = true;
  let menuOpen = false;
  let activeFilter = "all";
  let activeCertFilter = "all";
  let certsCurrentPage = 0;

  // Data stores
  let projectsData = [];
  let certsData = [];
  let skillsData = [];

  // Lightbox Carousel State
  let galleryItems = [];
  let currentGalleryIndex = 0;
  let currentProjectMainTitle = "";
  let currentProjectMainDesc = "";

  // DOM Elements
  const htmlEl = document.documentElement;
  const langToggleBtn = document.getElementById("lang-toggle");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNavPanel = document.getElementById("mobile-nav-panel");

  // Lightbox DOM Elements
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxSubtitle = document.getElementById("lightbox-subtitle");
  const lightboxDesc = document.getElementById("lightbox-desc");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxPrevBtn = document.getElementById("lightbox-prev-btn");
  const lightboxNextBtn = document.getElementById("lightbox-next-btn");

  // Fetch JSON datasets
  try {
    const [projRes, certRes, skillRes] = await Promise.all([
      fetch("data/projects.json"),
      fetch("data/certifications.json"),
      fetch("data/skills.json")
    ]);
    projectsData = await projRes.json();
    certsData = await certRes.json();
    skillsData = await skillRes.json();
  } catch (err) {
    console.error("Error loading portfolio datasets:", err);
  }

  /* ------------------------------------------------------------------------
     1. SIGNAL CANVAS (HERO ANIMATED PARTICLE PATTERN)
     ------------------------------------------------------------------------ */
  function initSignalCanvas() {
    const canvas = document.getElementById("signal-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    const draw = (now) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const tm = (now - startTime) / 1000;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const R = Math.min(cx, cy) * 0.78;

      const style = getComputedStyle(document.documentElement);
      const primaryCol = style.getPropertyValue("--primary").trim() || "oklch(0.67 0.17 255)";
      const accent2Col = style.getPropertyValue("--accent-2").trim() || "oklch(0.76 0.12 205)";
      const lilacCol = style.getPropertyValue("--lilac").trim() || "oklch(0.82 0.09 310)";

      // Waveform ring
      ctx.beginPath();
      for (let i = 0; i <= 180; i++) {
        const a = (i / 180) * Math.PI * 2;
        const w = R * 0.62 + Math.sin(a * 6 + tm * 2) * 4 + Math.sin(a * 11 - tm * 3) * 2.5;
        const x = cx + Math.cos(a) * w;
        const y = cy + Math.sin(a) * w;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = lilacCol;
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Orbits & Particles
      const orbits = [
        [R, 0.6, lilacCol],
        [R * 0.85, -0.9, primaryCol]
      ];

      orbits.forEach(([rad, sp, cc], k) => {
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = cc;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        for (let n = 0; n < 2; n++) {
          const a = tm * sp + n * Math.PI + k;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;

          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = k === 0 ? lilacCol : accent2Col;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.globalAlpha = 1;
          ctx.fillStyle = k === 0 ? lilacCol : cc;
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Core pulse
      const p = (tm % 2) / 2;
      ctx.globalAlpha = 0.5 * (1 - p);
      ctx.strokeStyle = primaryCol;
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + p * R * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.fillStyle = primaryCol;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
  }

  /* ------------------------------------------------------------------------
     2. TYPEWRITER EFFECT FOR ALTERNATING ROLES
     ------------------------------------------------------------------------ */
  let typewriterTimeout = null;
  function initTypewriter() {
    const el = document.getElementById("typewriter-text");
    if (!el) return;

    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    const words = t[currentLang].roles;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex % words.length] || "";
      if (!isDeleting) {
        el.textContent = currentWord.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isDeleting = true;
          typewriterTimeout = setTimeout(type, 1600);
          return;
        }
      } else {
        el.textContent = currentWord.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex++;
        }
      }
      const speed = isDeleting ? 40 : 80;
      typewriterTimeout = setTimeout(type, speed);
    }

    type();
  }

  /* ------------------------------------------------------------------------
     3. CUSTOM CURSOR (DAMPED RING + INSTANT CENTER DOT)
     ------------------------------------------------------------------------ */
  function initCustomCursor() {
    const ringEl = document.getElementById("site-cursor-ring");
    const dotEl = document.getElementById("site-cursor-dot");
    if (!ringEl || !dotEl) return;

    const fineMedia = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let x = 0, y = 0, trailX = 0, trailY = 0, frame = 0, last = 0;
    let positioned = false;

    const animate = (now) => {
      const delta = Math.min(now - (last || now), 50);
      last = now;
      const ease = 1 - Math.pow(0.8, delta / 16.67);
      trailX += (x - trailX) * ease;
      trailY += (y - trailY) * ease;

      ringEl.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(animate);
    };

    const move = (e) => {
      if (!fineMedia.matches || e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;

      // Center dot follows mouse instantaneously with zero lag
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (!positioned) {
        trailX = x;
        trailY = y;
        positioned = true;
      }

      ringEl.classList.add("site-cursor--visible");
      dotEl.classList.add("site-cursor--visible");

      const target = e.target;
      const hovering = target instanceof Element && !!target.closest("a, button, [role='button'], input, select, textarea, label, article, .project-card, .cert-card, .filter-btn");
      ringEl.classList.toggle("site-cursor--hover", hovering);
      dotEl.classList.toggle("site-cursor--hover", hovering);
    };

    const hide = () => {
      ringEl.classList.remove("site-cursor--visible", "site-cursor--hover");
      dotEl.classList.remove("site-cursor--visible", "site-cursor--hover");
      positioned = false;
    };

    const sync = () => {
      htmlEl.classList.toggle("has-custom-cursor", fineMedia.matches);
      if (fineMedia.matches) {
        if (!frame) frame = requestAnimationFrame(animate);
      } else {
        hide();
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
          last = 0;
        }
      }
    };

    sync();
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", () => { if (document.hidden) hide(); });
    fineMedia.addEventListener("change", sync);
  }

  /* ------------------------------------------------------------------------
     4. SCROLL REVEAL OBSERVER
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     5. MULTI-ITEM LIGHTBOX GALLERY MODAL HANDLER
     ------------------------------------------------------------------------ */
  function updateLightboxView() {
    if (!lightboxModal || galleryItems.length === 0) return;
    const current = galleryItems[currentGalleryIndex];
    if (!current) return;

    lightboxImg.src = current.image;
    lightboxTitle.textContent = currentProjectMainTitle;
    lightboxDesc.textContent = currentProjectMainDesc;

    const subTitleText = typeof current.title === "object" ? current.title[currentLang] : current.title;
    if (lightboxSubtitle) {
      lightboxSubtitle.textContent = subTitleText && galleryItems.length > 1 ? subTitleText : "";
      lightboxSubtitle.style.display = subTitleText && galleryItems.length > 1 ? "block" : "none";
    }

    if (lightboxCounter) {
      if (galleryItems.length > 1) {
        lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryItems.length}`;
        lightboxCounter.style.display = "inline-block";
      } else {
        lightboxCounter.style.display = "none";
      }
    }

    if (lightboxPrevBtn) lightboxPrevBtn.style.display = galleryItems.length > 1 ? "grid" : "none";
    if (lightboxNextBtn) lightboxNextBtn.style.display = galleryItems.length > 1 ? "grid" : "none";
  }

  function openGalleryLightbox(items, startIndex, mainTitle, mainDesc) {
    if (!lightboxModal) return;
    galleryItems = Array.isArray(items) && items.length > 0 ? items : [{ image: items, title: "" }];
    currentGalleryIndex = Math.max(0, Math.min(startIndex || 0, galleryItems.length - 1));
    currentProjectMainTitle = mainTitle || "";
    currentProjectMainDesc = mainDesc || "";

    updateLightboxView();
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxView();
    });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      updateLightboxView();
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("lightbox-media-wrapper")) {
        closeLightbox();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (!lightboxModal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && galleryItems.length > 1) {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxView();
    }
    if (e.key === "ArrowRight" && galleryItems.length > 1) {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      updateLightboxView();
    }
  });

  /* ------------------------------------------------------------------------
     6. PROJECT FILTER BAR RENDER & HANDLER
     ------------------------------------------------------------------------ */
  function renderProjectFilters() {
    const filterContainer = document.getElementById("project-filters");
    if (!filterContainer) return;

    const categories = [
      { id: "all", label: t[currentLang].filterAll },
      { id: "IA", label: "IA & Automation" },
      { id: "Web", label: "Web & E-commerce" },
      { id: "Desktop", label: "Desktop" },
      { id: "Sécurité", label: "Sécurité" }
    ];

    filterContainer.innerHTML = categories.map((cat) => `
      <button type="button" class="filter-btn ${activeFilter === cat.id ? 'active' : ''}" data-filter="${cat.id}">
        ${cat.label}
      </button>
    `).join("");

    filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter");
        filterContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyProjectFilters();
      });
    });
  }

  function applyProjectFilters() {
    const cards = document.querySelectorAll("#projects-grid article.project-card");
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category") || "";
      const tag = card.getAttribute("data-tag") || "";

      let show = false;
      if (activeFilter === "all") {
        show = true;
      } else if (activeFilter === "IA" && (cat.includes("IA") || tag.includes("IA") || tag.includes("AI"))) {
        show = true;
      } else if (activeFilter === "Web" && (cat.includes("Web") || tag.includes("Web"))) {
        show = true;
      } else if (activeFilter === "Desktop" && (cat.includes("Desktop") || tag.includes("Desktop"))) {
        show = true;
      } else if (activeFilter === "Sécurité" && (cat.includes("Sécurité") || tag.includes("Sécurité") || tag.includes("Security"))) {
        show = true;
      }

      if (show) {
        card.classList.remove("project-card--hidden");
      } else {
        card.classList.add("project-card--hidden");
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. RENDER FUNCTIONS FOR ALL DYNAMIC CONTENT
     ------------------------------------------------------------------------ */
  function renderAll() {
    const c = t[currentLang];

    // Document & HTML meta
    htmlEl.lang = currentLang;
    document.title = c.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", c.metaDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", c.pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", c.metaDescription);

    // Nav text
    const navItems = document.querySelectorAll("[data-nav-index]");
    navItems.forEach((el) => {
      const idx = parseInt(el.getAttribute("data-nav-index"), 10);
      if (c.nav[idx]) el.textContent = c.nav[idx];
    });

    // Language toggle button text
    const langLabel = document.getElementById("lang-label");
    if (langLabel) langLabel.textContent = currentLang.toUpperCase();

    // Static text labels
    const textIds = {
      "hero-badge-year": "Bejaïa · 2026",
      "hero-desc": c.desc,
      "hero-cta-explore": c.cta,
      "hero-cta-cv": c.cv,
      "quote-text": c.quote,
      "about-label": c.aboutLabel,
      "philo-title": c.philoTitle,
      "exp-label": c.expLabel,
      "proj-label": c.projLabel,
      "proj-title": c.projTitle,
      "cert-label": c.certLabel,
      "cert-title": c.certTitle,
      "skills-label": c.skillsLabel,
      "skills-title": c.skillsTitle,
      "lang-label-section": c.langLabel,
      "lang-title-section": c.langTitle,
      "langs-sub": c.langsSub,
      "int-sub": c.intSub,
      "together-label": c.together,
      "rights-text": `© 2026 Lina Maouche — ${c.rights}`
    };

    for (const [id, val] of Object.entries(textIds)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    // Typewriter refresh
    initTypewriter();

    // Render Education Timeline (Clean without numbers 1,2,3)
    const eduList = document.getElementById("education-timeline");
    if (eduList) {
      eduList.innerHTML = educationData.map((item) => `
        <li class="timeline-item">
          <span class="timeline-dot"></span>
          <p class="timeline-years">${currentLang === "fr" ? item.years : item.yearsEn}</p>
          <h3 class="timeline-title">${item[currentLang][0]}</h3>
          <p class="timeline-desc">${item[currentLang][1]}</p>
        </li>
      `).join("");
    }

    // Render Qualities Marquees
    const qualitiesContainer = document.getElementById("qualities-marquees");
    if (qualitiesContainer) {
      const kw = c.keywords;
      const doubleKw = [...kw, ...kw];
      qualitiesContainer.innerHTML = [0, 1].map((row) => `
        <div class="qualities-row">
          <div class="qualities-marquee animate-marquee" style="${row ? 'animation-direction: reverse;' : ''}">
            ${doubleKw.map((k) => `<span class="quality-chip">${k}</span>`).join("")}
          </div>
        </div>
      `).join("");
    }

    // Render Professional Experience Card (Task 12: Compact keywords only)
    const expContainer = document.getElementById("experience-cards");
    if (expContainer) {
      const skillTagsHtml = c.expSkillsKey.split(" · ").map((skill) => `
        <span class="quality-chip" style="font-size: 0.75rem; padding: 0.15rem 0.55rem; background: color-mix(in oklab, var(--primary) 8%, transparent); font-weight: 400;">${skill}</span>
      `).join("");

      expContainer.innerHTML = `
        <div class="job-card glass rounded-2xl">
          <div class="job-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div class="job-info">
            <h3 class="job-title">${c.expJob}</h3>
            <p class="job-company">${c.expCompany}</p>
            <div class="job-skills-tags" style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.375rem;">
              ${skillTagsHtml}
            </div>
          </div>
          <span class="job-date">${c.expYears}</span>
        </div>
      `;
    }

    // Render Project Filter Buttons
    renderProjectFilters();

    // Render Projects Grid (Tasks 4, 5, 8, 9)
    const projectsGrid = document.getElementById("projects-grid");
    if (projectsGrid && projectsData.length > 0) {
      projectsGrid.innerHTML = projectsData.map((p) => {
        const tagText = typeof p.tag === "object" ? p.tag[currentLang] : p.tag;
        const descText = typeof p.desc === "object" ? p.desc[currentLang] : p.desc;

        // Code Button (Uniform Secondary Style)
        const codeBtnHtml = p.github
          ? `<a href="${p.github}" target="_blank" rel="noreferrer" class="btn-action-secondary">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
               ${c.code}
             </a>`
          : `<button class="btn-action-secondary disabled" disabled>${c.code}</button>`;

        // Demo Button (Uniform Secondary Style)
        const demoBtnHtml = p.demo
          ? `<a href="${p.demo}" target="_blank" rel="noreferrer" class="btn-action-secondary">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
               ${c.demo}
             </a>`
          : ``;

        // Explore Button (Uniform Secondary Style)
        const exploreBtnHtml = `
          <button type="button" class="btn-action-secondary project-link-explore" data-project-id="${p.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            ${c.explore}
          </button>
        `;

        return `
          <article data-reveal class="project-card group${p.id === "n8n-suite" ? " project-card--n8n" : ""}" data-category="${p.category || ''}" data-tag="${tagText}">
            <div class="project-img-wrapper">
              <img src="${p.image}" alt="${p.title}" loading="lazy" class="project-img" />
            </div>
            <div class="project-content">
              <p class="project-tag">${tagText}</p>
              <h3 class="project-card-title">${p.title}</h3>
              <p class="project-card-desc">${descText}</p>
              <div class="project-links">
                ${exploreBtnHtml}
                ${codeBtnHtml}
                ${demoBtnHtml}
              </div>
            </div>
          </article>
        `;
      }).join("");

      // Apply Filter initial visibility
      applyProjectFilters();

      // Bind Lightbox clicks to "Explorer le projet"
      projectsGrid.querySelectorAll(".project-link-explore").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pId = btn.getAttribute("data-project-id");
          const project = projectsData.find((item) => item.id === pId);
          if (project) {
            const desc = typeof project.desc === "object" ? project.desc[currentLang] : project.desc;
            const gallery = Array.isArray(project.gallery) ? project.gallery : [{ image: project.image, title: project.title }];
            openGalleryLightbox(gallery, 0, project.title, desc);
          }
        });
      });
    }

    // Render certification filters, cards, and carousel pagination
    const certsTrack = document.getElementById("certs-track");
    const certsFilters = document.getElementById("certs-filters");
    const certsPagination = document.getElementById("certs-pagination");
    const certPrevBtn = document.getElementById("certs-prev-btn");
    const certNextBtn = document.getElementById("certs-next-btn");
    const categoryLabels = {
      algorithms: c.certFilterAlgorithms,
      development: c.certFilterDevelopment,
      languages: c.certFilterLanguages,
      "ai-agents": c.certFilterAiAgents
    };

    if (certsFilters && certsTrack && certsData.length > 0) {
      const certCategories = [...new Set(certsData.map((cert) => cert.category).filter(Boolean))];
      const certFilters = [
        { id: "all", label: c.certFilterAll },
        ...certCategories.map((id) => ({ id, label: categoryLabels[id] || id }))
      ];

      certsFilters.setAttribute("aria-label", c.certFilterLabel);
      certsFilters.innerHTML = certFilters.map((filter) => `
        <button type="button" class="filter-btn ${activeCertFilter === filter.id ? "active" : ""}"
          data-cert-filter="${filter.id}" aria-pressed="${activeCertFilter === filter.id}">
          ${filter.label}
        </button>
      `).join("");

      certsTrack.innerHTML = certsData.map((ce) => {
        const titleText = typeof ce.title === "object" ? ce.title[currentLang] : ce.title;
        const orgText = typeof ce.org === "object" ? ce.org[currentLang] : ce.org;
        const badgeText = ce.category === "ai-agents" ? c.certFilterAiAgents : ce.badge;
        const badgeHtml = badgeText ? `<span class="cert-badge label-mono">${badgeText}</span>` : "";
        const certificateAction = ce.photo ? `
          <button type="button" class="btn-action-secondary cert-link" data-cert-photo="${ce.photo}" data-cert-title="${titleText}" data-cert-org="${orgText}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            ${c.seeCert}
          </button>
        ` : ce.document ? `
          <a href="${ce.document}" target="_blank" rel="noopener noreferrer" class="btn-action-secondary cert-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
            ${c.seeCert}
          </a>
        ` : "";
        const verifyAction = ce.verifyUrl ? `
          <a href="${ce.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-secondary cert-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            ${c.certVerify}
          </a>
        ` : "";
        const trainingAction = ce.trainingUrl ? `
          <a href="${ce.trainingUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-secondary cert-link cert-training-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
            ${c.certTraining}
          </a>
        ` : "";

        return `
          <article class="cert-card glass rounded-2xl" data-category="${ce.category || ""}">
            ${badgeHtml}
            <div class="cert-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
            </div>
            <p class="cert-date">${ce.date}</p>
            <h3 class="cert-title">${titleText}</h3>
            <p class="cert-org">${orgText}</p>
            ${ce.certificateId ? `<p class="cert-id">${c.certIdLabel} : ${ce.certificateId}</p>` : ""}
            <div class="cert-actions">
              ${verifyAction}
              ${certificateAction}
              ${trainingAction}
            </div>
          </article>
        `;
      }).join("");

      certsTrack.querySelectorAll(".cert-link").forEach((btn) => {
        if (btn.tagName !== "BUTTON") return;
        btn.addEventListener("click", () => {
          const photo = btn.getAttribute("data-cert-photo");
          const title = btn.getAttribute("data-cert-title");
          const org = btn.getAttribute("data-cert-org");
          openGalleryLightbox([{ image: photo, title: "" }], 0, title, org);
        });
      });

      function visibleCertCards() {
        return [...certsTrack.querySelectorAll(".cert-card")].filter((card) => !card.hidden);
      }

      function certsPerPage() {
        if (window.matchMedia("(min-width: 1024px)").matches) return 3;
        if (window.matchMedia("(min-width: 640px)").matches) return 2;
        return 1;
      }

      function updateCertPagination(scrollToPage = false) {
        const cards = visibleCertCards();
        const perPage = certsPerPage();
        const pageCount = Math.ceil(cards.length / perPage);
        certsCurrentPage = Math.min(certsCurrentPage, Math.max(pageCount - 1, 0));
        if (scrollToPage && cards.length) {
          const card = cards[certsCurrentPage * perPage];
          const left = card.getBoundingClientRect().left - certsTrack.getBoundingClientRect().left + certsTrack.scrollLeft;
          certsTrack.scrollTo({ left, behavior: "smooth" });
        }

        if (certsPagination) {
          certsPagination.setAttribute("aria-label", t[currentLang].certPagesLabel);
          certsPagination.innerHTML = Array.from({ length: pageCount }, (_, page) => `
            <button type="button" class="cert-pagination-dot ${page === certsCurrentPage ? "active" : ""}"
              aria-label="${currentLang === "fr" ? "Page" : "Page"} ${page + 1}" aria-current="${page === certsCurrentPage ? "page" : "false"}"
              data-cert-page="${page}"></button>
          `).join("");
          certsPagination.querySelectorAll(".cert-pagination-dot").forEach((button) => {
            button.addEventListener("click", () => {
              certsCurrentPage = Number(button.getAttribute("data-cert-page"));
              updateCertPagination(true);
            });
          });
        }

        if (certPrevBtn) {
          certPrevBtn.disabled = certsCurrentPage === 0;
          certPrevBtn.setAttribute("aria-label", t[currentLang].certPrevious);
        }
        if (certNextBtn) {
          certNextBtn.disabled = pageCount === 0 || certsCurrentPage >= pageCount - 1;
          certNextBtn.setAttribute("aria-label", t[currentLang].certNext);
        }
      }

      function applyCertFilter() {
        certsCurrentPage = 0;
        certsFilters.querySelectorAll("[data-cert-filter]").forEach((button) => {
          const isActive = button.getAttribute("data-cert-filter") === activeCertFilter;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        certsTrack.querySelectorAll(".cert-card").forEach((card) => {
          card.hidden = activeCertFilter !== "all" && card.getAttribute("data-category") !== activeCertFilter;
        });
        updateCertPagination(true);
      }

      certsFilters.querySelectorAll("[data-cert-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          activeCertFilter = button.getAttribute("data-cert-filter") || "all";
          applyCertFilter();
        });
      });

      if (!certsTrack.dataset.paginationBound) {
        certsTrack.dataset.paginationBound = "true";
        certsTrack.addEventListener("scroll", () => {
          const cards = visibleCertCards();
          const perPage = certsPerPage();
          if (!cards.length) return;
          let closestPage = 0;
          let closestDistance = Infinity;
          for (let page = 0; page < Math.ceil(cards.length / perPage); page++) {
            const card = cards[page * perPage];
            const targetLeft = card.getBoundingClientRect().left - certsTrack.getBoundingClientRect().left + certsTrack.scrollLeft;
            const distance = Math.abs(targetLeft - certsTrack.scrollLeft);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestPage = page;
            }
          }
          certsCurrentPage = closestPage;
          updateCertPagination();
        }, { passive: true });
        window.addEventListener("resize", () => updateCertPagination(true));
      }
      applyCertFilter();
    }

    // Render Technical Skills Grid
    const skillsGrid = document.getElementById("skills-grid");
    if (skillsGrid && skillsData.length > 0) {
      skillsGrid.innerHTML = skillsData.map((s) => {
        const titleText = typeof s.title === "object" ? s.title[currentLang] : s.title;
        const skillIcons = {
          languages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 5-6 7 6 7"/><path d="m16 5 6 7-6 7"/><path d="m14 3-4 18"/></svg>',
          frontend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20"/><path d="m8 13-2 2 2 2"/><path d="m16 13 2 2-2 2"/><path d="m14 12-3 6"/></svg>',
          databases: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></svg>',
          devops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 8a4 4 0 1 0 4 4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/><path d="m14 10 6-6m-5 0h5v5"/></svg>',
          security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>',
          "ai-automation": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4m-4 5h.01M16 12h.01M9 16h6"/><path d="M2 12h2m16 0h2"/></svg>',
          "dsi-industry": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V8l6 3V8l6 3V4h6v17Z"/><path d="M17 8h.01M17 12h.01M7 15h.01M11 15h.01M15 15h.01M7 18h.01M11 18h.01M15 18h.01"/></svg>'
        };
        return `
          <div data-reveal class="skill-card glass rounded-2xl">
            <div class="skill-icon" aria-hidden="true">${skillIcons[s.category] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/></svg>'}</div>
            <h3 class="skill-title">${titleText}</h3>
            <p class="skill-items">${s.items}</p>
          </div>
        `;
      }).join("");
    }

    // Render Languages Boxes
    const langsBox = document.getElementById("languages-list");
    if (langsBox) {
      langsBox.innerHTML = languagesData.map((l) => `
        <div class="language-rect">
          <p class="lang-name">${l.name[currentLang]}</p>
          <p class="lang-level">${l.level[currentLang]}</p>
        </div>
      `).join("");
    }

    // Render Interests Marquees
    const interestsMarquees = document.getElementById("interests-marquees");
    if (interestsMarquees) {
      const tripleInt = [...interestsData, ...interestsData, ...interestsData];
      const getLucideIcon = (iconName) => {
        switch(iconName) {
          case 'book-open': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
          case 'pen-line': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
          case 'plane': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>';
          case 'film': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>';
          case 'utensils': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2v20"/><path d="M18 2a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4"/><path d="M6 2v20"/><path d="M6 2v7a3 3 0 0 0 6 0V2"/></svg>';
          case 'shirt': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>';
          default: return '';
        }
      };

      interestsMarquees.innerHTML = [0, 1].map((row) => `
        <div class="interests-marquee-wrapper">
          <div class="qualities-marquee animate-marquee" style="${row ? 'animation-direction: reverse;' : ''}">
            ${tripleInt.map((it) => `
              <span class="interest-chip glass rounded-2xl">
                <span class="skill-icon">${getLucideIcon(it.icon)}</span>
                ${it[currentLang]}
              </span>
            `).join("")}
          </div>
        </div>
      `).join("");
    }

    // Re-initialize scroll reveal for new dynamic elements
    initScrollReveal();
  }

  /* ------------------------------------------------------------------------
     8. EVENT LISTENERS
     ------------------------------------------------------------------------ */

  // Language switcher toggle
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      currentLang = currentLang === "fr" ? "en" : "fr";
      renderAll();
    });
  }

  // Theme switcher toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      isDark = !isDark;
      htmlEl.classList.toggle("dark", isDark);
    });
  }

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileNavPanel.style.display = menuOpen ? "flex" : "none";
    });

    mobileNavPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOpen = false;
        mobileNavPanel.style.display = "none";
      });
    });
  }

  // Certifications carousel scroll controls
  const certPrevBtn = document.getElementById("certs-prev-btn");
  const certNextBtn = document.getElementById("certs-next-btn");

  if (certPrevBtn) {
    certPrevBtn.addEventListener("click", () => {
      const activePage = document.querySelector("#certs-pagination .cert-pagination-dot.active");
      const page = activePage ? Number(activePage.getAttribute("data-cert-page")) : 0;
      document.querySelector(`#certs-pagination [data-cert-page="${Math.max(0, page - 1)}"]`)?.click();
    });
  }
  if (certNextBtn) {
    certNextBtn.addEventListener("click", () => {
      const activePage = document.querySelector("#certs-pagination .cert-pagination-dot.active");
      const page = activePage ? Number(activePage.getAttribute("data-cert-page")) : 0;
      document.querySelector(`#certs-pagination [data-cert-page="${page + 1}"]`)?.click();
    });
  }

  /* ------------------------------------------------------------------------
     9. INITIALIZATION
     ------------------------------------------------------------------------ */
  htmlEl.classList.add("dark"); // Default dark mode
  initSignalCanvas();
  initCustomCursor();
  renderAll();
});
