"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`card transition-colors ${isOpen ? "border-brand/30" : ""}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-xs font-bold text-brand-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-sm font-semibold sm:text-base">{item.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-5 pb-5 pl-[52px] text-sm leading-relaxed text-muted">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
