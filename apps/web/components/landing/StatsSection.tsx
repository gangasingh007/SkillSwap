"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { STATS } from "./constants"

export function StatsSection() {
  return (
    <section className="py-20 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-px bg-border/20 md:grid-cols-4 overflow-hidden rounded-2xl border border-border/30">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              className="group flex flex-col items-start gap-3 bg-background px-8 py-10 transition-colors hover:bg-muted/30"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              viewport={{ once: true }}
            >
              <p className="highlight-number text-4xl font-black tracking-tighter text-foreground">
                {value}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
