"use client"

import * as React from "react"
import { TICKER_ITEMS } from "./constants"

export function Ticker() {
  const duplicated = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="relative w-full overflow-hidden border-y border-border/30 bg-background/60 py-3.5 backdrop-blur-sm">
      <div className="flex animate-ticker whitespace-nowrap text-primary dark:text-primary/90 font-bold">
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-primary dark:bg-primary/70" />
            {item}
          </span>
        ))}
      </div>
      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
