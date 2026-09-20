"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import DiscordIcon from "./DiscordIcon";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
  { href: "/tos", label: "Terms" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4 sm:px-4">
      <div className="glass flex h-[60px] w-full max-w-6xl items-center gap-3 rounded-2xl px-3 sm:px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt={SITE.name}
            width={34}
            height={34}
            priority
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-base font-extrabold tracking-tight">
            Boti<span className="text-brand">vo</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 rounded-xl border border-white/5 bg-white/[0.03] p-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-brand/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3.5 !py-2 text-[13px]">
            <DiscordIcon className="h-4 w-4" /> Discord
          </a>
          <Link href="/#products" className="btn-primary !px-4 !py-2 text-[13px]">
            Shop Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted lg:hidden"
        >
          {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {open && (
        <div className="glass absolute inset-x-3 top-[84px] rounded-2xl p-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-brand/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
                <DiscordIcon className="h-4 w-4" /> Discord
              </a>
              <Link href="/#products" onClick={() => setOpen(false)} className="btn-primary flex-1">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
