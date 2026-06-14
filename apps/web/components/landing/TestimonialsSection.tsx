"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TESTIMONIALS } from "./constants"

export function TestimonialsSection() {
  return (
    <section className="border-t border-border/30 bg-muted/10 py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex items-center gap-3">
          <div className="h-px w-8 bg-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            On the Record
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map(({ quote, author, role, rating }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full rounded-2xl border-border/40 bg-background transition-all hover:border-amber-500/20">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="mb-6 flex gap-0.5">
                    {Array.from({ length: rating || 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="flex-1 text-base font-medium leading-relaxed text-foreground/80">
                    "{quote}"
                  </p>
                  <div className="mt-8 border-t border-border/30 pt-6">
                    <p className="text-sm font-bold text-foreground">{author}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
