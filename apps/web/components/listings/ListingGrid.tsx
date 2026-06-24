"use client"

import { motion } from 'framer-motion'
import { ListingCard } from './ListingCard'
import { PackageSearch } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

interface ListingGridProps {
  listings: any[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageSearch className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-1">No listings found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {listings.map((listing) => (
        <motion.div key={listing._id} variants={item}>
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </motion.div>
  )
}
