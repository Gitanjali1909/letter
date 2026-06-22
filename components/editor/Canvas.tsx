"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export default function Canvas() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const {
    canvas,
    setCanvas,
    setSelectedObject,
    zoom,
    setZoom,
    setPanOffset,
    gridEnabled,
    snapEnabled,
    saveState,
    deleteSelected,
    duplicateSelected,
    undo,
    redo,
  } = useEditorStore();

  useEffect(() => {
    if (!canvasElementRef.current || canvas) return;

    let fabricCanvas: any;

    import("fabric").then((fabric) => {
      if (!canvasElementRef.current) return;

      // Premium custom selection handles styling
      fabric.FabricObject.prototype.transparentCorners = false;
      fabric.FabricObject.prototype.cornerColor = "#ffffff";
      fabric.FabricObject.prototype.cornerStrokeColor = "#a8745a"; // Warm brown border
      fabric.FabricObject.prototype.cornerStyle = "circle";
      fabric.FabricObject.prototype.cornerSize = 10;
      fabric.FabricObject.prototype.borderColor = "#a8745a";
      fabric.FabricObject.prototype.borderScaleFactor = 1.5;

      // Ensure custom properties are always serialized in toJSON using static member
      const customProps = [
        "__meta",
        "selectable",
        "hasControls",
        "lockMovementX",
        "lockMovementY",
        "lockScalingX",
        "lockScalingY",
        "lockRotation",
      ];
      if (fabric.FabricObject.stateProperties) {
        fabric.FabricObject.stateProperties.push(...customProps);
      }

      fabricCanvas = new fabric.Canvas(canvasElementRef.current, {
        width: 720,
        height: 960,
        backgroundColor: "#fffaf2",
        preserveObjectStacking: true,
        selectionColor: "rgba(168, 116, 90, 0.1)",
        selectionBorderColor: "rgba(168, 116, 90, 0.4)",
        selectionLineWidth: 1,
      });

      setCanvas(fabricCanvas);
      setIsReady(true);

      // Selection listeners
      fabricCanvas.on("selection:created", (e: any) => {
        setSelectedObject(e.selected?.[0] ?? null);
      });
      fabricCanvas.on("selection:updated", (e: any) => {
        setSelectedObject(e.selected?.[0] ?? null);
      });
      fabricCanvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      // Save history state on key actions
      fabricCanvas.on("object:added", () => saveState());
      fabricCanvas.on("object:removed", () => saveState());
      fabricCanvas.on("object:modified", () => saveState());

      // Grid Rendering and Guides Rendering in after:render
      let activeGuides: Array<{ type: "horizontal" | "vertical"; x?: number; y?: number }> = [];

      fabricCanvas.on("after:render", (opt: any) => {
        const ctx = opt.ctx;
        if (!ctx) return;

        const currentZoom = fabricCanvas.getZoom();
        const vpt = fabricCanvas.viewportTransform;
        if (!vpt) return;

        // Draw background grid
        if (gridEnabled) {
          ctx.save();
          ctx.strokeStyle = "rgba(168, 116, 90, 0.06)";
          ctx.lineWidth = 1;

          const gridSize = 40 * currentZoom;
          const panX = vpt[4];
          const panY = vpt[5];
          const width = fabricCanvas.width || 720;
          const height = fabricCanvas.height || 960;

          ctx.beginPath();
          for (let x = panX % gridSize; x < width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
          }
          for (let y = panY % gridSize; y < height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Draw Snapping Guides in Canvas Space
        if (activeGuides.length > 0) {
          ctx.save();
          // Transform context to match canvas viewport
          ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
          ctx.strokeStyle = "#a8745a";
          ctx.lineWidth = 1.2 / currentZoom;
          ctx.setLineDash([4 / currentZoom, 4 / currentZoom]);
          ctx.beginPath();
          activeGuides.forEach((guide) => {
            if (guide.type === "horizontal" && typeof guide.y === "number") {
              ctx.moveTo(-5000, guide.y);
              ctx.lineTo(5000, guide.y);
            } else if (guide.type === "vertical" && typeof guide.x === "number") {
              ctx.moveTo(guide.x, -5000);
              ctx.lineTo(guide.x, 5000);
            }
          });
          ctx.stroke();
          ctx.restore();
        }
      });

      // Snapping Logic
      const SNAP_THRESHOLD = 8;
      fabricCanvas.on("object:moving", (e: any) => {
        if (!snapEnabled) return;
        const activeObj = e.target;
        if (!activeObj) return;

        const objLeft = activeObj.left;
        const objTop = activeObj.top;
        const objWidth = activeObj.width * activeObj.scaleX;
        const objHeight = activeObj.height * activeObj.scaleY;

        const objCenterX = objLeft + objWidth / 2;
        const objCenterY = objTop + objHeight / 2;
        const objRight = objLeft + objWidth;
        const objBottom = objTop + objHeight;

        let snapX: number | null = null;
        let snapY: number | null = null;
        const newGuides: typeof activeGuides = [];

        // Snap targets
        const canvasWidth = fabricCanvas.width || 720;
        const canvasHeight = fabricCanvas.height || 960;

        const targetsX = [
          { value: 0 },
          { value: canvasWidth / 2 },
          { value: canvasWidth },
        ];
        const targetsY = [
          { value: 0 },
          { value: canvasHeight / 2 },
          { value: canvasHeight },
        ];

        // Other objects on canvas
        const otherObjects = fabricCanvas.getObjects().filter((o: any) => o !== activeObj);
        otherObjects.forEach((obj: any) => {
          const oLeft = obj.left;
          const oTop = obj.top;
          const oWidth = obj.width * obj.scaleX;
          const oHeight = obj.height * obj.scaleY;
          const oCenterX = oLeft + oWidth / 2;
          const oCenterY = oTop + oHeight / 2;
          const oRight = oLeft + oWidth;
          const oBottom = oTop + oHeight;

          targetsX.push({ value: oLeft }, { value: oCenterX }, { value: oRight });
          targetsY.push({ value: oTop }, { value: oCenterY }, { value: oBottom });
        });

        // X Snapping
        for (const target of targetsX) {
          if (Math.abs(objLeft - target.value) < SNAP_THRESHOLD) {
            snapX = target.value;
            newGuides.push({ type: "vertical", x: target.value });
            break;
          }
          if (Math.abs(objCenterX - target.value) < SNAP_THRESHOLD) {
            snapX = target.value - objWidth / 2;
            newGuides.push({ type: "vertical", x: target.value });
            break;
          }
          if (Math.abs(objRight - target.value) < SNAP_THRESHOLD) {
            snapX = target.value - objWidth;
            newGuides.push({ type: "vertical", x: target.value });
            break;
          }
        }

        // Y Snapping
        for (const target of targetsY) {
          if (Math.abs(objTop - target.value) < SNAP_THRESHOLD) {
            snapY = target.value;
            newGuides.push({ type: "horizontal", y: target.value });
            break;
          }
          if (Math.abs(objCenterY - target.value) < SNAP_THRESHOLD) {
            snapY = target.value - objHeight / 2;
            newGuides.push({ type: "horizontal", y: target.value });
            break;
          }
          if (Math.abs(objBottom - target.value) < SNAP_THRESHOLD) {
            snapY = target.value - objHeight;
            newGuides.push({ type: "horizontal", y: target.value });
            break;
          }
        }

        if (snapX !== null) activeObj.set("left", snapX);
        if (snapY !== null) activeObj.set("top", snapY);

        activeGuides = newGuides;
        fabricCanvas.requestRenderAll();
      });

      fabricCanvas.on("object:modified", () => {
        activeGuides = [];
        fabricCanvas.requestRenderAll();
      });

      // Zoom via Ctrl + Scroll / Scroll to Pan
      fabricCanvas.on("mouse:wheel", (opt: any) => {
        const evt = opt.e;
        if (evt.ctrlKey) {
          const delta = evt.deltaY;
          let currentZoom = fabricCanvas.getZoom();
          currentZoom *= 0.999 ** delta;
          if (currentZoom > 5) currentZoom = 5;
          if (currentZoom < 0.1) currentZoom = 0.1;

          const pointer = fabricCanvas.getPointer(evt);
          fabricCanvas.zoomToPoint({ x: pointer.x, y: pointer.y }, currentZoom);

          setZoom(currentZoom);
          const vpt = fabricCanvas.viewportTransform;
          if (vpt) setPanOffset({ x: vpt[4], y: vpt[5] });

          evt.preventDefault();
          evt.stopPropagation();
        } else {
          const vpt = fabricCanvas.viewportTransform;
          if (vpt) {
            vpt[4] -= evt.deltaX;
            vpt[5] -= evt.deltaY;
            fabricCanvas.requestRenderAll();
            setPanOffset({ x: vpt[4], y: vpt[5] });
          }
          evt.preventDefault();
          evt.stopPropagation();
        }
      });

      // Panning via Spacebar + Drag
      let isDragging = false;
      let lastPosX = 0;
      let lastPosY = 0;

      fabricCanvas.on("mouse:down", (opt: any) => {
        const evt = opt.e;
        if (spacePressedRef.current || evt.button === 1) {
          isDragging = true;
          fabricCanvas.setCursor("grabbing");
          lastPosX = evt.clientX;
          lastPosY = evt.clientY;
          fabricCanvas.selection = false;
        }
      });

      fabricCanvas.on("mouse:move", (opt: any) => {
        if (isDragging) {
          const evt = opt.e;
          const vpt = fabricCanvas.viewportTransform;
          if (vpt) {
            vpt[4] += evt.clientX - lastPosX;
            vpt[5] += evt.clientY - lastPosY;
            fabricCanvas.requestRenderAll();
            setPanOffset({ x: vpt[4], y: vpt[5] });
          }
          lastPosX = evt.clientX;
          lastPosY = evt.clientY;
        }
      });

      fabricCanvas.on("mouse:up", () => {
        if (isDragging) {
          isDragging = false;
          fabricCanvas.selection = true;
          fabricCanvas.setCursor(spacePressedRef.current ? "grab" : "default");
        }
      });
    });

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      setCanvas(null);
      setSelectedObject(null);
      setIsReady(false);
    };
  }, [canvas, setCanvas, setSelectedObject, setZoom, setPanOffset, gridEnabled, snapEnabled, saveState]);

  // Keep ref of space key status to use in event listeners
  const spacePressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        (canvas && canvas.getActiveObject() && (canvas.getActiveObject() as any).isEditing)
      ) {
        return;
      }

      if (e.code === "Space") {
        spacePressedRef.current = true;
        if (canvas) {
          canvas.defaultCursor = "grab";
          canvas.setCursor("grab");
        }
        e.preventDefault();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
        e.preventDefault();
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        duplicateSelected();
        e.preventDefault();
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        undo();
        e.preventDefault();
      } else if (e.key === "y" && (e.ctrlKey || e.metaKey)) {
        redo();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressedRef.current = false;
        if (canvas) {
          canvas.defaultCursor = "default";
          canvas.setCursor("default");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvas, deleteSelected, duplicateSelected, undo, redo]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[78vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#e8dcc4]/50 bg-[#ebdccb]/30 p-8 shadow-[inset_0_2px_12px_rgba(92,64,38,0.06)]"
    >
      <div
        className="relative scale-90 select-none rounded-xl bg-[#fffaf0] p-4 shadow-[0_25px_70px_rgba(92,64,38,0.15),0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(168,116,90,0.04), transparent 45%), radial-gradient(circle at 85% 85%, rgba(168,116,90,0.05), transparent 45%)",
          transform: `scale(${zoom * 0.95})`,
          transformOrigin: "center center",
        }}
      >
        <canvas ref={canvasElementRef} className="block rounded-lg border border-[#e8dcc4]/30" />
        
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#fffaf0]/90 text-sm font-medium text-[#7a5a44]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7a5a44] border-t-transparent" />
            <span>preparing your high-grade paper...</span>
          </div>
        )}
      </div>
    </div>
  );
}