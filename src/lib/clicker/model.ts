import { Hashable } from "./hashable";

type subscriptionCallbackInterface<T extends Hashable> = (props: { oldValue: Readonly<Omit<T, "getValue" | "applyChanges" | "subscribe" | "copy" | "hash">>, newValue: Readonly<Omit<T, "getValue" | "applyChanges" | "subscribe" | "copy" | "hash">> }) => void;

/**
 * Generic reactive base class implementing the observer pattern.
 *
 * Subclasses declare a `dict` that maps each change key `T2` to a hash function.
 * When `applyChanges` is called, the hash is computed before and after the mutation;
 * subscribers are notified only if the hash actually changed.
 *
 * @typeParam T  - The concrete model type (the class that extends Model).
 * @typeParam T2 - A string enum of change keys used to identify which aspect changed.
 */
export abstract class Model<T extends Hashable, T2 extends string> {
  private subscriptions: Map<T2, Array<{ name: string, callback: subscriptionCallbackInterface<T> }>>;
  abstract readonly dict: { [key in T2]: () => string | boolean | number };

  /**
   * Initialises the internal subscription map.
   */
  constructor() {
    this.subscriptions = new Map();
  }

  abstract getValue(): T;

  private hash(target: T2) {
    return this.dict[target]();
  }

  /**
   * Registers a callback to be invoked whenever the value associated with `cause` changes.
   *
   * @param cause    - The change key to listen to.
   * @param name     - A human-readable label used for debugging.
   * @param callback - Function called with `{ oldValue, newValue }` snapshots when a change is detected.
   */
  public subscribe(cause: T2, name: string, callback: subscriptionCallbackInterface<T>): void {
    const subArray = this.subscriptions.get(cause);
    if (subArray) {
      subArray.push({ name: name, callback: callback });
    } else {
      this.subscriptions.set(cause, [{ name: name, callback: callback }]);
    }
  }

  /**
   * Applies a mutation to the model and notifies subscribers if the hash for `target` changed.
   *
   * The mutation is applied synchronously via `callback`. Subscribers registered under `target`
   * receive snapshots of the model taken immediately before and after the mutation.
   *
   * @param target   - The change key that represents the aspect being mutated.
   * @param name     - A human-readable label used for debugging.
   * @param callback - Function that mutates the model in place.
   */
  // @logExecution
  public applyChanges(target: T2, _name: string, callback: (model: T) => void): void {
    const hashBefore = this.hash(target);
    const modelBefore = this.getValue().copy();
    callback(this.getValue());
    const hashAfter = this.hash(target);
    const modelAfter = this.getValue().copy();
    this.subscriptions.get(target)?.forEach(sub => {
      if (hashBefore !== hashAfter) {
        sub.callback({ oldValue: modelBefore as T, newValue: modelAfter as T });
      }
    });
  }
}
