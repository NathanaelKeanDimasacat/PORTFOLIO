/* script.js — Portfolio interactivity */

/* ========== 1. Dynamic year in footer ========== */
document.getElementById("year").textContent = new Date().getFullYear();


/* ========== 2. Hamburger / mobile nav ========== */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  hamburger.innerHTML = isOpen
    ? '<i class="fa fa-times"></i>'
    : '<i class="fa fa-bars"></i>';
});

// Close menu when a link is clicked
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.innerHTML = '<i class="fa fa-bars"></i>';
    hamburger.setAttribute("aria-expanded", false);
  });
});


/* ========== 3. Active nav link on scroll ========== */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function setActiveNav() {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
}

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();


/* ========== 4. Scroll-to-top button ========== */
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  const show = window.scrollY > 400;
  scrollTopBtn.style.display = show ? "inline-flex" : "none";
}, { passive: true });

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ========== 5. Typing / typewriter effect ========== */
const phrases = [
  "Aspiring Cybersecurity Analyst",
  "Web Developer",
  "IT Student",
  "Problem Solver",
  "Always Learning",
];

const typeEl  = document.getElementById("type-text");
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typingTimeout;

function type() {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      typingTimeout = setTimeout(type, 1800); // pause before delete
      return;
    }
  } else {
    typeEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  typingTimeout = setTimeout(type, deleting ? 55 : 90);
}

type();


/* ========== 6. Skill progress bars (Intersection Observer) ========== */
const progressBars = document.querySelectorAll(".progress");

const animateBar = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar   = entry.target;
    const value = bar.dataset.value || 0;
    const span  = bar.querySelector("span");

    // Set background gradient on the span
    span.style.cssText = `
      display: block;
      height: 100%;
      border-radius: 999px;
      width: 0%;
      background: linear-gradient(90deg, #6a6cff, #8b5cf6);
      transition: width 1.1s cubic-bezier(.2,.9,.3,1);
    `;

    // Trigger reflow then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.style.width = value + "%";
      });
    });

    observer.unobserve(bar);
  });
};

const barObserver = new IntersectionObserver(animateBar, { threshold: 0.3 });
progressBars.forEach(bar => barObserver.observe(bar));


/* ========== 7. Scroll-reveal animations ========== */
// Add data-animate to cards/sections automatically
const revealTargets = document.querySelectorAll(
  ".about-card, .skill-card, .project-card, .timeline-item, .contact-info, .contact-form, .stat"
);

revealTargets.forEach((el, i) => {
  el.setAttribute("data-animate", "");
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  el.style.transition = "opacity .5s ease, transform .5s ease";
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));


/* ========== 8. Contact form feedback (UI only) ========== */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector("button[type='submit']");
    const original = btn.textContent;

    btn.textContent = "Sent! ✓";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = "";
      contactForm.reset();
    }, 2500);
  });
}


/* ========== 9. Mobile nav open styles (injected) ========== */
// Inject the .open class style for the mobile nav
const mobileStyle = document.createElement("style");
mobileStyle.textContent = `
  @media (max-width: 980px) {
    .nav-links.open {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(11,16,32,0.97);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 0 0 14px 14px;
      padding: .8rem;
      gap: .3rem;
      z-index: 50;
    }
  }

  .nav-link.active {
    color: var(--text) !important;
    background: linear-gradient(90deg, rgba(106,108,255,0.10), rgba(139,92,246,0.06)) !important;
  }
`;
document.head.appendChild(mobileStyle);