/* --- 1. TYPING ANIMATION --- */
const typingEl = document.getElementById("typing");
const roles = [
  "Full Stack & ML Developer",
  "Aspiring Software Engineer",
  "Deep Learning Enthusiast",
  "Problem Solver",
];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!reduceMotion) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const current = roles[roleIndex];
    charIndex += isDeleting ? -1 : 1;
    typingEl.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? 45 : 90;
    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  };
  typingEl.textContent = "";
  setTimeout(type, 600);
}

/* --- 2. TIME-BASED GREETING --- */
(function updateGreeting() {
  const el = document.getElementById("greeting-tag");
  const hour = new Date().getHours();
  let text = "Good Evening";
  if (hour >= 5 && hour < 12) text = "Good Morning";
  else if (hour >= 12 && hour < 17) text = "Good Afternoon";
  el.textContent = `<${text} />`;
})();

/* --- 3. MOBILE MENU --- */
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");

function setMenu(open) {
  navLinks.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuBtn.querySelector("i").className = open ? "fas fa-xmark" : "fas fa-bars";
}
menuBtn.addEventListener("click", () =>
  setMenu(!navLinks.classList.contains("active")),
);
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => setMenu(false)),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* --- 4. HIGHLIGHT ACTIVE NAV LINK ON SCROLL --- */
const sections = document.querySelectorAll("section[id], footer[id]");
const links = document.querySelectorAll(".nav-links a");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => observer.observe(s));

/* --- 5. MATRIX RAIN BACKGROUND (subtle) --- */
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");
const glyphs = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const fontSize = 14;
let drops = [];
const root = document.documentElement;
let rain = { fade: "rgba(11, 12, 16, 0.05)", dim: "#45a29e", bright: "#66fcf1" };

function readTheme() {
  const light = root.getAttribute("data-theme") === "light";
  rain = light
    ? { fade: "rgba(250, 247, 241, 0.09)", dim: "#1f3a5f", bright: "#b8892b" }
    : { fade: "rgba(11, 12, 16, 0.05)", dim: "#45a29e", bright: "#66fcf1" };
}
readTheme();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawMatrix() {
  ctx.fillStyle = rain.fade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
    ctx.fillStyle = Math.random() > 0.95 ? rain.bright : rain.dim;
    ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let timer = null;
function startRain() {
  if (!timer && !reduceMotion) timer = setInterval(drawMatrix, 40);
}
function stopRain() {
  clearInterval(timer);
  timer = null;
}
document.addEventListener("visibilitychange", () =>
  document.hidden ? stopRain() : startRain(),
);
startRain();

/* --- 6. DARK / LIGHT TOGGLE (dark by default) --- */
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode",
  );
  readTheme();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "light" ? "#faf7f1" : "#0b0c10";
}
applyTheme(root.getAttribute("data-theme") || "dark");

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

/* --- 7. SCROLL PROGRESS BAR --- */
const progress = document.getElementById("progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* --- 8. COUNT-UP NUMBERS IN THE FACTS BAR --- */
const counters = document.querySelectorAll("[data-count]");
if (!reduceMotion && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || "0", 10);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (end * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => {
    el.textContent = (0).toFixed(parseInt(el.dataset.decimals || "0", 10));
    countObserver.observe(el);
  });
}

/* --- 9. GLITCH TEXT: copy text into each highlight, stagger the timing --- */
document.querySelectorAll(".hl").forEach((el, i) => {
  el.dataset.text = el.textContent.trim();
  el.style.setProperty("--gd", `${((i * 0.9) % 4.5).toFixed(1)}s`);
});

/* --- 10. FLIP CARDS (click, tap, Enter/Space on the button, Esc to go back) --- */
document.querySelectorAll(".flip-card").forEach((card) => {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");

  function setFlipped(flipped, moveFocus = true) {
    card.classList.toggle("is-flipped", flipped);
    // the hidden side must not be reachable by keyboard or screen readers
    front.inert = flipped;
    back.inert = !flipped;
    const target = (flipped ? back : front).querySelector(".flip-btn");
    if (moveFocus && target) target.focus({ preventScroll: true });
  }
  setFlipped(false, false);

  card.querySelectorAll(".flip-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setFlipped(!card.classList.contains("is-flipped"));
    }),
  );

  // mouse/touch users can also tap the front of the card (links keep working)
  front.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    setFlipped(true);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && card.classList.contains("is-flipped")) setFlipped(false);
  });
});

/* --- 11. PROJECT FILTERS --- */
(function () {
  const buttons = document.querySelectorAll(".filter");
  const items = document.querySelectorAll(".card-grid > [data-tags]");
  const count = document.getElementById("filterCount");
  function apply(tag) {
    let shown = 0;
    items.forEach((el) => {
      const match = tag === "all" || el.dataset.tags.split(" ").includes(tag);
      el.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((b) => {
      const on = b.dataset.filter === tag;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    count.textContent = `Showing ${shown} of ${items.length} projects`;
  }
  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
  apply("all");
})();

/* --- 12. DOG ANIMATION TOGGLE --- */
(function () {
  const btn = document.getElementById("dogToggle");
  const dog = document.getElementById("dog");
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    btn.lastChild.textContent = on ? " on" : " off";
    dog.classList.toggle("paused", !on);
  });
})();
