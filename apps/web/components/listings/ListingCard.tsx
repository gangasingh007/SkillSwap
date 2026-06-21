"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, Clock, Coins, Star, ShieldCheck } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'

interface ListingUser {
  _id: string
  name: string
  avatarUrl?: string
  reputationScore: number
  isVerified: boolean
}

interface ListingCardProps {
  listing: {
    _id: string
    userId: ListingUser | string
    title: string
    description: string
    category: string
    skillTags: string[]
    cashPrice: number
    creditPrice: number
    deliveryFormat: string
    turnaroundDays: number
    analytics: { views: number; requests: number; conversions: number }
    createdAt: string
  }
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function ListingCard({ listing }: ListingCardProps) {
  const seller = typeof listing.userId === 'object' ? listing.userId : null

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/listings/${listing._id}`} className="block cursor-pointer">
        <div className="bg-card rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 h-full flex flex-col">
          {/* Header: category + views */}
          <div className="flex items-center justify-between mb-3">
            <CategoryBadge category={listing.category} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span className="font-mono highlight-number">{listing.analytics.views}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground leading-snug line-clamp-2 mb-1.5">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {listing.description}
          </p>

          {/* Skill tags */}
          {listing.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {listing.skillTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-sm"
                >
                  {tag}
                </span>
              ))}
              {listing.skillTags.length > 3 && (
                <span className="text-[11px] font-semibold text-muted-foreground">+{listing.skillTags.length - 3}</span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border/50 mb-4" />

          {/* Price row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-foreground highlight-number text-lg">
                {formatPrice(listing.cashPrice)}
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 font-mono font-bold text-primary highlight-number">
                <Coins className="h-3.5 w-3.5" />
                {listing.creditPrice}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {listing.turnaroundDays}d
            </span>
          </div>

          {/* Seller info */}
          {seller && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {seller.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-foreground">{seller.name}</span>
              {seller.isVerified && <ShieldCheck className="h-3 w-3 text-primary" />}
              <span className="ml-auto flex items-center gap-0.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="font-mono highlight-number">{seller.reputationScore}</span>
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
