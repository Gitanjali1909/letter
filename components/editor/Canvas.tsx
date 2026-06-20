"use client";

import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useEditorStore } from "@/store/useEditorStore";

export default function Canvas() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const setCanvas = useEditorStore((state) => state.setCanvas);

  useEffect(() => {
    if (!canvasElementRef.current || fabricCanvasRef.current) {
      return;
    }

    const fabricCanvas = new FabricCanvas(canvasElementRef.current, {
      width: 760,
      height: 480,
      backgroundColor: "#fffaf2",
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    return () => {
      setCanvas(null);
      fabricCanvasRef.current = null;
      void fabricCanvas.dispose();
    };
  }, [setCanvas]);

  return (
    <div className="flex h-[70vh] w-full max-w-3xl items-center justify-center rounded-xl bg-[#fffaf2] p-6 shadow-[0_22px_60px_rgba(92,64,38,0.12)]">
      <canvas ref={canvasElementRef} />
    </div>
  );
}
