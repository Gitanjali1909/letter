"use client";

import { useEditorStore } from "@/store/useEditorStore";

const STICKERS = ["✿","❀","★","♡","✦","☁︎","✉︎","❁","✺","❤︎"];

const SAFE_STICKERS = STICKERS.length
  ? ["*", "<3", "+", "~", "x", "!", "#", "@", "&", "?"]
  : [];

export default function Sidebar() {
  const addText = useEditorStore((s) => s.addText);
  const addSticker = useEditorStore((s) => s.addSticker);

  return (
    <aside className="p-4 border-r bg-[#fbf6ec]/70 overflow-y-auto">

      <div className="mb-4">
        <p className="text-xs uppercase">Add Text</p>
        <button
          type="button"
          onClick={addText}
          className="w-full mt-2 p-3 rounded bg-white"
        >
          + Write
        </button>
      </div>

      <div>
        <p className="text-xs uppercase mb-2">Stickers</p>
        <div className="grid grid-cols-4 gap-2">
          {SAFE_STICKERS.map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`Add sticker ${s}`}
              onClick={() => addSticker(s)}
              className="aspect-square bg-white rounded text-xl"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
