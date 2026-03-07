import { Model } from "@/lib/clicker/model";

export enum TestModelChanges {
  EVENT_A = "EVENT_A",
  EVENT_B = "EVENT_B",
}

/**
 *
 */
export abstract class TestModel extends Model<Test, TestModelChanges> {
  private _value: number;

  /**
   *
   */
  constructor(value: number) {
    super();
    this._value = value;
  }
  /**
   *
   */
  copy(): TestModel {
    return {
      ...this,
      value: this._value,
    };
  }

  /**
   *
   */
  get value () {
    return this._value;
  }

  /**
   *
   */
  set value(value: number) {
    this._value = value;
  }

  dict: { [key in TestModelChanges]: () => string | boolean | number } = {
    [TestModelChanges.EVENT_A]: () => this._value,
    [TestModelChanges.EVENT_B]: () => this._value,
  };
}

class Test extends TestModel {
  getValue(): Test {
    return this;
  }
}

describe("add() utility function", () => {
  let model1: Test;
  let model2: Test;
  let model3: Test;
  let model4: Test;

  beforeEach(() => {
    model1 = new Test(0);
    model2 = new Test(0);
    model3 = new Test(0);
    model4 = new Test(0);
  });

  test("Easy test subscription", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      expect(newValue.value).toBe(4);
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
  });

  test("Easy test filter subscription", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", () => {
      // should never be triggered
      expect(1).toBe(2);
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_B, "changing value to 4", (e) => {
      e.value = 4;
    });

    expect(model1.getValue().value).toBe(4);
  });

  test("Test Old/News Value", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ oldValue, newValue }) => {
      expect(() => (oldValue as any).getValue()).toThrow();
      expect(() => (oldValue as any).copy()).toThrow();
      expect(() => (oldValue as any).hash()).toThrow();
      expect(() => (oldValue as any).applyChanges(TestModelChanges.EVENT_A, "shall throw", () => {})).toThrow();
      expect(() => (oldValue as any).subscribe(TestModelChanges.EVENT_A, "shall throw", () => {})).toThrow();
      expect(oldValue.value).toBe(0);
      expect(() => (newValue as any).getValue()).toThrow();
      expect(() => (newValue as any).copy()).toThrow();
      expect(() => (newValue as any).hash()).toThrow();
      expect(() => (newValue as any).applyChanges(TestModelChanges.EVENT_A, "shall throw", () => {})).toThrow();
      expect(() => (newValue as any).subscribe(TestModelChanges.EVENT_A, "shall throw", () => {})).toThrow();
      expect(newValue.value).toBe(4);
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });

    expect(model1.getValue().value).toBe(4);
  });

  test("Should not trigger subscription when value is the same", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", () => {
      expect(0).toBe(1);
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "setting the value to 0", (e) => {
      e.value = 0;
    });
    expect(model1.getValue().value).toBe(0);
  });

  test("Test subscription", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(5);
  });

  test("Test subscription 2", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(5);
  });

  test("Test filter subscription event propagation", () => {
    // should not propagate event
    model1.subscribe(TestModelChanges.EVENT_B, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(0);
  });

  test("Test filter subscription event propagation 2", () => {
    // should not propagate event
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_B, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(0);
  });

  test("Test subscription propagation transitivity", () => {
    // 1 -> 2 -> 3
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    model2.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model3.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    expect(model3.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(5);
    expect(model3.getValue().value).toBe(6);
  });

  test("Test subscription propagation transitivity with different event type", () => {
    // 1 -> 2 -> 3
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    model2.subscribe(TestModelChanges.EVENT_B, "event-a", ({ newValue }) => {
      model3.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    expect(model3.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(5);
    expect(model3.getValue().value).toBe(6);
  });

  test("shall stop subscription propagation transitivity because different event type", () => {
    // 1 -> 2 -> 3
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    model2.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model3.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    expect(model3.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(5);
    expect(model3.getValue().value).toBe(0);
  });

  test("shall call recursively until value is above 10", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model1.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        if (newValue.value <= 10) {
          e.value = newValue.value + 1;
        }
      });
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 1;
    });
    expect(model1.getValue().value).toBe(11);
  });

  test("multiple same event subscription", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", () => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = 1;
      });
    });

    model1.subscribe(TestModelChanges.EVENT_A, "event-a", () => {
      model3.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = 2;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    expect(model3.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 4", (e) => {
      e.value = 4;
    });
    expect(model1.getValue().value).toBe(4);
    expect(model2.getValue().value).toBe(1);
    expect(model3.getValue().value).toBe(2);
  });

  test("should update in circle", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        expect(newValue.value).toBe(1);
        e.value = newValue.value + 1;
      });
    });

    model2.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model3.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        expect(newValue.value).toBe(2);
        e.value = newValue.value + 1;
      });
    });

    model2.subscribe(TestModelChanges.EVENT_B, "event-b", ({ newValue }) => {
      model3.applyChanges(TestModelChanges.EVENT_A, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
        expect(newValue.value).toBe(4);
      });
    });

    model3.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      model1.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        e.value = newValue.value + 1;
        expect(newValue.value).toBe(5);
      });
    });

    model3.subscribe(TestModelChanges.EVENT_B, "event-b", ({ newValue }) => {
      model2.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
        expect(newValue.value).toBe(3);
        e.value = newValue.value + 1;
      });
    });

    expect(model1.getValue().value).toBe(0);
    expect(model2.getValue().value).toBe(0);
    expect(model3.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 1", (e) => {
      e.value = 1;
    });
    expect(model1.getValue().value).toBe(6);
    expect(model2.getValue().value).toBe(4);
    expect(model3.getValue().value).toBe(5);
  });

  test("newValue should not change in subscribe", () => {
    model1.subscribe(TestModelChanges.EVENT_A, "event-a", ({ newValue }) => {
      if(newValue.value === 1) {
        model1.applyChanges(TestModelChanges.EVENT_B, "update-after-event-a", (e) => {
          e.value = newValue.value + 1;
        });
      }
      if(newValue.value === 2) {
        expect(1).toBe(2);
      }
    });

    expect(model1.getValue().value).toBe(0);
    model1.applyChanges(TestModelChanges.EVENT_A, "changing value to 1", (e) => {
      e.value = 1;
    });
    expect(model1.getValue().value).toBe(2);
  });

  // suppress unused variable warning for model4
  test("model4 exists", () => {
    expect(model4).toBeDefined();
  });
});
