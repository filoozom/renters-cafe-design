import { useEffect, useState } from "preact/hooks";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";

const calculateDuration = (date: Date) => {
  const end = differenceInMilliseconds(date, new Date());
  return intervalToDuration({ start: 0, end: Math.max(0, end) });
};

export const useCountdown = (date: Date) => {
  const [countdown, setCountdown] = useState<
    ReturnType<typeof intervalToDuration>
  >(() => calculateDuration(date));

  useEffect(() => {
    const refresh = () => setCountdown(calculateDuration(date));
    refresh();

    const interval = setInterval(refresh, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [date]);

  return countdown;
};
