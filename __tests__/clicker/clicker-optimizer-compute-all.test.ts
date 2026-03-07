import { setupClicker } from "@/lib/clicker";
import { ClickerModelChanges } from "@/lib/clicker/clicker";

describe("add() utility function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("new Date() should always return the fixed date", () => {
    const now = new Date();
    expect(now.toISOString()).toBe("2025-01-01T00:00:00.000Z");
  });

  test("expected old and new to be equal with day consider level 1", () => {
    const DEPTH = 100*100;

    const clicker = setupClicker(true);
    const listUpgrade = clicker.computeXBuildingAhead(DEPTH);
    expect(listUpgrade[listUpgrade.length - 1].time).toBeLessThanOrEqual(2098837890579);
  });

  test("expected old and new to be equal with day consider level 100", () => {
    const DEPTH = 100*100;

    const clicker = setupClicker(true);
    clicker.applyChanges(ClickerModelChanges.METIER_FARMER, "metier farmer", e => {
      e.metier.farmer = 100;
    });
    clicker.applyChanges(ClickerModelChanges.METIER_ALCHEMIST, "metier alchemist", e => {
      e.metier.alchemist = 100;
    });
    clicker.applyChanges(ClickerModelChanges.METIER_HUNTER, "metier hunter", e => {
      e.metier.hunter = 100;
    });
    clicker.applyChanges(ClickerModelChanges.METIER_MINER, "metier miner", e => {
      e.metier.miner = 100;
    });
    const listUpgrade = clicker.computeXBuildingAhead(DEPTH);

    expect(listUpgrade[listUpgrade.length -1].time).toBeLessThanOrEqual(1989912413751);
  });
});
