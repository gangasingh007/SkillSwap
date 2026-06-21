"use client"

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search, RotateCcw, Code2, Palette, Megaphone, PenTool, Briefcase, GraduationCap, Layers,
} from 'lucide-react'

const categories = [
  { value: 'Development', icon: Code2 },
  { value: 'Design', icon: Palette },
  { value: 'Marketing', icon: Megaphone },
  { value: 'Writing', icon: PenTool },
  { value: 'Business', icon: Briefcase },
  { value: 'Education', icon: GraduationCap },
  { value: 'Other', icon: Layers },
]

interface ListingFiltersProps {
  filters: {
    category: string
    minPrice: string
    maxPrice: string
    sortBy: string
    sortOrder: string
    search: string
  }
  onFilterChange: (filters: Record<string, string>) => void
  onReset: () => void
}

export function ListingFilters({ filters, onFilterChange, onReset }: ListingFiltersProps) {
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({ search: value })
    }, 300)
  }

  const handleCategoryClick = (category: string) => {
    onFilterChange({ category: filters.category === category ? '' : category })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(':')
    onFilterChange({ sortBy, sortOrder })
  }

  return (
    <div className="bg-card rounded-xl border border-border/40 p-5 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search skills..."
          defaultValue={filters.search}
          onChange={handleSearchChange}
          className="pl-9 rounded-xl border-input bg-background h-10"
        />
      </div>

      {/* Category */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
            Category
          </span>
        </div>
        <div className="space-y-1.5">
          {categories.map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryClick(value)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                filters.category === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
            Price Range
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              className="pl-7 rounded-lg border-input bg-background h-9 text-sm"
            />
          </div>
          <span className="text-muted-foreground text-xs">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              className="pl-7 rounded-lg border-input bg-background h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
            Sort By
          </span>
        </div>
        <Select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full rounded-lg border-input bg-background h-9 cursor-pointer">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt:desc">Newest First</SelectItem>
            <SelectItem value="createdAt:asc">Oldest First</SelectItem>
            <SelectItem value="cashPrice:asc">Price: Low to High</SelectItem>
            <SelectItem value="cashPrice:desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        onClick={onReset}
        className="w-full rounded-lg cursor-pointer gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  )
}
