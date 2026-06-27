"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, Star, Clock, FileText, Zap, RefreshCw, Eye, ArrowLeft, Coins, CreditCard, PlayCircle } from "lucide-react"
import { CategoryBadge } from "@/components/listings/CategoryBadge"
import { VerifiedSkillTag } from "@/components/profile/VerifiedSkillTag"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ListingDetailClientProps {
  listing: any;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const seller = typeof listing.userId === 'object' ? listing.userId : null

  return (
    <div className="min-h-screen bg-background">
      {/* Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-20" />

      <main className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link href="/listings" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <CategoryBadge category={listing.category} />
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm gap-1.5 py-1">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono">{listing.analytics?.views || 0}</span> views
                </Badge>
                {listing.deliveryFormat === 'live_call' && (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 gap-1.5 py-1">
                    <PlayCircle className="h-3.5 w-3.5" />
                    Live Session
                  </Badge>
                )}
                {listing.deliveryFormat === 'async' && (
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 gap-1.5 py-1">
                    <Zap className="h-3.5 w-3.5" />
                    Async Delivery
                  </Badge>
                )}
                {listing.deliveryFormat === 'document' && (
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 gap-1.5 py-1">
                    <FileText className="h-3.5 w-3.5" />
                    Document
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground leading-tight">
                {listing.title}
              </h1>

              {seller && (
                <Link href={`/profile/${seller._id}`} className="inline-flex items-center gap-4 p-2 pr-6 rounded-full bg-card border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer shadow-sm">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {seller.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground text-sm">{seller.name}</span>
                      {seller.isVerified && <ShieldCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current mr-1" />
                        <span className="font-bold font-mono">{seller.reputationScore}</span>
                      </div>
                      <span>•</span>
                      <span>Level 2 Seller</span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>

            {/* Description & Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-3xl p-8 border border-border/40 shadow-xl shadow-black/5"
            >
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
                  <TabsTrigger value="description" className="rounded-lg cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="rounded-lg cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Star className="h-4 w-4 mr-2" />
                    Portfolio Samples
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="focus-visible:outline-none space-y-8">
                  <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </div>
                  
                  {listing.skillTags && listing.skillTags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Skills Required / Included</h3>
                      <div className="flex flex-wrap gap-2">
                        {listing.skillTags.map((tag: string) => (
                          <VerifiedSkillTag key={tag} skill={tag} />
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="portfolio" className="focus-visible:outline-none">
                  {listing.samples && listing.samples.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listing.samples.map((sample: any, idx: number) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden border border-border/50 aspect-video bg-muted flex items-center justify-center">
                          {sample.type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={sample.url} alt={`Sample ${idx + 1}`} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="text-center p-4">
                              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <span className="text-sm font-medium text-muted-foreground truncate block">{sample.url}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No portfolio samples provided.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Pricing Card */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-2xl shadow-primary/5">
                <h3 className="text-lg font-black tracking-tight mb-6">Booking Options</h3>
                
                <div className="space-y-4">
                  {listing.visibility !== 'credits_only' && (
                    <Button className="w-full h-14 rounded-xl text-base font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Book for {formatPrice(listing.cashPrice)}
                    </Button>
                  )}
                  
                  {listing.visibility !== 'cash_only' && (
                    <Button variant="outline" className="w-full h-14 rounded-xl text-base font-bold border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all cursor-pointer">
                      <Coins className="mr-2 h-5 w-5" />
                      Swap for {listing.creditPrice} Credits
                    </Button>
                  )}
                </div>

                <div className="mt-8 space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      Turnaround
                    </div>
                    <span className="font-bold text-foreground font-mono">{listing.turnaroundDays} Days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Revisions
                    </div>
                    <span className="font-bold text-foreground font-mono">{listing.revisionsIncluded} Included</span>
                  </div>
                </div>
              </div>

              {/* Propose a Custom Swap */}
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <h4 className="font-bold text-foreground mb-2">Want to trade directly?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Offer your own skill in exchange instead of paying with credits or cash.
                </p>
                <Button variant="secondary" className="w-full rounded-xl font-bold cursor-pointer">
                  Propose Direct Swap
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
