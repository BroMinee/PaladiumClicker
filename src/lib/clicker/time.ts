import { Hashable } from "./hashable";
import { Model } from "./model";

export interface TimeProps {
  startingSeason: Date;
}

export enum TimeModelChanges {
  DAYCHANGE = "TIME_DAYCHANGE",
  CURRENT_DATECHANGE = "TIME_CURRENT_DATECHANGE",
}

/**
 * Represents the time in the clicker game
 */
export class Time extends Model<Time, TimeModelChanges> implements Hashable {
  private _currentDate: Date;
  private _daySinceBeggining: number;
  private readonly _startingDate: Date;

  dict: { [key in TimeModelChanges]: () => number } = {
    [TimeModelChanges.CURRENT_DATECHANGE]: () => this.currentDate.getTime(),
    [TimeModelChanges.DAYCHANGE]: () => this.daySinceBeggining,
  };

  /**
   * Creates a new time model
   * @param props The properties of the time model
   */
  constructor(readonly props: TimeProps) {
    super();
    this._startingDate = props.startingSeason;
    this._currentDate = props.startingSeason;
    this._daySinceBeggining = 0;
    this.setupSubscription();
  }

  /**
   * Returns the time model
   * @returns The time model
   */
  getValue(): Time {
    return this;
  }

  /**
   * Creates a copy of the time model
   * @returns A copy of the time model
   */
  copy(): Time {
    return {
      ...this,
      currentDate: this.currentDate,
      daySinceBeggining: this.daySinceBeggining,
    };
  }

  /**
   * The number of days since the beginning of the season
   */
  get daySinceBeggining(): number {
    return this._daySinceBeggining;
  }

  /**
   * The current date
   */
  get currentDate(): Date {
    return this._currentDate;
  }

  /**
   * The starting date of the season
   */
  get startingDate(): Date {
    return this._startingDate;
  }

  /**
   * Sets the current date
   * @param newDate The new current date
   */
  set currentDate(newDate: Date | number) {
    if (typeof newDate === "number") {
      this.currentDate = new Date(newDate);
    } else if (isNaN(newDate.getTime())) {
      throw new Error("[Time] Cannot set current Date to an invalid date");
    } else {
      this._currentDate = newDate;
    }
  }

  /**
   * Sets the number of days since the beginning of the season
   * @param newDay The new number of days
   */
  set daySinceBeggining(newDay: number) {
    this._daySinceBeggining = newDay;
  }

  private setupSubscription() {
    this.subscribe(TimeModelChanges.CURRENT_DATECHANGE, "[Time] currentTimeChange", ({ oldValue, newValue }) => {
      const newDaySinceStart = this.computeDaySinceStart(newValue.currentDate);
      if (oldValue.daySinceBeggining !== newDaySinceStart) {
        this.applyChanges(TimeModelChanges.DAYCHANGE, "[Time] Day Changes", (e) => {
          e.daySinceBeggining = newDaySinceStart;
        });
      }
    });
  }

  private computeDaySinceStart(currentDate: Date): number {
    return Math.trunc((currentDate.getTime() - this.startingDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}
