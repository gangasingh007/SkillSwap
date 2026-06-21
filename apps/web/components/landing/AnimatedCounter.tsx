import { useReducedMotion } from "framer-motion";
import React from "react";

export default function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0)
  const prefersReduced = useReducedMotion()

  React.useEffect(() => {
    if (prefersReduced) {
      setCount(target)
      return
    }
    let frame: number
    const duration = 2000
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, prefersReduced])

  return (
    <span className="highlight-number">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}