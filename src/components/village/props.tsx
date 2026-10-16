// اسباب‌وسازهای روستا: آسیاب، پل، جانورها و ریزه‌کاری‌های هر مکان

const TRUNK = "#8A6240";
const WOOD = "#7A5230";
const WOOD_LIGHT = "#A9805A";

export function Windmill({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* بدنه‌ی مخروطی */}
      <path d="M-26 0 L-17 -78 L17 -78 L26 0 Z" fill="#F0E4C8" stroke="#D9BE93" strokeWidth={2} />
      <path d="M-17 -78 L0 -96 L17 -78 Z" fill="#C4623A" />
      <rect x={-5} y={-22} width={10} height={22} rx={2} fill={TRUNK} />
      <rect x={-14} y={-48} width={9} height={11} rx={2} fill="#BFE3EA" stroke="#FFFCF4" strokeWidth={1.5} />
      <rect x={6} y={-58} width={9} height={11} rx={2} fill="#BFE3EA" stroke="#FFFCF4" strokeWidth={1.5} />
      <path d="M-22 -12 h44" stroke="#D9BE93" strokeWidth={2} />
      {/* پره‌ها — می‌چرخن */}
      <g transform="translate(0 -86)">
        <g className="rotor">
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1={0} y1={0} x2={0} y2={-34} stroke={WOOD} strokeWidth={3.5} />
              <path d="M2 -8 L11 -30 L3 -33 Z" fill="#F6F0DC" stroke="#D9C9A0" strokeWidth={1} />
            </g>
          ))}
          <circle r={4.5} fill={WOOD} />
        </g>
      </g>
    </g>
  );
}

// پل چوبی که جاده از روی رودخانه رد می‌شه
export function Bridge({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-46 6 Q 0 20 46 6" stroke={WOOD} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M-46 8 Q 0 22 46 8" stroke="#5F3D2D" strokeWidth={1.6} fill="none" opacity={0.5} />
      <path d="M-52 -4 L52 -4 L46 8 L-46 8 Z" fill={WOOD_LIGHT} stroke={WOOD} strokeWidth={1.6} />
      {[-44, -33, -22, -11, 0, 11, 22, 33, 44].map((px) => (
        <line key={px} x1={px * 0.94} y1={-4} x2={px * 0.88} y2={8} stroke={WOOD} strokeWidth={1.2} opacity={0.65} />
      ))}
      {[-40, -20, 0, 20, 40].map((px) => (
        <line key={px} x1={px} y1={-4} x2={px} y2={-16} stroke={WOOD} strokeWidth={2.4} strokeLinecap="round" />
      ))}
      <line x1={-46} y1={-16} x2={46} y2={-16} stroke={WOOD} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function Sheep({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* پاها */}
      <g stroke={WOOD} strokeWidth={2.6} strokeLinecap="round">
        <line x1={-8} y1={8} x2={-8} y2={14} />
        <line x1={8} y1={8} x2={8} y2={14} />
      </g>
      {/* بدن پشمالو */}
      <g>
        <ellipse cx={0} cy={0} rx={15} ry={10} fill="#F3F0E4" />
        <circle cx={-9} cy={-6} r={6} fill="#F3F0E4" />
        <circle cx={0} cy={-8} r={7} fill="#F3F0E4" />
        <circle cx={9} cy={-6} r={6} fill="#F3F0E4" />
      </g>
      {/* سر که تکان می‌خوره (چرا کردن) */}
      <g className="nibble" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx={16} cy={-3} rx={6} ry={5} fill="#4A3B32" />
        <ellipse cx={19} cy={0} rx={3.6} ry={2.6} fill="#3A2E26" />
        <circle cx={17} cy={-5} r={1.1} fill="#F6F2E6" />
      </g>
    </g>
  );
}

export function Chicken({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="peck" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx={0} cy={0} rx={8} ry={6.5} fill="#F6F2E6" />
        <path d="M-8 -1 Q -13 0 -11 -5 Q -8 -8 -5 -6 Z" fill="#F6F2E6" />
        <circle cx={-7} cy={-7} r={4.4} fill="#F6F2E6" />
        <path d="M-11 -7 L-14.5 -6 L-11 -5 Z" fill="#E8B24A" />
        <path d="M-7 -11 Q -6 -14 -4 -12" stroke="#D9534F" strokeWidth={2} fill="none" strokeLinecap="round" />
        <circle cx={-8.2} cy={-7.5} r={0.9} fill="#24312B" />
        <path d="M-2 6 L-2 10 M3 6 L3 10" stroke={WOOD} strokeWidth={1.8} strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Duck({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={12} ry={3.4} fill="#3E7C8A" opacity={0.25} className="float-y" style={{ animationDelay: `${delay}s` }} />
      <g className="float-y" style={{ animationDelay: `${delay}s`, animationDuration: "2.6s" }}>
        <ellipse cx={0} cy={0} rx={9} ry={5.5} fill="#F6F2E6" />
        <path d="M6 -3 Q 13 -5 14 -1 Q 13 2 7 2 Z" fill="#F6F2E6" />
        <path d="M13 -2 L18 -1 L13 1 Z" fill="#E8B24A" />
        <circle cx={11} cy={-3.4} r={1} fill="#24312B" />
      </g>
    </g>
  );
}

export function Cat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#4A3B32">
      <ellipse cx={0} cy={0} rx={7.5} ry={5.5} />
      <circle cx={-6} cy={-7} r={4.6} />
      <path d="M-9.5 -9.5 L-10.5 -14 L-7 -11.5 Z" />
      <path d="M-3 -11 L-1.5 -14.5 L-0.5 -10.5 Z" />
      <path d="M7 0 Q 13 2 12 8" stroke="#4A3B32" strokeWidth={2.4} fill="none" strokeLinecap="round" className="wobble" style={{ transformOrigin: "7px 0px" }} />
      <circle cx={-7.5} cy={-7.5} r={0.8} fill="#F6F2E6" />
    </g>
  );
}

// رخت‌کن بین دو تا خونه
export function Clothesline({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={-26} y1={0} x2={26} y2={4} stroke={WOOD} strokeWidth={1.8} />
      <g className="sway svg-anim-bottom" style={{ animationDuration: "5.2s" }}>
        <line x1={-13} y1={1.4} x2={-13} y2={5} stroke={WOOD} strokeWidth={1} />
        <path d="M-17 5 h8 v9 h-3 v-2 h-2 v2 h-3 Z" fill="#4E9FB5" />
      </g>
      <g className="sway svg-anim-bottom" style={{ animationDuration: "6.1s", animationDelay: "0.8s" }}>
        <line x1={3} y1={2.3} x2={3} y2={6} stroke={WOOD} strokeWidth={1} />
        <rect x={-1} y={6} width={8} height={10} rx={1.5} fill="#E4807F" />
      </g>
      <g className="sway svg-anim-bottom" style={{ animationDuration: "5.7s", animationDelay: "1.6s" }}>
        <line x1={17} y1={3.2} x2={17} y2={7} stroke={WOOD} strokeWidth={1} />
        <rect x={13} y={7} width={9} height={8} rx={4} fill="#E8B24A" />
      </g>
    </g>
  );
}

export function SatelliteDish({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <line x1={0} y1={0} x2={0} y2={-12} stroke="#6B7B86" strokeWidth={3} strokeLinecap="round" />
      <g transform="rotate(-38) translate(0 -14)">
        <path d="M-11 0 A 11 11 0 0 1 11 0 L 8 3 L -8 3 Z" fill="#DDE4E8" stroke="#B9C4CA" strokeWidth={1.5} />
        <line x1={0} y1={-2} x2={0} y2={-9} stroke="#6B7B86" strokeWidth={1.4} />
        <circle cx={0} cy={-10} r={1.8} fill="#6B7B86" />
      </g>
    </g>
  );
}

export function Scarecrow({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={-38} x2={0} y2={6} stroke={WOOD} strokeWidth={3.4} strokeLinecap="round" />
      <line x1={-16} y1={-26} x2={16} y2={-26} stroke={WOOD} strokeWidth={3} strokeLinecap="round" />
      <g className="sway svg-anim-bottom" style={{ animationDelay: `${delay}s`, animationDuration: "6.4s" }}>
        {/* پیراهن وصله‌دار */}
        <path d="M-9 -34 L9 -34 L12 -19 L4 -21 L0 -19 L-4 -21 L-12 -19 Z" fill="#C4623A" />
        <rect x={2} y={-31} width={4.5} height={4.5} fill="#F3E2C2" opacity={0.85} transform="rotate(12 4 -29)" />
        <rect x={-7} y={-27} width={4} height={4} fill="#F3E2C2" opacity={0.85} />
        {/* سر و کلاه حصیری */}
        <circle cx={0} cy={-39} r={5.6} fill="#E3C063" />
        <circle cx={-2} cy={-40.5} r={0.9} fill="#24312B" />
        <circle cx={2} cy={-40.5} r={0.9} fill="#24312B" />
        <path d="M-6.5 -43 Q 0 -47 6.5 -43" stroke="#A8781F" strokeWidth={1.4} fill="none" />
        <rect x={-7} y={-46} width={14} height={3} rx={1.5} fill="#D9A13A" />
      </g>
    </g>
  );
}

export function HayBale({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={11} fill="#E3C063" stroke="#C9A03C" strokeWidth={1.6} />
      <circle r={6.5} fill="none" stroke="#C9A03C" strokeWidth={1.2} opacity={0.8} />
      <circle r={2.6} fill="none" stroke="#C9A03C" strokeWidth={1.2} opacity={0.8} />
    </g>
  );
}

// بارانی که برای مزرعه‌ی آبیاری آب می‌پاشه
export function Sprinkler({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={0} x2={0} y2={-14} stroke="#6E7F8A" strokeWidth={3} strokeLinecap="round" />
      <circle cx={0} cy={-16} r={3} fill="#4E9FB5" />
      {[-1, 1].map((dir) => (
        <g key={dir} transform={`scale(${dir} 1)`}>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={8 + i * 7}
              cy={-16}
              r={1.9}
              fill="#7FC4D6"
              className="sprinkle"
              style={{ animationDelay: `${i * 0.33}s` }}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

export function Bench({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-16} y={-8} width={32} height={4} rx={1.5} fill={WOOD_LIGHT} />
      <rect x={-16} y={-16} width={32} height={3.4} rx={1.5} fill={WOOD_LIGHT} />
      <line x1={-13} y1={-4} x2={-13} y2={4} stroke={WOOD} strokeWidth={2.6} />
      <line x1={13} y1={-4} x2={13} y2={4} stroke={WOOD} strokeWidth={2.6} />
      <line x1={-14} y1={-15} x2={-14} y2={-4} stroke={WOOD} strokeWidth={2} />
      <line x1={14} y1={-15} x2={14} y2={-4} stroke={WOOD} strokeWidth={2} />
    </g>
  );
}

// بازی لی‌لی با گچ حیاط مدرسه
export function Hopscotch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#E7D6AC" strokeWidth={2} fill="none" opacity={0.9}>
      <rect x={0} y={0} width={16} height={16} rx={2} />
      <rect x={16} y={16} width={16} height={16} rx={2} />
      <rect x={0} y={32} width={16} height={16} rx={2} />
      <rect x={16} y={48} width={16} height={16} rx={2} />
      <circle cx={24} cy={24} r={2.6} fill="#E8B24A" stroke="none" opacity={0.8} />
    </g>
  );
}

// پهپاد کوچیک تحویل دارو بالای درمانگاه
export function MedDrone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="bob" style={{ animationDuration: "2.4s" }}>
        <line x1={-8} y1={-4} x2={-14} y2={-8} stroke="#143629" strokeWidth={2} />
        <line x1={8} y1={-4} x2={14} y2={-8} stroke="#143629" strokeWidth={2} />
        <ellipse cx={-14} cy={-9} rx={6} ry={1.8} fill="#4A5A52" opacity={0.7} />
        <ellipse cx={14} cy={-9} rx={6} ry={1.8} fill="#4A5A52" opacity={0.7} />
        <rect x={-8} y={-7} width={16} height={8} rx={4} fill="#FFFFFF" stroke="#C9D8D4" strokeWidth={1.5} />
        <rect x={-3.5} y={-10} width={7} height={4} rx={1.5} fill="#D9534F" />
        <line x1={0} y1={1} x2={0} y2={7} stroke="#6B7B86" strokeWidth={1.4} />
        <rect x={-5} y={7} width={10} height={8} rx={1.5} fill="#FBFDFD" stroke="#C9D8D4" strokeWidth={1.4} />
        <rect x={-3.5} y={9.5} width={7} height={3} fill="#D9534F" />
      </g>
    </g>
  );
}

export function StringLights({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + 10;
  const bulbs = [0.18, 0.36, 0.5, 0.64, 0.82];
  return (
    <g>
      <path d={`M${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`} stroke="#5F4B3A" strokeWidth={1.4} fill="none" />
      {bulbs.map((t, i) => {
        // نقطه روی منحنی درجه دو
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
        const c = i % 2 ? "#E8B24A" : "#E4807F";
        return (
          <g key={i}>
            <line x1={bx} y1={by} x2={bx} y2={by + 4} stroke="#5F4B3A" strokeWidth={1} />
            <circle cx={bx} cy={by + 6.5} r={2.6} fill={c} className="twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        );
      })}
    </g>
  );
}

export function Crates({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        <rect x={0} y={-14} width={22} height={14} rx={2} fill={WOOD_LIGHT} stroke={WOOD} strokeWidth={1.4} />
        <circle cx={6} cy={-16} r={3.4} fill="#D9534F" />
        <circle cx={12} cy={-17.5} r={3.4} fill="#E4807F" />
        <circle cx={17} cy={-15.5} r={3.4} fill="#D9534F" />
      </g>
      <g transform="translate(26 0)">
        <rect x={0} y={-14} width={20} height={14} rx={2} fill={WOOD_LIGHT} stroke={WOOD} strokeWidth={1.4} />
        <circle cx={6} cy={-16} r={3.4} fill="#6FAF63" />
        <circle cx={12} cy={-17} r={3.4} fill="#5E9E58" />
        <circle cx={16} cy={-15} r={3.4} fill="#6FAF63" />
      </g>
    </g>
  );
}

export function BatteryBank({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={0} width={26} height={18} rx={3} fill="#DDE4E8" stroke="#B9C4CA" strokeWidth={1.6} />
      <rect x={3} y={3} width={8} height={5} rx={1} fill="#58D68D" />
      <rect x={3} y={10} width={8} height={5} rx={1} fill="#E8B24A" />
      <line x1={15} y1={5} x2={22} y2={5} stroke="#6B7B86" strokeWidth={1.6} />
      <line x1={15} y1={12} x2={22} y2={12} stroke="#6B7B86" strokeWidth={1.6} />
    </g>
  );
}

// عقربه‌ی فشار روی تانکر آب
export function WaterGauge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={6.5} fill="#F6F2E6" stroke="#5F7B86" strokeWidth={1.6} />
      <line x1={0} y1={0} x2={3.4} y2={-3.4} stroke="#C4623A" strokeWidth={1.4} strokeLinecap="round" className="wobble" style={{ transformOrigin: "0px 0px", animationDuration: "7s" }} />
      <circle r={1} fill="#5F7B86" />
    </g>
  );
}

export function GardenPatch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-24} y={-8} width={48} height={22} rx={4} fill="#8FBC5F" />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {[0, 1, 2, 3].map((col) => (
            <circle key={col} cx={-16 + col * 11 + row * 3} cy={-2 + row * 6.5} r={2.8} fill={row === 1 ? "#D9534F" : "#5E9E58"} />
          ))}
        </g>
      ))}
    </g>
  );
}

// تابلوی خوش‌آمد کنار جاده
export function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={2} rx={16} ry={4.5} fill="#24312B" opacity={0.12} />
      <rect x={-3} y={-64} width={6} height={64} rx={2.5} fill={WOOD} />
      {/* تابلوهای جهت‌نما */}
      <g>
        <path d="M2 -62 L66 -62 L74 -54.5 L66 -47 L2 -47 Z" fill="#C9B58E" stroke={WOOD} strokeWidth={1.6} />
        <text x={34} y={-50.5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#4A3B26" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
          مزرعه و مدرسه
        </text>
      </g>
      <g>
        <path d="M-2 -42 L-66 -42 L-74 -34.5 L-66 -27 L-2 -27 Z" fill="#C9B58E" stroke={WOOD} strokeWidth={1.6} />
        <text x={-36} y={-30.5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#4A3B26" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
          بازار و خانه‌ها
        </text>
      </g>
      {/* پرنده‌ی کوچیک روی تابلو */}
      <g transform="translate(1 -68)">
        <ellipse cx={0} cy={0} rx={4.6} ry={3.6} fill="#5A6A62" />
        <circle cx={-3.6} cy={-2.6} r={2.6} fill="#5A6A62" />
        <path d="M-6 -2.8 L-8.6 -2.2 L-6 -1.6 Z" fill="#E8B24A" />
        <path d="M3.5 -1 Q 7 0 6 4" stroke="#5A6A62" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}
