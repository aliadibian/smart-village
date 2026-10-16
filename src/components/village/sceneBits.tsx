// اجزای طبیعت و آسمان — همه دست‌نویس SVG تا هیچ تصویر خارجی‌ای لازم نباشه

export function Cloud({ x, y, s = 1, o = 0.9 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="#FFFFFF">
      <ellipse cx={0} cy={0} rx={48} ry={18} />
      <ellipse cx={-34} cy={7} rx={30} ry={14} />
      <ellipse cx={36} cy={7} rx={34} ry={15} />
      <ellipse cx={6} cy={-12} rx={30} ry={15} />
    </g>
  );
}

const TREE_GREENS = ["#5E9E58", "#4C8C4E", "#6FAF63"];

export function Tree({
  x,
  y,
  s = 1,
  tone = 0,
  delay = 0,
  fruit = false,
}: {
  x: number;
  y: number;
  s?: number;
  tone?: number;
  delay?: number;
  fruit?: boolean;
}) {
  const g = TREE_GREENS[tone % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sway svg-anim-bottom" style={{ animationDelay: `${delay}s` }}>
        <rect x={-5} y={-28} width={10} height={32} rx={3} fill="#8A6240" />
        <circle cx={-17} cy={-34} r={17} fill={g} />
        <circle cx={17} cy={-34} r={17} fill={g} />
        <circle cx={0} cy={-48} r={24} fill={g} />
        <circle cx={-6} cy={-52} r={10} fill="#FFFFFF" opacity={0.14} />
        {fruit && (
          <g fill="#D9534F">
            <circle cx={-14} cy={-38} r={3.2} />
            <circle cx={8} cy={-46} r={3.2} />
            <circle cx={20} cy={-32} r={3.2} />
            <circle cx={-2} cy={-58} r={3.2} />
          </g>
        )}
      </g>
    </g>
  );
}

export function PineTree({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sway svg-anim-bottom" style={{ animationDelay: `${delay}s`, animationDuration: "5.6s" }}>
        <rect x={-3.5} y={-18} width={7} height={22} rx={2.5} fill="#7A5230" />
        <path d="M0 -74 L17 -46 L8 -46 L22 -22 L-22 -22 L-8 -46 L-17 -46 Z" fill="#3E7C55" />
        <path d="M0 -74 L10 -56 L-10 -56 Z" fill="#4E8C62" />
      </g>
    </g>
  );
}

export function Bush({ x, y, s = 1, tone = 0 }: { x: number; y: number; s?: number; tone?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={TREE_GREENS[tone % 3]}>
      <ellipse cx={0} cy={0} rx={22} ry={13} />
      <ellipse cx={-14} cy={3} rx={14} ry={10} />
      <ellipse cx={15} cy={3} rx={15} ry={10} />
      <circle cx={-6} cy={-6} r={3} fill="#FFFFFF" opacity={0.16} />
    </g>
  );
}

const FLOWER_COLORS = ["#E4807F", "#E8B24A", "#C4623A", "#B58AD9", "#F0F0E8"];

export function Flower({ x, y, s = 1, tone = 0, delay = 0 }: { x: number; y: number; s?: number; tone?: number; delay?: number }) {
  const c = FLOWER_COLORS[tone % FLOWER_COLORS.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="wobble svg-anim-bottom" style={{ animationDelay: `${delay}s` }}>
      <line x1={0} y1={0} x2={0} y2={-11} stroke="#7AA94E" strokeWidth={2} />
      <path d="M0 -4 Q -5 -6 -6 -10" stroke="#7AA94E" strokeWidth={1.6} fill="none" />
      <g transform="translate(0 -13)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-4} rx={2.6} ry={3.6} fill={c} transform={`rotate(${a})`} />
        ))}
        <circle r={2.2} fill="#F6E2A0" />
      </g>
    </g>
  );
}

// چندتا گل با هم — دست‌آزموده و نامنظم که طبیعی دیده بشه
export function FlowerCluster({ x, y, s = 1, seed = 0 }: { x: number; y: number; s?: number; seed?: number }) {
  const spots: [number, number, number][] = [
    [0, 0, 0],
    [14, 4, 2],
    [-12, 5, 1],
    [6, -6, 3],
    [-4, 9, 4],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {spots.map(([dx, dy, tone], i) => (
        <Flower key={i} x={dx} y={dy} s={0.9 + ((seed + i) % 3) * 0.12} tone={(tone + seed) % 5} delay={i * 0.4} />
      ))}
    </g>
  );
}

export function GrassTuft({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#7AA94E" strokeWidth={2.6} fill="none" strokeLinecap="round">
      <path d="M0 0 q 3 -13 6 0 q 3 -13 6 0 q 3 -13 6 0" />
    </g>
  );
}

export function Rock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={13} ry={8} fill="#9AA5A8" />
      <ellipse cx={-3} cy={-1} rx={8} ry={5} fill="#B7C0C2" />
      <ellipse cx={10} cy={3} rx={7} ry={5} fill="#8B979A" />
    </g>
  );
}

// سایه‌ی ابر روی زمین — خیلی محو، همراه ابرها جابه‌جا می‌شه
export function CloudShadow({ y, dur, delay }: { y: number; dur: number; delay: number }) {
  return (
    <g className="cloud-drift" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
      <ellipse cx={0} cy={y} rx={150} ry={34} fill="#143629" opacity={0.05} />
      <ellipse cx={90} cy={y + 14} rx={90} ry={22} fill="#143629" opacity={0.045} />
    </g>
  );
}

export function Balloon() {
  return (
    <g className="balloon-drift">
      <g className="float-y" style={{ animationDuration: "5s" }}>
        <g transform="scale(0.9)">
          {/* بالن */}
          <path d="M0 -78 C 30 -78 44 -52 44 -30 C 44 -4 22 18 0 24 C -22 18 -44 -4 -44 -30 C -44 -52 -30 -78 0 -78 Z" fill="#C4623A" />
          <path d="M0 -78 C 12 -78 18 -52 18 -30 C 18 -4 8 18 0 24 C -8 18 -18 -4 -18 -30 C -18 -52 -12 -78 0 -78 Z" fill="#E8B24A" opacity={0.9} />
          <path d="M-44 -30 L44 -30" stroke="#A04B29" strokeWidth={2} opacity={0.4} />
          <path d="M-38 -54 C -12 -62 12 -62 38 -54" stroke="#A04B29" strokeWidth={2} fill="none" opacity={0.35} />
          {/* طناب‌ها و سبد */}
          <line x1={-14} y1={20} x2={-9} y2={40} stroke="#7A5230" strokeWidth={1.6} />
          <line x1={14} y1={20} x2={9} y2={40} stroke="#7A5230" strokeWidth={1.6} />
          <rect x={-12} y={40} width={24} height={16} rx={3} fill="#A9805A" stroke="#7A5230" strokeWidth={1.5} />
          <line x1={-12} y1={46} x2={12} y2={46} stroke="#7A5230" strokeWidth={1} opacity={0.6} />
          <circle cx={0} cy={-46} r={7} fill="#FFFFFF" opacity={0.25} />
        </g>
      </g>
    </g>
  );
}

export function Butterfly({ x, y, s = 1, dur = 9, delay = 0, tone = 0 }: { x: number; y: number; s?: number; dur?: number; delay?: number; tone?: number }) {
  const c = tone === 0 ? "#E4807F" : "#B58AD9";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="butterfly-wander" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <g className="butterfly-flap" style={{ animationDelay: `${delay * 0.7}s` }}>
          <ellipse cx={-6} cy={-2} rx={6.5} ry={4.5} fill={c} transform="rotate(-24 -6 -2)" />
          <ellipse cx={6} cy={-2} rx={6.5} ry={4.5} fill={c} transform="rotate(24 6 -2)" />
          <ellipse cx={-4.5} cy={3} rx={4.5} ry={3.2} fill={c} opacity={0.75} transform="rotate(-14 -4.5 3)" />
          <ellipse cx={4.5} cy={3} rx={4.5} ry={3.2} fill={c} opacity={0.75} transform="rotate(14 4.5 3)" />
        </g>
        <ellipse cx={0} cy={0} rx={1.6} ry={5} fill="#4A3B32" />
      </g>
    </g>
  );
}
