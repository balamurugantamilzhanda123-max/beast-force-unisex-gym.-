import { defaultData, getCollection, addRecord } from "./firebase-service.js";

let plans = defaultData.plans;

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener("load", () => {
  setTimeout(() => qs("#loader")?.classList.add("hidden"), 450);
});

document.addEventListener("DOMContentLoaded", async () => {
  qs("#year").textContent = new Date().getFullYear();
  setupNavigation();
  setupTheme();
  setupScrollUi();
  await renderDynamicContent();
  setupContactForm();
  setupLightbox();
  setupFaq();
});

function setupNavigation() {
  const menuToggle = qs("#menuToggle");
  const nav = qs("#navMenu");
  menuToggle?.addEventListener("click", () => nav.classList.toggle("open"));
  qsa(".nav a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
}

function setupTheme() {
  const toggle = qs("#themeToggle");
  const saved = localStorage.getItem("beastForce:theme");
  if (saved === "light") document.body.classList.add("light-mode");
  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("beastForce:theme", document.body.classList.contains("light-mode") ? "light" : "dark");
  });
}

function setupScrollUi() {
  const progress = qs("#scrollProgress");
  const header = qs("#siteHeader");
  const backTop = qs("#backTop");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${Math.max(0, scrollY / max) * 100}%`;
    header.classList.toggle("scrolled", scrollY > 40);
    backTop.classList.toggle("visible", scrollY > 700);
  }, { passive: true });
  backTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

async function renderDynamicContent() {
  plans = await getCollection("membershipPlans", defaultData.plans);
  const trainers = await getCollection("trainers", defaultData.trainers);
  const amenities = await getCollection("amenities", defaultData.amenities);
  const gallery = await getCollection("gallery", defaultData.gallery);

  renderPlans(plans);
  renderSubscriptionOptions(plans);
  renderTrainers(trainers);
  renderAmenities(amenities);
  renderGallery(gallery);
  renderTestimonials(defaultData.testimonials);
  renderFaq(defaultData.faq);
}

function renderPlans(items) {
  qs("#pricingGrid").innerHTML = items.map((plan, index) => `
    <article class="pricing-card ${plan.featured || index === 2 ? "featured" : ""}" data-aos="fade-up" data-aos-delay="${index * 80}">
      <h3>${plan.name}</h3>
      <div class="price">${plan.price}</div>
      <ul>${(plan.benefits || []).map((benefit) => `<li>${benefit}</li>`).join("")}</ul>
      <button class="btn primary open-subscribe" data-plan="${plan.name}">Buy Now</button>
    </article>
  `).join("");
  qsa(".open-subscribe").forEach((button) => button.addEventListener("click", openSubscription));
}

function renderSubscriptionOptions(items) {
  const select = qs("#selectedPlan");
  if (!select) return;
  select.innerHTML = items.map((plan) => `<option value="${plan.name}">${plan.name} - ${plan.price}</option>`).join("");
}

function renderTrainers(items) {
  qs("#trainerGrid").innerHTML = items.map((trainer, index) => `
    <article class="trainer-card" data-aos="fade-up" data-aos-delay="${index * 100}">
      <img loading="lazy" src="${trainer.photo}" alt="${trainer.name}, ${trainer.role}">
      <div>
        <span>${trainer.role}</span>
        <h3>${trainer.name}</h3>
        <p><strong>${trainer.experience}</strong> | ${trainer.specialization}</p>
        <p>${trainer.intro || "Focused coaching for stronger, safer progress."}</p>
      </div>
    </article>
  `).join("");
}

function renderAmenities(items) {
  qs("#amenityGrid").innerHTML = items.map((item, index) => `
    <article class="amenity-card" data-aos="zoom-in" data-aos-delay="${(index % 5) * 50}">
      <i class="${item.icon}"></i>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </article>
  `).join("");
}

function renderGallery(items) {
  qs("#galleryGrid").innerHTML = items.map((item, index) => `
    <button class="gallery-item" data-full="${item.url}" data-aos="fade-up" data-aos-delay="${(index % 3) * 80}">
      <img loading="lazy" src="${item.url}" alt="${item.caption}">
      <span>${item.caption}</span>
    </button>
  `).join("");
}

function renderTestimonials(items) {
  qs("#testimonialSlides").innerHTML = items.map((item) => `
    <div class="swiper-slide testimonial-card">
      <p>"${item.text}"</p>
      <strong>${item.name}</strong>
    </div>
  `).join("");
  if (window.Swiper) {
    new Swiper(".testimonial-swiper", {
      loop: true,
      autoplay: { delay: 3200 },
      pagination: { el: ".swiper-pagination", clickable: true }
    });
  }
}

function renderFaq(items) {
  qs("#faqList").innerHTML = items.map((item) => `
    <article class="faq-item">
      <button type="button">${item.question}<i class="fa-solid fa-plus"></i></button>
      <div class="faq-answer">${item.answer}</div>
    </article>
  `).join("");
}

function setupFaq() {
  qs("#faqList")?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
    button.querySelector("i").className = item.classList.contains("open") ? "fa-solid fa-minus" : "fa-solid fa-plus";
  });
}

function setupContactForm() {
  qs("#contactForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = qs("#contactStatus");
    const payload = Object.fromEntries(new FormData(form).entries());
    await addRecord("contactMessages", payload);
    status.textContent = "Message sent. Our team will contact you soon.";
    form.reset();
  });
}

function openSubscription(event) {
  const modal = qs("#subscriptionModal");
  const selected = event.currentTarget.dataset.plan;
  qs("#selectedPlan").value = selected || plans[0]?.name;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

qs("#closeSubscription")?.addEventListener("click", closeSubscription);
qs("#subscriptionModal")?.addEventListener("click", (event) => {
  if (event.target.id === "subscriptionModal") closeSubscription();
});

function closeSubscription() {
  const modal = qs("#subscriptionModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function setupLightbox() {
  const lightbox = qs("#lightbox");
  const image = qs("#lightboxImage");
  qs("#galleryGrid")?.addEventListener("click", (event) => {
    const item = event.target.closest(".gallery-item");
    if (!item) return;
    image.src = item.dataset.full;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
  qs("#closeLightbox")?.addEventListener("click", () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    image.src = "";
  });
}
