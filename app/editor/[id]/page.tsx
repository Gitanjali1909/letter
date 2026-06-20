"use client";

import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-xl bg-[#f4eadf] text-[#4b3a30] shadow-[0_24px_70px_rgba(92,64,38,0.08)]">
      <Toolbar />

      <div className="grid min-h-0 flex-1 grid-cols-[250px_1fr_250px]">
        <aside className="bg-[#fff8ef]/70 p-5 shadow-[10px_0_28px_rgba(92,64,38,0.05)]">
          <span className="text-sm font-semibold text-[#735b49]">Sidebar</span>
        </aside>

        <main className="flex items-center justify-center bg-[#eadfd3] p-8">
          <Canvas />
        </main>

        <aside className="bg-[#fff8ef]/70 p-5 shadow-[-10px_0_28px_rgba(92,64,38,0.05)]">
          <span className="text-sm font-semibold text-[#735b49]">
            Layers Panel
          </span>
        </aside>
      </div>
    </div>
  );
}
