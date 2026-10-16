import type { ReactNode } from "react";
import type { LocationId, VillageLocation } from "../../data/locations";
import { cn } from "../../utils/cn";

// ناحیه‌ی قابل کلیک هر مکان — با حلقه‌ی انتخاب، نشان مکان‌نما و برچسب شناور
export function Hotspot({
  loc,
  index,
  selected,
  visited,
  onSelect,
  children,
}: {
  loc: VillageLocation;
  index: number;
  selected: boolean;
  visited: boolean;
  onSelect: (id: LocationId) => void;
  children: ReactNode;
}) {
  const { box, anchor } = loc;
  const labelW = loc.name.length * 10.5 + 32;

  return (
    <g
      className={cn("hotspot scene-in", selected && "is-selected")}
      role="button"
      tabIndex={0}
      aria-label={`${loc.name} — مشاهده توضیحات`}
      onClick={() => onSelect(loc.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(loc.id);
        }
      }}
      style={{ animationDelay: `${0.55 + index * 0.09}s` }}
    >
      {/* ناحیه‌ی کلیک پهن — روی موبایل حیاتی‌ه */}
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="transparent" />

      {selected && (
        <>
          <rect x={box.x - 6} y={box.y - 6} width={box.w + 12} height={box.h + 12} rx={24} fill="none" stroke="#E8B24A" strokeWidth={14} opacity={0.18} />
          <rect x={box.x - 6} y={box.y - 6} width={box.w + 12} height={box.h + 12} rx={24} fill="none" stroke="#E8B24A" strokeWidth={4} strokeDasharray="14 10" className="march-ring" />
        </>
      )}

      <g className="hot-inner">
        <ellipse cx={anchor.x} cy={box.y + box.h - 4} rx={box.w * 0.32} ry={10} fill="#24312B" opacity={0.12} />
        {children}
      </g>

      {/* نشان بالای هر مکان: طلایی چشمک‌زن تا وقتی ندیدی، سبز بعد از دیدن */}
      <g className={cn(!visited && "pulse-dot svg-anim")}>
        <circle cx={box.x + box.w / 2} cy={box.y - 4} r={9} fill={visited ? "#4C8C55" : "#E8B24A"} stroke="#FFFCF4" strokeWidth={3} />
        {visited ? (
          <path
            d={`M ${box.x + box.w / 2 - 3.4} ${box.y - 4} l 2.4 2.6 l 4.4 -5.2`}
            stroke="#FFFCF4"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle cx={box.x + box.w / 2} cy={box.y - 4} r={3} fill="#FFFCF4" />
        )}
      </g>

      {/* برچسب هنگام هاور/انتخاب */}
      <g className="hot-label">
        <rect x={anchor.x - labelW / 2} y={box.y - 44} width={labelW} height={32} rx={16} fill="#24312B" opacity={0.94} />
        <path d={`M ${anchor.x - 7} ${box.y - 14} L ${anchor.x + 7} ${box.y - 14} L ${anchor.x} ${box.y - 6} Z`} fill="#24312B" opacity={0.94} />
        <text x={anchor.x} y={box.y - 21} textAnchor="middle" fontSize={17} fontWeight={700} fill="#FFFCF4" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
          {loc.name}
        </text>
      </g>
    </g>
  );
}
