import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import DiscordIcon from "./DiscordIcon";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-bg-2/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt={SITE.name} width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight">
              Boti<span className="text-brand">vo</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Your trusted source for premium Discord services — instant delivery, competitive pricing, and support that
            actually replies.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All systems operational
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/#products" className="hover:text-white">Products</Link></li>
            <li><Link href="/#features" className="hover:text-white">Features</Link></li>
            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/tos" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Support</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <DiscordIcon className="h-4 w-4 text-[#5865F2]" /> Join our Discord
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.supportEmail}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-brand" /> {SITE.supportEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-2 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Not affiliated with Discord Inc. Payments secured by Stripe.</span>
        </div>
      </div>
    </footer>
  );
}
