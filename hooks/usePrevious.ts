import { useEffect, useRef } from "react";

export function usePrevious(value: any): (any | undefined) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
