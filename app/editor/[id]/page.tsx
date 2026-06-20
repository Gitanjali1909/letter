"use client";

import type { FabricObject } from "fabric";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import Sidebar from "@/components/editor/Sidebar";
import LayersPanel from "@/components/editor/LayersPanel";
import { FloatingNav } from "@/components/FloatingNav";
import { useEditorStore } from "@/store/useEditorStore";

export default function EditorPage() {
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

        {/* Canvas Area */}
        <main className="flex items-center justify-center bg-[#eadfd3] p-6">
          <Canvas />
        </main>

        {/* Right Layers Panel */}
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

      {/* Floating Nav (overlay) */}
      <FloatingNav />
    </div>
  );
}