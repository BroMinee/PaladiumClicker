import { Clicker } from "@/lib/clicker/clicker";
import { setupClicker } from "@/lib/clicker";
import { Time } from "@/lib/clicker/time";
import { BuildingModelChanges } from "@/lib/clicker/building";
import { UpgradeModelChanges } from "@/lib/clicker/upgrade";
import { TimeModelChanges } from "@/lib/clicker/time";
describe("add() utility function", () => {
  let clicker: Clicker;

  beforeEach(() => {
    clicker = setupClicker(true);
  });

  test("test initial production setup", () => {
    const production = clicker.RPS();
    expect(production).toBe(0.5);
    expect(clicker.buildings.length).toBe(35);
    expect(clicker.upgrade_100.length).toBe(16);
    expect(clicker.upgrade_200.length).toBe(16);
    expect(clicker.upgrade_many.length).toBe(16);
    expect(clicker.upgrade_posterior.length).toBe(11);
    expect(clicker.upgrade_category.length).toBe(8);
    expect(clicker.upgrade_global.length).toBe(10);
    expect(clicker.upgrade_terrain.length).toBe(4);

    expect(clicker.metier.farmer).toBe(1);
    expect(clicker.metier.hunter).toBe(1);
    expect(clicker.metier.miner).toBe(1);
    expect(clicker.metier.alchemist).toBe(1);
    expect(clicker.TotalSpend()).toBe(0);
  });

  test("Shall throw when setting job to 0", () => {
    expect(() => clicker.setMetierLevel("miner", 0)).toThrow("[Métier] impossible de définir miner au niveau 0. Le niveau doit être supérieur à 0");
  });

  describe("TimeModel", () => {
    test("shall not trigger new day event", () => {
      const timeModel = new Time({ startingSeason: new Date() });
      timeModel.subscribe(TimeModelChanges.DAYCHANGE, "day changes should not be trigger", () => {
        expect(1).toBe(2);
      });
      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 1 hour with date arg", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60);
      });

      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 1 hour with number arg", (e) => {
        e.currentDate = e.currentDate.getTime() + 1000 * 60 * 60;
      });
    });

    test("shall trigger new day event", () => {
      const timeModel = new Time({ startingSeason: new Date() });
      let totalDayChanges = 0;
      timeModel.subscribe(TimeModelChanges.DAYCHANGE, "sub day changes", () => {
        totalDayChanges += 1;
      });

      expect(timeModel.getValue().daySinceBeggining).toBe(0);
      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 1 day minus 1 milliseconds", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60 *24 -1);
      });
      expect(timeModel.getValue().daySinceBeggining).toBe(0);
      expect(totalDayChanges).toBe(0);
      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 1 milliseconds", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1);
      });
      expect(timeModel.getValue().daySinceBeggining).toBe(1);
      expect(totalDayChanges).toBe(1);
      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 10 days", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60 *24 * 10);
      });
      expect(timeModel.getValue().daySinceBeggining).toBe(11);
      expect(totalDayChanges).toBe(2);
      timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "sub 1 milliseconds", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() - 1);
      });
      expect(timeModel.getValue().daySinceBeggining).toBe(10);
      expect(totalDayChanges).toBe(3);
    });

    test("shall not throw if new date is invalid", () => {
      const timeModel = new Time({ startingSeason: new Date() });
      expect(() => timeModel.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 1 hour", (e) => {
        e.currentDate = new Date("toto");
      })).toThrow("[Temps] Impossible de définir une date invalide");
    });
  });

  describe("Buy building", () => {
    test("shall throw when setting count to -1", () => {
      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set -1 building", (e) => {
          e.count = -1;
        });
      }).toThrow("[Batiment] Mine abandonnée : quantite invalide (-1). Doit etre entre [0, 99]");
    });

    test("shall throw when setting count over 99", () => {
      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set -1 building", (e) => {
          e.count = 100;
        });
      }).toThrow("[Batiment] Mine abandonnée : quantite invalide (100). Doit etre entre [0, 99]");
    });

    test("shall throw when buying a building be previous one has not been bought", () => {
      expect(() => {
        clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "add 1 building", (e) => {
          e.count += 1;
        });
      }).toThrow("Impossible d'acheter Caverne aux gros cailloux car le batiment precedent Mine abandonnée n'a pas encore ete achete");
    });

    test("shall throw when selling a building be one after is still bought", () => {
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 1 building", (e) => {
        e.count += 1;
      });
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "add 1 building", (e) => {
        e.count += 1;
      });
      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 0 building", (e) => {
          e.count = 0;
        });
      }).toThrow("Impossible de vendre Mine abandonnée car le batiment suivant Caverne aux gros cailloux est encore achete");
    });

    test("test production without bonus", () => {
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 3 buildings", (e) => {
        e.count += 3;
      });
      expect(clicker.RPS()).toBe(0.8000000044703484);
      expect(clicker.TotalSpend()).toBe(4138);
    });

    test("test production without bonus", () => {
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 3 buildings", (e) => {
        e.count += 3;
      });

      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "add 3 buildings", (e) => {
        e.count += 3;
      });
      expect(clicker.RPS()).toBe(1.3399999982118604);
      expect(clicker.TotalSpend()).toBe(15723);
    });

    test("test production without bonus", () => {
      clicker.buildings.forEach((building, index) => {
        building.applyChanges(BuildingModelChanges.COUNT, `add ${index} buildings`, (e) => {
          e.count += index +1;
        });
      });

      const newProduction = clicker.RPS();
      expect(newProduction).toBe(3628449621.624799);
      expect(clicker.TotalSpend()).toBeCloseTo(10234828927793634, -1);
    });
  });

  describe("Total Spend", () => {
    test("shall increase by the sum of the price", () => {
      expect(clicker.TotalSpend()).toBe(0);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 1 building", (e) => {
        e.count += 10;
      });
      expect(clicker.TotalSpend()).toBe(19921);
    });

    test("shall decrease by the sum of the price", () => {
      expect(clicker.TotalSpend()).toBe(0);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 10 building", (e) => {
        e.count += 10;
      });
      expect(clicker.TotalSpend()).toBe(19921);

      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "remove 9 building", (e) => {
        e.count -= 9;
      });
      expect(clicker.TotalSpend()).toBe(1250);
    });
  });

  describe("Upgrade 100% Tests", () => {
    test("basic test production when buying", () => {
      expect(clicker.upgrade_100[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_100[0].canBuy).toBe(true);
      expect(clicker.TotalSpend()).toBe(19921);
      clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(2.5000000298023224);
      expect(clicker.TotalSpend()).toBe(25546);

      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });
      expect(clicker.RPS()).toBe(4.300000008940696);
      expect(clicker.TotalSpend()).toBe(81328);
      expect(clicker.upgrade_100[1].canBuy).toBe(true);
      clicker.upgrade_100[1].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(6.09999998807907);
      expect(clicker.TotalSpend()).toBe(100228);
    });

    test("test production when unbuy", () => {
      expect(clicker.upgrade_100[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_100[0].canBuy).toBe(true);
      clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_100[0].own).toBe(true);
      expect(clicker.RPS()).toBe(2.5000000298023224);
      expect(clicker.TotalSpend()).toBe(25546);

      clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_100[0].canBuy).toBe(true);
      expect(clicker.upgrade_100[0].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(19921);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_100[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_100[0].canBuy).toBe(true);
      clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(2.5000000298023224);

      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 0 buildings", (e) => {
          e.count = 0;
        });
      }).toThrow("[Upgrade 100%] Lampe frontale possédée mais pas assez de bâtiments pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_100[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Upgrade 100%] Lampe frontale possédée mais pas assez de bâtiments pour la posséder");
    });

  });

  describe("Upgrade 200% Tests", () => {
    test("basic test production", () => {
      expect(clicker.upgrade_200[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      clicker.time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 10 days", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60 *24 * 10);
      });
      expect(clicker.upgrade_200[0].canBuy).toBe(true);
      clicker.upgrade_200[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_200[0].own).toBe(true);
      expect(clicker.RPS()).toBe(2.5000000298023224);
      expect(clicker.TotalSpend()).toBe(31796);

      clicker.upgrade_200[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_200[0].canBuy).toBe(true);
      expect(clicker.upgrade_200[0].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(19921);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_200[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);

      clicker.time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 10 days", (e) => {
        e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60 *24 * 10);
      });
      expect(clicker.upgrade_200[0].canBuy).toBe(true);
      clicker.upgrade_200[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(2.5000000298023224);

      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
          e.count = 4;
        });
      }).toThrow("[Upgrade 200%] Potion de vision nocturne possédée mais pas assez de jours de connexion pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_200[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_200[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Upgrade 200%] Potion de vision nocturne possédée mais pas assez de bâtiments pour la posséder");
    });

  });

  describe("Upgrade Many Tests", () => {
    test("basic test production", () => {
      expect(clicker.upgrade_many[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_many[0].canBuy).toBe(true);
      clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_many[0].own).toBe(true);
      expect(clicker.RPS()).toBe(1.6000000163912773);
      expect(clicker.TotalSpend()).toBe(21171);

      clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.TotalSpend()).toBe(19921);
      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_many[0].canBuy).toBe(true);
      expect(clicker.upgrade_many[0].own).toBe(false);
    });

    test("test production when increasing building many", () => {
      expect(clicker.upgrade_many[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_many[0].canBuy).toBe(true);
      clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_many[0].own).toBe(true);
      expect(clicker.RPS()).toBe(1.6000000163912773);
      expect(clicker.TotalSpend()).toBe(21171);

      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count += 10;
      });
      expect(clicker.RPS()).toBe(2.900000035762787);
      expect(clicker.TotalSpend()).toBe(72843);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_many[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });

      expect(clicker.RPS()).toBe(1.5000000149011612);
      expect(clicker.upgrade_many[0].canBuy).toBe(true);
      clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(1.6000000163912773);

      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
          e.count = 1;
        });
      }).toThrow("[Upgrade Many] Production nombreuse - Mine abandonnée possédée mais pas assez de bâtiments pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_many[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Upgrade Many] Production nombreuse - Mine abandonnée possédée mais pas assez de bâtiments pour la posséder");
    });
  });

  describe("Upgrade Posterior Tests", () => {
    test("basic test production", () => {
      expect(clicker.upgrade_posterior[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
        e.count = 4;
      });

      expect(clicker.RPS()).toBe(2.2200000065565106);
      expect(clicker.TotalSpend()).toBe(36165);
      expect(clicker.upgrade_posterior[0].canBuy).toBe(true);
      clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_posterior[0].own).toBe(true);
      expect(clicker.RPS()).toBe(2.2920000057220458);
      expect(clicker.TotalSpend()).toBe(44040);

      clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(2.2200000065565106);
      expect(clicker.upgrade_posterior[0].canBuy).toBe(true);
      expect(clicker.upgrade_posterior[0].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(36165);
    });

    test("test production when increasing previous building posterior", () => {
      expect(clicker.upgrade_posterior[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
        e.count = 4;
      });

      expect(clicker.RPS()).toBe(2.2200000065565106);
      expect(clicker.upgrade_posterior[0].canBuy).toBe(true);
      expect(clicker.TotalSpend()).toBe(36165);
      clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_posterior[0].own).toBe(true);
      expect(clicker.RPS()).toBe(2.2920000057220458);
      expect(clicker.TotalSpend()).toBe(44040);

      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count += 10;
      });
      expect(clicker.RPS()).toBe(3.364000019788742);
      expect(clicker.TotalSpend()).toBe(95712);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_posterior[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 10;
      });
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
        e.count = 4;
      });

      expect(clicker.RPS()).toBe(2.2200000065565106);
      expect(clicker.upgrade_posterior[0].canBuy).toBe(true);
      clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_posterior[0].own).toBe(true);
      expect(clicker.RPS()).toBe(2.2920000057220458);

      expect(() => {
        clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
          e.count = 1;
        });
      }).toThrow("[Upgrade Posterior] Production postérieure - Caverne aux gros cailloux possédée mais pas assez de bâtiments pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_posterior[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Upgrade Posterior] Production postérieure - Caverne aux gros cailloux possédée mais pas assez de bâtiments pour la posséder");
    });

  });

  describe("Upgrade Category Tests", () => {
    test("basic test production with pourcentage = 0.1", () => {
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      clicker.buildings[2].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });
      expect(clicker.upgrade_category[0].canBuy).toBe(true);
      expect(clicker.RPS()).toBe(1.103999987065792);
      expect(clicker.TotalSpend()).toBe(10750);

      clicker.upgrade_category[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_category[0].own).toBe(true);
      expect(clicker.RPS()).toBe(1.1643999857723712);
      expect(clicker.TotalSpend()).toBe(17925);

      clicker.upgrade_category[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(1.103999987065792);
      expect(clicker.upgrade_category[0].canBuy).toBe(true);
      expect(clicker.upgrade_category[0].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(10750);
    });

    test("basic test production with pourcentage = 0.5", () => {
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      for(let i = 0; i < 8; i++) {
        expect(clicker.upgrade_category[4].canBuy).toBe(false);
        clicker.buildings[i].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
          e.count = 1;
        });
        expect(clicker.upgrade_category[4].canBuy).toBe(false);
      }
      // just bought 1 example of the 7 first buildings

      expect(clicker.upgrade_category[0].canBuy).toBe(true);
      expect(clicker.upgrade_category[1].canBuy).toBe(false);
      expect(clicker.upgrade_category[2].canBuy).toBe(false);
      expect(clicker.upgrade_category[3].canBuy).toBe(true);
      expect(clicker.RPS()).toBe(14.14994881770809);
      clicker.buildings[8].applyChanges(BuildingModelChanges.COUNT, "set 2 buildings", (e) => {
        e.count = 2;
      });
      expect(clicker.TotalSpend()).toBe(1923250);
      expect(clicker.upgrade_category[4].canBuy).toBe(false);
      clicker.buildings[8].applyChanges(BuildingModelChanges.COUNT, "add 1 buildings", (e) => {
        e.count += 1;
      });
      expect(clicker.upgrade_category[4].canBuy).toBe(true);
      expect(clicker.TotalSpend()).toBe(2709750);

      expect(clicker.RPS()).toBe(47.20982403203702);
      clicker.upgrade_category[4].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_category[4].own).toBe(true);
      expect(clicker.RPS()).toBe(63.9017616330324);
      expect(clicker.TotalSpend()).toBe(5658375);

      clicker.upgrade_category[4].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(47.20982403203702);
      expect(clicker.upgrade_category[0].canBuy).toBe(true);
      expect(clicker.upgrade_category[1].canBuy).toBe(false);
      expect(clicker.upgrade_category[2].canBuy).toBe(false);
      expect(clicker.upgrade_category[3].canBuy).toBe(true);
      expect(clicker.upgrade_category[4].canBuy).toBe(true);
      expect(clicker.upgrade_category[4].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(2709750);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });
      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });
      clicker.buildings[2].applyChanges(BuildingModelChanges.COUNT, "set 1 buildings", (e) => {
        e.count = 1;
      });

      expect(clicker.RPS()).toBe(1.103999987065792);
      expect(clicker.upgrade_category[0].canBuy).toBe(true);
      clicker.upgrade_category[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(1.1643999857723712);

      expect(() => {
        clicker.buildings[2].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
          e.count = 0;
        });
      }).toThrow("[Amélioration Catégorie] Pioche en Paladium possédée mais pas assez de bâtiments pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_category[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_category[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Amélioration Catégorie] Pioche en Paladium possédée mais pas assez de bâtiments pour la posséder");
    });
  });

  describe("Upgrade Global Tests", () => {
    test("basic test production", () => {
      expect(clicker.upgrade_global[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 76 buildings", (e) => {
        e.count = 76;
      });
      expect(clicker.RPS()).toBe(8.100000113248825);
      expect(clicker.upgrade_global[0].canBuy).toBe(false);
      expect(clicker.TotalSpend()).toBe(17476086);

      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 1 buildings", (e) => {
        e.count += 1;
      });
      expect(clicker.RPS()).toBe(8.200000114738941);
      expect(clicker.upgrade_global[0].canBuy).toBe(true);
      expect(clicker.TotalSpend()).toBe(19224945);
      clicker.upgrade_global[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.upgrade_global[0].own).toBe(true);
      expect(clicker.RPS()).toBe(8.970000126212836);
      expect(clicker.TotalSpend()).toBe(20984945);

      clicker.upgrade_global[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(8.200000114738941);
      expect(clicker.upgrade_global[0].canBuy).toBe(true);
      expect(clicker.upgrade_global[0].own).toBe(false);
      expect(clicker.TotalSpend()).toBe(19224945);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      expect(clicker.upgrade_global[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 10 buildings", (e) => {
        e.count = 77;
      });

      expect(clicker.RPS()).toBe(8.200000114738941);
      expect(clicker.TotalSpend()).toBe(19224945);
      expect(clicker.upgrade_global[0].canBuy).toBe(true);
      clicker.upgrade_global[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(8.970000126212836);

      expect(() => {
        clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 4 buildings", (e) => {
          e.count = 4;
        });
      }).toThrow("[Upgrade Global] Namuu Ecolier possédée mais pas assez de jours de connexion pour la posséder");
    });

    test("shall throw when buying but condition is not met", () => {
      expect(clicker.upgrade_global[0].canBuy).toBe(false);
      expect(() => {
        clicker.upgrade_global[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
          e.own = true;
        });
      }).toThrow("[Upgrade Global] Namuu Ecolier possédée mais pas assez de coins dépensés pour la posséder");
    });

  });

  describe("Upgrade Terrain Tests", () => {
    test("basic test production when terrain impact the building", () => {
      expect(clicker.upgrade_terrain[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 76 buildings", (e) => {
        e.count = 76;
      });
      expect(clicker.RPS()).toBe(8.100000113248825);
      expect(clicker.TotalSpend()).toBe(17476086);
      clicker.setMetierLevel("miner", 20);
      expect(clicker.RPS()).toBe(8.100000113248825);
      expect(clicker.TotalSpend()).toBe(17476086);
      clicker.upgrade_terrain[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(9.62000013589859);
      expect(clicker.TotalSpend()).toBe(19366086);

      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 76 buildings", (e) => {
        e.count = 76;
      });
      expect(clicker.RPS()).toBe(26.035999945640558);
      expect(clicker.TotalSpend()).toBe(68299128);

      clicker.setMetierLevel("miner", 10);
      expect(clicker.RPS()).toBe(23.907999950170513);
      expect(clicker.TotalSpend()).toBe(68299128);
      clicker.upgrade_terrain[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = false;
      });
      expect(clicker.RPS()).toBe(21.779999954700465);
      expect(clicker.TotalSpend()).toBe(66409128);
    });

    test("basic test production when terrain impact the building", () => {
      expect(clicker.upgrade_terrain[0].canBuy).toBe(false);
      clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 76 buildings", (e) => {
        e.count = 76;
      });
      expect(clicker.RPS()).toBe(8.100000113248825);
      expect(clicker.TotalSpend()).toBe(17476086);

      clicker.upgrade_terrain[1].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
        e.own = true;
      });
      expect(clicker.RPS()).toBe(8.100000113248825);
      expect(clicker.TotalSpend()).toBe(26476086);

      clicker.setMetierLevel("farmer", 20);

      clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "buy upgrade", (e) => {
        e.count = 1;
      });
      clicker.buildings[2].applyChanges(BuildingModelChanges.COUNT, "buy upgrade", (e) => {
        e.count = 1;
      });
      expect(clicker.RPS()).toBe(8.604000098824502);
      expect(clicker.TotalSpend()).toBe(26485586);

      clicker.buildings[3].applyChanges(BuildingModelChanges.COUNT, "buy upgrade", (e) => {
        // is impact by terrain[1]
        e.count = 10;
      });
      expect(clicker.RPS()).toBe(15.602399646925933);
      expect(clicker.TotalSpend()).toBe(26684804);
    });

    test("shall throw when upgrade condition is not met but still bought", () => {
      // TODO check the day condition
    });

    test("shall throw when buying but condition is not met", () => {
      // TODO check the day condition
    });

  });

  test("test production with 100%, 200%, many posterior, category, global and terrain", () => {
    expect(clicker.upgrade_100[0].canBuy).toBe(false);
    expect(clicker.upgrade_100[0].canBuy).toBe(false);
    clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "set 3 buildings", (e) => {
      e.count = 3;
    });

    expect(clicker.RPS()).toBe(0.8000000044703484);
    expect(clicker.upgrade_100[0].canBuy).toBe(true);
    expect(clicker.upgrade_200[0].canBuy).toBe(false);
    expect(clicker.upgrade_many[0].canBuy).toBe(true);
    expect(clicker.upgrade_many[0].own).toBe(false);
    clicker.upgrade_100[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(1.1000000089406967);

    clicker.buildings[0].applyChanges(BuildingModelChanges.COUNT, "add 7 buildings", (e) => {
      e.count = 7;
    });

    expect(clicker.RPS()).toBe(1.9000000208616257);
    expect(clicker.upgrade_100[0].own).toBe(true);
    clicker.time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "add 7 days", (e) => {
      e.currentDate = new Date(e.currentDate.getTime() + 1000 * 60 * 60 *24 * 7);
    });
    expect(clicker.upgrade_200[0].canBuy).toBe(true);
    expect(clicker.upgrade_many[0].own).toBe(false);
    clicker.upgrade_200[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(2.6000000312924385);
    expect(clicker.upgrade_100[0].own).toBe(true);
    expect(clicker.upgrade_200[0].own).toBe(true);
    expect(clicker.upgrade_many[0].own).toBe(false);

    clicker.upgrade_many[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(2.6490000320225953);
    expect(clicker.upgrade_100[0].own).toBe(true);
    expect(clicker.upgrade_200[0].own).toBe(true);
    expect(clicker.upgrade_many[0].own).toBe(true);
    expect(clicker.upgrade_posterior[0].canBuy).toBe(false);
    expect(clicker.upgrade_posterior[0].own).toBe(false);
    expect(clicker.TotalSpend()).toBe(30609);

    clicker.buildings[1].applyChanges(BuildingModelChanges.COUNT, "set 99 buildings", (e) => {
      e.count = 99;
    });
    expect(clicker.upgrade_posterior[0].canBuy).toBe(true);
    expect(clicker.upgrade_posterior[0].own).toBe(false);
    expect(clicker.RPS()).toBe(20.468999825492492);
    clicker.upgrade_posterior[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.upgrade_posterior[0].own).toBe(true);
    expect(clicker.RPS()).toBe(21.716399811035387);
    expect(clicker.TotalSpend()).toBe(438478351);

    clicker.buildings[2].applyChanges(BuildingModelChanges.COUNT, "add 1 buildings", (e) => {
      e.count = 1;
    });
    expect(clicker.RPS()).toBe(22.040399798697226);
    expect(clicker.TotalSpend()).toBe(438484351);

    clicker.upgrade_category[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(23.924799777853483);
    expect(clicker.TotalSpend()).toBe(438491526);

    clicker.upgrade_global[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(25.80919975700974);
    expect(clicker.TotalSpend()).toBe(440251526);
    clicker.buildings[3].applyChanges(BuildingModelChanges.COUNT, "add 1 buildings", (e) => {
      e.count = 1;
    });

    expect(clicker.RPS()).toBe(26.450719715585706);
    expect(clicker.TotalSpend()).toBe(440264026);

    expect(clicker.upgrade_terrain[0].canBuy).toBe(true);
    clicker.upgrade_terrain[0].applyChanges(UpgradeModelChanges.OWN, "buy upgrade", (e) => {
      e.own = true;
    });
    expect(clicker.RPS()).toBe(26.639159713501332);
    expect(clicker.TotalSpend()).toBe(442154026);

    // farmer does not impact the RPS in this scenario
    clicker.setMetierLevel("farmer", 20);

    expect(clicker.RPS()).toBe(26.639159713501332);
    expect(clicker.TotalSpend()).toBe(442154026);

    clicker.setMetierLevel("miner", 20);
    expect(clicker.RPS()).toBe(30.21951967389822);
    expect(clicker.TotalSpend()).toBe(442154026);

  });
});
