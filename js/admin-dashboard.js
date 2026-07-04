import {
  firebase,
  isFirebaseConfigured,
  adminAllowlist,
  onAuthStateChanged,
  signOut
} from "./firebase-config.js";
import {
  defaultData,
  getCollection,
  addRecord,
  setRecord,
  removeRecord
} from "./firebase-service.js";

let members = [];
let plans = [];

document.addEventListener("DOMContentLoaded", async () => {
  await guardAdmin();
  await loadDashboard();
  bindAdminForms();
});

async function guardAdmin() {
  if (!isFirebaseConfigured) {
    if (!localStorage.getItem("beastForce:demoAdmin")) {
      localStorage.setItem("beastForce:demoAdmin", "demo-admin@beastforce.local");
    }
    return;
  }

  return new Promise((resolve) => {
    onAuthStateChanged(firebase.auth, (user) => {
      if (!user || !adminAllowlist.includes(user.email)) {
        window.location.href = "admin-login.html";
        return;
      }
      resolve();
    });
  });
}

async function loadDashboard() {
  members = await getCollection("members", []);
  plans = await getCollection("membershipPlans", defaultData.plans);
  const messages = await getCollection("contactMessages", []);

  renderMetrics();
  renderMembers();
  renderPlans();
  renderMessages(messages);
}

function renderMetrics() {
  const active = members.filter((member) => member.status === "active").length;
  const expired = members.filter((member) => member.status === "expired").length;
  const revenue = members.reduce((sum, member) => {
    const plan = plans.find((item) => item.name === member.selectedPlan);
    const value = Number(String(plan?.price || "").replace(/[^\d]/g, ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  setText("totalMembers", members.length);
  setText("activeMembers", active);
  setText("expiredMembers", expired);
  setText("revenueSummary", `₹${revenue.toLocaleString("en-IN")}`);
  setText("analyticsSummary", `${plans.length} plans tracked. ${active} active members. ${members.length} total registrations loaded.`);

  document.getElementById("recentMembers").innerHTML = members.slice(0, 6).map((member) => `
    <tr>
      <td>${member.fullName || "-"}</td>
      <td>${member.selectedPlan || "-"}</td>
      <td>${member.phone || "-"}</td>
      <td>${member.status || "pending"}</td>
      <td>${formatDate(member.createdAt)}</td>
    </tr>
  `).join("") || emptyRow(5);
}

function renderMembers(filter = "") {
  const normalized = filter.toLowerCase();
  const rows = members.filter((member) => JSON.stringify(member).toLowerCase().includes(normalized));
  document.getElementById("membersTable").innerHTML = rows.map((member) => `
    <tr>
      <td>${member.fullName || "-"}</td>
      <td>${member.email || "-"}</td>
      <td>${member.selectedPlan || "-"}</td>
      <td>${member.paymentMethod || "-"}</td>
      <td>
        <div class="row-actions">
          <button data-edit-member="${member.id}">Edit</button>
          <button data-delete-member="${member.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("") || emptyRow(5);
}

function renderPlans() {
  document.getElementById("adminPlans").innerHTML = plans.map((plan) => `
    <article class="mini-item">
      <strong>${plan.name}</strong>
      <p>${plan.price}</p>
      <small>${(plan.benefits || []).join(", ")}</small>
      <div class="row-actions">
        <button data-edit-plan="${plan.id}">Edit</button>
      </div>
    </article>
  `).join("");
}

function renderMessages(messages) {
  document.getElementById("messagesList").innerHTML = messages.map((message) => `
    <article class="mini-item">
      <strong>${message.name || "Website Visitor"}</strong>
      <p>${message.message || ""}</p>
      <small>${message.email || ""} ${message.phone || ""}</small>
    </article>
  `).join("") || `<p class="mini-item">No messages yet.</p>`;
}

function bindAdminForms() {
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    if (isFirebaseConfigured) await signOut(firebase.auth);
    localStorage.removeItem("beastForce:demoAdmin");
    window.location.href = "admin-login.html";
  });

  document.getElementById("memberSearch")?.addEventListener("input", (event) => renderMembers(event.target.value));

  document.getElementById("seedMemberBtn")?.addEventListener("click", async () => {
    await addRecord("members", {
      fullName: "Demo Member",
      email: "member@example.com",
      phone: "+91 90000 00000",
      selectedPlan: "Monthly",
      paymentMethod: "Pay at Gym",
      status: "active",
      paymentStatus: "paid",
      confirmationId: `BF-${Date.now().toString().slice(-8)}`
    });
    await loadDashboard();
  });

  document.getElementById("memberForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const id = data.id || `member-${Date.now()}`;
    delete data.id;
    await setRecord("members", id, { id, ...data });
    event.currentTarget.reset();
    await loadDashboard();
  });

  document.getElementById("membersTable")?.addEventListener("click", async (event) => {
    const editId = event.target.dataset.editMember;
    const deleteId = event.target.dataset.deleteMember;
    if (editId) fillForm("memberForm", members.find((member) => member.id === editId));
    if (deleteId) {
      await removeRecord("members", deleteId);
      await loadDashboard();
    }
  });

  document.getElementById("planForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const id = data.id || data.name.toLowerCase().replace(/\s+/g, "-");
    const plan = {
      id,
      name: data.name,
      price: data.price,
      benefits: data.benefits.split("\n").map((item) => item.trim()).filter(Boolean)
    };
    await setRecord("membershipPlans", id, plan);
    event.currentTarget.reset();
    await loadDashboard();
  });

  document.getElementById("adminPlans")?.addEventListener("click", (event) => {
    const id = event.target.dataset.editPlan;
    if (!id) return;
    const plan = plans.find((item) => item.id === id);
    fillForm("planForm", { ...plan, benefits: (plan.benefits || []).join("\n") });
  });

  bindSimpleAdd("trainerForm", "trainers");
  bindSimpleAdd("amenityForm", "amenities");
  bindSimpleAdd("galleryForm", "gallery");
  bindSimpleAdd("settingsForm", "settings", "contact");

  document.getElementById("promoForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    await addRecord("promotions", payload);
    document.getElementById("promoStatus").textContent = "Promotion queued. Connect EmailJS/backend sender for delivery.";
    event.currentTarget.reset();
  });
}

function bindSimpleAdd(formId, collection, fixedId = null) {
  document.getElementById(formId)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (fixedId) await setRecord(collection, fixedId, data);
    else await addRecord(collection, data);
    event.currentTarget.reset();
  });
}

function fillForm(formId, data = {}) {
  const form = document.getElementById(formId);
  Object.entries(data).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) input.value = value;
  });
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function formatDate(value) {
  if (!value) return "-";
  if (typeof value === "string") return new Date(value).toLocaleDateString();
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleDateString();
  return "-";
}

function emptyRow(columns) {
  return `<tr><td colspan="${columns}">No records yet.</td></tr>`;
}
