"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { FabricObject, IText } from "fabric";
import { Type, Image as ImageIcon, Trash2, Lock, Unlock } from "lucide-react";

type Props = {
  objects?: FabricObject[];
  selected?: FabricObject | null;
  onSelect?: (obj: FabricObject) => void;
  onDelete?: (obj: FabricObject) => void;
};

export default function LayersPanel({
  objects: propObjects,
  selected: propSelected,
  onSelect,
  onDelete,
}: Props) {
  const { canvas, selectedObject } = useEditorStore();

  const storeObjects = canvas?.getObjects() ?? [];
  const activeObjects = propObjects !== undefined ? propObjects : storeObjects;
  const activeSelected = propSelected !== undefined ? propSelected : selectedObject;

  const labelFor = (o: FabricObject, i: number) => {
    if (o.type === "i-text" || o.type === "textbox" || o.type === "text") {
      const t = (o as IText).text ?? "";
      return t.trim().slice(0, 22) || `Text ${i + 1}`;
    }
    const metaType = (o as any).__meta?.type;
    if (metaType === "sticker") {
      return `Sticker ${(o as any).text || ""}`;
    }
    return `Sticker ${i + 1}`;
  };

  const handleSelect = (obj: FabricObject) => {
    if (onSelect) {
      onSelect(obj);
    } else if (canvas) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
      useEditorStore.getState().setSelectedObject(obj);
    }
  };

  const handleDelete = (obj: FabricObject) => {
    if (onDelete) {
      onDelete(obj);
    } else if (canvas) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.renderAll();
      useEditorStore.getState().setSelectedObject(null);
      useEditorStore.getState().saveState();
    }
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
    <aside className="w-64 shrink-0 border-l border-[#e8dcc4]/60 bg-[#fbf6ec]/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#7a5a44] font-semibold flex items-center justify-between">
        <span>Layers List</span>
        <span className="text-[10px] text-[#7a5a44]/60 normal-case font-normal">{activeObjects.length} items</span>
      </div>

      {activeObjects.length === 0 && (
        <p className="text-xs text-[#7a5a44]/70 italic mt-4">
          Nothing here yet. Add text or a sticker to begin.
        </p>
      )}

      <ul className="space-y-2">
        {[...activeObjects].reverse().map((o, idx) => {
          const i = activeObjects.length - 1 - idx;
          const isText = o.type === "i-text" || o.type === "textbox" || o.type === "text";
          const active = activeSelected === o;
          const isLocked = o.lockMovementX;

          return (
            <li key={i}>
              <div
                className={`group flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-all duration-300 ${
                  active
                    ? "border-[#a8745a] bg-white shadow-sm"
                    : "border-[#e8dcc4] bg-white/40 hover:bg-white"
                }`}
                onClick={() => handleSelect(o)}
              >
                {isText ? (
                  <Type className="h-3.5 w-3.5 text-[#a8745a]" />
                ) : (
                  <ImageIcon className="h-3.5 w-3.5 text-[#a8745a]" />
                )}
                
                <span className="text-xs font-medium text-[#3b2f25] truncate flex-1">
                  {labelFor(o, i)}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(o, !isLocked);
                    }}
                    className={`p-0.5 rounded hover:bg-[#ebdccb]/40 text-[#7a5a44] ${isLocked ? "text-[#a8745a]" : ""}`}
                    title={isLocked ? "Unlock Layer" : "Lock Layer"}
                  >
                    {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${labelFor(o, i)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(o);
                    }}
                    className="p-0.5 rounded hover:bg-red-50 text-[#7a5a44] hover:text-red-600"
                    title="Delete Layer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}