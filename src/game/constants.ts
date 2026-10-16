// ثابت‌های بازی «نجات مزرعه» — همه‌چیز نسبت به بوم ۹۶۰×۵۴۰ حساب می‌شه
export const W = 960;
export const H = 540;

export const FIELD_Y = 468; // خط افق مزرعه
export const PLAYER_Y = 428; // ارتفاع پرواز پهپاد
export const CATCH_HALF = 46; // نیم‌عرض سطل برای گرفتن قطره
export const DURATION = 60; // ثانیه

export const CLOUDS = [180, 480, 780];

// سرعت‌ها و فاصله‌های تولید — پایه‌اش با گذشت زمان سخت‌تر می‌شه
export const PLAYER_SPEED = 560;
export const DROP_BASE_SPEED = 150;
export const HAZ_BASE_SPEED = 165;
export const SPAWN_BASE = 0.92;
export const SPAWN_MIN = 0.42;
export const HAZ_SPAWN_BASE = 1.95;
export const HAZ_SPAWN_MIN = 0.85;

export const MOISTURE_PER_DROP = 5;
export const GOLDEN_CHANCE = 0.12;
export const GOLDEN_POINTS = 30;
export const DROP_POINTS = 10;
export const STREAK_BONUS_CAP = 10;
export const STREAK_BONUS_STEP = 2;

export const START_HEARTS = 3;
export const INVULN_TIME = 1.3;
export const HIT_HALF = 44;

// شمارش معکوس قبل از شروع
export const COUNTDOWN_STEP = 0.62;

export const PALETTE = {
  skyTop: "#9FD3E8",
  skyMid: "#D8EDDC",
  skyLow: "#CFE3A8",
  sun: "#F7C948",
  hillA: "#A9C98B",
  hillB: "#B3CF92",
  dirt: [172, 148, 96] as [number, number, number],
  green: [122, 148, 74] as [number, number, number],
  cropDry: [185, 161, 90] as [number, number, number],
  cropWet: [76, 140, 85] as [number, number, number],
};

export const CONFETTI_COLORS = ["#4C8C55", "#E8B24A", "#4E9FB5", "#F6F2E6", "#D9A13A"];
export const GOLD_BURST = ["#E8B24A", "#F6E1AE", "#D9A13A"];
export const WATER_BURST = ["#58AEE0", "#9AD4E2", "#C9EAF2"];
export const HIT_BURST = ["#C4623A", "#8A5A44", "#E4A57C"];
export const SPLASH_BURST = ["#B8D3DC", "#9FBEC9"];
export const HAZARD_BURST = ["#C9B58E", "#A98F63"];
