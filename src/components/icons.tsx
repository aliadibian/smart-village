import type { SVGProps, ReactNode } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(children: ReactNode, viewBox = "0 0 24 24") {
  return function Icon({ size = 20, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}

export const IconClose = make(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
);

export const IconCheck = make(<path d="M20 6 9 17l-5-5" />);

export const IconChevronRight = make(<path d="m9 18 6-6-6-6" />);
export const IconChevronLeft = make(<path d="m15 18-6-6 6-6" />);

export const IconMap = make(
  <>
    <path d="M14.1 6.1 9 3 3.6 5.8a1 1 0 0 0-.6.9v12.4a1 1 0 0 0 1.5.9L9 17.4l5.5 3.2 5.4-2.8a1 1 0 0 0 .6-.9V4.5a1 1 0 0 0-1.5-.9L14.1 6Z" />
    <path d="M9 3v14.4" />
    <path d="M14.5 6.2V21" />
  </>
);

export const IconQuiz = make(
  <>
    <circle cx={12} cy={12} r={9} />
    <path d="M9.3 9.2a2.8 2.8 0 0 1 5.5.7c0 1.9-2.6 2.3-2.6 3.7" />
    <path d="M12 17h.01" />
  </>
);

export const IconGame = make(
  <>
    <path d="M6 11h4M8 9v4" />
    <path d="M15.5 11h.01M17.5 13h.01" />
    <path d="M7.2 6h9.6a5 5 0 0 1 5 5.5l-.6 3.4a3 3 0 0 1-5.2 1.6l-.7-1a2 2 0 0 0-1.6-.9h-2.8a2 2 0 0 0-1.6.9l-.7 1a3 3 0 0 1-5.2-1.6l-.6-3.4A5 5 0 0 1 7.2 6Z" />
  </>
);

export const IconTrophy = make(
  <>
    <path d="M8 21h8M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4.5A1.5 1.5 0 0 0 3 7.5C3 9.4 4.6 11 6.5 11H7M17 6h2.5A1.5 1.5 0 0 1 21 7.5C21 9.4 19.4 11 17.5 11H17" />
  </>
);

export const IconClock = make(
  <>
    <circle cx={12} cy={12} r={9} />
    <path d="M12 7v5l3 2" />
  </>
);

export const IconUsers = make(
  <>
    <circle cx={9} cy={8} r={3.5} />
    <path d="M2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
    <path d="M16 5a3.5 3.5 0 0 1 0 6.6M21.5 20c-.4-2.3-1.8-4-3.7-4.9" />
  </>
);

export const IconSignal = make(
  <>
    <path d="M4 20v.01M8.5 20v-4M13 20v-8M17.5 20V7M22 20V3" />
  </>
);

export const IconDroplet = make(
  <path d="M12 3s6 6.3 6 10.5a6 6 0 0 1-12 0C6 9.3 12 3 12 3Z" />
);

export const IconLeaf = make(
  <>
    <path d="M4 20c0-8.5 5.5-14 16-14 0 10.5-5.5 16-13 16a6.5 6.5 0 0 1-3-.6" />
    <path d="M4 20c3-6 7-9.5 12-12" />
  </>
);

export const IconSun = make(
  <>
    <circle cx={12} cy={12} r={4.5} />
    <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.9 1.9M17.1 17.1 19 19M19 5l-1.9 1.9M6.9 17.1 5 19" />
  </>
);

export const IconBook = make(
  <>
    <path d="M12 6.5C10 4.8 7.2 4.3 3.5 4.5v14c3.7-.2 6.5.3 8.5 2 2-1.7 4.8-2.2 8.5-2v-14c-3.7-.2-6.5.3-8.5 2Z" />
    <path d="M12 6.5v14" />
  </>
);

export const IconCross = make(
  <>
    <rect x={3.5} y={3.5} width={17} height={17} rx={4} />
    <path d="M12 8v8M8 12h8" />
  </>
);

export const IconStore = make(
  <>
    <path d="M4 10v9.5h16V10" />
    <path d="M3 6.5 4.5 3h15L21 6.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0L3 6.5Z" />
    <path d="M9.5 19.5v-5h5v5" />
  </>
);

export const IconHome = make(
  <>
    <path d="m3.5 11 8.5-7.5L20.5 11" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5.5h4V20" />
  </>
);

export const IconTractor = make(
  <>
    <circle cx={7} cy={16.5} r={3.5} />
    <circle cx={18} cy={17.5} r={2.5} />
    <path d="M10.5 16.5h5M7 13V7.5h6l1.5 5.5" />
    <path d="M13 7.5h4.5l1.5 6" />
    <path d="M5 7.5V5" />
  </>
);

export const IconBolt = make(<path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />);

export const IconAlert = make(
  <>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4M12 17h.01" />
  </>
);

export const IconSparkle = make(
  <>
    <path d="M12 3.5 14 9.5l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
    <path d="M19 3v3M17.5 4.5h3" />
  </>
);

export const IconMedal = make(
  <>
    <circle cx={12} cy={14.5} r={5.5} />
    <path d="M8.5 9.5 5.5 3h4L12 7.5 14.5 3h4l-3 6.5" />
    <path d="M12 12.2 13 14.3h2l-1.6 1.2.6 2.2-2-1.4-2 1.4.6-2.2L9 14.3h2l1-2.1Z" />
  </>
);

export const IconLock = make(
  <>
    <rect x={4.5} y={10.5} width={15} height={10.5} rx={3} />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    <circle cx={12} cy={15.7} r={1.3} fill="currentColor" stroke="none" />
  </>
);

export const IconKey = make(
  <>
    <circle cx={8} cy={8} r={4.5} />
    <path d="M11.2 11.2 20 20M17 17l2-2M14.5 14.5l2-2" />
  </>
);

export const IconRefresh = make(
  <>
    <path d="M20 11a8 8 0 0 0-14.6-3.6M4 13a8 8 0 0 0 14.6 3.6" />
    <path d="M5.5 3.5v4h4M18.5 20.5v-4h-4" />
  </>
);

export const IconVolume = make(
  <>
    <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
    <path d="M15 9a4.5 4.5 0 0 1 0 6M18 6.5a8.5 8.5 0 0 1 0 11" />
  </>
);

export const IconVolumeOff = make(
  <>
    <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </>
);

export const IconPlay = make(<path d="M7 4.5 19 12 7 19.5v-15Z" />);

export const IconPause = make(
  <>
    <rect x={6} y={4.5} width={4} height={15} rx={1.4} />
    <rect x={14} y={4.5} width={4} height={15} rx={1.4} />
  </>
);

export const IconHandPoint = make(
  <>
    <path d="M9 11.5V4.8a1.8 1.8 0 0 1 3.6 0v6" />
    <path d="M12.6 10.5V6.3a1.7 1.7 0 0 1 3.4 0v5" />
    <path d="M16 11.3a1.7 1.7 0 0 1 3.4.5c-.2 1.7-.4 3.4-.8 5a7 7 0 0 1-6.8 5.3c-3.9 0-5.5-2.3-7.4-6.2-.5-1-.3-2 .5-2.6a1.9 1.9 0 0 1 2.8.2l1.5 1.7" />
  </>
);

export const IconDatabase = make(
  <>
    <ellipse cx={12} cy={5.5} rx={8} ry={3} />
    <path d="M4 5.5V12c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5" />
    <path d="M4 12v6.5c0 1.7 3.6 3 8 3s8-1.3 8-3V12" />
  </>
);

export const IconTarget = make(
  <>
    <circle cx={12} cy={12} r={9} />
    <circle cx={12} cy={12} r={5} />
    <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
  </>
);

const ICONS: Record<string, (p: IconProps) => ReactNode> = {
  tractor: IconTractor,
  droplet: IconDroplet,
  book: IconBook,
  cross: IconCross,
  store: IconStore,
  home: IconHome,
  signal: IconSignal,
  leaf: IconLeaf,
  sun: IconSun,
};

export function LocationIcon({ name, ...props }: { name: string } & IconProps) {
  const Cmp = ICONS[name] ?? IconMap;
  return <Cmp {...props} />;
}
