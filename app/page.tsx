import Link from "next/link";

export default function Home() {
  return (
    <section className="relative -mx-4 -my-8 flex min-h-screen items-center justify-center overflow-hidden rounded-xl bg-[#fdf2df] px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,_rgba(253,246,236,0.95),_rgba(248,219,190,0.72)_48%,_rgba(255,250,242,0.94)),radial-gradient(circle_at_22%_24%,_rgba(226,151,123,0.18),_transparent_28rem),radial-gradient(circle_at_82%_76%,_rgba(173,125,91,0.14),_transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(88,61,38,0.24)_0.7px,_transparent_0.7px)] [background-size:4px_4px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="mb-5 rounded-full bg-[#fffaf2]/70 px-4 py-2 text-sm font-medium text-[#8a6248] shadow-[0_10px_30px_rgba(92,64,38,0.07)]">
            Letters, notes, feelings, together.
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] text-[#4a3426] sm:text-6xl lg:text-7xl">
            Write letters that feel alive.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#735b49] sm:text-xl">
            A collaborative digital space for emotional, handwritten-style letters.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start">
            <Link
              href="/editor/new"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#7d4f3a] px-8 text-base font-semibold text-[#fffaf2] shadow-[0_18px_38px_rgba(125,79,58,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6d4432] sm:w-auto"
            >
              Start Writing
            </Link>
            <Link
              href="/explore"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#fffaf2]/55 px-8 text-base font-semibold text-[#6f4b38] shadow-[0_14px_34px_rgba(92,64,38,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fffaf2]/85 sm:w-auto"
            >
              Explore Letters
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative h-[420px] w-full max-w-md">
            <div className="absolute left-8 top-10 h-72 w-60 rotate-6 rounded-xl bg-[#f4dec8] shadow-[0_28px_70px_rgba(92,64,38,0.12)]" />
            <div className="absolute right-2 top-4 h-[355px] w-[285px] -rotate-2 rounded-xl bg-[#fffaf2] p-8 shadow-[0_30px_80px_rgba(92,64,38,0.18)]">
              <div className="mb-7 flex items-center justify-between">
                <div className="h-3 w-20 rounded-full bg-[#e9c9ad]" />
                <div className="h-8 w-8 rounded-full bg-[#f4d7c2]" />
              </div>

              <div className="space-y-4">
                <div className="h-3 w-full rounded-full bg-[#d7b79c]/70" />
                <div className="h-3 w-11/12 rounded-full bg-[#d7b79c]/60" />
                <div className="h-3 w-4/5 rounded-full bg-[#d7b79c]/55" />
                <div className="h-3 w-full rounded-full bg-[#d7b79c]/50" />
                <div className="h-3 w-8/12 rounded-full bg-[#d7b79c]/45" />
              </div>

              <div className="mt-10 rounded-xl bg-[#f8eadb] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <div className="mb-4 h-3 w-24 rounded-full bg-[#c68c70]/50" />
                <div className="space-y-3">
                  <div className="h-2.5 w-full rounded-full bg-[#d5a488]/45" />
                  <div className="h-2.5 w-9/12 rounded-full bg-[#d5a488]/40" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-9 left-2 rounded-full bg-[#fffaf2]/80 px-5 py-3 text-sm font-medium text-[#8a6248] shadow-[0_18px_42px_rgba(92,64,38,0.13)]">
              saved with love
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
