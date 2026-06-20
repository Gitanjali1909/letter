"use client";

import Link from "next/link";

export function FloatingNav() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      
      <Link
        href="/"
        className="rounded-full bg-[#fffaf0]/80 backdrop-blur px-4 py-2 text-sm text-[#5b4636] shadow-[0_10px_30px_-12px_rgba(92,64,38,0.35)] hover:bg-[#fffaf0] transition-colors"
      >
        Home
      </Link>

      <Link
        href="/editor/new"
        className="rounded-full bg-[#3b2f25] px-4 py-2 text-sm text-[#fbf6ec] shadow-[0_10px_30px_-12px_rgba(59,47,37,0.45)] hover:bg-[#574536] transition-colors"
      >
        New Letter
      </Link>

    </div>
  );
}