"use client"

import { useRef } from 'react'
import { ListingCard } from '@/components/listings/ListingCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ExploreCollectionProps {
  title: string
  description?: string
  listings: any[]
}

export function ExploreCollection({ title, description, listings }: ExploreCollectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!listings || listings.length === 0) return null

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {listings.length > 3 && (
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {listings.map((listing) => (
          <div key={listing._id} className="min-w-[300px] max-w-[350px] flex-shrink-0 snap-start h-full">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  )
}
