import { useEffect, useState } from "preact/hooks";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";

export const useCountdown = (date: Date) => {
  const [countdown, setCountdown] =
    useState<ReturnType<typeof intervalToDuration>>();

  useEffect(() => {
    const refresh = () => {
      const end = differenceInMilliseconds(new Date(), date);
      setCountdown(intervalToDuration({ start: 0, end }));
    };
    refresh();

    const interval = setInterval(refresh, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [date]);

  return countdown;
};
