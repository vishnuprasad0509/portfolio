/* =========================================================================
   R Vishnuprasad — PLM Portfolio  ·  interactions
   ========================================================================= */
(() => {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Contact / nav links (single source of truth) ---------- */
  const portfolio = {
    name: "R Vishnuprasad",
    email: "rvishnuprasad310@gmail.com",
    linkedin: "https://www.linkedin.com/in/vishnuprasad-r-2a908b190/",
    github: "https://github.com/vishnuprasad0509",
    resume: "Vishnuprasad_R_Resume.pdf"
  };
  document.title = `${portfolio.name} | Siemens Teamcenter & PLM Developer`;

  const setLink = (id, href, external = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = href;
    if (external) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
  };
  setLink("emailLink", `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.email)}`);
  setLink("linkedinLink", portfolio.linkedin);
  setLink("githubLink", portfolio.github);
  setLink("navResume", portfolio.resume);

  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()}`;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const preloaderBar = preloader && preloader.querySelector(".preloader-bar i");
  const preloaderText = document.getElementById("preloaderText");
  if (preloader) {
    const steps = ["INITIALIZING SYSTEM", "LOADING MODULES", "MOUNTING WORKSPACE", "READY"];
    let p = 0, s = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 26 + 8);
      if (preloaderBar) preloaderBar.style.width = p + "%";
      const idx = Math.min(steps.length - 1, Math.floor((p / 100) * steps.length));
      if (idx !== s && preloaderText) { s = idx; preloaderText.textContent = steps[idx]; }
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => { preloader.classList.add("done"); startTypewriter(); startTerminal(); }, 350);
      }
    }, prefersReduced ? 60 : 220);
  }
  window.addEventListener("load", () => { if (preloader && !preloader.classList.contains("done")) { preloader.classList.add("done"); startTypewriter(); startTerminal(); } });

  /* ---------- Header shrink on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const onHeaderScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- Back-to-top + theme ---------- */
  const backToTop = document.getElementById("backToTop");
  const themeToggle = document.getElementById("themeToggle");
  const onScrollBtn = () => backToTop && backToTop.classList.toggle("visible", window.scrollY > 320);
  window.addEventListener("scroll", onScrollBtn, { passive: true });
  onScrollBtn();
  if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const savedTheme = (() => { try { return localStorage.getItem("rv-theme"); } catch { return null; } })();
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) { themeToggle.setAttribute("aria-pressed", "true"); themeToggle.setAttribute("aria-label", "Switch to dark mode"); }
  }
  if (themeToggle) themeToggle.addEventListener("click", () => {
    const light = document.body.classList.toggle("light-mode");
    themeToggle.setAttribute("aria-pressed", String(light));
    themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.setAttribute("title", light ? "Switch to dark mode" : "Switch to light mode");
    try { localStorage.setItem("rv-theme", light ? "light" : "dark"); } catch {}
  });

  /* ---------- Scroll progress ---------- */
  const progressBar = document.getElementById("scrollProgress");
  const updateProgress = () => {
    if (!progressBar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0) + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-heading, .stat, .about-lead, .about-note, .skill-card, .skillbar, .toolbelt, .skills-detail, .project-card, .timeline-item, .achievement-card, .education-card, .contact-inner"
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    if (el.classList.contains("skill-card")) el.style.transitionDelay = `${(i % 4) * 70}ms`;
  });
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        if (e.target.dataset.count !== undefined) animateCount(e.target);
        if (e.target.classList.contains("skillbar")) fillSkill(e.target);
        if (e.target.querySelectorAll) {
          e.target.querySelectorAll("[data-count]").forEach(animateCount);
          e.target.querySelectorAll(".skillbar").forEach(fillSkill);
        }
        ro.unobserve(e.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(el => ro.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("is-visible"));
    document.querySelectorAll("[data-count]").forEach(animateCount);
    document.querySelectorAll(".skillbar").forEach(fillSkill);
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    if (el.dataset.done) return; el.dataset.done = "1";
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.innerHTML = target.toFixed(decimals) + `<span>${suffix}</span>`; return; }
    const dur = 1500; const t0 = performance.now();
    const step = (now) => {
      const prog = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.innerHTML = (target * eased).toFixed(decimals) + `<span>${suffix}</span>`;
      if (prog < 1) requestAnimationFrame(step);
      else el.innerHTML = target.toFixed(decimals) + `<span>${suffix}</span>`;
    };
    requestAnimationFrame(step);
  }

  /* ---------- Skill bars ---------- */
  function fillSkill(bar) {
    const fill = bar.querySelector("i[data-level]");
    if (fill && !fill.dataset.done) { fill.dataset.done = "1"; fill.style.width = fill.dataset.level + "%"; }
  }

  /* ---------- Nav active section ---------- */
  const navLinks = Array.from(document.querySelectorAll('#nav a[href^="#"]'));
  const sections = navLinks.map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const no = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(l => {
          const active = l.getAttribute("href") === `#${e.target.id}`;
          l.classList.toggle("active", active);
          active ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
    sections.forEach(s => no.observe(s));
  }

  /* ---------- Project filter ---------- */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  const filterStatus = document.getElementById("filterStatus");
  filterButtons.forEach(btn => btn.addEventListener("click", () => {
    const filter = btn.dataset.filter; let shown = 0;
    filterButtons.forEach(b => { const sel = b === btn; b.classList.toggle("active", sel); b.setAttribute("aria-pressed", String(sel)); });
    projectCards.forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.hidden = !match;
      if (match) { card.classList.remove("filter-in"); void card.offsetWidth; card.classList.add("filter-in"); shown++; }
    });
    if (filterStatus) {
      const label = btn.textContent.trim().replace(/\s+\d+$/, "");
      filterStatus.textContent = filter === "all"
        ? `Showing all ${shown} featured projects.`
        : `Showing ${shown} project${shown === 1 ? "" : "s"} for ${label}.`;
    }
  }));

  /* ---------- Typewriter ---------- */
  function startTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el || el.dataset.on) return; el.dataset.on = "1";
    const phrases = ["Teamcenter customizations", "ITK / C++ server logic", "BMIDE data models", "Active Workspace UIs", "reliable data migrations", "CAD–PLM integrations"];
    if (prefersReduced) { el.textContent = phrases[0]; return; }
    let pi = 0, ci = 0, deleting = false;
    const type = () => {
      const word = phrases[pi];
      el.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(type, 55 + Math.random() * 45); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1600); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 28); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 320); }
    };
    type();
  }

  /* ---------- Terminal boot sequence ---------- */
  function startTerminal() {
    const body = document.getElementById("terminalBody");
    if (!body || body.dataset.on) return; body.dataset.on = "1";
    const lines = [
      '<span class="t-prompt">$</span> tcstart <span class="t-flag">--env</span> production',
      '<span class="t-comment"># connecting to Teamcenter 2512...</span>',
      '<span class="t-ok">✓</span> ITK session established',
      '<span class="t-ok">✓</span> BMIDE template loaded',
      '<span class="t-ok">✓</span> Active Workspace mounted',
      '<span class="t-prompt">$</span> migrate <span class="t-flag">--items</span> 10000',
      '<span class="t-ok">✓</span> 10,000 items · 100% accuracy',
      '<span class="t-prompt">$</span> <span class="terminal-cursor"></span>'
    ];
    if (prefersReduced) { body.innerHTML = lines.join("<br>"); return; }
    let i = 0;
    const next = () => {
      if (i >= lines.length) return;
      const div = document.createElement("div");
      div.innerHTML = lines[i];
      div.style.opacity = "0";
      div.style.transition = "opacity .3s ease";
      body.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = "1"; });
      i++;
      setTimeout(next, i === 2 ? 650 : 480);
    };
    next();
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (dot && ring) {
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });
      const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`; requestAnimationFrame(loop); };
      loop();
      document.querySelectorAll("a, button, .tilt, .tool-list span").forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
      });
    }
  }

  /* ---------- 3D tilt ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      const strength = 9;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateZ(6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Particle constellation background ---------- */
  const canvas = document.getElementById("fxCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [], mouse = { x: -9999, y: -9999 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
      const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 17000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
    const accent = () => document.body.classList.contains("light-mode") ? "10,157,120" : "94,242,196";
    const link = () => document.body.classList.contains("light-mode") ? "59,91,219" : "124,155,255";
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const maxD = 130 * dpr;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dmx = p.x - mouse.x, dmy = p.y - mouse.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < 120 * dpr) { p.x += dmx / dm * 1.4; p.y += dmy / dm * 1.4; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent()},0.65)`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < maxD) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${link()},${0.14 * (1 - d / maxD)})`;
            ctx.lineWidth = dpr * 0.6; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
})();
