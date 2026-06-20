import type { FabricObject, IText } from "fabric";
import { Type, Image as ImageIcon, Trash2 } from "lucide-react";

type Props = {
  objects: FabricObject[];
  selected: FabricObject | null;
  onSelect: (obj: FabricObject) => void;
  onDelete: (obj: FabricObject) => void;
};

function labelFor(o: FabricObject, i: number) {
  if (o.type === "i-text" || o.type === "textbox" || o.type === "text") {
    const t = (o as IText).text ?? "";
    return t.trim().slice(0, 22) || `Text ${i + 1}`;
  }
  return `Sticker ${i + 1}`;
}

export default function LayersPanel({ objects, selected, onSelect, onDelete }: Props) {
  return (
    <aside className="w-64 shrink-0 border-l border-[#e8dcc4]/60 bg-[#fbf6ec]/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#7a5a44]">
        Layers
      </div>
      {objects.length === 0 && (
        <p className="text-xs text-[#7a5a44]/70 italic">
          Nothing here yet. Add text or a sticker to begin.
        </p>
      )}
      <ul className="space-y-1.5">
        {[...objects].reverse().map((o, idx) => {
          const i = objects.length - 1 - idx;
          const isText =
            o.type === "i-text" || o.type === "textbox" || o.type === "text";
          const active = selected === o;
          return (
            <li key={i}>
              <div
                className={`group flex items-center gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition ${
                  active
                    ? "border-[#7a5a44] bg-white"
                    : "border-[#e8dcc4] bg-white/50 hover:bg-white"
                }`}
                onClick={() => onSelect(o)}
              >
                {isText ? (
                  <Type className="h-3.5 w-3.5 text-[#7a5a44]" />
                ) : (
                  <ImageIcon className="h-3.5 w-3.5 text-[#7a5a44]" />
                )}
                <span className="text-sm text-[#3b2f25] truncate flex-1">
                  {labelFor(o, i)}
                </span>
                <button
                  type="button"
                  aria-label={`Delete ${labelFor(o, i)}`}
                  title={`Delete ${labelFor(o, i)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(o);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#7a5a44] hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
