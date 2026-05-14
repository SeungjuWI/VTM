"use client";

import { useState, useEffect } from "react";

export function AnimatedOVR({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count}</>;
}
