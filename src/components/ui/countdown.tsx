const Completionist = () =>
  <span className="text-secondary-foreground">00:00:00</span>;

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

// Renderer callback with condition
export const renderer = ({ days, hours, minutes, seconds, completed }: renderType) => {
  if (completed) {
    // Render a completed state
    return <Completionist/>;
  } else {
    // Render a countdown
    return <span
      className="text-secondary-foreground">{print2digits(hours + days * 24)}:{print2digits(minutes)}:{print2digits(seconds)}</span>;
  }
};
