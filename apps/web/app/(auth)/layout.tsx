"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

/* ─────────────────────── Animation Variants ─────────────────────── */

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/* ═══════════════════════ AUTH LAYOUT ════════════════════════════════ */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh w-full">
      {/* ── Left Panel — Branding (hidden on mobile) ── */}
      <div className="relative hidden w-1/2 overflow-hidden border-r border-border/30 bg-muted/20 lg:flex lg:flex-col lg:justify-between">
        {/* Background Layers */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          {/* Primary glow — top right */}
          <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-primary/8 blur-[120px] dark:bg-primary/10" />

          {/* Secondary glow — bottom left */}
          <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] dark:bg-primary/8" />

          {/* Accent glow — center */}
          <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-chart-2/5 blur-[100px] dark:bg-chart-2/8" />

          {/* Extra ambient glow — lower right */}
          <div className="absolute right-1/4 bottom-1/4 h-[260px] w-[260px] rounded-full bg-primary/5 blur-[140px]" />
        </div>

        {/* Top — Logo */}
        <div className="relative z-10 p-8 lg:p-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <span className="text-xl font-black tracking-tighter text-foreground">
              Skill<span className="text-primary">Swap</span>
            </span>
          </Link>
        </div>

        {/* Center — Tagline */}
        <div className="relative z-10 flex flex-1 items-center px-8 lg:px-10">
          <div className="max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                Professional Skill Exchange
              </span>
            </div>

            <h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-black leading-[0.92] tracking-tighter text-foreground">
              YOUR SKILLS
              <br />
              ARE{" "}
              <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent dark:from-primary dark:to-primary">
                CURRENCY.
              </span>
            </h2>

            <p className="mt-5 text-sm font-medium leading-relaxed text-muted-foreground">
              The dual-currency marketplace where expertise is both product and
              payment. Join thousands of professionals exchanging skills every
              day.
            </p>
          </div>
        </div>

        {/* Bottom — Live Stats + Copyright */}
        <div className="relative z-10 space-y-4 p-8 lg:p-10">
          <p className="text-xs font-medium text-muted-foreground/40">
            &copy; {new Date().getFullYear()} SkillSwap Market. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel — Form Content ── */}
      <div className="relative flex w-full flex-col bg-background lg:w-1/2">
        {/* Mobile logo (visible below lg) */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <span className="text-lg font-black tracking-tighter text-foreground">
              Skill<span className="text-primary">Swap</span>
            </span>
          </Link>
        </div>

        {/* Centered form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={typeof children === "object" ? "auth-form" : "auth"}
                variants={fadeSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
