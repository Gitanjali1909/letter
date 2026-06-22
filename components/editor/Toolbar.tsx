"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Download, Undo2, Redo2, Keyboard, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Toolbar() {
  const { canvas, historyIndex, history, undo, redo } = useEditorStore();
  const [title, setTitle] = useState("My Aesthetic Letter");
  const [showShortcuts, setShowShortcuts] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleExportPNG = () => {
    if (!canvas) return;

    // Deselect active objects to avoid selection lines in the exported PNG
    canvas.discardActiveObject();
    canvas.renderAll();

    // Export with high multiplier (3x) for super crisp quality
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 3,
    });

    if (!dataURL) return;

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-") || "letter"}.png`;
    link.click();
  };

  return (
    <>
      <header className="relative z-50 flex h-16 w-full items-center justify-between border-b border-[#e8dcc4]/55 bg-white/60 px-6 backdrop-blur-md">
        {/* Left Side: Navigation & Document Title */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dcc4] bg-[#fffaf0] hover:border-[#a8745a] hover:bg-white active:scale-95 transition-all duration-300"
            title="Go back to dashboard"
          >
            <ChevronLeft className="h-4 w-4 text-[#7a5a44]" />
          </Link>
          
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-serif text-base font-semibold text-[#3b2f25] focus:border-b focus:border-[#a8745a] focus:outline-none"
              title="Click to edit letter title"
            />
            <span className="text-[10px] text-[#7a5a44]/70 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              Aged Paper Editor
            </span>
          </div>
        </div>

        {/* Center: Undo & Redo Controls */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#e8dcc4]/40 bg-[#fbf6ec]/50 p-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              canUndo
                ? "text-[#3b2f25] hover:bg-white active:scale-90"
                : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              canRedo
                ? "text-[#3b2f25] hover:bg-white active:scale-90"
                : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Right Side: Keyboard Shortcuts & Download */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShortcuts(true)}
            className="flex h-10 gap-2 items-center rounded-xl border border-[#e8dcc4]/80 bg-white/80 px-3.5 text-xs font-semibold text-[#7a5a44] hover:border-[#a8745a] hover:bg-white active:scale-95 transition-all"
          >
            <Keyboard className="h-4 w-4" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          <button
            onClick={handleExportPNG}
            disabled={!canvas}
            className="flex h-10 gap-2 items-center rounded-xl bg-[#3b2f25] px-5 text-xs font-semibold text-[#fffaf0] shadow-md shadow-[#3b2f25]/15 hover:bg-[#4a3a2e] active:scale-95 transition-all"
            title="Download letter as high resolution PNG"
          >
            <Download className="h-4 w-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[360px] rounded-2xl border border-[#e8dcc4] bg-[#fffaf0] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-bold text-[#3b2f25] mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3 text-xs text-[#7a5a44]">
              <div className="flex justify-between border-b border-[#e8dcc4]/20 pb-1.5">
                <span>Duplicate Selection</span>
                <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Ctrl + D</kbd>
              </div>
              <div className="flex justify-between border-b border-[#e8dcc4]/20 pb-1.5">
                <span>Delete Selection</span>
                <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Delete</kbd>
              </div>
              <div className="flex justify-between border-b border-[#e8dcc4]/20 pb-1.5">
                <span>Undo Action</span>
                <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between border-b border-[#e8dcc4]/20 pb-1.5">
                <span>Redo Action</span>
                <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Ctrl + Y</kbd>
              </div>
              <div className="flex justify-between border-b border-[#e8dcc4]/20 pb-1.5">
                <span>Pan Canvas</span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Space</kbd> + drag
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Zoom In/Out</span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans font-semibold text-[#3b2f25]">Ctrl</kbd> + scroll
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-6 w-full rounded-xl bg-[#3b2f25] py-2.5 text-xs font-semibold text-[#fffaf0] hover:bg-[#4a3a2e] transition-all"
            >
              Close Shortcuts
            </button>
          </div>
        </div>
      )}
    </>
  );
}