"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/shared/ThemeToggle"

export function LandingHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/75 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-black tracking-tighter text-foreground">Skill<span className="text-primary">Swap</span></span>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-bold text-sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg text-sm"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
