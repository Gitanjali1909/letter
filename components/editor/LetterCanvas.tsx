"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type FabricMod = typeof import("fabric");
type FabricCanvas = InstanceType<FabricMod["Canvas"]>;
type FabricObject = InstanceType<FabricMod["FabricObject"]>;

const FONTS = [
  "Caveat",
  "Instrument Serif",
  "Inter",
  "Homemade Apple",
  "Georgia",
];

const COLORS = [
  "#3b2f25",
  "#a8745a",
  "#c98a74",
  "#5b4636",
  "#2f6b5b",
  "#7a3b3b",
];

const STICKERS = ["✿", "✉", "♡", "✶", "❀", "☾", "✷", "❁"];

const PAPER_BG =
  "radial-gradient(circle at 30% 20%, rgba(168,116,90,0.05), transparent 60%), radial-gradient(circle at 80% 90%, rgba(168,116,90,0.06), transparent 60%)";

const CANVAS_STYLE = {
  backgroundImage: PAPER_BG,
};

export interface LetterCanvasProps {
  letterId: string;
}

interface LayerInfo {
  id: string;
  label: string;
  type: string;
}

export function LetterCanvas({ letterId: _letterId }: LetterCanvasProps) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const modRef = useRef<FabricMod | null>(null);

  const [ready, setReady] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Caveat");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#3b2f25");
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);


  const refreshLayers = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;

    const objs = c.getObjects();
    let textN = 0;
    let stickerN = 0;

    setLayers(
      objs.map((o) => {
        const meta = (o as any).__meta;
        const type = meta?.type ?? "object";

        const label =
          type === "text"
            ? `Text ${++textN}`
            : type === "sticker"
              ? `Sticker ${++stickerN}`
              : "Layer";

        return {
          id: meta?.id ?? Math.random().toString(36),
          label,
          type,
        };
      }),
    );
  }, []);


  useEffect(() => {
    let disposed = false;
    let canvas: FabricCanvas | null = null;

    (async () => {
      const fabric = await import("fabric");

      if (disposed || !canvasElRef.current) return;

      modRef.current = fabric;

      canvas = new fabric.Canvas(canvasElRef.current, {
        backgroundColor: "#fffaf0",
        preserveObjectStacking: true,
        selection: true,
      });

      fabricRef.current = canvas;

      const handleSel = () => {
        const o = canvas!.getActiveObject() as FabricObject | undefined;
        const meta = (o as any)?.__meta;
        setSelectedId(meta?.id ?? null);
      };

      canvas.on("selection:created", handleSel);
      canvas.on("selection:updated", handleSel);
      canvas.on("selection:cleared", () => setSelectedId(null));
      canvas.on("object:added", refreshLayers);
      canvas.on("object:removed", refreshLayers);

      setReady(true);
    })();

    return () => {
      disposed = true;
      canvas?.dispose();
      fabricRef.current = null;
    };
  }, [refreshLayers]);


  const addText = useCallback(() => {
    const c = fabricRef.current;
    const fabric = modRef.current;
    if (!c || !fabric) return;

    const t = new fabric.IText("write something...", {
      left: 80,
      top: 80,
      fontFamily: selectedFont,
      fontSize,
      fill: color,
      editable: true,
    });

    (t as any).__meta = {
      id: Math.random().toString(36),
      type: "text",
    };

    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
  }, [selectedFont, fontSize, color]);

  const addSticker = useCallback((glyph: string) => {
    const c = fabricRef.current;
    const fabric = modRef.current;
    if (!c || !fabric) return;

    const t = new fabric.Text(glyph, {
      left: 120,
      top: 120,
      fontFamily: "Instrument Serif",
      fontSize: 72,
      fill: "#a8745a",
    });

    (t as any).__meta = {
      id: Math.random().toString(36),
      type: "sticker",
    };

    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;

    const objs = c.getActiveObjects();
    objs.forEach((o) => c.remove(o));

    c.discardActiveObject();
    c.requestRenderAll();
  }, []);

  const exportPng = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;

    const url = c.toDataURL({ format: "png", multiplier: 2 });

    const a = document.createElement("a");
    a.href = url;
    a.download = "letter.png";
    a.click();
  }, []);


  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;

    const o = c.getActiveObject() as FabricObject & {
      set?: (p: Record<string, unknown>) => void;
      type?: string;
    };

    if (!o) return;

    if (o.type === "i-text" || o.type === "text" || o.type === "textbox") {
      o.set?.({
        fontFamily: selectedFont,
        fontSize,
        fill: color,
      });

      c.requestRenderAll();
    }
  }, [selectedFont, fontSize, color, selectedId]);

  const selectLayer = useCallback((id: string) => {
    const c = fabricRef.current;
    if (!c) return;

    const obj = c.getObjects().find((o) => (o as any)?.__meta?.id === id);

    if (obj) {
      c.setActiveObject(obj);
      c.requestRenderAll();
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-0)] w-full text-[#3b2f25]">
      {/* LEFT */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-[#e8dcc4]/70 bg-[#fbf6ec]/70 p-5 md:flex">
        <div>
          <p className="mb-2 text-[10px] uppercase text-[#a8896a]">
            Compose
          </p>

          <button
            type="button"
            onClick={addText}
            aria-label="Add text to canvas"
            className="w-full rounded-2xl bg-[#3b2f25] px-4 py-3 text-sm text-[#fbf6ec]"
          >
            ✏️ Add Text
          </button>
        </div>

        <div>
          <p className="mb-2 text-[10px] uppercase text-[#a8896a]">
            Stickers
          </p>

          <div className="grid grid-cols-4 gap-2">
            {STICKERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSticker(s)}
                aria-label={`Add sticker ${s}`}
                className="flex h-12 items-center justify-center rounded-xl border border-[#e8dcc4] bg-[#fffaf0] text-2xl"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e8dcc4]/70 bg-[#fbf6ec]/80 px-5 py-3">
          <label htmlFor="font-select" className="sr-only">
            Font selector
          </label>

          <select
            id="font-select"
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="rounded-full border border-[#e8dcc4] bg-[#fffaf0] px-3 py-1.5"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded-full border border-[#e8dcc4] bg-[#fffaf0] px-3 py-1.5">
            <label htmlFor="font-size" className="text-xs text-[#a8896a]">
              size
            </label>

            <input
              id="font-size"
              type="number"
              min={8}
              max={200}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value) || 16)}
              className="w-14 bg-transparent text-center"
            />
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[#e8dcc4] bg-[#fffaf0] px-2 py-1">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="ml-auto flex gap-2">
            <button type="button" onClick={deleteSelected}>
              Delete
            </button>
            <button type="button" onClick={exportPng}>
              Export PNG
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-auto p-8">
          <div
            className="relative rotate-[-0.6deg] rounded-xl bg-[#fffaf0] p-3"
            style={CANVAS_STYLE}
          >
            <canvas
              ref={canvasElRef}
              width={720}
              height={960}
              className="block rounded-lg"
            />

            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-[#a8896a]">
                preparing your paper…
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="hidden w-60 shrink-0 flex-col border-l border-[#e8dcc4]/70 bg-[#fbf6ec]/70 p-5 lg:flex">
        <p className="mb-3 text-xs uppercase text-[#a8896a]">Layers</p>

        {layers.length === 0 ? (
          <p className="text-sm text-[#a8896a]">
            nothing yet — add something
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {layers
              .slice()
              .reverse()
              .map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => selectLayer(l.id)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </aside>
    </div>
  );
}