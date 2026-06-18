"use client"

import * as React from "react"
import Link from "next/link"
import { Zap } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border/30 bg-muted/10 py-20">
      <div className="container mx-auto px-4 text-foreground">
        <div className="mb-16 grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-lg font-black tracking-tighter">Skill<span className="text-primary">Swap</span></span>
            </div>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
              The global clearing infrastructure for professional expertise. Built for the modern
              expert who understands that their skill is their greatest asset.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                All systems operational
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Platform</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-muted-foreground">
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Marketplace</Link></li>
              <li><Link href="/looking-for" className="hover:text-foreground transition-colors">Needs Board</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link href="/credits" className="hover:text-foreground transition-colors">Skill Credits</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Company</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Vision</Link></li>
              <li><Link href="/journal" className="hover:text-foreground transition-colors">The Journal</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Legal</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-border/30 pt-10 md:flex-row md:items-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            © 2026 SkillSwap Market Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <Link href="#" className="hover:text-foreground transition-colors text-muted-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors text-muted-foreground">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground transition-colors text-muted-foreground">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
