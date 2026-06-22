"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export interface LetterCanvasProps {
  letterId: string;
}

export function LetterCanvas({ letterId }: LetterCanvasProps) {
  const canvas = useEditorStore((s) => s.canvas);

  // Load saved letter data from localStorage or create a warm preset if empty
  useEffect(() => {
    if (!canvas || !letterId) return;

    const savedData = localStorage.getItem(`letter-editor-${letterId}`);
    if (savedData) {
      try {
        const json = JSON.parse(savedData);
        canvas.loadFromJSON(json).then(() => {
          canvas.renderAll();
          // Reset store history to start clean with the loaded file
          useEditorStore.getState().clearHistory();
        });
      } catch (err) {
        console.error("Failed to load letter from storage:", err);
      }
    } else {
      // Set up a beautiful handwritten preset letter to greet the user
      import("fabric").then(({ IText, Text }) => {
        const header = new IText("Dear Friend,", {
          left: 80,
          top: 100,
          fontFamily: "Georgia",
          fontSize: 32,
          fill: "#3b2f25",
          fontWeight: "bold",
        });
        (header as any).__meta = { id: Math.random().toString(36), type: "text" };

        const body = new IText(
          "I was thinking of you today and wanted to send this letter. Thank you for always being there. Let's catch up soon!\n\nWarmly,\nYour Friend",
          {
            left: 80,
            top: 180,
            fontFamily: "Caveat",
            fontSize: 28,
            fill: "#3b2f25",
            width: 540,
            splitByGrapheme: true,
          }
        );
        (body as any).__meta = { id: Math.random().toString(36), type: "text" };

        const sticker = new Text("✿", {
          left: 550,
          top: 80,
          fontFamily: "Inter",
          fontSize: 80,
          fill: "#a8745a",
        });
        (sticker as any).__meta = { id: Math.random().toString(36), type: "sticker" };

        canvas.add(header, body, sticker);
        canvas.renderAll();
        useEditorStore.getState().clearHistory();
      });
    }
  }, [canvas, letterId]);

  // Auto-save to localStorage whenever the canvas modifications are made
  useEffect(() => {
    if (!canvas || !letterId) return;

    const handleAutoSave = () => {
      const state = JSON.stringify(canvas.toJSON());
      localStorage.setItem(`letter-editor-${letterId}`, state);
    };

    canvas.on("object:added", handleAutoSave);
    canvas.on("object:removed", handleAutoSave);
    canvas.on("object:modified", handleAutoSave);
    canvas.on("text:changed", handleAutoSave);

    return () => {
      canvas.off("object:added", handleAutoSave);
      canvas.off("object:removed", handleAutoSave);
      canvas.off("object:modified", handleAutoSave);
      canvas.off("text:changed", handleAutoSave);
    };
  }, [canvas, letterId]);

  return null; // Pure state manager, rendering is handled by the Main Canvas component
}
export default LetterCanvas;