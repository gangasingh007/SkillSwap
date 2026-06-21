"use client"

import { Badge } from '@/components/ui/badge'
import { Code2, Palette, Megaphone, PenTool, Briefcase, GraduationCap, Layers } from 'lucide-react'

const categoryConfig: Record<string, { icon: React.ElementType; label: string }> = {
  Development: { icon: Code2, label: 'Development' },
  Design: { icon: Palette, label: 'Design' },
  Marketing: { icon: Megaphone, label: 'Marketing' },
  Writing: { icon: PenTool, label: 'Writing' },
  Business: { icon: Briefcase, label: 'Business' },
  Education: { icon: GraduationCap, label: 'Education' },
  Other: { icon: Layers, label: 'Other' },
}

export function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] || categoryConfig.Other
  const Icon = config.icon
  return (
    <Badge variant="secondary" className="gap-1 text-xs font-semibold">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
