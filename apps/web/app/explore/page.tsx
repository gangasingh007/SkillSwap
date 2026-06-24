import { Suspense } from 'react'
import { fetchExploreCollections } from '@/lib/explore'
import { ExploreCollection } from '@/components/discovery/ExploreCollection'
import { SearchBar } from '@/components/discovery/SearchBar'
import { Loader2, ShieldCheck, Star, Users, Search } from 'lucide-react'

export const metadata = {
  title: 'Explore Skills | SkillSwap Market',
  description: 'Discover top-rated skills, quick turnarounds, and new offerings from our community.',
}

async function ExploreContent() {
  const collections = await fetchExploreCollections()
  
  return (
    <div className="flex flex-col gap-16 w-full max-w-7xl mx-auto mt-12 pb-24 relative z-10">
      {collections.topRated?.length > 0 && (
        <ExploreCollection 
          title="Top Rated Professionals" 
          description="Consistently delivering excellence with highest community ratings and 100% completion rates."
          listings={collections.topRated} 
        />
      )}
      
      {collections.quickTurnaround?.length > 0 && (
        <ExploreCollection 
          title="Fast Delivery" 
          description="Need it fast? These verified skills are delivered within 48 hours."
          listings={collections.quickTurnaround} 
        />
      )}
      
      {collections.newThisWeek?.length > 0 && (
        <ExploreCollection 
          title="New Arrivals" 
          description="Fresh talent and newly verified offerings just added to the market."
          listings={collections.newThisWeek} 
        />
      )}
      
      {(!collections.topRated?.length && !collections.quickTurnaround?.length && !collections.newThisWeek?.length) && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-border/50 shadow-sm">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xl font-semibold text-foreground mb-2">No listings available yet</p>
          <p className="text-muted-foreground">Check back soon for top-rated professionals.</p>
        </div>
      )}
    </div>
  )
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-20" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        
        {/* Premium Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground bg-clip-text">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Exceptional</span> Talent
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Exchange your expertise or book top-tier professionals using USD or Skill Credits. 
            All members are community-verified.
          </p>
          
          <SearchBar />

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-border/50 w-full max-w-3xl text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span>Escrow Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Peer-Verified Skills</span>
            </div>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Curating the best professionals for you...</p>
          </div>
        }>
          <ExploreContent />
        </Suspense>
      </div>
    </div>
  )
}
