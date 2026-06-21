"use client"

import { ShieldCheck } from "lucide-react"

export function VerifiedSkillTag({ skill }: { skill: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
      <ShieldCheck className="h-3.5 w-3.5" />
      <span className="text-xs font-bold">{skill}</span>
    </div>
  )
}
