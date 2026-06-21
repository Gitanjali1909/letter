"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";

type FabricMod = typeof import("fabric");
type FabricCanvas = InstanceType<FabricMod["Canvas"]>;

export default function LetterViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let disposed = false;
    let canvas: FabricCanvas | null = null;

    (async () => {
      const fabric = await import("fabric");

      if (disposed || !canvasRef.current) return;

      canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#fffaf0",
        selection: false,
      });

      fabricRef.current = canvas;

      const raw = localStorage.getItem(`letterspace:letter:${id}`);

      if (!raw) {
        setStatus("empty");
        return;
      }

      try {
        const parsed = JSON.parse(raw);

        await canvas.loadFromJSON(parsed.json);

        canvas.getObjects().forEach((o) => {
          o.selectable = false;
          o.evented = false;
        });

        canvas.requestRenderAll();
        setStatus("ready");
      } catch {
        setStatus("empty");
      }
    })();

    return () => {
      disposed = true;
      canvas?.dispose();
      fabricRef.current = null;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-[#f5efe6] text-[#3b2f25] flex flex-col items-center px-6 py-16">
      <button
        onClick={() => router.push("/explore")}
        className="mb-8 self-start rounded-full border px-4 py-1.5 text-sm hover:-translate-y-0.5 transition"
      >
        ← back
      </button>

      <div className="relative rotate-[-0.6deg] bg-[#fffaf0] p-4 rounded-xl shadow-xl">
        <canvas
          ref={canvasRef}
          width={720}
          height={960}
          className="rounded-lg"
        />

        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#a8896a]">
            {status === "loading" ? (
              <p className="italic">unfolding...</p>
            ) : (
              <>
                <p className="text-xl mb-2">no letter here</p>
                <button
                  onClick={() => router.push(`/editor/${id}`)}
                  className="px-4 py-2 bg-[#3b2f25] text-white rounded-full"
                >
                  write one
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {status === "ready" && (
        <p className="mt-6 text-sm italic text-[#a8896a]">
          slow words hit harder ♡
        </p>
      )}

      <FloatingNav />
    </main>
  );
}