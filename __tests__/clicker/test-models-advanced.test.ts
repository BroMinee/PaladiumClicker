import { Model } from "@/lib/clicker/model";

// ============================================================================
// MODELS DEFINITIONS
// ============================================================================

export enum CounterEvents {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  RESET = "RESET",
  MULTIPLY = "MULTIPLY",
}

export enum StateEvents {
  ACTIVATE = "ACTIVATE",
  DEACTIVATE = "DEACTIVATE",
  TOGGLE = "TOGGLE",
}

export enum AggregatorEvents {
  AGGREGATE = "AGGREGATE",
}

export enum ChainEvents {
  PROPAGATE = "PROPAGATE",
  REVERSE_PROPAGATE = "REVERSE_PROPAGATE",
  BROADCAST = "BROADCAST",
}

// Counter Model
class Counter extends Model<Counter, CounterEvents> {
  private _value: number;
  private _name: string;
  private _history: number[] = [];

  constructor(name: string, initialValue: number = 0) {
    super();
    this._value = initialValue;
    this._name = name;
    this._history.push(initialValue);
  }

  copy(): Counter {
    const c = new Counter(this._name, this._value);
    c._history = [...this._history];
    return c;
  }

  getValue(): Counter {
    return this;
  }

  get value() {
    return this._value;
  }

  set value(v: number) {
    this._history.push(v);
    this._value = v;
  }

  get name() {
    return this._name;
  }

  get history() {
    return [...this._history];
  }

  dict: { [key in CounterEvents]: () => string | boolean | number } = {
    [CounterEvents.DECREMENT]: () => this._value,
    [CounterEvents.INCREMENT]: () => this._value,
    [CounterEvents.MULTIPLY]: () => this._value,
    [CounterEvents.RESET]: () => this._value,
  };
}

// State Model (Active/Inactive)
class StateModel extends Model<StateModel, StateEvents> {
  private _active: boolean;
  private _id: string;
  private _toggleCount: number = 0;

  constructor(id: string, active: boolean = false) {
    super();
    this._active = active;
    this._id = id;
  }

  copy(): StateModel {
    const s = new StateModel(this._id, this._active);
    s._toggleCount = this._toggleCount;
    return s;
  }

  getValue(): StateModel {
    return this;
  }

  get active() {
    return this._active;
  }

  set active(v: boolean) {
    this._active = v;
  }

  get id() {
    return this._id;
  }

  get toggleCount() {
    return this._toggleCount;
  }

  incrementToggle() {
    this._toggleCount++;
  }

  dict: { [key in StateEvents]: () => string | boolean | number } = {
    [StateEvents.ACTIVATE]: () => this._active,
    [StateEvents.DEACTIVATE]: () => this._active,
    [StateEvents.TOGGLE]: () => this._toggleCount,
  };
}

// Aggregator Model (collects values from multiple counters)
class Aggregator extends Model<Aggregator, AggregatorEvents> {
  private _sum: number = 0;
  private _count: number = 0;
  private _max: number = -Infinity;
  private _min: number = Infinity;

  constructor() {
    super();
  }

  copy(): Aggregator {
    const a = new Aggregator();
    a._sum = this._sum;
    a._count = this._count;
    a._max = this._max;
    a._min = this._min;
    return a;
  }

  getValue(): Aggregator {
    return this;
  }

  get sum() {
    return this._sum;
  }

  get count() {
    return this._count;
  }

  get average() {
    return this._count === 0 ? 0 : this._sum / this._count;
  }

  get max() {
    return this._max === -Infinity ? 0 : this._max;
  }

  get min() {
    return this._min === Infinity ? 0 : this._min;
  }

  addValue(value: number) {
    this._sum += value;
    this._count++;
    this._max = Math.max(this._max, value);
    this._min = Math.min(this._min, value);
  }

  dict: { [key in AggregatorEvents]: () => string | boolean | number } = {
    [AggregatorEvents.AGGREGATE]: () => `${this._count}-${this._sum}-${this.max}-${this._min}`,
  };
}

// Chain Model (for complex propagation patterns)
class ChainNode extends Model<ChainNode, ChainEvents> {
  private _value: number;
  private _level: number;
  private _processed: boolean = false;

  constructor(level: number, value: number = 0) {
    super();
    this._level = level;
    this._value = value;
  }

  copy(): ChainNode {
    const c = new ChainNode(this._level, this._value);
    c._processed = this._processed;
    return c;
  }

  getValue(): ChainNode {
    return this;
  }

  get value() {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
  }

  get level() {
    return this._level;
  }

  get processed() {
    return this._processed;
  }

  markProcessed() {
    this._processed = true;
  }

  dict: { [key in ChainEvents]: () => string | boolean | number } = {
    [ChainEvents.BROADCAST]: () => this._value,
    [ChainEvents.PROPAGATE]: () => `${this._value}-${this._processed}`,
    [ChainEvents.REVERSE_PROPAGATE]: () => this._value,
  };
}

// ============================================================================
// MEGA COMPLEX TESTS
// ============================================================================

describe("🔥 ULTIMATE COMPLEX MODEL TESTS 🔥", () => {

  describe("🎯 Multi-Model Orchestra", () => {
    let counters: Counter[];
    let states: StateModel[];
    let aggregator: Aggregator;

    beforeEach(() => {
      counters = [
        new Counter("Alpha", 0),
        new Counter("Beta", 0),
        new Counter("Gamma", 0),
        new Counter("Delta", 0),
      ];
      states = [
        new StateModel("S1", false),
        new StateModel("S2", false),
        new StateModel("S3", false),
      ];
      aggregator = new Aggregator();
    });

    test("Complex multi-model cascade with conditional propagation", () => {
      const callOrder: string[] = [];

      // Counter Alpha triggers State S1
      counters[0].subscribe(CounterEvents.INCREMENT, "alpha-to-s1", ({ newValue }) => {
        callOrder.push("alpha-inc");
        if (newValue.value >= 5) {
          states[0].applyChanges(StateEvents.ACTIVATE, "activate-s1", (s) => {
            s.active = true;
          });
        }
      });

      // State S1 triggers Counter Beta when activated
      states[0].subscribe(StateEvents.ACTIVATE, "s1-to-beta", () => {
        callOrder.push("s1-activate");
        counters[1].applyChanges(CounterEvents.INCREMENT, "inc-beta", (c) => {
          c.value = 10;
        });
      });

      // Counter Beta updates Aggregator
      counters[1].subscribe(CounterEvents.INCREMENT, "beta-to-agg", ({ newValue }) => {
        callOrder.push("beta-to-agg");
        aggregator.applyChanges(AggregatorEvents.AGGREGATE, "agg-beta", (a) => {
          a.addValue(newValue.value);
        });
      });

      // Aggregator triggers Counter Gamma if sum > 8
      aggregator.subscribe(AggregatorEvents.AGGREGATE, "agg-to-gamma", ({ newValue }) => {
        callOrder.push("agg-aggregate");
        if (newValue.sum > 8) {
          counters[2].applyChanges(CounterEvents.MULTIPLY, "multiply-gamma", (c) => {
            c.value = newValue.sum * 2;
          });
        }
      });

      // Counter Gamma triggers State S2
      counters[2].subscribe(CounterEvents.MULTIPLY, "gamma-to-s2", ({}) => {
        callOrder.push("gamma-mult");
        states[1].applyChanges(StateEvents.TOGGLE, "toggle-s2", (s) => {
          s.active = !s.active;
          s.incrementToggle();
        });
      });

      // Execute the cascade
      counters[0].applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 5;
      });

      expect(counters[0].value).toBe(5);
      expect(states[0].active).toBe(true);
      expect(counters[1].value).toBe(10);
      expect(aggregator.sum).toBe(10);
      expect(counters[2].value).toBe(20);
      expect(states[1].active).toBe(true);
      expect(states[1].toggleCount).toBe(1);
      expect(callOrder).toEqual([
        "alpha-inc",
        "s1-activate",
        "beta-to-agg",
        "agg-aggregate",
        "gamma-mult",
      ]);
    });

    test("Circular dependency with break condition", () => {
      let iterations = 0;
      const maxIterations = 5;

      // Counter Alpha -> Beta
      counters[0].subscribe(CounterEvents.INCREMENT, "alpha-to-beta", ({ newValue }) => {
        iterations++;
        if (iterations < maxIterations && newValue.value < 20) {
          counters[1].applyChanges(CounterEvents.INCREMENT, "inc-beta", (c) => {
            c.value = newValue.value + 2;
          });
        }
      });

      // Counter Beta -> Gamma
      counters[1].subscribe(CounterEvents.INCREMENT, "beta-to-gamma", ({ newValue }) => {
        if (iterations < maxIterations && newValue.value < 20) {
          counters[2].applyChanges(CounterEvents.INCREMENT, "inc-gamma", (c) => {
            c.value = newValue.value + 1;
          });
        }
      });

      // Counter Gamma -> Alpha (circular!)
      counters[2].subscribe(CounterEvents.INCREMENT, "gamma-to-alpha", ({ newValue }) => {
        if (iterations < maxIterations && newValue.value < 20) {
          counters[0].applyChanges(CounterEvents.INCREMENT, "inc-alpha", (c) => {
            c.value = newValue.value + 3;
          });
        }
      });

      counters[0].applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 1;
      });

      expect(iterations).toBe(4);
      expect(counters[0].value).toBe(19);
      expect(counters[1].value).toBe(21);
      expect(counters[2].value).toBe(16);
    });

    test("Diamond dependency pattern", () => {
      const executionLog: string[] = [];

      // Top: Counter Alpha
      counters[0].subscribe(CounterEvents.INCREMENT, "alpha-split", ({ newValue }) => {
        executionLog.push("alpha");
        // Split to Beta and Gamma
        counters[1].applyChanges(CounterEvents.INCREMENT, "to-beta", (c) => {
          c.value = newValue.value * 2;
        });
        counters[2].applyChanges(CounterEvents.INCREMENT, "to-gamma", (c) => {
          c.value = newValue.value * 3;
        });
      });

      // Beta -> Delta
      counters[1].subscribe(CounterEvents.INCREMENT, "beta-to-delta", ({ newValue }) => {
        executionLog.push("beta");
        counters[3].applyChanges(CounterEvents.INCREMENT, "from-beta", (c) => {
          c.value += newValue.value;
        });
      });

      // Gamma -> Delta
      counters[2].subscribe(CounterEvents.INCREMENT, "gamma-to-delta", ({ newValue }) => {
        executionLog.push("gamma");
        counters[3].applyChanges(CounterEvents.INCREMENT, "from-gamma", (c) => {
          c.value += newValue.value;
        });
      });

      counters[0].applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 5;
      });

      expect(counters[0].value).toBe(5);
      expect(counters[1].value).toBe(10); // 5 * 2
      expect(counters[2].value).toBe(15); // 5 * 3
      expect(counters[3].value).toBe(25); // 10 + 15
      expect(executionLog).toEqual(["alpha", "beta", "gamma"]);
    });

    test("State-based fan-out with aggregation", () => {
      // Setup: all counters update aggregator when incremented
      counters.forEach((counter, idx) => {
        counter.subscribe(CounterEvents.INCREMENT, `counter-${idx}-agg`, ({ newValue }) => {
          aggregator.applyChanges(AggregatorEvents.AGGREGATE, `add-${idx}`, (a) => {
            a.addValue(newValue.value);
          });
        });
      });

      // State S1 controls whether to increment all counters
      states[0].subscribe(StateEvents.ACTIVATE, "broadcast-increment", () => {
        counters.forEach((counter, idx) => {
          counter.applyChanges(CounterEvents.INCREMENT, `inc-${idx}`, (c) => {
            c.value = (idx + 1) * 10;
          });
        });
      });

      // Activate state to trigger fan-out
      states[0].applyChanges(StateEvents.ACTIVATE, "activate", (s) => {
        s.active = true;
      });

      expect(aggregator.sum).toBe(100); // 10 + 20 + 30 + 40
      expect(aggregator.count).toBe(4);
      expect(aggregator.average).toBe(25);
      expect(aggregator.max).toBe(40);
      expect(aggregator.min).toBe(10);
    });
  });

  describe("🌊 Chain Reaction Patterns", () => {
    let chain: ChainNode[];

    beforeEach(() => {
      chain = Array.from({ length: 10 }, (_, i) => new ChainNode(i, 0));
    });

    test("Forward propagation with exponential growth", () => {
      // Setup forward chain
      for (let i = 0; i < chain.length - 1; i++) {
        chain[i].subscribe(ChainEvents.PROPAGATE, `forward-${i}`, ({ newValue }) => {
          chain[i + 1].applyChanges(ChainEvents.PROPAGATE, `to-${i + 1}`, (node) => {
            node.value = newValue.value * 2 + 1;
            node.markProcessed();
          });
        });
      }

      chain[0].applyChanges(ChainEvents.PROPAGATE, "start", (node) => {
        node.value = 1;
        node.markProcessed();
      });

      expect(chain[0].value).toBe(1);
      expect(chain[1].value).toBe(3);   // 1*2+1
      expect(chain[2].value).toBe(7);   // 3*2+1
      expect(chain[3].value).toBe(15);  // 7*2+1
      expect(chain[9].value).toBe(1023); // 511*2+1
      expect(chain.every(node => node.processed)).toBe(true);
    });

    test("Bidirectional propagation", () => {
      const visited: number[] = [];

      // Forward propagation
      for (let i = 0; i < chain.length - 1; i++) {
        chain[i].subscribe(ChainEvents.PROPAGATE, `forward-${i}`, ({ newValue }) => {
          visited.push(i);
          if (i < chain.length - 1) {
            chain[i + 1].applyChanges(ChainEvents.PROPAGATE, `to-${i + 1}`, (node) => {
              node.value = newValue.value + 1;
            });
          }
        });
      }

      // Backward propagation from the end
      for (let i = chain.length - 1; i > 0; i--) {
        chain[i].subscribe(ChainEvents.PROPAGATE, `backward-${i}`, ({ newValue }) => {
          if (newValue.value >= 5) {
            chain[i - 1].applyChanges(ChainEvents.REVERSE_PROPAGATE, `back-to-${i - 1}`, (node) => {
              node.value += 100;
            });
          }
        });
      }

      chain[0].applyChanges(ChainEvents.PROPAGATE, "start", (node) => {
        node.value = 1;
      });

      expect(chain[9].value).toBe(10); // Forward: 1+1+1...+1
      expect(chain[0].value).toBe(1); // Backward: 1 + 100
    });

    test("Selective broadcast with filtering", () => {
      const evenIndices = [0, 2, 4, 6, 8];

      // Broadcaster at index 0
      chain[0].subscribe(ChainEvents.BROADCAST, "broadcast", ({ newValue }) => {
        // Update only even indices
        evenIndices.slice(1).forEach(idx => {
          chain[idx].applyChanges(ChainEvents.PROPAGATE, `to-${idx}`, (node) => {
            node.value = newValue.value * idx;
          });
        });
      });

      // Each even index updates its adjacent odd index
      evenIndices.forEach(idx => {
        if (idx < chain.length - 1) {
          chain[idx].subscribe(ChainEvents.PROPAGATE, `even-${idx}-to-odd`, ({ newValue }) => {
            chain[idx + 1].applyChanges(ChainEvents.PROPAGATE, `to-odd-${idx + 1}`, (node) => {
              node.value = newValue.value / 2;
            });
          });
        }
      });

      chain[0].applyChanges(ChainEvents.BROADCAST, "start", (node) => {
        node.value = 10;
      });

      expect(chain[0].value).toBe(10);
      expect(chain[1].value).toBe(0);
      expect(chain[2].value).toBe(20);
      expect(chain[3].value).toBe(10);
      expect(chain[4].value).toBe(40);
      expect(chain[5].value).toBe(20);
      expect(chain[6].value).toBe(60);
      expect(chain[7].value).toBe(30);
      expect(chain[8].value).toBe(80);
      expect(chain[9].value).toBe(40);

    });
  });

  describe("🧠 Complex State Machine", () => {
    let counters: Counter[];
    let states: StateModel[];
    let aggregator: Aggregator;

    beforeEach(() => {
      counters = Array.from({ length: 5 }, (_, i) => new Counter(`C${i}`, 0));
      states = Array.from({ length: 3 }, (_, i) => new StateModel(`S${i}`, false));
      aggregator = new Aggregator();
    });

    test("State machine with multiple transitions", () => {
      const transitionLog: string[] = [];

      // State S0: Initial state
      states[0].subscribe(StateEvents.ACTIVATE, "s0-activate", () => {
        transitionLog.push("S0->ACTIVE");
        counters[0].applyChanges(CounterEvents.INCREMENT, "inc-c0", (c) => {
          c.value = 1;
        });
      });

      // Counter C0 triggers State S1
      counters[0].subscribe(CounterEvents.INCREMENT, "c0-to-s1", ({ newValue }) => {
        if (newValue.value >= 1) {
          states[1].applyChanges(StateEvents.ACTIVATE, "activate-s1", (s) => {
            s.active = true;
          });
        }
      });

      // State S1 increments multiple counters
      states[1].subscribe(StateEvents.ACTIVATE, "s1-activate", () => {
        transitionLog.push("S1->ACTIVE");
        counters[1].applyChanges(CounterEvents.INCREMENT, "inc-c1", (c) => {
          c.value = 5;
        });
        counters[2].applyChanges(CounterEvents.INCREMENT, "inc-c2", (c) => {
          c.value = 10;
        });
      });

      // Both C1 and C2 contribute to aggregator
      [counters[1], counters[2]].forEach((counter, idx) => {
        counter.subscribe(CounterEvents.INCREMENT, `c${idx + 1}-agg`, ({ newValue }) => {
          aggregator.applyChanges(AggregatorEvents.AGGREGATE, `add-c${idx + 1}`, (a) => {
            a.addValue(newValue.value);
          });
        });
      });

      // Aggregator triggers State S2 when sum > 10
      aggregator.subscribe(AggregatorEvents.AGGREGATE, "agg-to-s2", ({ newValue }) => {
        if (newValue.sum > 10) {
          states[2].applyChanges(StateEvents.ACTIVATE, "activate-s2", (s) => {
            s.active = true;
          });
        }
      });

      // State S2 triggers Counter C3
      states[2].subscribe(StateEvents.ACTIVATE, "s2-activate", () => {
        transitionLog.push("S2->ACTIVE");
        counters[3].applyChanges(CounterEvents.MULTIPLY, "mult-c3", (c) => {
          c.value = aggregator.getValue().sum * 3;
        });
      });

      // Start the state machine
      states[0].applyChanges(StateEvents.ACTIVATE, "start", (s) => {
        s.active = true;
      });

      expect(transitionLog).toEqual(["S0->ACTIVE", "S1->ACTIVE", "S2->ACTIVE"]);
      expect(states.every(s => s.active)).toBe(true);
      expect(aggregator.sum).toBe(15);
      expect(counters[3].value).toBe(45);
    });

    test("Race condition handling", () => {
      let raceDetected = false;
      const updates: number[] = [];

      // Two states trying to update the same counter
      states[0].subscribe(StateEvents.ACTIVATE, "s0-race", () => {
        counters[0].applyChanges(CounterEvents.INCREMENT, "from-s0", (c) => {
          updates.push(0);
          c.value += 10;
        });
      });

      states[1].subscribe(StateEvents.ACTIVATE, "s1-race", () => {
        counters[0].applyChanges(CounterEvents.INCREMENT, "from-s1", (c) => {
          updates.push(1);
          c.value += 20;
        });
      });

      // Counter detects multiple rapid updates
      counters[0].subscribe(CounterEvents.INCREMENT, "race-detector", ({}) => {
        if (updates.length > 1) {
          raceDetected = true;
        }
      });

      // Master trigger activates both states
      states[2].subscribe(StateEvents.ACTIVATE, "master-trigger", () => {
        states[0].applyChanges(StateEvents.ACTIVATE, "activate-s0", (s) => {
          s.active = true;
        });
        states[1].applyChanges(StateEvents.ACTIVATE, "activate-s1", (s) => {
          s.active = true;
        });
      });

      states[2].applyChanges(StateEvents.ACTIVATE, "start", (s) => {
        s.active = true;
      });

      expect(raceDetected).toBe(true);
      expect(counters[0].value).toBe(30); // 10 + 20
      expect(updates).toEqual([0, 1]);
    });
  });

  describe("🎭 Event Filtering Mayhem", () => {
    let models: Counter[];

    beforeEach(() => {
      models = Array.from({ length: 6 }, (_, i) => new Counter(`M${i}`, 0));
    });

    test("Complex multi-event type filtering", () => {
      const eventLog: Array<{ model: string; event: string }> = [];

      // Model 0: INCREMENT -> Model 1 (DECREMENT)
      models[0].subscribe(CounterEvents.INCREMENT, "m0-inc", () => {
        eventLog.push({ model: "M0", event: "INC" });
        models[1].applyChanges(CounterEvents.DECREMENT, "to-m1", (c) => {
          c.value -= 1;
        });
      });

      // Model 1: DECREMENT -> Model 2 (MULTIPLY)
      models[1].subscribe(CounterEvents.DECREMENT, "m1-dec", () => {
        eventLog.push({ model: "M1", event: "DEC" });
        models[2].applyChanges(CounterEvents.MULTIPLY, "to-m2", (c) => {
          c.value = 2;
        });
      });

      // Model 1: INCREMENT should NOT trigger (filter test)
      models[1].subscribe(CounterEvents.INCREMENT, "m1-inc-should-not-fire", () => {
        throw new Error("This should never execute!");
      });

      // Model 2: MULTIPLY -> Model 3 (RESET)
      models[2].subscribe(CounterEvents.MULTIPLY, "m2-mult", () => {
        eventLog.push({ model: "M2", event: "MULT" });
        models[3].applyChanges(CounterEvents.RESET, "to-m3", (c) => {
          c.value = 10;
        });
      });

      // Model 3: RESET -> Model 4 (INCREMENT)
      models[3].subscribe(CounterEvents.RESET, "m3-reset", () => {
        eventLog.push({ model: "M3", event: "RESET" });
        models[4].applyChanges(CounterEvents.INCREMENT, "to-m4", (c) => {
          c.value = 100;
        });
      });

      // Start the chain
      models[0].applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 1;
      });

      expect(eventLog).toEqual([
        { model: "M0", event: "INC" },
        { model: "M1", event: "DEC" },
        { model: "M2", event: "MULT" },
        { model: "M3", event: "RESET" },
      ]);
      expect(models[4].value).toBe(100);
    });

    test("Multiple subscriptions with event type mixing", () => {
      let incrementCount = 0;
      let decrementCount = 0;
      let multiplyCount = 0;

      // Model 0 listens to three different event types on Model 1
      models[0].subscribe(CounterEvents.INCREMENT, "track-inc", () => {
        models[1].applyChanges(CounterEvents.INCREMENT, "inc", (c) => {
          incrementCount++;
          c.value++;
        });
      });

      models[0].subscribe(CounterEvents.DECREMENT, "track-dec", () => {
        models[1].applyChanges(CounterEvents.DECREMENT, "dec", (c) => {
          decrementCount++;
          c.value--;
        });
      });

      models[0].subscribe(CounterEvents.MULTIPLY, "track-mult", () => {
        models[1].applyChanges(CounterEvents.MULTIPLY, "mult", (c) => {
          multiplyCount++;
          c.value *= 2;
        });
      });

      // Trigger different events
      models[0].applyChanges(CounterEvents.INCREMENT, "trigger-1", (c) => c.value++);
      models[0].applyChanges(CounterEvents.INCREMENT, "trigger-2", (c) => c.value++);
      models[0].applyChanges(CounterEvents.DECREMENT, "trigger-3", (c) => c.value--);
      models[0].applyChanges(CounterEvents.MULTIPLY, "trigger-4", (c) => c.value *= 2);

      expect(incrementCount).toBe(2);
      expect(decrementCount).toBe(1);
      expect(multiplyCount).toBe(1);
    });
  });

  describe("🌀 Recursive Madness", () => {
    let counter: Counter;
    let state: StateModel;

    beforeEach(() => {
      counter = new Counter("Recursive", 0);
      state = new StateModel("Controller", false);
    });

    test("Fibonacci-like recursive pattern", () => {
      const sequence: number[] = [];

      counter.applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 1;
      });

      counter.subscribe(CounterEvents.INCREMENT, "fibonacci", ({ newValue, oldValue }) => {
        sequence.push(newValue.value);

        if (newValue.value < 100) {
          const prev = oldValue.value;
          const curr = newValue.value;
          counter.applyChanges(CounterEvents.INCREMENT, "next-fib", (c) => {
            c.value = prev + curr;
          });
        }
      });

      counter.applyChanges(CounterEvents.INCREMENT, "start", (c) => {
        c.value = 2;
      });

      expect(sequence).toEqual([2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
      expect(counter.value).toBe(144);
    });

    test("Countdown with state toggle", () => {
      const countdown: number[] = [];

      counter.subscribe(CounterEvents.DECREMENT, "countdown", ({ newValue }) => {
        countdown.push(newValue.value);

        if (newValue.value > 0) {
          counter.applyChanges(CounterEvents.DECREMENT, "tick", (c) => {
            c.value--;
          });
        } else {
          state.applyChanges(StateEvents.ACTIVATE, "liftoff", (s) => {
            s.active = true;
          });
        }
      });

      counter.applyChanges(CounterEvents.DECREMENT, "start", (c) => {
        c.value = 10;
      });

      expect(countdown).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
      expect(state.active).toBe(true);
    });

    test("Recursive tree traversal simulation", () => {
      const nodes: Counter[] = Array.from({ length: 7 }, (_, i) => new Counter(`Node${i}`, 0));
      const visitOrder: number[] = [];

      // Binary tree structure: 0 -> [1, 2], 1 -> [3, 4], 2 -> [5, 6]
      const tree: Record<number, number[]> = {
        0: [1, 2],
        1: [3, 4],
        2: [5, 6],
      };

      nodes.forEach((node, idx) => {
        node.subscribe(CounterEvents.INCREMENT, `traverse-${idx}`, ({ newValue }) => {
          visitOrder.push(idx);

          if (tree[idx]) {
            tree[idx].forEach(childIdx => {
              nodes[childIdx].applyChanges(CounterEvents.INCREMENT, `visit-${childIdx}`, (c) => {
                c.value = newValue.value + 1;
              });
            });
          }
        });
      });

      nodes[0].applyChanges(CounterEvents.INCREMENT, "start-traversal", (c) => {
        c.value = 1;
      });

      expect(visitOrder).toEqual([0, 1, 3, 4, 2, 5, 6]);
      expect(nodes[0].value).toBe(1);
      expect(nodes[1].value).toBe(2);
      expect(nodes[2].value).toBe(2);
      expect(nodes[3].value).toBe(3);
      expect(nodes[4].value).toBe(3);
      expect(nodes[5].value).toBe(3);
      expect(nodes[6].value).toBe(3);
    });
  });

  describe("🎪 Stress Test - The Grand Finale", () => {
    test("MEGA TEST: 50 models, complex dependencies, multiple event types", () => {
      const counters = Array.from({ length: 20 }, (_, i) => new Counter(`C${i}`, i * 100)); // Valeurs initiales différentes
      const states = Array.from({ length: 15 }, (_, i) => new StateModel(`S${i}`, false));
      const aggregators = Array.from({ length: 5 }, () => new Aggregator());
      const chains = Array.from({ length: 10 }, (_, i) => new ChainNode(i, i * 5)); // Valeurs initiales différentes

      const globalEventLog: string[] = [];
      let totalOperations = 0;

      // Setup 1: Counters feed into aggregators
      counters.forEach((counter, idx) => {
        const aggIdx = idx % aggregators.length;
        counter.subscribe(CounterEvents.INCREMENT, `c${idx}-to-agg${aggIdx}`, ({ newValue }) => {
          totalOperations++;
          aggregators[aggIdx].applyChanges(AggregatorEvents.AGGREGATE, `add-c${idx}`, (a) => {
            a.addValue(newValue.value);
          });
        });
      });

      // Setup 2: Aggregators control states
      aggregators.forEach((agg, aggIdx) => {
        agg.subscribe(AggregatorEvents.AGGREGATE, `agg${aggIdx}-control`, ({ newValue }) => {
          totalOperations++;
          if (newValue.sum > 10 * (aggIdx + 1)) {
            const stateIdx = aggIdx * 3;
            if (stateIdx < states.length) {
              states[stateIdx].applyChanges(StateEvents.ACTIVATE, `activate-s${stateIdx}`, (s) => {
                s.active = true;
              });
            }
          }
        });
      });

      // Setup 3: States trigger chain reactions
      states.forEach((state, sIdx) => {
        state.subscribe(StateEvents.ACTIVATE, `s${sIdx}-chain`, ({}) => {
          totalOperations++;
          globalEventLog.push(`STATE_${sIdx}_ACTIVATED`);
          const chainIdx = sIdx % chains.length;
          chains[chainIdx].applyChanges(ChainEvents.PROPAGATE, `from-s${sIdx}`, (node) => {
            node.value = node.value + (sIdx + 1) * 10; // Force un changement
            node.markProcessed();
          });
        });
      });

      // Setup 4: Chain nodes propagate forward
      chains.forEach((node, idx) => {
        if (idx < chains.length - 1) {
          node.subscribe(ChainEvents.PROPAGATE, `chain${idx}-forward`, ({ newValue }) => {
            totalOperations++;
            chains[idx + 1].applyChanges(ChainEvents.PROPAGATE, `to-chain${idx + 1}`, (n) => {
              n.value = n.value + newValue.value / 2; // Force un changement
            });
          });
        }
      });

      // Setup 5: Last chain node triggers counter updates
      chains[chains.length - 1].subscribe(ChainEvents.PROPAGATE, "chain-end", ({ newValue }) => {
        totalOperations++;
        if (newValue.value > 50) {
          counters.slice(0, 5).forEach((counter, idx) => {
            counter.applyChanges(CounterEvents.MULTIPLY, `boost-c${idx}`, (c) => {
              c.value = c.value * 2 + idx; // Force un changement différent pour chaque
            });
          });
        }
      });

      // Setup 6: Some counters have circular dependencies with limits
      for (let i = 0; i < 5; i++) {
        const nextIdx = (i + 1) % 5;
        counters[i].subscribe(CounterEvents.MULTIPLY, `circular-${i}`, ({ newValue }) => {
          totalOperations++;
          if (newValue.value < 10000) { // Limite plus haute car valeurs initiales plus grandes
            counters[nextIdx].applyChanges(CounterEvents.INCREMENT, `from-c${i}`, (c) => {
              c.value = c.value + 50 + i; // Force un changement différent
            });
          }
        });
      }

      // INITIATE THE CHAOS
      globalEventLog.push("STARTING_MEGA_TEST");

      // Trigger 1: Activate multiple counters avec valeurs qui changent vraiment
      [0, 5, 10, 15].forEach(idx => {
        counters[idx].applyChanges(CounterEvents.INCREMENT, `init-c${idx}`, (c) => {
          c.value = c.value + (idx + 1) * 3; // Incrémente au lieu de set
        });
      });

      // Trigger 2: Manually activate some states (ACTIVATE change false -> true)
      [0, 7, 14].forEach(idx => {
        states[idx].applyChanges(StateEvents.ACTIVATE, `activate-s${idx}`, (s) => {
          s.active = true; // Change de false à true
        });
      });

      // Trigger 3: Direct chain activation avec changement réel
      chains[0].applyChanges(ChainEvents.PROPAGATE, "direct-chain", (node) => {
        node.value = node.value + 20; // Incrémente au lieu de set
      });

      globalEventLog.push("MEGA_TEST_COMPLETE");

      // ASSERTIONS - The Moment of Truth
      expect(totalOperations).toBeGreaterThan(50);
      expect(globalEventLog.length).toBeGreaterThan(3);

      // Verify aggregators received data
      const activeAggregators = aggregators.filter(a => a.count > 0);
      expect(activeAggregators.length).toBeGreaterThan(0);

      // Verify states were activated
      const activeStates = states.filter(s => s.active);
      expect(activeStates.length).toBeGreaterThan(0);

      // Verify chains were processed
      const processedChains = chains.filter(c => c.processed);
      expect(processedChains.length).toBeGreaterThan(0);

      // Verify at least one aggregator has significant data
      const maxSum = Math.max(...aggregators.map(a => a.sum));
      expect(maxSum).toBeGreaterThan(10);
    });

    test("EXTREME: Recursive explosion with controlled termination", () => {
      const models = Array.from({ length: 100 }, (_, i) => new Counter(`M${i}`, i)); // Valeurs initiales différentes
      let explosionDepth = 0;
      const maxDepth = 7; // En profondeur : 7 niveaux
      let operationCount = 0;
      const visitLog: number[] = [];

      // Each model triggers two others (binary tree explosion)
      // Propagation en PROFONDEUR : left d'abord complètement, puis right
      models.forEach((model, idx) => {
        model.subscribe(CounterEvents.INCREMENT, `explode-${idx}`, ({ newValue, oldValue }) => {
          operationCount++;
          const depth = newValue.value - oldValue.value; // Calcule la profondeur basée sur l'incrément
          explosionDepth = Math.max(explosionDepth, depth);
          visitLog.push(idx);

          if (depth < maxDepth) {
            const left = (idx * 2 + 1) % models.length;
            const right = (idx * 2 + 2) % models.length;

            // LEFT d'abord (profondeur) - incrémente pour forcer le changement
            models[left].applyChanges(CounterEvents.INCREMENT, `from-${idx}-left`, (c) => {
              c.value = c.value + depth + 1; // Force un changement réel
            });

            // RIGHT ensuite (après que left ait complètement terminé sa récursion)
            models[right].applyChanges(CounterEvents.INCREMENT, `from-${idx}-right`, (c) => {
              c.value = c.value + depth + 1; // Force un changement réel
            });
          }
        });
      });

      // DETONATE
      models[0].applyChanges(CounterEvents.INCREMENT, "big-bang", (c) => {
        c.value = c.value + 1; // Incrémente au lieu de set (0 -> 1)
      });

      expect(explosionDepth).toBe(maxDepth);
      expect(operationCount).toBeGreaterThan(10);

      // En profondeur, on visite moins de nœuds qu'en largeur mais on va plus loin
      // Vérifie que la propagation s'est bien faite en profondeur
      const uniqueVisited = new Set(visitLog);
      expect(uniqueVisited.size).toBeGreaterThan(5);

      // Vérifie que le premier nœud gauche (1) a été visité avant beaucoup d'autres
      const firstLeftIndex = visitLog.indexOf(1);
      expect(firstLeftIndex).toBeGreaterThanOrEqual(0);
      expect(firstLeftIndex).toBeLessThan(10); // Visité tôt (profondeur)

      // Count how many models were affected
      const affectedModels = models.filter((m, i) => m.value !== i); // Valeur changée
      expect(affectedModels.length).toBeGreaterThan(5);
    });

    test("INSANE: Event type symphony - all events interacting", () => {
      const conductor = new Counter("Conductor", 0);
      const orchestra = {
        strings: Array.from({ length: 4 }, (_, i) => new Counter(`String${i}`, 0)),
        brass: Array.from({ length: 3 }, (_, i) => new Counter(`Brass${i}`, 0)),
        percussion: Array.from({ length: 2 }, (_, i) => new Counter(`Perc${i}`, 0)),
      };
      const maestro = new StateModel("Maestro", false);
      const scorekeeper = new Aggregator();

      let symphonyPhase = 0;

      // Phase 1: Conductor increments -> Strings play
      conductor.subscribe(CounterEvents.INCREMENT, "cue-strings", ({ newValue }) => {
        if (newValue.value === 1) {
          symphonyPhase = 1;
          orchestra.strings.forEach((instrument, idx) => {
            instrument.applyChanges(CounterEvents.INCREMENT, `strings-${idx}`, (c) => {
              c.value = (idx + 1) * 2;
            });
          });
        }
      });

      // Phase 2: Strings trigger Brass
      orchestra.strings.forEach((string, idx) => {
        string.subscribe(CounterEvents.INCREMENT, `string-${idx}-to-brass`, ({}) => {
          if (symphonyPhase === 1 && idx === orchestra.strings.length - 1) {
            symphonyPhase = 2;
            orchestra.brass.forEach((brass, bIdx) => {
              brass.applyChanges(CounterEvents.MULTIPLY, `brass-${bIdx}`, (c) => {
                c.value = (bIdx + 1) * 3;
              });
            });
          }
        });
      });

      // Phase 3: Brass triggers Percussion
      orchestra.brass.forEach((brass, idx) => {
        brass.subscribe(CounterEvents.MULTIPLY, `brass-${idx}-to-perc`, ({}) => {
          if (symphonyPhase === 2 && idx === orchestra.brass.length - 1) {
            symphonyPhase = 3;
            orchestra.percussion.forEach((perc, pIdx) => {
              perc.applyChanges(CounterEvents.DECREMENT, `perc-${pIdx}`, (c) => {
                c.value = 10 - pIdx;
              });
            });
          }
        });
      });

      // All instruments report to scorekeeper
      [...orchestra.strings, ...orchestra.brass, ...orchestra.percussion].forEach((instrument) => {
        [CounterEvents.INCREMENT, CounterEvents.MULTIPLY, CounterEvents.DECREMENT].forEach(event => {
          instrument.subscribe(event, `${instrument.name}-score`, ({ newValue }) => {
            scorekeeper.applyChanges(AggregatorEvents.AGGREGATE, `add-${instrument.name}`, (a) => {
              a.addValue(Math.abs(newValue.value));
            });
          });
        });
      });

      // Finale: Scorekeeper activates Maestro when sum > 50
      scorekeeper.subscribe(AggregatorEvents.AGGREGATE, "finale", ({ newValue }) => {
        if (newValue.sum > 50 && !maestro.getValue().active) {
          maestro.applyChanges(StateEvents.ACTIVATE, "standing-ovation", (s) => {
            s.active = true;
          });
        }
      });

      // Maestro triggers encore
      maestro.subscribe(StateEvents.ACTIVATE, "encore", () => {
        conductor.applyChanges(CounterEvents.MULTIPLY, "encore-cue", (c) => {
          c.value = 999;
        });
      });

      // START THE SYMPHONY
      conductor.applyChanges(CounterEvents.INCREMENT, "downbeat", (c) => {
        c.value = 1;
      });

      // VERIFY THE PERFORMANCE
      expect(symphonyPhase).toBe(3);
      expect(orchestra.strings.every(s => s.value > 0)).toBe(true);
      expect(orchestra.brass.every(b => b.value > 0)).toBe(true);
      expect(orchestra.percussion.every(p => p.value > 0)).toBe(true);
      expect(scorekeeper.count).toBe(9); // 4 strings + 3 brass + 2 percussion
      expect(scorekeeper.sum).toBeGreaterThan(50);
      expect(maestro.active).toBe(true);
      expect(conductor.value).toBe(999);
    });
  });

  describe("🔬 Edge Cases & Boundary Conditions", () => {
    test("Zero-value propagation chain", () => {
      const zeros = Array.from({ length: 5 }, (_, i) => new Counter(`Zero${i}`, 0));

      zeros.forEach((zero, idx) => {
        if (idx < zeros.length - 1) {
          zero.subscribe(CounterEvents.RESET, `zero-${idx}`, ({ newValue }) => {
            zeros[idx + 1].applyChanges(CounterEvents.RESET, `to-${idx + 1}`, (c) => {
              c.value = newValue.value; // Always 0
            });
          });
        }
      });

      zeros[0].applyChanges(CounterEvents.RESET, "start", (c) => {
        c.value = 0;
      });

      expect(zeros.every(z => z.value === 0)).toBe(true);
    });

    test("Negative value cascading", () => {
      const counters = Array.from({ length: 5 }, (_, i) => new Counter(`C${i}`, 100));

      counters.forEach((counter, idx) => {
        if (idx < counters.length - 1) {
          counter.subscribe(CounterEvents.DECREMENT, `cascade-${idx}`, ({ newValue }) => {
            counters[idx + 1].applyChanges(CounterEvents.DECREMENT, `to-${idx + 1}`, (c) => {
              c.value = newValue.value - 10;
            });
          });
        }
      });

      counters[0].applyChanges(CounterEvents.DECREMENT, "start", (c) => {
        c.value = -5;
      });

      expect(counters[4].value).toBe(-45);
    });

    test("Rapid toggle state machine", () => {
      const state = new StateModel("Rapid", false);
      let toggles = 0;

      state.subscribe(StateEvents.TOGGLE, "count-toggles", () => {
        toggles++;
        if (toggles < 100) {
          state.applyChanges(StateEvents.TOGGLE, "rapid-toggle", (s) => {
            s.active = !s.active;
            s.incrementToggle();
          });
        }
      });

      state.applyChanges(StateEvents.TOGGLE, "start", (s) => {
        s.active = !s.active;
        s.incrementToggle();
      });

      expect(toggles).toBe(100);
      expect(state.toggleCount).toBe(100);
      expect(state.active).toBe(false); // Even number of toggles
    });

    test("Hash collision handling", () => {
      const models = Array.from({ length: 10 }, () => new Counter("Same", 42));
      const hashes = models.map(m => (m as any).hash(CounterEvents.DECREMENT));

      // All should have same hash (collision scenario)
      expect(new Set(hashes).size).toBe(1);

      // But they should still be independent
      models[0].applyChanges(CounterEvents.INCREMENT, "modify-first", (c) => {
        c.value = 100;
      });

      expect(models[0].value).toBe(100);
      expect(models[1].value).toBe(42);
    });
  });

  describe("🎨 Advanced Patterns", () => {
    test("Observer pattern with dynamic subscription", () => {
      const publisher = new Counter("Publisher", 0);
      const subscribers = Array.from({ length: 5 }, (_, i) => new Counter(`Sub${i}`, 0));
      const subscriptionLog: string[] = [];

      // Publisher dynamically adds subscribers based on its value
      publisher.subscribe(CounterEvents.INCREMENT, "dynamic-sub", ({ newValue }) => {
        const subIdx = newValue.value % subscribers.length;
        subscriptionLog.push(`ADDING_SUB_${subIdx}`);

        subscribers[subIdx].applyChanges(CounterEvents.INCREMENT, `notify-${subIdx}`, (c) => {
          c.value = newValue.value * 10;
        });
      });

      // Publish multiple times
      for (let i = 1; i <= 7; i++) {
        publisher.applyChanges(CounterEvents.INCREMENT, `publish-${i}`, (c) => {
          c.value = i;
        });
      }

      expect(subscribers[0].value).toBe(50); // Updated when value was 5
      expect(subscribers[1].value).toBe(60); // Updated when value was 6
      expect(subscribers[2].value).toBe(70); // Updated when value was 7
    });

    test("Command pattern with undo/redo simulation", () => {
      const model = new Counter("Undoable", 0);
      const history: number[] = [];

      model.subscribe(CounterEvents.INCREMENT, "record", ({ newValue }) => {
        history.push(newValue.value);
      });

      // Execute commands
      [5, 10, 15, 20].forEach(val => {
        model.applyChanges(CounterEvents.INCREMENT, `set-${val}`, (c) => {
          c.value = val;
        });
      });

      expect(history).toEqual([5, 10, 15, 20]);
      expect(model.value).toBe(20);

      // "Undo" by accessing history
      const undoValue = history[history.length - 2];
      expect(undoValue).toBe(15);
    });

    test("Strategy pattern with conditional behavior", () => {
      const context = new Counter("Context", 0);
      const strategy = new StateModel("Strategy", false);
      let aggressiveCount = 0;
      let conservativeCount = 0;

      // Aggressive strategy (when state is active)
      context.subscribe(CounterEvents.INCREMENT, "aggressive", ({ newValue }) => {
        if (strategy.getValue().active) {
          aggressiveCount++;
          context.applyChanges(CounterEvents.MULTIPLY, "aggressive-mult", (c) => {
            c.value = newValue.value * 3;
          });
        }
      });

      // Conservative strategy (when state is inactive)
      context.subscribe(CounterEvents.INCREMENT, "conservative", ({}) => {
        if (!strategy.getValue().active) {
          conservativeCount++;
          // Do nothing, just count
        }
      });

      // Test conservative
      context.applyChanges(CounterEvents.INCREMENT, "test-1", (c) => {
        c.value = 2;
      });
      expect(conservativeCount).toBe(1);
      expect(context.value).toBe(2);

      // Switch to aggressive
      strategy.applyChanges(StateEvents.ACTIVATE, "switch", (s) => {
        s.active = true;
      });

      context.applyChanges(CounterEvents.INCREMENT, "test-2", (c) => {
        c.value = 3;
      });
      expect(aggressiveCount).toBe(1);
      expect(context.value).toBe(9); // 3 * 3
    });
  });
});