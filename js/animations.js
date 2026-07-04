document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({
      duration: 850,
      once: true,
      offset: 80
    });
  }

  if (window.gsap) {
    gsap.from(".brand", { y: -16, opacity: 0, duration: 0.7, ease: "power2.out" });
    gsap.to(".hero-bg", {
      yPercent: 6,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  const counters = document.querySelectorAll(".counter");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
});

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}${target >= 70 ? "+" : ""}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
