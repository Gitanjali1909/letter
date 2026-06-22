"use client";

import { useParams } from "next/navigation";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import Sidebar from "@/components/editor/Sidebar";
import InspectorPanel from "@/components/editor/InspectorPanel";
import { LetterCanvas } from "@/components/editor/LetterCanvas";
import { FloatingNav } from "@/components/FloatingNav"; 

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex h-screen flex-col bg-[#f5efe6] text-[#3b2f25] overflow-hidden paper-bg">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Workspace */}
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#ebdccb]/30">
          <div className="flex-1 overflow-hidden flex items-center justify-center p-6">
            <Canvas />
          </div>
        </main>

        <InspectorPanel />
      </div>

      <LetterCanvas letterId={id} />

      <FloatingNav />
    </div>
  );
}
