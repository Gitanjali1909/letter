"use client";

import { useEditorStore } from "@/store/useEditorStore";

export default function Toolbar() {
  const addText = useEditorStore((state) => state.addText);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);

  return (
    <div className="flex h-[60px] shrink-0 items-center gap-3 px-6 shadow-[0_10px_28px_rgba(92,64,38,0.07)]">
      <button
        type="button"
        onClick={addText}
        className="rounded-full bg-[#7d4f3a] px-5 py-2 text-sm font-semibold text-[#fffaf2] shadow-[0_10px_24px_rgba(125,79,58,0.18)] transition hover:-translate-y-0.5 hover:bg-[#6d4432]"
      >
        Add Text
      </button>
      <button
        type="button"
        onClick={deleteSelected}
        className="rounded-full bg-[#fff8ef]/80 px-5 py-2 text-sm font-semibold text-[#725746] shadow-[0_10px_24px_rgba(92,64,38,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fffaf2]"
      >
        Delete
      </button>
    </div>
  );
}
