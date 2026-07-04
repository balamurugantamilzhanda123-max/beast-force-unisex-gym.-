import { addRecord } from "./firebase-service.js";
import { emailJsConfig, isEmailJsConfigured } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscriptionForm");
  const status = document.getElementById("subscriptionStatus");
  if (!form) return;

  if (window.emailjs && isEmailJsConfigured) {
    emailjs.init({ publicKey: emailJsConfig.publicKey });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Creating membership confirmation...";

    const payload = Object.fromEntries(new FormData(form).entries());
    const confirmationId = `BF-${Date.now().toString().slice(-8)}`;
    const member = {
      ...payload,
      confirmationId,
      status: "pending",
      paymentStatus: "pending"
    };

    try {
      await addRecord("members", member);
      await sendConfirmationEmail(member);
      window.location.href = `success.html?id=${encodeURIComponent(confirmationId)}`;
    } catch (error) {
      status.textContent = "Subscription saved locally failed. Please try again or contact the gym.";
      console.error(error);
    }
  });
});

async function sendConfirmationEmail(member) {
  if (!window.emailjs || !isEmailJsConfigured) {
    console.info("EmailJS is not configured. Skipping confirmation email.", member);
    return;
  }

  await emailjs.send(
    emailJsConfig.serviceId,
    emailJsConfig.subscriptionTemplateId,
    {
      to_name: member.fullName,
      to_email: member.email,
      selected_plan: member.selectedPlan,
      confirmation_id: member.confirmationId,
      gym_name: "BEAST FORCE UNISEX GYM"
    }
  );
}
