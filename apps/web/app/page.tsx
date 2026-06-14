"use client"

import { LandingHeader } from "@/components/landing/LandingHeader"
import { Hero } from "@/components/landing/Hero"
import { Ticker } from "@/components/landing/Ticker"
import { StatsSection } from "@/components/landing/StatsSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { LiveActivity } from "@/components/landing/LiveActivity"
import { ProcessStrip } from "@/components/landing/ProcessStrip"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { CTASection } from "@/components/landing/CTASection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <LandingHeader />
      <main className="flex-1 pt-16">
        <Hero />
        <Ticker />
        <StatsSection />
        <HowItWorks />
        <LiveActivity />
        <ProcessStrip />
        <TestimonialsSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  )
}
