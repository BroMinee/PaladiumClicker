const Completionist = () =>
  <span className="">00:00:00</span>;

function print2digits(time: number) {
  if (time < 10) {
    return "0" + time;
  }
  return time;
}

type renderType = {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  completed: boolean
}

/**
 * Custom renderer function for a countdown component.
 * Converts days, hours, minutes, and seconds into a string formatted as HH:MM:SS.
 * - If the countdown is completed, it renders the Completionist component.
 * - Otherwise, it displays the remaining time in HH:MM:SS format,
 *   adding days into hours (days * 24 + hours).
 *
 * @param days Number of days remaining
 * @param hour Number of hours remaining
 * @param minutes Number of minutes remaining
 * @param seconds Number of seconds remaining
 * @param completed Boolean flag indicating if the countdown is finished
 */
export const renderer = ({ days, hours, minutes, seconds, completed }: renderType) => {
  if (completed) {
    // Render a completed state
    return <Completionist/>;
  } else {
    // Render a countdown
    return <span
      className="">{print2digits(hours + days * 24)}:{print2digits(minutes)}:{print2digits(seconds)}</span>;
  }
};
