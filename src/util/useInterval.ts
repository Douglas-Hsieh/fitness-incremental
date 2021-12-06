import React from "react";

export default function useInterval(callback: any, delay: number) {
  const intervalRef = React.useRef<any>();
  const callbackRef = React.useRef<any>(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset.

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  React.useEffect(() => {
    intervalRef.current = setInterval(() => callbackRef.current(), delay);

    // Clear interval if the components is unmounted or the delay changes:
    return () => clearInterval(intervalRef.current);
  }, [delay]);
  
  // Returns a ref to the interval ID in case you want to clear it manually:
  return intervalRef;
}
