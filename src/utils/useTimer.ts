/**
 *
 *
 * @author Bradley Baysinger
 * @since The beginning of time.
 * @version N/A
 */

import { useEffect, useCallback } from "react";

const useTimer = (duration: number, onExpire: () => void) => {
  const reset = useCallback(() => {
    const timer = setTimeout(onExpire, duration);
    return () => clearTimeout(timer);
  }, [duration, onExpire]);

  useEffect(() => {
    reset();
  }, [reset]);

  return { reset };
};

export default useTimer;
