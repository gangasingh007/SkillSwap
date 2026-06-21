"use client"

import { Medal } from "lucide-react"

export function SwapBadge({ swapsCount }: { swapsCount: number }) {
  let badge = null
  let colorClass = ""

  if (swapsCount >= 100) {
    badge = "Platinum"
    colorClass = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
  } else if (swapsCount >= 50) {
    badge = "Gold"
    colorClass = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
  } else if (swapsCount >= 20) {
    badge = "Silver"
    colorClass = "text-slate-400 bg-slate-500/10 border-slate-500/20"
  } else if (swapsCount >= 5) {
    badge = "Bronze"
    colorClass = "text-orange-600 bg-orange-600/10 border-orange-600/20"
  }

  if (!badge) return null

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${colorClass}`}>
      <Medal className="h-4 w-4" />
      <span className="text-xs font-bold uppercase tracking-widest">{badge} Swapper</span>
    </div>
  )
}
