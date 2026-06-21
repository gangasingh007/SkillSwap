"use client"

import { Target } from "lucide-react"

export function SkillChallengeCard({ title, status, score }: { title: string, status: string, score?: number }) {
  return (
    <div className="flex items-center justify-between bg-card border border-border/40 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground capitalize">{status}</p>
        </div>
      </div>
      {score !== undefined && (
        <div className="text-right">
          <span className="text-lg font-mono font-bold highlight-number text-foreground">{score}%</span>
        </div>
      )}
    </div>
  )
}
