"use client";

import type { IText } from "fabric";
import { useEditorStore } from "@/store/useEditorStore";
import { Download, Trash2 } from "lucide-react";

export default function Toolbar() {
  const canvas = useEditorStore((s) => s.canvas);
  const selected = useEditorStore((s) => s.selectedObject);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);

  const isText =
    selected &&
    (selected.type === "i-text" ||
      selected.type === "textbox" ||
      selected.type === "text");

  const text = isText ? (selected as IText) : null;
  const textColor = typeof text?.fill === "string" ? text.fill : "#3b2f25";

  return (
    <div className="flex h-14 items-center gap-3 px-4 border-b border-[#e8dcc4]/60 bg-[#fbf6ec]/80 backdrop-blur">
      
      {/* font */}
      <select
        aria-label="Font family"
        title="Font family"
        disabled={!text}
        value={text?.fontFamily ?? "Caveat"}
        onChange={(e) => {
          text?.set("fontFamily", e.target.value);
          canvas?.renderAll();
        }}
        className="rounded-lg border px-2 py-1 text-sm"
      >
        <option value="Caveat">Handwritten</option>
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans</option>
      </select>

      {/* size */}
      <input
        aria-label="Font size"
        title="Font size"
        type="number"
        disabled={!text}
        value={text?.fontSize ?? 32}
        onChange={(e) => {
          text?.set("fontSize", Number(e.target.value));
          canvas?.renderAll();
        }}
        className="w-20 rounded-lg border px-2 py-1 text-sm"
      />

      {/* color */}
      <input
        aria-label="Text color"
        title="Text color"
        type="color"
        disabled={!text}
        value={textColor}
        onChange={(e) => {
          text?.set("fill", e.target.value);
          canvas?.renderAll();
        }}
      />

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          aria-label="Delete selected object"
          title="Delete selected object"
          onClick={deleteSelected}
          disabled={!selected}
          className="px-3 py-1.5 rounded bg-white border"
        >
          <Trash2 size={16} />
        </button>

        <button
          type="button"
          aria-label="Download letter as PNG"
          title="Download letter as PNG"
          onClick={() => {
            const data = canvas?.toDataURL({
              format: "png",
              quality: 1,
              multiplier: 1,
            });

            if (!data) return;

            const link = document.createElement("a");
            link.href = data;
            link.download = "letter.png";
            link.click();
          }}
          className="px-4 py-1.5 rounded bg-[#3b2f25] text-white"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
