"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LIVE_SWAPS } from "./constants"

export function LiveFeed() {
  return (
    <div className="space-y-2.5">
      {LIVE_SWAPS.map((swap, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          viewport={{ once: true }}
          className="flex items-center justify-between gap-4 rounded-2xl border border-border/30 bg-muted/20 px-5 py-3.5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-black text-amber-600 dark:text-amber-400">
              {swap.from.charAt(0)}
            </div>
            <p className="truncate text-sm font-medium text-muted-foreground">
              <span className="font-bold text-foreground">{swap.from}</span>{" "}
              {swap.skill}{" "}
              <span className="text-muted-foreground/60">→</span>{" "}
              <span className="font-bold text-foreground">{swap.for}</span>
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              +{swap.credits} CR
            </span>
            <span className="text-[10px] text-muted-foreground/50">{swap.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
