"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LiveFeed } from "./LiveFeed"
import { CATEGORIES } from "./constants"

export function LiveActivity() {
  return (
    <section className="border-y border-border/30 bg-muted/10 py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Live Feed */}
          <div>
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
                  Live Exchange Feed
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                VALUE FLOWING
                <br />
                RIGHT NOW.
              </h2>
            </div>
            <LiveFeed />
            <Link href="/explore" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              View all activity <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary dark:text-primary/80">
                  The Marketplace
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                EVERY SKILL
                <br />
                CATEGORY.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/explore">
                    <div className="group flex items-center gap-4 rounded-xl border border-border/40 bg-background px-5 py-4 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted/40 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                        <cat.icon className="h-4.5 w-4.5 text-muted-foreground transition-colors group-hover:text-primary dark:group-hover:text-primary/80" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{cat.name}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground/60">{cat.tag}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link href="/explore" className="block w-full">
              <Button
                variant="outline"
                className="mt-5 w-full rounded-xl border-border/50 font-bold hover:border-foreground/30 gap-2"
              >
                View Full Marketplace <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
