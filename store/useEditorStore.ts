"use client";

import { create } from "zustand";
import type { Canvas as FabricCanvas, FabricObject } from "fabric";

interface EditorState {
  canvas: FabricCanvas | null;
  selectedObject: FabricObject | null;

  history: string[];
  historyIndex: number;

  zoom: number;
  panOffset: { x: number; y: number };

  gridEnabled: boolean;
  snapEnabled: boolean;

  activeSidebarTab: "text" | "stickers" | "layers" | "canvas";

  setCanvas: (canvas: FabricCanvas | null) => void;
  setSelectedObject: (obj: FabricObject | null) => void;

  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;

  setGridEnabled: (enabled: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;

  setActiveSidebarTab: (
    tab: "text" | "stickers" | "layers" | "canvas"
  ) => void;

  saveState: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  addText: (
    textString?: string,
    stylePreset?: "heading" | "subheading" | "body" | "handwritten"
  ) => void;

  addSticker: (glyph: string) => void;

  deleteSelected: () => void;
  duplicateSelected: () => void;

  bringToFront: () => void;
  sendToBack: () => void;
  bringForward: () => void;
  sendBackward: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  selectedObject: null,

  history: [],
  historyIndex: -1,

  zoom: 1,
  panOffset: { x: 0, y: 0 },

  gridEnabled: true,
  snapEnabled: true,

  activeSidebarTab: "text",

  setCanvas: (canvas) => {
    set({ canvas });

    if (canvas) {
      set({
        history: [JSON.stringify(canvas.toJSON())],
        historyIndex: 0,
      });
    }
  },

  setSelectedObject: (selectedObject) => set({ selectedObject }),

  setZoom: (zoom) => {
    const canvas = get().canvas;
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.requestRenderAll();

    set({ zoom });
  },

  setPanOffset: (panOffset) => {
    const canvas = get().canvas;
    if (!canvas) return;

    const vpt = canvas.viewportTransform;
    if (vpt) {
      vpt[4] = panOffset.x;
      vpt[5] = panOffset.y;
      canvas.requestRenderAll();
    }

    set({ panOffset });
  },

  setGridEnabled: (gridEnabled) => {
    set({ gridEnabled });
    get().canvas?.requestRenderAll();
  },

  setSnapEnabled: (snapEnabled) => set({ snapEnabled }),

  setActiveSidebarTab: (activeSidebarTab) =>
    set({ activeSidebarTab }),

  saveState: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);

    if (newHistory[newHistory.length - 1] === state) return;

    set({
      history: [...newHistory, state],
      historyIndex: newHistory.length,
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;

    canvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
      canvas.discardActiveObject();
      canvas.renderAll();
      set({ historyIndex: newIndex, selectedObject: null });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;

    canvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
      canvas.discardActiveObject();
      canvas.renderAll();
      set({ historyIndex: newIndex, selectedObject: null });
    });
  },

  clearHistory: () => {
    const canvas = get().canvas;
    if (!canvas) return;

    set({
      history: [JSON.stringify(canvas.toJSON())],
      historyIndex: 0,
    });
  },

  addText: (textString, stylePreset) => {
    const canvas = get().canvas;
    if (!canvas) return;

    import("fabric").then(({ IText }) => {
      const text = new IText(textString || "Write something...", {
        left: 150,
        top: 150,
        fontFamily: "Inter",
        fontSize: 24,
        fill: "#3b2f25",
      });

      (text as any).__meta = {
        id: Math.random().toString(36),
        type: "text",
      };

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();

      get().saveState();
    });
  },

  addSticker: (glyph) => {
    const canvas = get().canvas;
    if (!canvas) return;

    import("fabric").then(({ Text }) => {
      const sticker = new Text(glyph, {
        left: 200,
        top: 200,
        fontSize: 72,
      });

      canvas.add(sticker);
      canvas.setActiveObject(sticker);
      canvas.renderAll();

      get().saveState();
    });
  },

  deleteSelected: () => {
    const canvas = get().canvas;
    if (!canvas) return;

    canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();

    set({ selectedObject: null });
    get().saveState();
  },

  duplicateSelected: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    selectedObject.clone().then((cloned: any) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();

      get().saveState();
      set({ selectedObject: cloned });
    });
  },

  // 🔥 FIXED FOR YOUR FABRIC VERSION
  bringToFront: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
    get().saveState();
  },

  sendToBack: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    canvas.sendObjectToBack(selectedObject);
    canvas.renderAll();
    get().saveState();
  },

  bringForward: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    canvas.bringObjectForward(selectedObject);
    canvas.renderAll();
    get().saveState();
  },

  sendBackward: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    canvas.sendObjectBackwards(selectedObject); // ✅ FIX HERE
    canvas.renderAll();
    get().saveState();
  },
}));