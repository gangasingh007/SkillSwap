import { motion, useReducedMotion } from "framer-motion"

export default function OrbitingTags({ tags }: { tags: string[] }) {
  const prefersReduced = useReducedMotion()
  const radius = 44 

  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        animate={prefersReduced ? {} : { rotate: 360 }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {tags.map((label, i) => {
          const angle = (i / tags.length) * Math.PI * 2
          // Position relative to center of the section (50%, 45%)
          const x = 50 + Math.cos(angle) * radius
          const y = 45 + Math.sin(angle) * (radius * 0.7)

          return (
            <motion.div
              key={label}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.0 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Counter-rotate so the text stays upright */}
              <motion.div
                animate={prefersReduced ? {} : { rotate: -360 }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="pointer-events-auto cursor-default rounded-xl border border-border/60 bg-card/80 px-3.5 py-2 shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <span className="text-xs font-semibold text-foreground/80 whitespace-nowrap">
                    {label}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}