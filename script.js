
 // Edit these details before publishing.
const portfolio = {
  name: "R Vishnuprasad",
  email: "rvishnuprasad310@gmail.com",
  linkedin: "https://www.linkedin.com/in/vishnuprasad-r-2a908b190/?isSelfProfile=true",
  github: "./github.html"
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
  githubLink.href = new URL(portfolio.github, document.baseURI).href;
  githubLink.removeAttribute("target");
  githubLink.removeAttribute("rel");
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


(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// cursor spotlight
addEventListener('pointermove',e=>{
  document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px');
  const c=e.target.closest&&e.target.closest('.skill-card,.project-card');
  if(c){const r=c.getBoundingClientRect();c.style.setProperty('--cx',e.clientX-r.left+'px');c.style.setProperty('--cy',e.clientY-r.top+'px')}
},{passive:true});
// count-up stats
const counters=$$('[data-count]');
const run=el=>{const to=+el.dataset.count,d=+(el.dataset.dec||0),suf=el.dataset.suffix||'';
  if(calm){el.textContent=to.toFixed(d)+suf;return}
  const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1200),e=1-Math.pow(1-p,3);
  el.textContent=(to*e).toFixed(d)+suf;if(p<1)requestAnimationFrame(f)})(t0)};
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){run(x.target);io.unobserve(x.target)}}),{threshold:.6});counters.forEach(c=>io.observe(c))}
// Animated hero statement: cycles through the work I build.
(()=>{
  const word=document.getElementById('buildRole');
  const picker=document.getElementById('languageSelect');
  const prefix=document.querySelector('[data-build-prefix]');
  if(!word)return;
  const phrases={
    en:['Teamcenter solutions','scalable PLM workflows','CAD–PLM integrations','data migration tools','AI change-impact concepts'],
    de:['Teamcenter-Lösungen','skalierbare PLM-Workflows','CAD–PLM-Integrationen','Datenmigrationstools','KI-Konzepte zur Änderungsanalyse'],
    fr:['des solutions Teamcenter','des workflows PLM évolutifs','des intégrations CAD–PLM','des outils de migration de données','des concepts IA d’impact des changements'],
    es:['soluciones Teamcenter','flujos PLM escalables','integraciones CAD–PLM','herramientas de migración de datos','conceptos de IA para analizar cambios']
  };
  const prefixes={en:'I build',de:'Ich entwickle',fr:'Je conçois',es:'Desarrollo'};
  let lang=picker?.value||'en',phraseIndex=0,charIndex=0,deleting=false,timer;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resetLanguage(){lang=picker?.value||'en';phraseIndex=0;charIndex=0;deleting=false;clearTimeout(timer);if(prefix)prefix.textContent=prefixes[lang]||prefixes.en;word.textContent='';if(reduced){word.textContent=(phrases[lang]||phrases.en)[0];return}tick()}
  function tick(){const list=phrases[lang]||phrases.en;const current=list[phraseIndex%list.length];charIndex+=deleting?-1:1;word.textContent=current.slice(0,charIndex);let delay=deleting?32:62;if(!deleting&&charIndex>=current.length){deleting=true;delay=1450}else if(deleting&&charIndex<=0){deleting=false;phraseIndex=(phraseIndex+1)%list.length;delay=260}timer=setTimeout(tick,delay)}
  picker?.addEventListener('change',resetLanguage);
  resetLanguage();
})();

// scroll-to + command helpers
const go=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:calm?'auto':'smooth'})};
const toggleTheme=()=>document.getElementById('themeToggle')?.click();
const filter=f=>{go('projects');document.querySelector(`[data-filter="${f}"]`)?.click()};
const copyMail=()=>navigator.clipboard?.writeText(portfolio.email);
const open=u=>window.open(u,'_blank','noopener');
// Lightweight profile Q&A assistant. Answers are based on the information shown on this page.
const aiDialog = document.getElementById('profileAI');
const aiOpen = document.getElementById('aiAssistantOpen');
const aiClose = document.getElementById('profileAIClose');
const aiForm = document.getElementById('profileAIForm');
const aiInput = document.getElementById('profileAIInput');
const aiMessages = document.getElementById('profileAIMessages');
const openAI = () => {
  if (!aiDialog) return;
  aiDialog.hidden = false;
  document.body.classList.add('profile-ai-open');
  if (aiInput) aiInput.focus();
};
const closeAI = () => {
  if (!aiDialog) return;
  aiDialog.hidden = true;
  document.body.classList.remove('profile-ai-open');
  if (aiOpen) aiOpen.focus();
};
aiOpen?.addEventListener('click', openAI);
aiClose?.addEventListener('click', closeAI);
aiDialog?.addEventListener('click', e => { if (e.target === aiDialog) closeAI(); });

const profileKnowledge = [
  { keys: ['hello','hi','hey','good morning','good afternoon','good evening'], answer: 'Hi! I’m Vishnuprasad’s portfolio assistant. You can ask about his skills, work history, projects, education, or certifications.' },
  { keys: ['main skills','key skills','technical skills','skills','technology','technologies','tech stack','expertise','programming','tools','what can he do'], answer: 'MAIN SKILLS\n\n• Siemens Teamcenter: ITK, server-side customization, workflows, ACLs, queries, administration\n• C/C++: ITK utilities, extensions, action and rule handlers\n• Active Workspace: UI customization, commands, stylesheets, saved searches\n• BMIDE: data modelling, business objects, properties, rules and LOVs\n• Classification: class hierarchies, attributes and LOVs\n• Data migration: IPS utilities, validation and production migration\n• CAD–PLM: NX, Solid Edge and SolidWorks integration\n• Other tools: SQL, Python, JavaScript, REST APIs, Git, Jira and Azure DevOps.' },
  { keys: ['experience','work history','career','companies','company','employer','capgemini','wipro','cognizant','where has he worked'], answer: 'PROFESSIONAL EXPERIENCE\n\n1. Capgemini — PLM Developer | Oct 2025–Present\n• Teamcenter ITK/C++ utilities, extensions and handlers\n• Active Workspace customization and BMIDE configuration\n• Designed 20+ workflows and managed 100+ classification classes\n• Supports Teamcenter administration and QA/sandbox deployments\n\n2. Wipro Technologies — Project Engineer | May 2022–Oct 2025\n• Worked across PLM development and test-lead responsibilities\n• Migrated 10,000+ items to production with reported 100% accuracy\n• Built Active Workspace queries and supported NX, Solid Edge and SolidWorks CAD–PLM integrations\n• Coordinated testing across customers, business teams and developers\n\n3. Cognizant — Programmer Analyst Trainee (Internship) | Feb–May 2022\n• Optimized MySQL queries and supported database design and query planning.' },
  { keys: ['project','projects','built','develop','achievement','migration','10000','10,000','impact analysis','ai','artificial intelligence'], answer: 'Featured work includes a production migration of 10,000+ Teamcenter items with reported 100% accuracy, Active Workspace customization, CAD–PLM integration, and an AI change-impact concept to help identify affected parts, assemblies, documents and manufacturing processes.' },
  { keys: ['education','degree','college','university','study','cgpa','qualification'], answer: 'He earned a B.E. in Computer Science & Engineering from Hindustan Institute of Technology, affiliated with Anna University, Tamil Nadu (2018–2022), with a CGPA of 8.49/10.' },
  { keys: ['certification','certified','aws'], answer: 'His listed certifications are Siemens Teamcenter Professional, Siemens Partner – Teamcenter X Associate, and AWS Cloud Practitioner.' },
  { keys: ['teamcenter','plm','bmide','awc','active workspace','itk','workflow','classification','customization'], answer: 'His Teamcenter work covers ITK utilities, extensions and handlers in C/C++, Active Workspace UI customization, BMIDE configuration, workflow design, classification, administration, and deployment support.' },
  { keys: ['contact','email','linkedin','hire','reach','phone'], answer: 'Use the Email or LinkedIn links in the Contact section near the bottom of the portfolio to reach Vishnuprasad.' },
  { keys: ['years','how long','experience length','how many years'], answer: 'The profile states 4.7+ years of software engineering experience. The Experience timeline lists roles at Capgemini, Wipro and Cognizant.' },
  { keys: ['language','translate','german','french','japanese','swiss','singapore'], answer: 'Use the language selector in the top navigation to switch the portfolio language.' }
];
const normalizeAIQuestion = value => String(value || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const profileAnswer = question => {
  const q = normalizeAIQuestion(question);
  if (!q) return 'Please type a question about Vishnuprasad’s profile.';
  // Prioritize the dedicated button prompts and specific phrases before broad topic matches.
  if (q.includes('main skills') || q.includes('key skills') || q === 'skills') return profileKnowledge[1].answer;
  if (q.includes('experience') || q.includes('work history') || q.includes('where has he worked')) return profileKnowledge[2].answer;
  if (q.includes('project')) return profileKnowledge[3].answer;
  const match = profileKnowledge.find(item => item.keys.some(key => q.includes(normalizeAIQuestion(key))));
  if (match) return match.answer;
  if (q.includes('who') || q.includes('about him') || q.includes('about vishnu')) return 'R Vishnuprasad is a Siemens Teamcenter and PLM developer with experience in server-side customization, Active Workspace, BMIDE, data migration, and CAD–PLM integration.';
  if (q.includes('resume') || q.includes('cv')) return 'Use the Download resume link in the Contact section to access Vishnuprasad’s resume.';
  return 'I can answer questions about Vishnuprasad’s technical skills, Capgemini/Wipro/Cognizant experience, projects, education, certifications, and contact details. Try “Main skills”, “Experience”, or “Projects”.';
};
const addAIMessage = (message, role) => {
  if (!aiMessages) return;
  const el = document.createElement('div');
  el.className = `profile-ai-message ${role}`;
  el.textContent = message;
  aiMessages.appendChild(el);
  aiMessages.scrollTop = aiMessages.scrollHeight;
};
const askAI = question => {
  const q = String(question || '').trim();
  if (!q) return;
  addAIMessage(q, 'user');
  addAIMessage(profileAnswer(q), 'assistant');
};
aiForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!aiInput) return;
  const question = aiInput.value.trim();
  if (!question) return;
  askAI(question);
  aiInput.value = '';
  aiInput.focus();
});
// Use one delegated click handler so suggestion buttons still work if UI labels are updated.
document.addEventListener('click', event => {
  const button = event.target.closest('#profileAI .profile-ai-suggestions [data-ai-question]');
  if (!button) return;
  event.preventDefault();
  const question = button.getAttribute('data-ai-question');
  if (!question) return;
  if (aiDialog && aiDialog.hidden) openAI();
  askAI(question);
});
addEventListener('keydown', event => {
  if (event.key === 'Escape' && aiDialog && !aiDialog.hidden) closeAI();
});
})();

// constellation background
(()=>{const cv=document.getElementById('netBg');if(!cv||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const x=cv.getContext('2d');let w,h,pts=[];
const size=()=>{const d=devicePixelRatio||1;w=innerWidth;h=innerHeight;cv.width=w*d;cv.height=h*d;x.setTransform(d,0,0,d,0,0);
  const n=Math.min(70,Math.floor(w*h/22000));pts=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))};
size();addEventListener('resize',size);
(function tick(){x.clearRect(0,0,w,h);const lm=document.body.classList.contains('light-mode'),c=lm?'8,127,91':'131,240,197';
  pts.forEach(p=>{p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;x.fillStyle=`rgba(${c},.5)`;x.beginPath();x.arc(p.x,p.y,1.6,0,6.3);x.fill()});
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<140){x.strokeStyle=`rgba(${c},${.16*(1-d/140)})`;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
  requestAnimationFrame(tick)})()})();
