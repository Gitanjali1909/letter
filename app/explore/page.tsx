"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/FloatingNav";

/* ---------------- TYPES ---------------- */

type Letter = {
  id: string;
  author: string;
  variant:
    | "paper"
    | "cream"
    | "dark"
    | "burnt"
    | "watercolor"
    | "map"
    | "chalk"
    | "vintage";
  greeting: string;
  body: string;
  signoff: string;
  font: "caveat" | "homemade" | "serif";
  decor?: "flowers-tl" | "flowers-tr" | "hearts" | "sprig" | "map" | "none";
  rotate: number;
};

/* ---------------- MOCK DATA ---------------- */

const LETTERS: Letter[] = [
  {
    id: "1",
    author: "Maya",
    variant: "map",
    greeting: "Dear Sarah,",
    body: "Love me finched my friend...",
    signoff: "With love,\nMaya",
    font: "caveat",
    decor: "map",
    rotate: -1.2,
  },
  {
    id: "2",
    author: "Forsnel",
    variant: "watercolor",
    greeting: "Dear Sarah,",
    body: "but oxe the howes and has killings...",
    signoff: "With love,\nLemma",
    font: "caveat",
    decor: "hearts",
    rotate: 0.8,
  },
];

/* ---------------- STYLES ---------------- */

const VARIANT_STYLES = {
  paper: { bg: "#fdf6e6", fg: "#4a3b2c" },
  cream: { bg: "#fffaf0", fg: "#3b2f25" },
  dark: { bg: "#2b211a", fg: "#e8c4a0" },
  burnt: { bg: "#4a2818", fg: "#f0c89a" },
  watercolor: { bg: "#f9f3eb", fg: "#4a3b2c" },
  map: { bg: "#f1e6cc", fg: "#4a3b2c" },
  chalk: { bg: "#1a1a1a", fg: "#d8a87a" },
  vintage: { bg: "#e8d9b8", fg: "#5b4030" },
} as const;

const FONT_FAMILY = {
  caveat: "'Caveat', cursive",
  homemade: "'Homemade Apple', cursive",
  serif: "'Instrument Serif', serif",
} as const;

/* ---------------- CARD ---------------- */

function LetterCard({ letter }: { letter: Letter }) {
  const v = VARIANT_STYLES[letter.variant];
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl border shadow-lg transition hover:-translate-y-1"
        style={{
          backgroundColor: v.bg,
          color: v.fg,
          fontFamily: FONT_FAMILY[letter.font],
          transform: `rotate(${letter.rotate}deg)`,
        }}
      >
        <div className="p-4 text-xs">
          <p>{letter.greeting}</p>
          <p className="whitespace-pre-line">{letter.body}</p>
          <p className="mt-2 text-right italic">{letter.signoff}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span>{letter.author}</span>
        <button onClick={() => setLiked(!liked)}>
          {liked ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return LETTERS.filter(
      (l) =>
        l.author.toLowerCase().includes(q) ||
        l.body.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#e8d8b8] p-6 text-[#3b2f25]">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-3xl">
          Explore Letters
        </h1>

        <input
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 w-full rounded-full px-4 py-2"
        />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {filtered.map((l) => (
            <LetterCard key={l.id} letter={l} />
          ))}
        </div>
      </div>

      <FloatingNav />
    </main>
  );
}