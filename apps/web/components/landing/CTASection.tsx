"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="border-t border-border/30 py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-foreground/80 px-8 py-24 text-background md:px-20">
          {/* Large ambient type */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-[20vw] font-black leading-none tracking-tighter text-background/[0.03] select-none overflow-hidden"
          >
            SWAP
          </div>

          <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-background/40">
                Ready to begin
              </p>
              <h2 className="text-4xl font-black leading-[0.9] tracking-tighter md:text-6xl">
                YOUR EXPERTISE
                <br />
                IS WAITING
                <br />
                <span className="text-primary">TO BE SPENT.</span>
              </h2>
              <p className="mt-6 max-w-md text-base font-medium text-background/60">
                Join 12,000+ professionals who've turned their skills into a self-sustaining
                economy. Free to join. No subscription. Your first 3 Credits are on us.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-shrink-0">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 w-full gap-2 rounded-xl bg-primary px-10 font-bold text-background hover:bg-primary/80 md:w-auto group"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full gap-2 rounded-xl border-background/20 bg-transparent px-10 font-bold text-background hover:bg-background/30 md:w-auto"
                >
                  Browse First
                </Button>
              </Link>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-background/30">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
