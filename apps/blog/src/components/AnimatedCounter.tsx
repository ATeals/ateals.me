import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      const value = Math.floor(percentage * end);

      if (countRef.current !== value) {
        countRef.current = value;
        setCount(value);
      }

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration]);

  return <div className="text-primary text-4xl font-bold">{count.toLocaleString()}</div>;
};
