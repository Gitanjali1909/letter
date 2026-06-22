"use client";

import { useEditorStore } from "@/store/useEditorStore";
import {
  Type,
  Smile,
  Layers,
  Settings,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import type { FabricObject, IText } from "fabric";

const STICKERS = [
  "✿","❀","★","♡","✦","☁︎","✉︎","❁","✺","❤︎",
  "☾","☼","☘︎","✉","✈︎","✍︎","☕︎","⚓︎"
];

export default function Sidebar() {
  const {
    canvas,
    selectedObject,
    activeSidebarTab,
    setActiveSidebarTab,
    addText,
    addSticker,
    gridEnabled,
    setGridEnabled,
    snapEnabled,
    setSnapEnabled,
  } = useEditorStore();

  const objects = canvas?.getObjects() ?? [];

  const getObjectLabel = (o: FabricObject, index: number) => {
    if (o.type === "i-text" || o.type === "textbox" || o.type === "text") {
      const text = (o as IText).text ?? "";
      return text.trim().slice(0, 18) || `Text ${index + 1}`;
    }
    const metaType = (o as any).__meta?.type;
    if (metaType === "sticker") {
      return `Sticker ${(o as any).text || ""}`;
    }
    return `Object ${index + 1}`;
  };

  const handleSelectObject = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
    useEditorStore.getState().setSelectedObject(obj);
  };

  const handleDeleteObject = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
    useEditorStore.getState().setSelectedObject(null);
    useEditorStore.getState().saveState();
  };

  const handleToggleLock = (obj: FabricObject, isLocked: boolean) => {
    if (!canvas) return;
    obj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      lockRotation: isLocked,
      hasControls: !isLocked,
      selectable: !isLocked,
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    useEditorStore.getState().setSelectedObject(null);
    useEditorStore.getState().saveState();
  };

  return (
    <aside className="relative z-40 flex h-full border-r border-[#e8dcc4]/55 bg-white/40 backdrop-blur-md">
      
      {/* LEFT ICON DOCK */}
      <div className="flex w-16 flex-col items-center border-r border-[#e8dcc4]/40 bg-[#fbf6ec]/60 py-6 gap-6">
        {[
          { id: "text", icon: Type, label: "Text" },
          { id: "stickers", icon: Smile, label: "Stickers" },
          { id: "layers", icon: Layers, label: "Layers" },
          { id: "canvas", icon: Settings, label: "Canvas" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(tab.id as any)}
              aria-label={tab.label}
              title={tab.label}
              className={`group relative flex h-12 w-12 flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#3b2f25] text-[#fffaf0] shadow-md shadow-[#3b2f25]/10 scale-105"
                  : "text-[#7a5a44] hover:bg-[#ebdccb]/30 hover:text-[#3b2f25]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-[9px] font-medium tracking-wide uppercase opacity-75">
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute -left-1 top-3.5 h-5 w-1.5 rounded-r-full bg-[#a8745a]" />
              )}
            </button>
          );
        })}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-64 flex-col bg-white/70 p-5 overflow-y-auto">
        
        <div className="mb-4 border-b border-[#e8dcc4]/30 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7a5a44]">
            {activeSidebarTab} Options
          </h2>
        </div>

        {/* TEXT */}
        {activeSidebarTab === "text" && (
          <div className="space-y-4">
            <button
              onClick={() => addText("Heading Text", "heading")}
              aria-label="Add heading text"
              title="Add heading text"
              className="w-full rounded-xl border border-[#e8dcc4] bg-[#fffaf0] p-3 text-left hover:border-[#a8745a]"
            >
              <span className="font-serif text-xl font-bold">Add Heading</span>
            </button>

            <button
              onClick={() => addText("Body text...", "body")}
              aria-label="Add body text"
              title="Add body text"
              className="w-full rounded-xl border border-[#e8dcc4] bg-[#fffaf0] p-3 text-left hover:border-[#a8745a]"
            >
              <span className="text-sm">Add Body</span>
            </button>
          </div>
        )}

        {/* STICKERS */}
        {activeSidebarTab === "stickers" && (
          <div className="grid grid-cols-3 gap-2">
            {STICKERS.map((s) => (
              <button
                key={s}
                onClick={() => addSticker(s)}
                aria-label={`Add sticker ${s}`}
                title={`Add sticker ${s}`}
                className="flex aspect-square items-center justify-center rounded-xl border border-[#e8dcc4] bg-[#fffaf0] text-2xl hover:border-[#a8745a]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* LAYERS */}
        {activeSidebarTab === "layers" && (
          <div className="space-y-2">
            {objects.length === 0 ? (
              <p className="text-xs italic">No layers yet</p>
            ) : (
              [...objects].reverse().map((o, idx) => {
                const i = objects.length - 1 - idx;
                const active = selectedObject === o;
                const isLocked = o.lockMovementX;

                return (
                  <div
                    key={i}
                    onClick={() => handleSelectObject(o)}
                    className={`flex items-center justify-between rounded-xl border p-2 cursor-pointer ${
                      active ? "bg-white border-[#a8745a]" : "bg-white/40"
                    }`}
                  >
                    <span className="text-xs truncate">
                      {getObjectLabel(o, i)}
                    </span>

                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLock(o, !isLocked);
                        }}
                        aria-label={isLocked ? "Unlock object" : "Lock object"}
                        title={isLocked ? "Unlock object" : "Lock object"}
                      >
                        {isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteObject(o);
                        }}
                        aria-label="Delete layer"
                        title="Delete layer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* CANVAS SETTINGS */}
        {activeSidebarTab === "canvas" && (
          <div className="space-y-4">
            
            <button
              onClick={() => setGridEnabled(!gridEnabled)}
              aria-label="Toggle grid"
              title="Toggle grid"
              className="w-full rounded-xl border p-2"
            >
              Grid: {gridEnabled ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => setSnapEnabled(!snapEnabled)}
              aria-label="Toggle snapping"
              title="Toggle snapping"
              className="w-full rounded-xl border p-2"
            >
              Snap: {snapEnabled ? "ON" : "OFF"}
            </button>

          </div>
        )}
      </div>
    </aside>
  );
}