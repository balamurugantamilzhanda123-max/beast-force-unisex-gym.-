import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/config";

export default function ContactPage() {
  return (
    <main className="dashboard-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">Contact</span>
          <h1 className="section-title">Visit The Gym</h1>
          <p className="muted">{siteConfig.address}</p>
          <p className="muted">{siteConfig.phone}</p>
          <p className="muted">{siteConfig.email}</p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
