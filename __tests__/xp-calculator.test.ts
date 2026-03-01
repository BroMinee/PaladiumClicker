import { JobXp } from "@/lib/misc/xp-calculator";
import { constants } from "@/lib/constants";

const { metier_xp_java: metier_xp } = constants;

const XP_LEVEL_1 = JobXp.totalXp(1);  // 0
const XP_LEVEL_2 = JobXp.totalXp(2);  // 22123
const XP_LEVEL_20 = JobXp.totalXp(20); // 17302375
const XP_PER_LEVEL_AFTER_20 = metier_xp[metier_xp.length - 1]; // 2594953

describe("MetierXP.xpCoef", () => {
  it("returns 0 when currentXp is 0", () => {
    expect(JobXp.xpCoef(1, 0)).toBe(0);
    expect(JobXp.xpCoef(5, 0)).toBe(0);
    expect(JobXp.xpCoef(15, 0)).toBe(0);
  });

  it("returns 0 at the very start of a level (xp exactly at level threshold)", () => {
    expect(JobXp.xpCoef(1, XP_LEVEL_1)).toBe(0);
    expect(JobXp.xpCoef(2, XP_LEVEL_2)).toBe(0);
  });

  it("returns 1 at the end of a level (xp at next level threshold)", () => {
    expect(JobXp.xpCoef(1, XP_LEVEL_2)).toBe(1);
  });

  it("returns ~0.5 halfway through a level", () => {
    const halfwayLevel1 = XP_LEVEL_1 + metier_xp[0] / 2;
    expect(JobXp.xpCoef(1, halfwayLevel1)).toBeCloseTo(0.5);

    const halfwayLevel2 = XP_LEVEL_2 + metier_xp[1] / 2;
    expect(JobXp.xpCoef(2, halfwayLevel2)).toBeCloseTo(0.5);
  });

  it("handles intermediate levels correctly", () => {
    const xp25PercentLevel5 = JobXp.totalXp(5) + metier_xp[4] * 0.25;
    expect(JobXp.xpCoef(5, xp25PercentLevel5)).toBeCloseTo(0.25);

    const xp75PercentLevel10 = JobXp.totalXp(10) + metier_xp[9] * 0.75;
    expect(JobXp.xpCoef(10, xp75PercentLevel10)).toBeCloseTo(0.75);
  });

  it("handles the last normal level (19) correctly", () => {
    const halfwayLevel19 = JobXp.totalXp(19) + metier_xp[18] / 2;
    expect(JobXp.xpCoef(19, halfwayLevel19)).toBeCloseTo(0.5);
  });

  it("handles levels beyond 20 using the last xp-per-step value", () => {
    expect(JobXp.xpCoef(20, XP_LEVEL_20)).toBe(0);
    expect(JobXp.xpCoef(20, XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20 / 2)).toBeCloseTo(0.5);
    expect(JobXp.xpCoef(25, JobXp.totalXp(25) + XP_PER_LEVEL_AFTER_20 / 2)).toBeCloseTo(0.5);
  });
});

describe("MetierXP.totalXp", () => {
  it("returns 0 for level 1", () => {
    expect(JobXp.totalXp(1)).toBe(0);
  });

  it("returns correct cumulative XP for levels within the xp table", () => {
    expect(JobXp.totalXp(2)).toBe(22123);
    expect(JobXp.totalXp(3)).toBe(62513);
    expect(JobXp.totalXp(10)).toBe(1989772);
    expect(JobXp.totalXp(20)).toBe(17302375);
  });

  it("extrapolates XP linearly beyond level 20", () => {
    expect(JobXp.totalXp(21)).toBe(XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20);
    expect(JobXp.totalXp(25)).toBe(XP_LEVEL_20 + 5 * XP_PER_LEVEL_AFTER_20);
    expect(JobXp.totalXp(30)).toBe(XP_LEVEL_20 + 10 * XP_PER_LEVEL_AFTER_20);
  });

  it("is monotonically increasing", () => {
    for (let lvl = 1; lvl < 30; lvl++) {
      expect(JobXp.totalXp(lvl + 1)).toBeGreaterThan(JobXp.totalXp(lvl));
    }
  });
});

describe("MetierXP.levelFromXp", () => {
  it("returns 1 for xp=0 (start of the game)", () => {
    expect(JobXp.levelFromXp(0)).toBe(1);
  });

  it("returns 1 for xp just below the level 2 threshold", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_2 - 1)).toBe(1);
  });

  it("returns 2 for xp at the level 2 threshold", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_2)).toBe(2);
  });

  it("returns correct level for mid-table values", () => {
    expect(JobXp.levelFromXp(JobXp.totalXp(10))).toBe(10);
    expect(JobXp.levelFromXp(JobXp.totalXp(10) + 1)).toBe(10);
    expect(JobXp.levelFromXp(JobXp.totalXp(11) - 1)).toBe(10);
    expect(JobXp.levelFromXp(JobXp.totalXp(11))).toBe(11);
  });

  it("returns 19 for xp just below the level 20 threshold", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_20 - 1)).toBe(19);
  });

  it("returns 20 for xp at the level 20 threshold", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_20)).toBe(20);
  });

  it("extrapolates levels beyond 20 based on the last xp-per-level value", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20)).toBe(21);
    expect(JobXp.levelFromXp(XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20 * 5)).toBe(25);
  });

  it("stays at level 20 for xp just below level 21 threshold", () => {
    expect(JobXp.levelFromXp(XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20 - 1)).toBe(20);
  });

  it("is consistent with MetierXP.totalXp (round-trip)", () => {
    for (let lvl = 1; lvl <= 25; lvl++) {
      expect(JobXp.levelFromXp(JobXp.totalXp(lvl))).toBe(lvl);
    }
  });
});
