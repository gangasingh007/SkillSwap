"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Search,
  Zap,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TICKER_ITEMS } from "./constants"
import RotatingText from "./RotatingText"


function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

function OrbitingTags({ tags }: { tags: string[] }) {
  const prefersReduced = useReducedMotion()
  const radius = 44 // percentage of container half-size

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

/* ─────────────────── Trust Badge Item ─────────────────────────── */

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Stripe-Secured Escrow" },
  { icon: Globe, label: "140+ Countries" },
  { icon: Sparkles, label: "AI-Matched Swaps" },
  { icon: BarChart3, label: "Real-Time Clearing" },
] as const

/* ─────────────────── Stagger Configs ─────────────────────────── */

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
}


export function Hero() {
  const prefersReduced = useReducedMotion()
  const floatingTags = TICKER_ITEMS.slice(0, 7)

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-12 md:pt-32 lg:pt-36">
      {/* ── Background Layer ── */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-primary/8 blur-[120px] dark:bg-primary/10" />
        <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] dark:bg-primary/8" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-chart-2/5 blur-[100px] dark:bg-chart-2/8" />
      </div>

      {/* ── Orbiting Skill Tags (XL screens) ── */}
      <OrbitingTags tags={floatingTags} />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="relative z-10"
        >
  
          {/* ── Headline ── */}
          <motion.h1
            variants={stagger.item}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.9] tracking-tighter text-foreground"
          >
            YOUR SKILLS
            <br />
            YOUR {" "}
            <span className="inline-block relative">
              <RotatingText
                texts={['Currency', 'Commodities', 'Capital', 'Power', 'Influence']}
                mainClassName="px-2 sm:px-2 md:px-3 bg-primary/50 text-background overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                splitBy="characters"
                auto
                loop
              />
            </span>
          </motion.h1>

          {/* ── Sub + CTA Row ── */}
          <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              variants={stagger.item}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="max-w-xl"
            >
              <p className="text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
                The dual-currency marketplace where expertise is both product and
                payment. Hire in USD or earn{" "}
                <span className="inline-flex items-baseline gap-1 font-mono font-bold text-foreground">
                  <Sparkles className="inline h-3.5 w-3.5 text-primary" />
                  Skill Credits
                </span>{" "}
                by delivering your own work.
              </p>

              {/* ── CTA Buttons ── */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="group h-13 cursor-pointer gap-2 rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                  >
                    Start Swapping
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group h-13 cursor-pointer gap-2 rounded-xl border-border px-8 font-bold transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                  >
                    <Search className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ── Live Stat Card ── */}
            <motion.div
              className="hidden shrink-0 lg:block"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group relative cursor-default overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/3 group-hover:to-transparent" />

                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-40" />
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-chart-1" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Live Activity
                  </span>
                </div>

                <p className="text-5xl font-black tracking-tighter text-foreground">
                  <AnimatedCounter target={12400} />
                  <span className="text-primary">+</span>
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  experts active today
                </p>

                <div className="mt-4 flex items-center gap-1.5 border-t border-border/40 pt-3">
                  <ArrowUpRight className="h-3.5 w-3.5 text-chart-1" />
                  <span className="text-xs font-bold text-chart-1">+18%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Trust Strip ── */}
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="rounded-2xl border border-border/40 bg-card/40 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <p className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                Trusted&nbsp;infrastructure
              </p>
              <div className="h-px w-full bg-border/40 sm:h-4 sm:w-px" />
              <div className="flex flex-wrap items-center gap-4">
                {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="group flex cursor-default items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all duration-200 hover:bg-primary/5"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/8 transition-colors duration-200 group-hover:bg-primary/15 dark:bg-primary/12">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
