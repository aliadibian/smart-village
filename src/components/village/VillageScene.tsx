import { useRef } from "react";
import { LOCATIONS, type LocationId } from "../../data/locations";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { Hotspot } from "./Hotspot";
import {
  Balloon,
  Bush,
  Butterfly,
  Cloud,
  CloudShadow,
  Flower,
  FlowerCluster,
  GrassTuft,
  PineTree,
  Rock,
  Tree,
} from "./sceneBits";
import {
  BatteryBank,
  Bench,
  Bridge,
  Cat,
  Chicken,
  Clothesline,
  Crates,
  Duck,
  GardenPatch,
  HayBale,
  Hopscotch,
  MedDrone,
  SatelliteDish,
  Scarecrow,
  Sheep,
  Signpost,
  Sprinkler,
  StringLights,
  WaterGauge,
  Windmill,
} from "./props";

function SolarPanel({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={6} y1={34} x2={6} y2={46} stroke="#6B7B86" strokeWidth={4} />
      <line x1={42} y1={24} x2={42} y2={46} stroke="#6B7B86" strokeWidth={4} />
      <path d="M0 8 L48 18 L48 42 L0 32 Z" fill="#2E4E7E" stroke="#22375B" strokeWidth={2} strokeLinejoin="round" />
      <path d="M16 12 L16 36 M32 16 L32 40" stroke="#5A86C4" strokeWidth={2} />
      <line x1={8} y1={14} x2={40} y2={22} stroke="#BFD9F5" strokeWidth={3} strokeLinecap="round" className="glint" style={{ animationDelay: `${delay}s` }} />
    </g>
  );
}

export default function VillageScene({
  selectedId,
  visited,
  onSelect,
}: {
  selectedId: LocationId | null;
  visited: Set<LocationId>;
  onSelect: (id: LocationId) => void;
}) {
  const selected = selectedId ? LOCATIONS.find((l) => l.id === selectedId) ?? null : null;
  const isMobile = useIsMobile();
  const cameraRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    // لمس نه — پارالاکس فقط برای موس معنی داره
    if (e.pointerType === "touch" || selectedId || !cameraRef.current) return;
    const el = cameraRef.current.parentElement!;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * -14;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * -9;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (parallaxRef.current) parallaxRef.current.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    });
  };

  const onLeave = () => {
    if (parallaxRef.current) parallaxRef.current.style.transform = "translate3d(0,0,0)";
  };

  // دوربین: روی دسکتاپ نقطه‌ی انتخاب می‌ره سمت چپ (جای پنل باز)؛
  // روی موبایل که پنل تمام‌عرض باز می‌شه، مرکز صحنه هدف گرفته می‌شه
  const ZOOM = 1.28;
  const focusX = isMobile ? 50 : 72;
  const focusY = isMobile ? 42 : 50;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(20,54,41,0.45)] ring-1 ring-ink/10"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ aspectRatio: "16 / 10" }}
    >
      <div
        ref={cameraRef}
        className="camera h-full w-full will-change-transform"
        style={{
          transform: selected ? `scale(${ZOOM})` : "scale(1)",
          transformOrigin: selected
            ? `${(((selected.anchor.x / 1600) * 100 * ZOOM - focusX) / (ZOOM - 1))}% ${(((selected.anchor.y / 900) * 100 * ZOOM - focusY) / (ZOOM - 1))}%`
            : "center",
          transition:
            "transform 1.15s cubic-bezier(0.3, 0.85, 0.3, 1), transform-origin 1.15s cubic-bezier(0.3, 0.85, 0.3, 1)",
        }}
      >
        <div ref={parallaxRef} className="h-full w-full transition-transform duration-500 ease-out">
          <svg viewBox="0 0 1600 900" className="block h-full w-full" role="img" aria-label="نقشه‌ی تعاملی روستای هوشمند">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A5DCEF" />
                <stop offset="48%" stopColor="#CDEBE9" />
                <stop offset="78%" stopColor="#EDEED6" />
                <stop offset="100%" stopColor="#F6ECD0" />
              </linearGradient>
              <radialGradient id="sunCore" cx="0.38" cy="0.35" r="0.9">
                <stop offset="0%" stopColor="#FFE9A8" />
                <stop offset="55%" stopColor="#F7C948" />
                <stop offset="100%" stopColor="#EDA92B" />
              </radialGradient>
              <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6D98F" />
                <stop offset="100%" stopColor="#9FBF6D" />
              </linearGradient>
              <linearGradient id="riverG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7CC3D4" />
                <stop offset="100%" stopColor="#5AA9BC" />
              </linearGradient>
              <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFFDF2" stopOpacity="0.5" />
              </linearGradient>
              <radialGradient id="vignette" cx="0.5" cy="0.46" r="0.75">
                <stop offset="62%" stopColor="#143629" stopOpacity="0" />
                <stop offset="100%" stopColor="#143629" stopOpacity="0.16" />
              </radialGradient>
            </defs>

            {/* ---------- آسمان ---------- */}
            <rect x={0} y={0} width={1600} height={580} fill="url(#sky)" className="scene-in" />

            {/* خورشید با پرتوهای چرخان */}
            <g className="scene-in" style={{ animationDelay: "0.05s" }}>
              <g transform="translate(1385 128)">
                <g className="sun-rays">
                  {Array.from({ length: 12 }, (_, i) => (
                    <path key={i} d="M0 -84 L7 -150 L-7 -150 Z" fill="#F7C948" opacity={0.1} transform={`rotate(${i * 30})`} />
                  ))}
                </g>
                <circle r={112} fill="#F7C948" opacity={0.12} />
                <circle r={76} fill="#F7C948" opacity={0.3} className="sun-glow svg-anim" />
                <circle r={46} fill="url(#sunCore)" />
                <circle cx={-13} cy={-12} r={14} fill="#FFE49A" opacity={0.8} />
              </g>
            </g>

            {/* ابرهای دور — کوچک و کم‌رنگ */}
            <g transform="translate(0 90) scale(0.42)" opacity={0.5}>
              <g className="cloud-drift" style={{ animationDuration: "190s", animationDelay: "-70s" }}>
                <Cloud x={0} y={0} />
              </g>
            </g>
            <g transform="translate(0 345) scale(0.36)" opacity={0.4}>
              <g className="cloud-drift" style={{ animationDuration: "240s", animationDelay: "-150s" }}>
                <Cloud x={0} y={0} />
              </g>
            </g>

            {/* بادکنک هوای گرم که از آسمان رد می‌شه */}
            <g className="scene-in" style={{ animationDelay: "1.4s" }}>
              <g transform="translate(0 210)">
                <Balloon />
              </g>
            </g>

            {/* ابرهای اصلی */}
            <g>
              <g transform="translate(0 118) scale(1.15)">
                <g className="cloud-drift" style={{ animationDuration: "150s", animationDelay: "-45s" }}>
                  <Cloud x={0} y={0} o={0.94} />
                </g>
              </g>
              <g transform="translate(0 225) scale(0.8)">
                <g className="cloud-drift" style={{ animationDuration: "210s", animationDelay: "-130s" }}>
                  <Cloud x={0} y={0} o={0.7} />
                </g>
              </g>
              <g transform="translate(0 62) scale(0.95)">
                <g className="cloud-drift" style={{ animationDuration: "125s", animationDelay: "-90s" }}>
                  <Cloud x={0} y={0} o={0.96} />
                </g>
              </g>
              <g transform="translate(0 315) scale(0.6)">
                <g className="cloud-drift" style={{ animationDuration: "250s", animationDelay: "-18s" }}>
                  <Cloud x={0} y={0} o={0.5} />
                </g>
              </g>
            </g>

            {/* پرنده‌ها */}
            <g stroke="#4A5A52" strokeWidth={2.6} fill="none" strokeLinecap="round">
              <g transform="translate(0 185)">
                <g className="birds-fly" style={{ animationDuration: "62s", animationDelay: "-12s" }}>
                  <path d="M0 0 Q 6 -8 12 0 Q 18 -8 24 0" />
                  <path d="M40 16 Q 46 8 52 16 Q 58 8 64 16" />
                  <path d="M-30 24 Q -24 16 -18 24 Q -12 16 -6 24" />
                  <path d="M70 4 Q 76 -4 82 4 Q 88 -4 94 4" />
                </g>
              </g>
              <g transform="translate(0 265) scale(0.7)" opacity={0.75}>
                <g className="birds-fly" style={{ animationDuration: "85s", animationDelay: "-52s" }}>
                  <path d="M0 0 Q 6 -8 12 0 Q 18 -8 24 0" />
                  <path d="M36 14 Q 42 6 48 14 Q 54 6 60 14" />
                </g>
              </g>
            </g>

            {/* ---------- کوه‌ها ---------- */}
            {/* رشته‌ی دور، روشن‌تر */}
            <g className="scene-in" style={{ animationDelay: "0.1s" }}>
              <path
                d="M-20 460 L180 300 L360 420 L560 260 L760 430 L940 310 L1130 440 L1330 320 L1520 430 L1620 380 L1620 560 L-20 560 Z"
                fill="#C7D8CE"
              />
            </g>
            {/* رشته‌ی نزدیک با قله‌های برفی */}
            <g className="scene-in" style={{ animationDelay: "0.15s" }}>
              <path
                d="M-20 500 L140 330 L300 470 L480 300 L660 475 L830 350 L990 480 L1180 360 L1350 490 L1490 400 L1620 470 L1620 590 L-20 590 Z"
                fill="#B7CDBF"
              />
              <path d="M480 300 L514 342 L496 331 L481 344 L466 331 L448 342 Z" fill="#EEF6F3" />
              <path d="M140 330 L170 367 L154 357 L141 369 L128 357 L112 367 Z" fill="#EEF6F3" />
              <path d="M830 350 L858 384 L844 375 L831 387 L818 375 L804 384 Z" fill="#EEF6F3" />
              <path d="M1180 360 L1208 394 L1194 385 L1181 397 L1168 385 L1154 394 Z" fill="#EEF6F3" />
              {/* درخت‌های پراکنده‌ی دامنه */}
              {[[210, 452], [252, 440], [540, 436], [586, 424], [876, 448], [1218, 434], [1262, 446]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <path d="M0 -18 L7 -4 L-7 -4 Z" fill="#7FA26B" />
                  <line x1={0} y1={-4} x2={0} y2={2} stroke="#6B5138" strokeWidth={2} />
                </g>
              ))}
            </g>

            {/* مهِ ملایم پای کوه‌ها */}
            <rect x={0} y={470} width={1600} height={90} fill="url(#haze)" opacity={0.55} />

            {/* ---------- تپه‌ها و زمین ---------- */}
            <g className="scene-in" style={{ animationDelay: "0.28s" }}>
              <ellipse cx={170} cy={565} rx={270} ry={115} fill="#A9C98B" />
              <ellipse cx={640} cy={562} rx={250} ry={95} fill="#B3CF92" />
              <ellipse cx={1055} cy={568} rx={270} ry={105} fill="#A9C98B" />
              <ellipse cx={1500} cy={562} rx={250} ry={100} fill="#B3CF92" />
              <ellipse cx={1430} cy={478} rx={104} ry={48} fill="#8FB573" />
              {/* خطوط بافت تپه‌ها */}
              <path d="M-40 590 Q 170 545 380 585" stroke="#98BA79" strokeWidth={3} fill="none" opacity={0.55} />
              <path d="M420 588 Q 640 540 890 582" stroke="#A2C284" strokeWidth={3} fill="none" opacity={0.55} />
              <path d="M820 594 Q 1055 540 1330 588" stroke="#98BA79" strokeWidth={3} fill="none" opacity={0.55} />
            </g>

            <path
              d="M0 548 C 240 508, 480 540, 720 530 C 960 522, 1200 542, 1600 528 L 1600 900 L 0 900 Z"
              fill="url(#ground)"
              className="scene-in"
              style={{ animationDelay: "0.36s" }}
            />

            {/* سایه‌ی ابرها روی زمین */}
            <g className="scene-in" style={{ animationDelay: "0.5s" }}>
              <CloudShadow y={640} dur={95} delay={-20} />
              <CloudShadow y={760} dur={130} delay={-75} />
            </g>

            {/* ردیف درخت‌های افق */}
            <g className="scene-in" style={{ animationDelay: "0.42s" }} fill="#7FAF66" opacity={0.65}>
              {[
                [60, 545], [95, 538], [135, 546], [560, 532], [600, 526], [640, 533],
                [1020, 534], [1060, 528], [1100, 535], [1290, 532], [1330, 527], [1370, 534],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 2 ? 14 : 19} />
              ))}
            </g>

            {/* ---------- رودخانه ---------- */}
            <g className="scene-in" style={{ animationDelay: "0.48s" }}>
              <ellipse cx={772} cy={519} rx={46} ry={15} fill="#5FA9BC" />
              <ellipse cx={772} cy={517} rx={34} ry={10} fill="#8ED0DE" opacity={0.8} />
              <path d="M768 522 C 705 585, 600 592, 512 648 C 430 700, 396 708, 368 748" fill="none" stroke="#4E93A4" strokeWidth={38} strokeLinecap="round" opacity={0.55} />
              <path d="M768 522 C 705 585, 600 592, 512 648 C 430 700, 396 708, 368 748" fill="none" stroke="url(#riverG)" strokeWidth={32} strokeLinecap="round" />
              <path d="M768 522 C 705 585, 600 592, 512 648 C 430 700, 396 708, 368 748" fill="none" stroke="#C9EAF2" strokeWidth={7} strokeLinecap="round" strokeDasharray="16 34" className="flow-line" opacity={0.85} />
              <path d="M768 522 C 705 585, 600 592, 512 648 C 430 700, 396 708, 368 748" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeDasharray="4 52" className="flow-line" style={{ animationDuration: "3.6s" }} opacity={0.9} />
              {/* برق آب */}
              {[[742, 540], [660, 590], [548, 642], [432, 704]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2.6} fill="#FFFFFF" className="twinkle" style={{ animationDelay: `${i * 0.9}s` }} />
              ))}
              {/* ماهی یکی دو تا بزنه بیرون؟ نه — سنگ‌ها و مرغ‌آبی کافیه */}
              <Rock x={368} y={772} s={0.9} />
              <Rock x={556} y={636} s={0.7} />
              <Duck x={468} y={676} s={0.9} delay={0.2} />
              <Duck x={388} y={738} s={0.75} delay={1.3} />
            </g>

            {/* ---------- جاده‌ها ---------- */}
            <g className="scene-in" style={{ animationDelay: "0.52s" }}>
              <g stroke="#D9C69A" fill="none" strokeLinecap="round">
                <path d="M-20 722 C 250 700, 330 662, 540 656 C 720 650, 780 616, 950 616 C 1120 616, 1180 586, 1360 592 C 1480 596, 1545 622, 1620 612" strokeWidth={30} />
                <path d="M540 656 C 566 642, 590 632, 614 624" strokeWidth={14} />
                <path d="M1360 592 C 1382 604, 1404 618, 1424 630" strokeWidth={14} />
                <path d="M950 616 C 960 660, 1000 700, 1060 726" strokeWidth={14} />
              </g>
              <g stroke="#E7D6AC" fill="none" strokeLinecap="round">
                <path d="M-20 722 C 250 700, 330 662, 540 656 C 720 650, 780 616, 950 616 C 1120 616, 1180 586, 1360 592 C 1480 596, 1545 622, 1620 612" strokeWidth={24} />
                <path d="M540 656 C 566 642, 590 632, 614 624" strokeWidth={11} />
                <path d="M1360 592 C 1382 604, 1404 618, 1424 630" strokeWidth={11} />
                <path d="M950 616 C 960 660, 1000 700, 1060 726" strokeWidth={11} />
              </g>
              {/* خطوط وسط جاده */}
              <path d="M-20 722 C 250 700, 330 662, 540 656 C 720 650, 780 616, 950 616 C 1120 616, 1180 586, 1360 592 C 1480 596, 1545 622, 1620 612" stroke="#F6EFDA" strokeWidth={2.6} fill="none" strokeDasharray="18 26" opacity={0.75} />
              {/* دبه‌ی خاکی به سمت پنل‌های خورشیدی */}
              <path d="M252 706 C 235 712, 220 718, 207 726" stroke="#E0CFA4" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9} />
            </g>

            {/* آسیاب بادی کنار جاده */}
            <g className="scene-in" style={{ animationDelay: "0.6s" }}>
              <ellipse cx={382} cy={592} rx={40} ry={9} fill="#24312B" opacity={0.1} />
              <Windmill x={382} y={590} s={0.92} />
            </g>

            {/* تابلوی خوش‌آمد */}
            <Signpost x={952} y={768} />

            {/* ---------- مکان‌های تعاملی ---------- */}

            {/* طبیعت و درختان */}
            <Hotspot loc={LOCATIONS[7]} index={7} selected={selectedId === "nature"} visited={visited.has("nature")} onSelect={onSelect}>
              <Tree x={112} y={612} s={0.8} tone={1} delay={0.6} />
              <Tree x={168} y={600} s={1.05} tone={0} delay={0} fruit />
              <PineTree x={210} y={598} s={0.9} delay={2.2} />
              <Tree x={252} y={588} s={1.25} tone={2} delay={1.4} fruit />
              <Tree x={295} y={612} s={0.9} tone={1} delay={0.9} />
              <Bush x={318} y={622} />
              <Bush x={92} y={622} s={0.8} tone={1} />
              <Sheep x={150} y={632} s={0.72} delay={0.3} />
              <Sheep x={190} y={638} s={0.58} delay={1.8} />
              <Flower x={86} y={636} tone={0} delay={0.5} />
              <Flower x={332} y={618} tone={1} delay={1.2} />
            </Hotspot>

            {/* آبیاری و تانک آب */}
            <Hotspot loc={LOCATIONS[1]} index={1} selected={selectedId === "irrigation"} visited={visited.has("irrigation")} onSelect={onSelect}>
              <g>
                <rect x={215} y={608} width={158} height={70} rx={10} fill="#8FBC5F" />
                {[245, 275, 305, 335, 358].map((x) => (
                  <path key={x} d={`M ${x} 614 q 5 30 0 58`} stroke="#7AA94E" strokeWidth={4} fill="none" strokeLinecap="round" />
                ))}
              </g>
              <Sprinkler x={296} y={652} s={1.05} />
              <path d="M418 758 C 470 736, 472 694, 424 672" fill="none" stroke="#6FB7C9" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
              <ellipse cx={330} cy={784} rx={102} ry={46} fill="#4B93A6" />
              <ellipse cx={330} cy={779} rx={90} ry={38} fill="#7FC4D6" />
              <ellipse cx={330} cy={775} rx={68} ry={26} fill="#9AD4E2" opacity={0.7} />
              {[0, 1.15, 2.3].map((d) => (
                <ellipse key={d} cx={330} cy={778} rx={58} ry={22} fill="none" stroke="#EAF7FA" strokeWidth={2.5} className="ripple-anim svg-anim" style={{ animationDelay: `${d}s` }} />
              ))}
              <rect x={425} y={706} width={46} height={40} fill="#F0E4C8" stroke="#D9BE93" strokeWidth={2} />
              <path d="M419 706 L448 687 L477 706 Z" fill="#8B9AA6" />
              <line x1={448} y1={742} x2={404} y2={766} stroke="#6E7F8A" strokeWidth={7} strokeLinecap="round" />
              <circle cx={410} cy={764} r={7} fill="#6E7F8A" />
              <rect x={446} y={634} width={30} height={54} rx={8} fill="#9FC6D4" stroke="#7FB0BF" strokeWidth={2} />
              <ellipse cx={461} cy={634} rx={15} ry={6} fill="#C6E4EC" />
              <WaterGauge x={461} y={660} />
              <line x1={452} y1={688} x2={452} y2={706} stroke="#6E7F8A" strokeWidth={5} />
              <line x1={470} y1={688} x2={470} y2={706} stroke="#6E7F8A" strokeWidth={5} />
              <line x1={461} y1={690} x2={448} y2={700} stroke="#6E7F8A" strokeWidth={5} />
            </Hotspot>

            {/* مزرعه */}
            <Hotspot loc={LOCATIONS[0]} index={0} selected={selectedId === "farm"} visited={visited.has("farm")} onSelect={onSelect}>
              <g className="sway svg-anim-bottom" style={{ animationDuration: "6s" }}>
                <rect x={565} y={648} width={238} height={82} rx={10} fill="#E9C766" />
                {[590, 622, 654, 686, 718, 750, 782].map((x, i) => (
                  <path key={x} d={`M ${x} 654 q ${i % 2 ? 5 : -5} 38 0 72`} stroke="#D4A93F" strokeWidth={4} fill="none" strokeLinecap="round" />
                ))}
              </g>
              <Scarecrow x={780} y={662} s={0.95} delay={0.4} />
              <HayBale x={545} y={700} s={1} />
              <HayBale x={563} y={711} s={0.72} />
              <g>
                <rect x={415} y={600} width={95} height={62} fill="#B5533C" />
                <path d="M407 603 L462 565 L517 603 Z" fill="#8F3E2C" />
                <rect x={442} y={622} width={30} height={40} fill="#8F3E2C" stroke="#F3E2C2" strokeWidth={2.5} />
                <path d="M442 622 L472 662 M472 622 L442 662" stroke="#F3E2C2" strokeWidth={2.5} />
                <circle cx={462} cy={588} r={6} fill="#F3E2C2" />
              </g>
              <Chicken x={430} y={676} s={0.95} delay={0} />
              <Chicken x={452} y={682} s={0.75} delay={1.1} />
              <g>
                <rect x={560} y={545} width={110} height={78} fill="#F3E2C2" stroke="#DCC29A" strokeWidth={2} />
                <path d="M548 548 L615 500 L682 548 Z" fill="#C4623A" />
                <rect x={652} y={506} width={14} height={26} fill="#A94F31" />
                <circle cx={659} cy={498} r={5} fill="#DDE5E2" className="smoke-puff svg-anim" />
                <circle cx={663} cy={496} r={4} fill="#DDE5E2" className="smoke-puff svg-anim" style={{ animationDelay: "1.6s" }} />
                <rect x={600} y={586} width={26} height={37} rx={3} fill="#8A6240" />
                <rect x={570} y={562} width={22} height={20} rx={2} fill="#BFE3EA" stroke="#FFFCF4" strokeWidth={2} />
                <rect x={638} y={562} width={22} height={20} rx={2} fill="#BFE3EA" stroke="#FFFCF4" strokeWidth={2} />
              </g>
              <g className="bob" style={{ animationDelay: "0.8s" }}>
                <rect x={688} y={640} width={52} height={22} rx={7} fill="#C94F3D" />
                <rect x={722} y={620} width={22} height={22} rx={4} fill="#BFE3EA" stroke="#C94F3D" strokeWidth={3} />
                <rect x={694} y={628} width={5} height={13} rx={2} fill="#3B4245" />
                <circle cx={696} cy={668} r={16} fill="#3B4245" />
                <circle cx={696} cy={668} r={7} fill="#6B7478" />
                <circle cx={736} cy={672} r={11} fill="#3B4245" />
                <circle cx={736} cy={672} r={4.5} fill="#6B7478" />
              </g>
            </Hotspot>

            {/* مدرسه */}
            <Hotspot loc={LOCATIONS[2]} index={2} selected={selectedId === "school"} visited={visited.has("school")} onSelect={onSelect}>
              <rect x={810} y={545} width={180} height={105} fill="#F6E7C9" stroke="#DCC29A" strokeWidth={2} />
              <path d="M800 548 L900 505 L1000 548 Z" fill="#3E7C8A" />
              <circle cx={900} cy={528} r={11} fill="#FFFCF4" stroke="#3E7C8A" strokeWidth={2.5} />
              <path d="M900 528 L900 521 M900 528 L905 530" stroke="#3E7C8A" strokeWidth={2} strokeLinecap="round" />
              <rect x={880} y={600} width={40} height={50} rx={4} fill="#5B4630" />
              <rect x={872} y={650} width={56} height={7} fill="#E0D2B2" />
              {[826, 862, 912, 948].map((x) => (
                <rect key={x} x={x} y={566} width={26} height={24} rx={2} fill="#BFE3EA" stroke="#FFFCF4" strokeWidth={2} />
              ))}
              <line x1={1008} y1={545} x2={1008} y2={468} stroke="#7A6A55" strokeWidth={3.5} />
              <path d="M1008 470 L1042 480 L1008 492 Z" fill="#C94F3D" className="flag-wave" />
              <Hopscotch x={828} y={658} s={0.95} />
              <Bench x={1022} y={648} s={0.95} />
              <Tree x={812} y={655} s={0.65} tone={2} delay={2} />
            </Hotspot>

            {/* درمانگاه */}
            <Hotspot loc={LOCATIONS[3]} index={3} selected={selectedId === "clinic"} visited={visited.has("clinic")} onSelect={onSelect}>
              <MedDrone x={1122} y={505} s={1} />
              <rect x={1090} y={550} width={150} height={100} fill="#FBFDFD" stroke="#C9D8D4" strokeWidth={2} />
              <rect x={1084} y={536} width={162} height={18} rx={9} fill="#2F8F9D" />
              <circle cx={1165} cy={522} r={15} fill="#FFFFFF" stroke="#E3E9E7" strokeWidth={2} />
              <rect x={1161} y={511} width={8} height={22} rx={1.5} fill="#D9534F" />
              <rect x={1154} y={518} width={22} height={8} rx={1.5} fill="#D9534F" />
              <rect x={1105} y={570} width={30} height={26} rx={2} fill="#CDE9EE" stroke="#FFFCF4" strokeWidth={2} />
              <rect x={1192} y={570} width={30} height={26} rx={2} fill="#CDE9EE" stroke="#FFFCF4" strokeWidth={2} />
              <rect x={1150} y={602} width={30} height={48} rx={3} fill="#2F8F9D" />
              <Bush x={1082} y={652} s={0.75} tone={2} />
              <g className="bob" style={{ animationDelay: "1.6s" }}>
                <rect x={1192} y={612} width={18} height={20} rx={4} fill="#DCE9E6" stroke="#B9C9C5" strokeWidth={2} />
                <rect x={1208} y={606} width={52} height={26} rx={5} fill="#FFFFFF" stroke="#D8E2E0" strokeWidth={2} />
                <rect x={1228} y={612} width={6} height={14} fill="#D9534F" />
                <rect x={1224} y={616} width={14} height={6} fill="#D9534F" />
                <rect x={1224} y={599} width={12} height={6} rx={2} fill="#D9534F" />
                <circle cx={1218} cy={636} r={7} fill="#3B4245" />
                <circle cx={1250} cy={636} r={7} fill="#3B4245" />
              </g>
            </Hotspot>

            {/* بازار */}
            <Hotspot loc={LOCATIONS[4]} index={4} selected={selectedId === "market"} visited={visited.has("market")} onSelect={onSelect}>
              <g>
                <rect x={1310} y={550} width={112} height={92} fill="#EFE0BC" stroke="#DCC29A" strokeWidth={2} />
                <rect x={1302} y={528} width={128} height={18} fill="#D97E4A" />
                {[1318, 1350, 1382, 1414].map((x) => (
                  <rect key={x} x={x} y={528} width={16} height={18} fill="#F7ECD6" />
                ))}
                {[1310, 1328, 1346, 1364, 1382, 1400, 1418].map((x, i) => (
                  <circle key={x} cx={x + 4} cy={546} r={8} fill={i % 2 ? "#F7ECD6" : "#D97E4A"} />
                ))}
                <rect x={1352} y={596} width={28} height={46} rx={3} fill="#8A6240" />
                <rect x={1320} y={566} width={30} height={30} rx={2} fill="#CDE9EE" stroke="#FFFCF4" strokeWidth={2} />
                <rect x={1384} y={612} width={28} height={16} rx={2} fill="#B58A5A" />
                <circle cx={1391} cy={609} r={5} fill="#E08A3C" />
                <circle cx={1399} cy={607} r={5} fill="#E08A3C" />
                <circle cx={1407} cy={609} r={5} fill="#E08A3C" />
              </g>
              <StringLights x1={1306} y1={548} x2={1428} y2={552} />
              <g>
                <rect x={1442} y={565} width={88} height={78} fill="#E9DDBE" stroke="#DCC29A" strokeWidth={2} />
                <rect x={1436} y={545} width={100} height={16} fill="#2F8F9D" />
                {[1454, 1482, 1510].map((x) => (
                  <rect key={x} x={x} y={545} width={14} height={16} fill="#F7ECD6" />
                ))}
                <rect x={1452} y={580} width={28} height={26} rx={2} fill="#CDE9EE" stroke="#FFFCF4" strokeWidth={2} />
                <rect x={1494} y={598} width={22} height={45} rx={3} fill="#8A6240" />
              </g>
              <g>
                <path d="M1476 616 L1512 584 L1548 616 Z" fill="#C4623A" />
                <path d="M1512 584 L1532 616 L1512 616 Z" fill="#F0C9A8" />
                <line x1={1512} y1={616} x2={1512} y2={664} stroke="#8A6240" strokeWidth={3.5} />
                <rect x={1480} y={650} width={64} height={8} rx={3} fill="#8A6240" />
                <line x1={1488} y1={658} x2={1488} y2={672} stroke="#8A6240" strokeWidth={4} />
                <line x1={1536} y1={658} x2={1536} y2={672} stroke="#8A6240" strokeWidth={4} />
                <circle cx={1498} cy={641} r={8} fill="#6FAF63" />
                <circle cx={1514} cy={638} r={8} fill="#5E9E58" />
                <circle cx={1530} cy={641} r={8} fill="#6FAF63" />
              </g>
              <Crates x={1322} y={655} s={1} />
              <Bush x={1548} y={650} s={0.8} tone={1} />
            </Hotspot>

            {/* خانه‌ها */}
            <Hotspot loc={LOCATIONS[5]} index={5} selected={selectedId === "homes"} visited={visited.has("homes")} onSelect={onSelect}>
              <g>
                <rect x={1060} y={732} width={112} height={84} fill="#F0DDBE" stroke="#D9BE93" strokeWidth={2} />
                <path d="M1050 735 L1116 690 L1182 735 Z" fill="#A94F31" />
                <rect x={1148} y={706} width={12} height={24} fill="#8F3E2C" />
                <circle cx={1154} cy={700} r={4.5} fill="#DDE5E2" className="smoke-puff svg-anim" style={{ animationDelay: "0.7s" }} />
                <SatelliteDish x={1138} y={714} s={0.95} />
                <rect x={1100} y={778} width={30} height={38} rx={3} fill="#8A6240" />
                <rect x={1072} y={752} width={24} height={22} rx={2} fill="#F5D98F" stroke="#FFFCF4" strokeWidth={2} />
                <rect x={1138} y={752} width={24} height={22} rx={2} fill="#F5D98F" stroke="#FFFCF4" strokeWidth={2} />
              </g>
              <g>
                <rect x={1195} y={750} width={92} height={74} fill="#EFE3C8" stroke="#D9BE93" strokeWidth={2} />
                <path d="M1187 753 L1241 714 L1295 753 Z" fill="#7A8B96" />
                <circle cx={1241} cy={741} r={8} fill="#F5D98F" stroke="#FFFCF4" strokeWidth={2} />
                <rect x={1230} y={784} width={26} height={40} rx={3} fill="#8A6240" />
              </g>
              <Clothesline x={1112} y={800} s={1} />
              <g fill="#C9B58E">
                <rect x={1058} y={832} width={128} height={4} rx={2} />
                {[1062, 1090, 1118, 1146, 1174].map((x) => (
                  <rect key={x} x={x} y={824} width={5} height={18} rx={2} />
                ))}
              </g>
              <Cat x={1180} y={826} s={0.9} />
              <GardenPatch x={1248} y={818} s={0.9} />
              <Bush x={1042} y={806} s={0.9} />
              <Tree x={1305} y={790} s={0.7} tone={0} delay={1.1} fruit />
            </Hotspot>

            {/* دکل شبکه */}
            <Hotspot loc={LOCATIONS[6]} index={6} selected={selectedId === "network"} visited={visited.has("network")} onSelect={onSelect}>
              <SatelliteDish x={1362} y={482} s={1.1} />
              <g stroke="#7A8B96" fill="none">
                <line x1={1413} y1={470} x2={1427} y2={352} strokeWidth={4.5} />
                <line x1={1447} y1={470} x2={1433} y2={352} strokeWidth={4.5} />
                <line x1={1417} y1={442} x2={1443} y2={442} strokeWidth={2.5} />
                <line x1={1420} y1={412} x2={1440} y2={412} strokeWidth={2.5} />
                <line x1={1423} y1={386} x2={1437} y2={386} strokeWidth={2.5} />
                <line x1={1422} y1={455} x2={1438} y2={425} strokeWidth={2} />
                <line x1={1438} y1={455} x2={1422} y2={425} strokeWidth={2} />
              </g>
              <rect x={1418} y={344} width={24} height={10} rx={3} fill="#7A8B96" />
              <circle cx={1430} cy={338} r={4.5} fill="#E4573D" className="tick-anim" />
              <path d="M1455 396 a 13 13 0 0 1 0 18" stroke="#7A8B96" strokeWidth={3} fill="none" />
              <circle cx={1457} cy={405} r={3} fill="#C9D4DA" />
              {[0, 0.85, 1.7].map((d) => (
                <circle key={d} cx={1430} cy={338} r={56} fill="none" stroke="#2F8F9D" strokeWidth={2.5} className="signal-ring svg-anim" style={{ animationDelay: `${d}s` }} opacity={0} />
              ))}
            </Hotspot>

            {/* انرژی خورشیدی */}
            <Hotspot loc={LOCATIONS[8]} index={8} selected={selectedId === "solar"} visited={visited.has("solar")} onSelect={onSelect}>
              <SolarPanel x={86} y={718} delay={0} />
              <SolarPanel x={152} y={718} delay={1.5} />
              <SolarPanel x={86} y={768} delay={2.8} />
              <SolarPanel x={152} y={768} delay={3.9} />
              <BatteryBank x={224} y={798} s={1} />
              <rect x={214} y={758} width={36} height={28} rx={5} fill="#DDE4E8" stroke="#B9C4CA" strokeWidth={2} />
              <circle cx={224} cy={772} r={3.5} fill="#58D68D" className="tick-anim" />
              <circle cx={234} cy={772} r={3.5} fill="#E8B24A" />
              <Bush x={262} y={742} s={0.7} tone={2} />
            </Hotspot>

            {/* پل پیاده‌ی چوبی روی رودخانه — بعد از مکان‌ها کشیده می‌شه که دیده بشه */}
            <g className="scene-in" style={{ animationDelay: "0.56s" }} pointerEvents="none">
              <Bridge x={420} y={706} rot={58} s={0.85} />
            </g>

            {/* ---------- پیش‌زمینه ---------- */}
            <g className="scene-in" style={{ animationDelay: "1s" }} pointerEvents="none">
              {[
                [70, 872], [340, 884], [560, 868], [820, 882], [1010, 872], [1360, 880], [1520, 866],
              ].map(([x, y], i) => (
                <GrassTuft key={i} x={x} y={y} s={1 + (i % 3) * 0.15} />
              ))}
              <g>
                <line x1={250} y1={858} x2={250} y2={846} stroke="#7AA94E" strokeWidth={3} />
                <circle cx={250} cy={842} r={5} fill="#E4807F" />
                <line x1={680} y1={876} x2={680} y2={864} stroke="#7AA94E" strokeWidth={3} />
                <circle cx={680} cy={860} r={5} fill="#E8B24A" />
                <line x1={1450} y1={852} x2={1450} y2={840} stroke="#7AA94E" strokeWidth={3} />
                <circle cx={1450} cy={836} r={5} fill="#E4807F" />
              </g>
              <FlowerCluster x={352} y={866} seed={1} />
              <FlowerCluster x={905} y={874} seed={3} s={0.9} />
              <FlowerCluster x={1252} y={884} seed={2} s={0.85} />
              <Rock x={610} y={878} s={0.8} />
            </g>

            {/* پروانه‌ها — فقط تزئین، کلیک نمی‌گیرن */}
            <g pointerEvents="none">
              <Butterfly x={700} y={614} tone={0} dur={9} delay={0} s={0.9} />
              <Butterfly x={972} y={706} tone={1} dur={11} delay={2.5} s={0.8} />
              <Butterfly x={450} y={590} tone={0} dur={10} delay={5} s={0.7} />
            </g>

            {/* ویگنت ملایم دور صحنه */}
            <rect x={0} y={0} width={1600} height={900} fill="url(#vignette)" pointerEvents="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
