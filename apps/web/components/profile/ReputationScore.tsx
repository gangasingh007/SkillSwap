"use client"

import { Star } from "lucide-react"

export function ReputationScore({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-card border border-border/40 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <Star className="h-5 w-5 fill-primary text-primary" />
        <span className="text-2xl font-black font-mono highlight-number text-foreground">
          {score}
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Reputation
      </span>
    </div>
  )
}
