document.body.classList.add("js");

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]")).filter((section) =>
  navLinks.some((link) => link.getAttribute("href") === "#" + section.id)
);
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

document.getElementById("currentYear").textContent = new Date().getFullYear();

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }
};

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#171033" : "#fff8f0");
}

applyTheme(storage.get("portfolio-theme") === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  const switchTheme = () => {
    applyTheme(next);
    storage.set("portfolio-theme", next);
  };
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(switchTheme);
  } else {
    switchTheme();
  }
});

function setMenu(open) {
  primaryNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open && window.innerWidth <= 900);
}

menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenu(false);
});

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 500);
  scrollProgress.style.transform = "scaleX(" + progress + ")";
  backToTop.style.setProperty("--progress", (progress * 100).toFixed(1));
  document.documentElement.style.setProperty("--scroll-y", window.scrollY + "px");
}
updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const heroSection = document.querySelector(".hero");
const heroSpotlight = document.getElementById("heroSpotlight");
if (heroSection && heroSpotlight) {
  heroSection.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const bounds = heroSection.getBoundingClientRect();
    heroSpotlight.style.setProperty("--spot-x", (((event.clientX - bounds.left) / bounds.width) * 100).toFixed(2) + "%");
    heroSpotlight.style.setProperty("--spot-y", (((event.clientY - bounds.top) / bounds.height) * 100).toFixed(2) + "%");
  });
}

const staggerGroups = document.querySelectorAll(".stats-strip, .skills-grid, .projects-grid, .achievement-grid");
staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty("--reveal-delay", (index * 0.09).toFixed(2) + "s");
  });
});

const revealElements = Array.from(document.querySelectorAll(".reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealElements.forEach((element) => revealObserver.observe(element));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((section) => navObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const profileImage = document.getElementById("profileImage");
const profileMonogram = document.getElementById("profileMonogram");
const profileCandidates = ["images/profile.webp", "images/profile.jpg", "images/profile.jpeg", "images/profile.png", "images/adhyansh.jpg"];

function loadProfileImage(index) {
  if (!profileImage || !profileMonogram || index >= profileCandidates.length) return;
  const candidate = new Image();
  candidate.onload = () => {
    profileImage.src = profileCandidates[index];
    profileImage.hidden = false;
    profileMonogram.hidden = true;
  };
  candidate.onerror = () => loadProfileImage(index + 1);
  candidate.src = profileCandidates[index];
}
loadProfileImage(0);

const copyEmail = document.getElementById("copyEmail");
if (copyEmail) {
  copyEmail.addEventListener("click", async () => {
    const email = "adinishad452@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      copyEmail.textContent = "Copied";
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
      copyEmail.textContent = "Copied";
    }
    setTimeout(() => {
      copyEmail.textContent = "Copy";
    }, 1800);
  });
}

const projectDetails = Array.from(document.querySelectorAll(".project-details"));
projectDetails.forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    projectDetails.forEach((other) => {
      if (other !== details) other.open = false;
    });
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--rx", (-y * 4).toFixed(2) + "deg");
    card.style.setProperty("--ry", (x * 4).toFixed(2) + "deg");
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

const validators = {
  name: (value) => (value.trim().length >= 2 ? "" : "Please enter your name."),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address."),
  message: (value) => (value.trim().length >= 10 ? "" : "Please write at least 10 characters.")
};

function validateField(field) {
  const error = validators[field.name](field.value);
  const errorNode = document.querySelector('[data-error-for="' + field.name + '"]');
  if (errorNode) errorNode.textContent = error;
  field.classList.toggle("invalid", Boolean(error));
  field.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}

Object.keys(validators).forEach((name) => {
  const field = contactForm.elements[name];
  field.addEventListener("input", () => {
    if (field.classList.contains("invalid")) validateField(field);
  });
  field.addEventListener("blur", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Object.keys(validators).map((name) => contactForm.elements[name]);
  const invalid = fields.filter((field) => !validateField(field));
  if (invalid.length) {
    formStatus.style.color = "#f87171";
    formStatus.textContent = "Please fix the highlighted fields.";
    invalid[0].focus();
    return;
  }

  const data = new FormData(contactForm);
  const subject = encodeURIComponent("Portfolio message from " + data.get("name"));
  const body = encodeURIComponent("Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\n\n" + data.get("message"));
  formStatus.style.color = "#34d399";
  formStatus.textContent = "Your email app will open with the message ready to send.";
  window.location.href = "mailto:adinishad452@gmail.com?subject=" + subject + "&body=" + body;
});

const cursorBlob = document.getElementById("cursorBlob");
const cursorDot = document.getElementById("cursorDot");
if (cursorBlob && cursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.body.classList.add("cursor-live");
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let blobX = targetX;
  let blobY = targetY;
  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorDot.style.transform = "translate3d(" + targetX + "px," + targetY + "px,0)";
  }, { passive: true });
  (function followCursor() {
    blobX += (targetX - blobX) * 0.14;
    blobY += (targetY - blobY) * 0.14;
    cursorBlob.style.transform = "translate3d(" + blobX.toFixed(2) + "px," + blobY.toFixed(2) + "px,0)";
    requestAnimationFrame(followCursor);
  })();
}

document.querySelectorAll(".btn, .icon-btn, .hero-socials a").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || reducedMotion.matches) return;
    const rect = element.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--mag-x", (relX * 9).toFixed(2) + "px");
    element.style.setProperty("--mag-y", (relY * 9).toFixed(2) + "px");
  });
  element.addEventListener("pointerleave", () => {
    element.style.removeProperty("--mag-x");
    element.style.removeProperty("--mag-y");
  });
});

function ordinal(value) {
  const words = ["th", "st", "nd", "rd"];
  const lastTwo = value % 100;
  return value + (words[(lastTwo - 20) % 10] || words[lastTwo] || words[0]);
}

function runCounter(element) {
  const target = Number(element.dataset.count) || 0;
  const pad = Number(element.dataset.pad) || 0;
  const suffix = element.dataset.suffix;
  const finalText = suffix ? ordinal(target) : String(target).padStart(pad, "0");
  if (reducedMotion.matches) {
    element.textContent = finalText;
    return;
  }
  const duration = 1300;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = suffix ? ordinal(value) : String(value).padStart(pad, "0");
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = finalText;
    }
  }
  requestAnimationFrame(tick);
}

const counters = Array.from(document.querySelectorAll(".stat strong[data-count]"));
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  counters.forEach((element) => counterObserver.observe(element));
} else {
  counters.forEach(runCounter);
}
