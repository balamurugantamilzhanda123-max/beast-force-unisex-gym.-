import { siteConfig } from "@/lib/config";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${siteConfig.whatsapp}?text=I%20want%20to%20join%20Beast%20Force%20Gym`}
      target="_blank"
      rel="noreferrer"
    >
      WhatsApp
    </a>
  );
}
