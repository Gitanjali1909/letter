"use client";

import { useParams } from "next/navigation";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import Sidebar from "@/components/editor/Sidebar";
import LayersPanel from "@/components/editor/LayersPanel";
import { LetterCanvas } from "@/components/editor/LetterCanvas";
import { FloatingNav } from "@/components/FloatingNav";
import { useEditorStore } from "@/store/useEditorStore";
import type { FabricObject } from "fabric";

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;

  const canvas = useEditorStore((s) => s.canvas);
  const selected = useEditorStore((s) => s.selectedObject);

  const objects = canvas?.getObjects() ?? [];

  return (
    <div className="flex h-screen flex-col bg-[#f5ecdc] text-[#3b2f25]">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Layout */}
      <div className="grid flex-1 grid-cols-[260px_1fr_260px] overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <main className="flex items-center justify-center bg-[#eadfd3] p-6">
          <Canvas />
        </main>

        {/* Layers */}
        <LayersPanel
          objects={objects}
          selected={selected}
          onSelect={(obj: FabricObject) => {
            canvas?.setActiveObject(obj);
            canvas?.renderAll();
          }}
          onDelete={(obj: FabricObject) => {
            canvas?.remove(obj);
            canvas?.discardActiveObject();
            canvas?.renderAll();
          }}
        />
      </div>

      {/* Letter Canvas (uses route id) */}
      <LetterCanvas letterId={id} />

      {/* Floating Nav */}
      <FloatingNav />
    </div>
  );
}