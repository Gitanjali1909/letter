import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfce]/70 bg-[#fffaf2]/75 shadow-[0_10px_34px_rgba(92,64,38,0.07)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-[0.02em] text-[#4b3528]"
        >
          LetterSpace
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/explore"
            className="text-sm font-medium text-[#725746] transition hover:text-[#4b3528]"
          >
            Explore
          </Link>
          <Link
            href="/editor/new"
            className="rounded-full bg-[#7d4f3a] px-5 py-2.5 text-sm font-semibold text-[#fffaf2] shadow-[0_12px_26px_rgba(125,79,58,0.18)] transition hover:-translate-y-0.5 hover:bg-[#6d4432]"
          >
            Create Letter
          </Link>
        </div>
      </nav>
    </header>
  );
}
