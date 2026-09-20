import Link from "next/link";
import { ArrowLeft, CircleX } from "lucide-react";
import { SITE } from "@/lib/site";
import DiscordIcon from "@/components/DiscordIcon";

export const metadata = { title: `Checkout cancelled | ${SITE.name}` };

export default function CancelPage() {
  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
          <CircleX className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-muted">No payment was taken. You can go back and try again whenever you&apos;re ready.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/#products" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>
          <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <DiscordIcon className="h-4 w-4" /> Need help?
          </a>
        </div>
      </div>
    </section>
  );
}
