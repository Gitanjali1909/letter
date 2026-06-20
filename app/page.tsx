import Link from "next/link";

export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6 py-20 bg-[#fdf6ec]">
      
      <div
        className="pointer-events-none absolute right-6 top-24 hidden w-72 rotate-6 rounded-[14px_18px_12px_20px] bg-[#fffaf0] p-6 shadow-[0_20px_60px_-20px_rgba(122,90,68,0.35)] md:block"
        style={{ fontFamily: '"Caveat", cursive' }}
        aria-hidden
      >
        <p className="text-sm text-[#7a5a44]">Sunday, 4:12pm</p>
        <p className="mt-3 text-2xl leading-snug text-[#3b2f25]">
          Dearest June, <br />
          I found the letter you tucked into my coat pocket last winter…
        </p>
        <div className="mt-6 h-px bg-[#e8dcc4]" />
        <p className="mt-3 text-right text-xl text-[#a8745a]">— with love</p>
      </div>

      <div
        className="pointer-events-none absolute left-6 bottom-16 hidden w-56 -rotate-3 rounded-[18px_12px_20px_14px] bg-[#f6e6d6] p-5 shadow-[0_16px_40px_-18px_rgba(122,90,68,0.35)] lg:block"
        style={{ fontFamily: '"Caveat", cursive' }}
        aria-hidden
      >
        <p className="text-xl leading-snug text-[#5b4636]">
          p.s. the tea you sent still smells like home.
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e8dcc4] bg-[#fffaf0]/70 px-3 py-1 text-xs text-[#7a5a44] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c98a74]" />
          A quieter way to write
        </span>

        <h1
          className="mt-6 text-5xl leading-[1.05] text-[#2f2418] sm:text-6xl"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          Write letters that{" "}
          <em className="italic text-[#a8745a]">feel alive.</em>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#5b4636] sm:text-lg">
          A collaborative digital space for emotional, handwritten-style letters.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/editor/new"
            className="rounded-full bg-[#3b2f25] px-6 py-3 text-sm font-medium text-[#fbf6ec] shadow-[0_10px_30px_-12px_rgba(59,47,37,0.5)] hover:bg-[#574536] transition-colors"
          >
            Start Writing
          </Link>

          <Link
            href="/explore"
            className="rounded-full border border-[#cbb89a] bg-[#fffaf0]/70 px-6 py-3 text-sm font-medium text-[#5b4636] backdrop-blur hover:bg-[#fffaf0] transition-colors"
          >
            Explore Letters
          </Link>
        </div>

        <p
          className="mt-10 text-xl text-[#a8745a]"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          “some words deserve more than a text.”
        </p>
      </div>
    </section>
  );
}