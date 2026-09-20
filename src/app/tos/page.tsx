import { SITE } from "@/lib/site";

export const metadata = { title: `Terms of Service | ${SITE.name}` };

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Digital products",
    body: "All items sold on this store are digital goods delivered electronically. Delivery is considered complete when the product (gift link, account credentials or applied boost) has been provided to you or applied to the server you specified.",
  },
  {
    title: "2. Payments",
    body: "Payments are processed by Stripe. We do not store card details. Prices are shown in USD unless stated otherwise and may change at any time without notice.",
  },
  {
    title: "3. Refunds & replacements",
    body: "Because our products are digital, all sales are final once delivered. If a product is defective on arrival we will replace it free of charge, provided you contact support within 24 hours of delivery. Chargebacks filed without contacting support first will result in a permanent ban.",
  },
  {
    title: "4. Warranty",
    body: "Products carry a replacement warranty for the duration stated on the product page (1 or 3 months). The warranty does not cover misuse, violations of Discord's Terms of Service, or actions taken after delivery that compromise the product.",
  },
  {
    title: "5. Your responsibilities",
    body: "You must provide accurate delivery information (e.g. Discord username or server invite). We are not responsible for orders delivered to incorrect details that you supplied. You agree to use purchased products in accordance with Discord's Terms of Service.",
  },
  {
    title: "6. Support",
    body: `Support is provided through our Discord server and by email at ${SITE.supportEmail}. Response times are typically within minutes but are not guaranteed.`,
  },
  {
    title: "7. Affiliation",
    body: `${SITE.name} is an independent store and is not affiliated with, endorsed by or sponsored by Discord Inc.`,
  },
];

export default function TosPage() {
  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-3xl">
        <div className="section-label">Legal</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted">By purchasing from {SITE.name} you agree to the following terms.</p>
        <div className="mt-10 space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="card p-6">
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
