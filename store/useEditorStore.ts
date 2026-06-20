import { Canvas as FabricCanvas, FabricObject, Textbox } from "fabric";
import { create } from "zustand";

type EditorStore = {
  canvas: FabricCanvas | null;
  selectedObject: FabricObject | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
  setSelectedObject: (object: FabricObject | null) => void;
  addText: () => void;
  addSticker: (sticker: string) => void;
  deleteSelected: () => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvas: null,
  selectedObject: null,
  setCanvas: (canvas) => set({ canvas, selectedObject: null }),
  setSelectedObject: (object) => set({ selectedObject: object }),
  addText: () => {
    const { canvas } = get();

    if (!canvas) {
      return;
    }

    const text = new Textbox("New text", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      width: 220,
      fontSize: 28,
      fill: "#4b3a30",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    set({ selectedObject: text });
    canvas.requestRenderAll();
  },
  addSticker: (sticker) => {
    const { canvas } = get();

    if (!canvas) {
      return;
    }

    const stickerObject = new Textbox(sticker, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      width: 90,
      fontSize: 42,
      fill: "#7d4f3a",
      textAlign: "center",
    });

    canvas.add(stickerObject);
    canvas.setActiveObject(stickerObject);
    set({ selectedObject: stickerObject });
    canvas.requestRenderAll();
  },
  deleteSelected: () => {
    const { canvas } = get();
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject) {
      return;
    }

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    set({ selectedObject: null });
    canvas.requestRenderAll();
  },
}));
