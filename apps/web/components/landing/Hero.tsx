"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Globe, Sparkles, ShieldCheck, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-26 pb-0 md:pt-22">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-primary" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary dark:text-primary">
            Professional Skill Exchange
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="max-w-5xl text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.88] tracking-tighter"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          YOUR SKILLS
          <br />
          ARE{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary dark:text-primary">CURRENCY.</span>
            <span className="absolute inset-x-0 bottom-2 -z-10 h-[0.12em] bg-amber-500/20" />
          </span>
        </motion.h1>

        {/* Sub + CTA row */}
        <div className="mt-10 flex flex-col gap-12 md:flex-row md:items-end">
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              The dual-currency marketplace where expertise is both product and payment. Hire in
              USD or earn{" "}
              <span className="font-mono font-bold text-foreground">Skill Credits</span>{" "}
              by delivering your own work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-13 gap-2 rounded-xl bg-foreground px-8 font-bold text-background hover:bg-foreground/90 group"
                >
                  Start Swapping
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 gap-2 rounded-xl border-border/60 px-8 font-bold hover:border-foreground/30"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating stat column */}
          <motion.div
            className="ml-auto hidden flex-col items-end gap-2 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live Activity
            </div>
            <p className="highlight-number text-5xl font-black tracking-tighter text-primary dark:text-primary">
              12,400
              <span className="text-foreground">+</span>
            </p>
            <p className="text-sm font-semibold text-muted-foreground">experts active today</p>
          </motion.div>
        </div>
      </div>

      {/* Trust row */}
      <motion.div
        className="mt-20 border-t border-border/30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="container mx-auto flex flex-wrap items-center gap-8 py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            Trusted infrastructure
          </p>
          {[
            { icon: ShieldCheck, label: "Stripe-Secured Escrow" },
            { icon: Globe, label: "140+ Countries" },
            { icon: Sparkles, label: "AI-Matched Swaps" },
            { icon: BarChart3, label: "Real-Time Clearing" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/40">
              <Icon className="h-3.5 w-3.5 text-primary dark:text-primary" />
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
