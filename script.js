
 // Edit these details before publishing.
const portfolio = {
  name: "R Vishnuprasad",
  email: "rvishnuprasad310@gmail.com",
  linkedin: "https://www.linkedin.com/in/vishnuprasad-r-2a908b190/?isSelfProfile=true",
  github: "https://github.com/"
};

document.title = `${portfolio.name} | Siemens Teamcenter & PLM Developer`;

const emailLink = document.getElementById("emailLink");
const linkedinLink = document.getElementById("linkedinLink");
const githubLink = document.getElementById("githubLink");

// Open Gmail compose instead of using the mailto: protocol.
if (emailLink) {
  emailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.email)}`;
  emailLink.target = "_blank";
  emailLink.rel = "noopener noreferrer";
}

if (linkedinLink) {
  linkedinLink.href = portfolio.linkedin;
}

if (githubLink) {
  githubLink.href = portfolio.github;
}

// Mobile navigation menu
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// Back-to-top and icon-based light/dark theme controls
const backToTopButton = document.getElementById("backToTop");
const themeToggleButton = document.getElementById("themeToggle");

function updateBackToTopVisibility() {
  if (backToTopButton) backToTopButton.classList.toggle("visible", window.scrollY > 320);
}
window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const lightMode = document.body.classList.toggle("light-mode");
    themeToggleButton.setAttribute("aria-pressed", String(lightMode));
    themeToggleButton.setAttribute("aria-label", lightMode ? "Switch to dark mode" : "Switch to light mode");
    themeToggleButton.setAttribute("title", lightMode ? "Switch to dark mode" : "Switch to light mode");
  });
}


// Scroll progress indicator
const progressBar = document.getElementById("scrollProgress");
function updateScrollProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// Reveal content as it enters the viewport (with a no-observer fallback).
const revealTargets = document.querySelectorAll(
  ".section-heading, .stat, .about-lead, .about-note, .skill-card, .toolbelt, .skills-detail, .project-card, .timeline-item, .achievement-card, .education-card, .contact-inner"
);
revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  if (element.classList.contains("skill-card")) element.style.transitionDelay = `${(index % 4) * 65}ms`;
});
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add("is-visible"));
}

// Highlight the navigation item for the section currently in view.
const sectionLinks = Array.from(document.querySelectorAll('#nav a[href^="#"]'));
const observedSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && observedSections.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  observedSections.forEach(section => navObserver.observe(section));
}

// Filter the featured work without reloading the page.
const projectFilterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card[data-category]");
const filterStatus = document.getElementById("filterStatus");
projectFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let shown = 0;
    projectFilterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach(card => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.hidden = !matches;
      card.classList.toggle("filter-in", matches);
      if (matches) shown++;
    });
    if (filterStatus) {
      const label = button.textContent.trim().replace(/\s+\d+$/, "");
      filterStatus.textContent = filter === "all"
        ? `Showing all ${shown} featured projects.`
        : `Showing ${shown} project${shown === 1 ? "" : "s"} for ${label}.`;
    }
  });
});
