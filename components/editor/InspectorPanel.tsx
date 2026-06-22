"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline,
  Copy, Trash2, Lock, Unlock, Maximize2, Trash
} from "lucide-react";

const FONTS = ["Caveat", "Instrument Serif", "Inter", "Homemade Apple", "Georgia"];
const COLORS = ["#3b2f25","#a8745a","#c98a74","#ebdccb","#2f6b5b","#7a3b3b","#4a6b82","#000000"];

export default function InspectorPanel() {
  const {
    canvas, selectedObject, setSelectedObject,
    saveState, deleteSelected, duplicateSelected
  } = useEditorStore();

  const [properties, setProperties] = useState({
    fontFamily: "Caveat",
    fontSize: 32,
    charSpacing: 0,
    lineHeight: 1.16,
    fill: "#3b2f25",
    textAlign: "left",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    opacity: 1,
    angle: 0,
    isLocked: false,
  });

  useEffect(() => {
    if (!canvas) return;

    const update = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;

      setProperties({
        fontFamily: obj.get("fontFamily") || "Caveat",
        fontSize: obj.get("fontSize") || 32,
        charSpacing: obj.get("charSpacing") || 0,
        lineHeight: obj.get("lineHeight") || 1.16,
        fill: typeof obj.get("fill") === "string" ? obj.get("fill") : "#3b2f25",
        textAlign: obj.get("textAlign") || "left",
        fontWeight: obj.get("fontWeight") || "normal",
        fontStyle: obj.get("fontStyle") || "normal",
        underline: obj.get("underline") || false,
        opacity: obj.get("opacity") || 1,
        angle: obj.get("angle") || 0,
        isLocked: obj.lockMovementX || false,
      });
    };

    canvas.on("selection:created", update);
    canvas.on("selection:updated", update);
    canvas.on("object:modified", update);

    return () => {
      canvas.off("selection:created", update);
      canvas.off("selection:updated", update);
      canvas.off("object:modified", update);
    };
  }, [canvas]);

  const setObj = (key: string, value: any) => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    obj.set(key as any, value);
    canvas?.renderAll();
    setProperties(p => ({ ...p, [key]: value }));
    saveState();
  };

  const toggleLock = () => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    const lock = !properties.isLocked;

    obj.set({
      lockMovementX: lock,
      lockMovementY: lock,
      lockScalingX: lock,
      lockScalingY: lock,
      lockRotation: lock,
      selectable: !lock,
    });

    canvas?.renderAll();
    setProperties(p => ({ ...p, isLocked: lock }));
    saveState();
  };

  const isText = selectedObject?.type?.includes("text");

  return (
    <aside className="w-64 p-4 space-y-5 bg-white/40 backdrop-blur-md border-l">

      {isText && (
        <>
          {/* FONT */}
          <div>
            <label htmlFor="font" className="text-xs font-semibold">Font</label>
            <select
              id="font"
              aria-label="Font Family"
              value={properties.fontFamily}
              onChange={(e) => setObj("fontFamily", e.target.value)}
              className="w-full mt-1 border rounded p-2 text-sm"
            >
              {FONTS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {/* FONT SIZE */}
          <div>
            <label htmlFor="fontSize" className="text-xs font-semibold">
              Font Size
            </label>
            <input
              id="fontSize"
              type="range"
              aria-label="Font Size"
              min={8}
              max={150}
              value={properties.fontSize}
              onChange={(e) => setObj("fontSize", Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* SPACING */}
          <div>
            <label htmlFor="spacing" className="text-xs font-semibold">
              Letter Spacing
            </label>
            <input
              id="spacing"
              type="range"
              aria-label="Letter Spacing"
              min={-50}
              max={300}
              value={properties.charSpacing}
              onChange={(e) => setObj("charSpacing", Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* STYLE BUTTONS */}
          <div className="flex gap-2">
            <button aria-label="Bold" title="Bold" onClick={() => setObj("fontWeight", properties.fontWeight === "bold" ? "normal" : "bold")}>
              <Bold size={16} />
            </button>
            <button aria-label="Italic" title="Italic" onClick={() => setObj("fontStyle", properties.fontStyle === "italic" ? "normal" : "italic")}>
              <Italic size={16} />
            </button>
            <button aria-label="Underline" title="Underline" onClick={() => setObj("underline", !properties.underline)}>
              <Underline size={16} />
            </button>
          </div>

          {/* ALIGN */}
          <div className="flex gap-2">
            {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
              <button
                key={i}
                aria-label="Text Align"
                title="Text Align"
                onClick={() => setObj("textAlign", ["left","center","right","justify"][i])}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* COLORS */}
          <div>
            <p className="text-xs font-semibold mb-1">Color</p>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  aria-label={`Color ${c}`}
                  title={c}
                  onClick={() => setObj("fill", c)}
                  className="h-6 rounded"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 pt-2">
            <button aria-label="Lock" title="Lock" onClick={toggleLock}>
              {properties.isLocked ? <Lock size={16}/> : <Unlock size={16}/>}
            </button>

            <button aria-label="Duplicate" title="Duplicate" onClick={duplicateSelected}>
              <Copy size={16}/>
            </button>

            <button aria-label="Delete" title="Delete" onClick={deleteSelected}>
              <Trash2 size={16}/>
            </button>
          </div>
        </>
      )}

      {!selectedObject && (
        <>
          <button
            aria-label="Fit Screen"
            title="Fit Screen"
            className="w-full flex gap-2 items-center justify-center border p-2 rounded"
          >
            <Maximize2 size={16}/> Fit
          </button>

          <button
            aria-label="Clear Canvas"
            title="Clear Canvas"
            className="w-full flex gap-2 items-center justify-center border p-2 rounded text-red-500"
          >
            <Trash size={16}/> Clear
          </button>
        </>
      )}

    </aside>
  );
}