"use client"

import * as React from "react"

export function ProcessStrip() {
  const steps = [
    {
      step: "I",
      title: "Post Your Expertise",
      desc: "Create a service listing in under 5 minutes. Set your rate in USD, Skill Credits, or both. Your profile is your portfolio.",
    },
    {
      step: "II",
      title: "Get Matched & Negotiate",
      desc: "The AI Suggester surfaces bilateral opportunities. Accept, counter, or negotiate directly through the platform's encrypted messaging.",
    },
    {
      step: "III",
      title: "Deliver & Clear",
      desc: "Complete the work. Escrow releases on mutual confirmation — credits or cash, your account updates in real time.",
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex items-center gap-3">
          <div className="h-px w-8 bg-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Getting Started
          </span>
        </div>
        <div className="grid gap-0 divide-y divide-border/30 md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="group px-0 py-10 md:px-12 md:py-0 first:md:pl-0 last:md:pr-0 transition-colors hover:bg-muted/5">
              <p className="mb-6 font-mono text-xs font-black text-muted-foreground/30">STEP {step}</p>
              <h3 className="mb-4 text-xl font-black tracking-tight text-foreground">{title}</h3>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
