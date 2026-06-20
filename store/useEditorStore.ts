import { Canvas as FabricCanvas, Textbox } from "fabric";
import { create } from "zustand";

type EditorStore = {
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
  addText: () => void;
  deleteSelected: () => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
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
    canvas.requestRenderAll();
  },
  deleteSelected: () => {
    const { canvas } = get();
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject) {
      return;
    }

    canvas.remove(activeObject);
    canvas.requestRenderAll();
  },
}));
