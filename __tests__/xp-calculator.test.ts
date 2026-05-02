import { JobXp } from "@/lib/misc/xp-calculator";
import { constants } from "@/lib/constants";

const { metier_xp_java: metier_xp, metier_xp_bedrock } = constants;

describe("Java", () => {
  const version = "java";
  const XP_LEVEL_1 = JobXp.totalXp(1, version);   // 0
  const XP_LEVEL_2 = JobXp.totalXp(2, version);   // 22123
  const XP_LEVEL_20 = JobXp.totalXp(20, version); // 17302375
  const XP_PER_LEVEL_AFTER_20 = metier_xp[metier_xp.length - 1]; // 2594953

  describe("MetierXP.totalXp (java)", () => {
    it("returns 0 for level 1", () => {
      expect(JobXp.totalXp(1, version)).toBe(0);
    });

    it("returns correct cumulative XP for levels within the xp table", () => {
      expect(JobXp.totalXp(2, version)).toBe(22123);
      expect(JobXp.totalXp(3, version)).toBe(62513);
      expect(JobXp.totalXp(10, version)).toBe(1989772);
      expect(JobXp.totalXp(20, version)).toBe(17302375);
    });

    it("extrapolates XP linearly beyond level 20", () => {
      expect(JobXp.totalXp(21, version)).toBe(XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20);
      expect(JobXp.totalXp(25, version)).toBe(XP_LEVEL_20 + 5 * XP_PER_LEVEL_AFTER_20);
      expect(JobXp.totalXp(30, version)).toBe(XP_LEVEL_20 + 10 * XP_PER_LEVEL_AFTER_20);
    });

    it("is monotonically increasing", () => {
      for (let lvl = 1; lvl < 30; lvl++) {
        expect(JobXp.totalXp(lvl + 1, version)).toBeGreaterThan(JobXp.totalXp(lvl, version));
      }
    });
  });

  describe("MetierXP.levelFromXp (java)", () => {
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
      expect(JobXp.levelFromXp(JobXp.totalXp(10, version))).toBe(10);
      expect(JobXp.levelFromXp(JobXp.totalXp(10, version) + 1)).toBe(10);
      expect(JobXp.levelFromXp(JobXp.totalXp(11, version) - 1)).toBe(10);
      expect(JobXp.levelFromXp(JobXp.totalXp(11, version))).toBe(11);
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

    it("is consistent with totalXp (round-trip)", () => {
      for (let lvl = 1; lvl <= 25; lvl++) {
        expect(JobXp.levelFromXp(JobXp.totalXp(lvl, version))).toBe(lvl);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Java — xpCoef
  // ─────────────────────────────────────────────────────────────────────────────

  describe("MetierXP.xpCoef (java)", () => {
    it("returns 0 when currentXp is 0", () => {
      expect(JobXp.xpCoef(1, 0, version)).toBe(0);
      expect(JobXp.xpCoef(5, 0, version)).toBe(0);
      expect(JobXp.xpCoef(15, 0, version)).toBe(0);
    });

    it("returns 0 at the very start of a level (xp exactly at level threshold)", () => {
      expect(JobXp.xpCoef(1, XP_LEVEL_1, version)).toBe(0);
      expect(JobXp.xpCoef(2, XP_LEVEL_2, version)).toBe(0);
    });

    it("returns 1 at the end of a level (xp at next level threshold)", () => {
      expect(JobXp.xpCoef(1, XP_LEVEL_2, version)).toBe(1);
    });

    it("returns ~0.5 halfway through a level", () => {
      const halfwayLevel1 = XP_LEVEL_1 + metier_xp[0] / 2;
      expect(JobXp.xpCoef(1, halfwayLevel1, version)).toBeCloseTo(0.5);

      const halfwayLevel2 = XP_LEVEL_2 + metier_xp[1] / 2;
      expect(JobXp.xpCoef(2, halfwayLevel2, version)).toBeCloseTo(0.5);
    });

    it("handles intermediate levels correctly", () => {
      const xp25PercentLevel5 = JobXp.totalXp(5, version) + metier_xp[4] * 0.25;
      expect(JobXp.xpCoef(5, xp25PercentLevel5, version)).toBeCloseTo(0.25);

      const xp75PercentLevel10 = JobXp.totalXp(10, version) + metier_xp[9] * 0.75;
      expect(JobXp.xpCoef(10, xp75PercentLevel10, version)).toBeCloseTo(0.75);
    });

    it("handles the last normal level (19) correctly", () => {
      const halfwayLevel19 = JobXp.totalXp(19, version) + metier_xp[18] / 2;
      expect(JobXp.xpCoef(19, halfwayLevel19, version)).toBeCloseTo(0.5);
    });

    it("handles levels beyond 20 using the last xp-per-step value", () => {
      expect(JobXp.xpCoef(20, XP_LEVEL_20, version)).toBe(0);
      expect(JobXp.xpCoef(20, XP_LEVEL_20 + XP_PER_LEVEL_AFTER_20 / 2, version)).toBeCloseTo(0.5);
      expect(JobXp.xpCoef(25, JobXp.totalXp(25, version) + XP_PER_LEVEL_AFTER_20 / 2, version)).toBeCloseTo(0.5);
    });
  });
});

describe("Bedrock", () => {
  const version = "bedrock";
  const XP_LEVEL_0_BEDROCK = JobXp.totalXp(0, version);  // 0
  const XP_LEVEL_1_BEDROCK = JobXp.totalXp(1, version);  // 2000
  const XP_LEVEL_2_BEDROCK = JobXp.totalXp(2, version);  // 5047
  const XP_LEVEL_18_BEDROCK = JobXp.totalXp(18, version);
  const XP_LEVEL_19_BEDROCK = JobXp.totalXp(19, version);
  const XP_LEVEL_20_BEDROCK = JobXp.totalXp(20, version);
  const XP_PER_LEVEL_AFTER_20_BEDROCK = metier_xp_bedrock[metier_xp_bedrock.length - 1]; // 5945249

  describe("MetierXP.totalXp (bedrock)", () => {
    it("returns 0 for level 0 (starting level)", () => {
      expect(XP_LEVEL_0_BEDROCK).toBe(0);
    });

    it("returns correct cumulative XP for early levels", () => {
      expect(XP_LEVEL_1_BEDROCK).toBe(metier_xp_bedrock[0]); // 2000
      expect(XP_LEVEL_2_BEDROCK).toBe(metier_xp_bedrock[0] + metier_xp_bedrock[1]); // 5047
    });

    it("level 19 exists and is strictly between level 18 and level 20", () => {
      expect(XP_LEVEL_19_BEDROCK).toBeGreaterThan(XP_LEVEL_18_BEDROCK);
      expect(XP_LEVEL_19_BEDROCK).toBeLessThan(XP_LEVEL_20_BEDROCK);
    });

    it("level 20 equals level-19 XP + the 19→20 transition cost", () => {
      expect(XP_LEVEL_20_BEDROCK).toBe(XP_LEVEL_19_BEDROCK + metier_xp_bedrock[19]);
    });

    it("extrapolates XP linearly beyond level 20", () => {
      expect(JobXp.totalXp(21, version)).toBe(XP_LEVEL_20_BEDROCK + XP_PER_LEVEL_AFTER_20_BEDROCK);
      expect(JobXp.totalXp(25, version)).toBe(XP_LEVEL_20_BEDROCK + 5 * XP_PER_LEVEL_AFTER_20_BEDROCK);
    });

    it("level 19, 20, and 21 are strictly increasing", () => {
      expect(XP_LEVEL_19_BEDROCK).toBeLessThan(XP_LEVEL_20_BEDROCK);
      expect(XP_LEVEL_20_BEDROCK).toBeLessThan(JobXp.totalXp(21, version));
    });

    it("is monotonically increasing", () => {
      const levels = [0, 1, 2, 3, 5, 10, 15, 18, 19, 20, 21, 25];
      for (let i = 0; i < levels.length - 1; i++) {
        expect(JobXp.totalXp(levels[i + 1], version)).toBeGreaterThan(JobXp.totalXp(levels[i], version));
      }
    });
  });

  describe("MetierXP.xpCoef (bedrock)", () => {
    it("returns 0 when currentXp is 0", () => {
      expect(JobXp.xpCoef(0, 0, version)).toBe(0);
      expect(JobXp.xpCoef(5, 0, version)).toBe(0);
    });

    it("returns 0 at the very start of a level", () => {
      expect(JobXp.xpCoef(0, XP_LEVEL_0_BEDROCK, version)).toBe(0);
      expect(JobXp.xpCoef(1, XP_LEVEL_1_BEDROCK, version)).toBe(0);
    });

    it("returns 1 at the end of a level", () => {
      expect(JobXp.xpCoef(0, XP_LEVEL_1_BEDROCK, version)).toBe(1);
      expect(JobXp.xpCoef(1, XP_LEVEL_2_BEDROCK, version)).toBe(1);
    });

    it("returns ~0.5 halfway through a level", () => {
      const halfwayLevel0 = XP_LEVEL_0_BEDROCK + metier_xp_bedrock[0] / 2;
      expect(JobXp.xpCoef(0, halfwayLevel0, version)).toBeCloseTo(0.5);

      const halfwayLevel1 = XP_LEVEL_1_BEDROCK + metier_xp_bedrock[1] / 2;
      expect(JobXp.xpCoef(1, halfwayLevel1, version)).toBeCloseTo(0.5);
    });

    it("returns ~0.5 halfway through level 18", () => {
      const halfwayLevel18 = XP_LEVEL_18_BEDROCK + metier_xp_bedrock[18] / 2;
      expect(JobXp.xpCoef(18, halfwayLevel18, version)).toBeCloseTo(0.5);
    });

    it("handles levels beyond 20", () => {
      expect(JobXp.xpCoef(20, XP_LEVEL_20_BEDROCK, version)).toBe(0);
      expect(JobXp.xpCoef(20, XP_LEVEL_20_BEDROCK + XP_PER_LEVEL_AFTER_20_BEDROCK / 2, version)).toBeCloseTo(0.5);
    });
  });
});
