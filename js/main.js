/* Pittura Group — interactions & effects */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    const bar = preloader.querySelector(".preloader-bar span");
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + Math.random() * 22, 92);
      if (bar) bar.style.width = p + "%";
    }, 120);
    window.addEventListener("load", () => {
      clearInterval(tick);
      if (bar) bar.style.width = "100%";
      setTimeout(() => preloader.classList.add("done"), 350);
    });
    // Safety: never trap the user behind the loader
    setTimeout(() => preloader.classList.add("done"), 3500);
  }

  /* ---------- Nav ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
      document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && !reduceMotion && matchMedia("(hover: hover)").matches) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .card, .work-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }

  /* ---------- Aurora canvas (hero) ---------- */
  const canvas = document.getElementById("aurora");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const blobs = [
      { c: [124, 58, 237], r: 0.42, sx: 0.00021, sy: 0.00017, px: 0.25, py: 0.35 },
      { c: [236, 72, 153], r: 0.38, sx: 0.00017, sy: 0.00023, px: 0.7, py: 0.3 },
      { c: [245, 158, 11], r: 0.33, sx: 0.00024, sy: 0.00015, px: 0.55, py: 0.75 },
      { c: [59, 130, 246], r: 0.28, sx: 0.00013, sy: 0.0002, px: 0.15, py: 0.8 },
    ];
    let w, h;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    let pointerX = 0.5, pointerY = 0.5;
    document.addEventListener("mousemove", (e) => {
      pointerX = e.clientX / window.innerWidth;
      pointerY = e.clientY / window.innerHeight;
    });
    (function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      blobs.forEach((b, i) => {
        const ox = Math.sin(t * b.sx + i * 2) * 0.18 + (pointerX - 0.5) * 0.06;
        const oy = Math.cos(t * b.sy + i * 3) * 0.16 + (pointerY - 0.5) * 0.06;
        const x = (b.px + ox) * w;
        const y = (b.py + oy) * h;
        const r = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.22)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })(0);
  }

  /* ---------- Scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dur = 1800;
        const start = performance.now();
        (function step(now) {
          const k = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (k < 1) requestAnimationFrame(step);
        })(start);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  /* ---------- Card spotlight + 3D tilt ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (reduceMotion || !card.classList.contains("tilt")) return;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- FAQ accordions ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Work filters ---------- */
  const filterBtns = document.querySelectorAll("[data-filter]");
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        document.querySelectorAll(".work-card[data-cat]").forEach((card) => {
          const show = f === "all" || card.dataset.cat === f;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (form.querySelector("#name") || {}).value || "";
      const email = (form.querySelector("#email") || {}).value || "";
      const service = (form.querySelector("#service") || {}).value || "";
      const budget = (form.querySelector("#budget") || {}).value || "";
      const message = (form.querySelector("#message") || {}).value || "";
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\n${message}`
      );
      window.location.href = `mailto:hello@pitturagroup.com?subject=${encodeURIComponent(
        "Project inquiry — " + name
      )}&body=${body}`;
      const success = document.querySelector(".form-success");
      if (success) success.classList.add("show");
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
