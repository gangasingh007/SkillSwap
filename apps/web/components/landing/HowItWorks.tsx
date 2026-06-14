"use client"

import { Globe, Coins, Sparkles, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-primary " />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary dark:text-primary">
                The Architecture
              </span>
            </div>
            <h2 className="text-4xl font-black leading-[0.92] tracking-tighter md:text-5xl">
              TWO RAILS.
              <br />
              ONE ECONOMY.
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
            Every transaction flows through one of two clearing systems — you choose which one serves you best.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Rail 1: USD */}
          <Card className="group rounded-2xl border-border/40 bg-muted/10 transition-all hover:border-amber-500/20 hover:bg-muted/20">
            <CardContent className="flex h-full flex-col p-8">
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="highlight-number font-mono text-xs font-bold text-muted-foreground/40">
                  RAIL 01
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-black tracking-tight text-foreground">USD Clearing</h3>
              <p className="flex-1 text-sm font-medium leading-relaxed text-muted-foreground">
                Standard professional rates with fully-automated escrow via Stripe Connect. List a
                service, deliver on time, and withdraw directly to your bank account within 48 hours.
              </p>
              <div className="mt-8 border-t border-border/30 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  10% flat success fee — no monthly subscription
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rail 2: Skill Credits (featured) */}
          <Card className="group relative rounded-2xl border-foreground/10 bg-foreground text-background overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <Coins className="absolute -bottom-8 -right-8 h-48 w-48 rotate-12 text-background" />
            </div>
            <CardContent className="relative flex h-full flex-col p-8">
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-background/20 bg-background/10">
                  <Coins className="h-5 w-5 text-amber-400" />
                </div>
                <span className="highlight-number font-mono text-xs font-bold text-background/30">
                  RAIL 02
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-black tracking-tight">Skill Credits</h3>
              <p className="flex-1 text-sm font-medium leading-relaxed text-background/60">
                Our native barter layer. Deliver any service and earn Credits; spend them to hire
                any expert in the market. No cash needed — your expertise is the bank.
              </p>
              <div className="mt-8 border-t border-background/10 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  3 free Credits on signup. Zero expiry.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rail 3: AI Matching */}
          <Card className="group rounded-2xl border-border/40 bg-muted/10 transition-all hover:border-amber-500/20 hover:bg-muted/20">
            <CardContent className="flex h-full flex-col p-8">
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="highlight-number font-mono text-xs font-bold text-muted-foreground/40">
                  LAYER 03
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-black tracking-tight text-foreground">AI Matching</h3>
              <p className="flex-1 text-sm font-medium leading-relaxed text-muted-foreground">
                Our Suggester engine continuously maps your posted expertise against active Needs
                Board listings to surface bilateral swap opportunities in real time.
              </p>
              <div className="mt-8 border-t border-border/30 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Precision-ranked matches, refreshed every 6 hours
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
