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

  addText: (textString?: string) => void;
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

  // ---------------------------
  // CANVAS INIT
  // ---------------------------
  setCanvas: (canvas) => {
    set({ canvas });

    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());
    set({ history: [state], historyIndex: 0 });
  },

  setSelectedObject: (selectedObject) => set({ selectedObject }),

  // ---------------------------
  // VIEW CONTROLS
  // ---------------------------
  setZoom: (zoom) => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.requestRenderAll();

    set({ zoom });
  },

  setPanOffset: (panOffset) => {
    const { canvas } = get();
    if (!canvas) return;

    const vpt = canvas.viewportTransform;
    if (!vpt) return;

    vpt[4] = panOffset.x;
    vpt[5] = panOffset.y;

    canvas.requestRenderAll();
    set({ panOffset });
  },

  setGridEnabled: (gridEnabled) => {
    set({ gridEnabled });
    get().canvas?.requestRenderAll();
  },

  setSnapEnabled: (snapEnabled) => set({ snapEnabled }),

  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),

  // ---------------------------
  // HISTORY SYSTEM
  // ---------------------------
  saveState: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());

    const updatedHistory = history.slice(0, historyIndex + 1);

    if (updatedHistory.at(-1) === state) return;

    set({
      history: [...updatedHistory, state],
      historyIndex: updatedHistory.length,
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const nextIndex = historyIndex - 1;

    canvas.loadFromJSON(JSON.parse(history[nextIndex])).then(() => {
      canvas.discardActiveObject();
      canvas.renderAll();

      set({
        historyIndex: nextIndex,
        selectedObject: null,
      });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;

    canvas.loadFromJSON(JSON.parse(history[nextIndex])).then(() => {
      canvas.discardActiveObject();
      canvas.renderAll();

      set({
        historyIndex: nextIndex,
        selectedObject: null,
      });
    });
  },

  clearHistory: () => {
    const { canvas } = get();
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());

    set({
      history: [state],
      historyIndex: 0,
    });
  },

  // ---------------------------
  // OBJECT CREATION
  // ---------------------------
  addText: (textString) => {
    const { canvas } = get();
    if (!canvas) return;

    import("fabric").then(({ IText }) => {
      const text = new IText(textString || "Write something...", {
        left: 150,
        top: 150,
        fontSize: 32,
        fill: "#3b2f25",
        fontFamily: "Caveat",
      });

      (text as any).__meta = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36),
        type: "text",
      };

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.requestRenderAll();

      get().saveState();
    });
  },

  addSticker: (glyph) => {
    const { canvas } = get();
    if (!canvas) return;

    import("fabric").then(({ Text }) => {
      const sticker = new Text(glyph, {
        left: 200,
        top: 200,
        fontSize: 72,
        fill: "#a8745a",
      });

      (sticker as any).__meta = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36),
        type: "sticker",
      };

      canvas.add(sticker);
      canvas.setActiveObject(sticker);
      canvas.requestRenderAll();

      get().saveState();
    });
  },

  // ---------------------------
  // OBJECT ACTIONS
  // ---------------------------
  deleteSelected: () => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    get().saveState();
  },

  duplicateSelected: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    selectedObject.clone().then((cloned: any) => {
      cloned.set({
        left: (cloned.left ?? 0) + 20,
        top: (cloned.top ?? 0) + 20,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();

      get().saveState();
    });
  },

  // ---------------------------
  // LAYER ORDERING (SAFE CAST)
  // ---------------------------
  bringToFront: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    (canvas as any).bringToFront(selectedObject);
    canvas.requestRenderAll();

    get().saveState();
  },

  sendToBack: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    (canvas as any).sendToBack(selectedObject);
    canvas.requestRenderAll();

    get().saveState();
  },

  bringForward: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    (canvas as any).bringForward(selectedObject);
    canvas.requestRenderAll();

    get().saveState();
  },

  sendBackward: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    (canvas as any).sendBackward(selectedObject);
    canvas.requestRenderAll();

    get().saveState();
  },
}));