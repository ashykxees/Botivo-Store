import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CircleCheck, CreditCard, Headset, Lock, ShieldCheck, Star, Zap } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import Faq from "@/components/Faq";
import DiscordIcon from "@/components/DiscordIcon";

export const revalidate = 300;

const STATS = [
  { value: "5.0", label: "Rating", icon: Star },
  { value: "99.9%", label: "Uptime", icon: ShieldCheck },
  { value: "1K+", label: "Servers Boosted", icon: Zap },
  { value: "2K+", label: "Happy Clients", icon: CircleCheck },
];

const STEPS = [
  {
    n: "01",
    title: "Choose a product",
    text: "Pick Nitro Tokens, Discord Nitro or Server Boosts and select a 1 or 3 month plan.",
  },
  {
    n: "02",
    title: "Pay with Stripe",
    text: "Secure checkout with card, Apple Pay, Google Pay and more. We never see your card details.",
  },
  {
    n: "03",
    title: "Receive instantly",
    text: "Your order is delivered right after payment. Need a hand? Open a ticket in our Discord.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Instant delivery", text: "Orders are processed automatically the moment Stripe confirms your payment." },
  { icon: Lock, title: "Secure checkout", text: "Payments run through Stripe — PCI compliant, 3D Secure ready, no card data touches our servers." },
  { icon: ShieldCheck, title: "Replacement warranty", text: "If anything doesn't work as described, we replace it free of charge. No arguments." },
  { icon: CreditCard, title: "Best prices", text: "Competitive pricing on every product with bigger savings on 3-month plans." },
  { icon: Headset, title: "24/7 support", text: "Real humans in our Discord ticket system, usually replying within minutes." },
  { icon: CircleCheck, title: "No Discord login", text: "We never ask for your password. Nitro is delivered via gift link or applied to a server you choose." },
];

const FAQ = [
  {
    q: "How fast is the delivery?",
    a: "Orders are delivered automatically right after Stripe confirms your payment. You'll see your order details on the confirmation page and receive a Stripe receipt by email. Boosts and Nitro gifts are typically applied within minutes.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All payments are processed by Stripe. That means credit and debit cards, Apple Pay, Google Pay, Link and other local methods enabled in your region.",
  },
  {
    q: "Are the products safe to use?",
    a: "Yes. Every product is tested before listing and we only work with trusted sources. Our replacement warranty covers you if anything goes wrong.",
  },
  {
    q: "Do you offer refunds?",
    a: "Digital products are non-refundable once delivered. If you receive a defective product, we offer free replacements — just open a ticket in our Discord within 24 hours.",
  },
  {
    q: "Do I need to give you my Discord login?",
    a: "Never. Nitro is delivered as a gift link you redeem yourself. Boosts are applied to a server invite you provide. Nitro tokens are separate accounts delivered to you.",
  },
  {
    q: "How can I contact support?",
    a: `Join our Discord and open a ticket for the fastest response, or email ${SITE.supportEmail}. We usually reply within minutes.`,
  },
];

export default async function Home() {
  const products = await getCatalog();

  return (
    <>
      {/* Hero */}
      <section className="container-x pb-12 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="pill anim-fade-up delay-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All services are operational
            </div>
            <h1 className="anim-fade-up delay-200 text-[38px] font-black leading-[1.02] tracking-tight sm:text-[54px] lg:text-[60px]">
              Premium Discord,
              <br />
              <span className="gradient-text">delivered in seconds.</span>
            </h1>
            <p className="anim-fade-up delay-300 mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
              Nitro, tokens and server boosts at the best price — instant delivery, secure Stripe checkout, and every
              order backed by our replacement warranty.
            </p>
            <div className="anim-fade-up delay-400 mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/#products" className="btn-primary">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <DiscordIcon className="h-4 w-4" /> Join Discord
              </a>
            </div>
            <div className="anim-fade-up delay-500 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
              {["Instant delivery", "No Discord login", "Replacement warranty"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <CircleCheck className="h-3.5 w-3.5 text-brand" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="anim-fade-up delay-300 relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand/20 blur-3xl" />
            <div className="card anim-float relative overflow-hidden p-2">
              <Image
                src="/banner.png"
                alt={`${SITE.name} banner`}
                width={1568}
                height={896}
                priority
                className="rounded-2xl"
              />
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live &amp; delivering
                </div>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 5.0 avg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 flex justify-center">
          <div className="card flex divide-x divide-white/[0.07] overflow-x-auto">
            {STATS.map((s) => (
              <div key={s.label} className="flex shrink-0 flex-col items-center px-6 py-4 text-center sm:px-9">
                <span className="text-2xl font-black leading-none sm:text-[28px]">{s.value}</span>
                <span className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-2">
                  <s.icon className="h-3 w-3" /> {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container-x scroll-mt-24 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-label">✦ Products</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Pick your upgrade</h2>
          <p className="mt-3 text-muted">
            Choose a 1 or 3 month plan, set your quantity and check out securely with Stripe.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-label">✦ Simple process</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">From checkout to delivery in under a minute</h2>
          <p className="mt-3 text-muted">Three steps, zero friction. No accounts, no waiting rooms.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card card-hover p-6">
              <div className="gradient-text text-4xl font-black">{s.n}</div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-x scroll-mt-24 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-label">✦ Why Botivo</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Built for speed, backed by support</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x scroll-mt-24 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="section-label">✦ FAQ</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-muted">Everything you need to know before you buy. Still stuck? Support is live on Discord around the clock.</p>
            <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6">
              <DiscordIcon className="h-4 w-4" /> Ask on Discord
            </a>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pt-8">
        <div className="card relative overflow-hidden p-8 text-center sm:p-14">
          <div className="hero-glow absolute inset-0" />
          <div className="relative">
            <div className="section-label">Ready when you are</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Upgrade your Discord experience today.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Instant delivery, secure checkout, and support that actually replies. Pick a product, check out, and
              you&apos;re done in under a minute.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/#products" className="btn-primary">
                Shop products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <DiscordIcon className="h-4 w-4" /> Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
