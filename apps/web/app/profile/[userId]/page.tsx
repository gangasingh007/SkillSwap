"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, MapPin, Calendar, Users, UserPlus, UserMinus, FileText, BadgeCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { ProtectedNavbar } from "@/components/shared/ProtectedNavbar"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

import { fetchUserProfile, fetchUserListings, followUser, unfollowUser } from "@/lib/users"
import { ReputationScore } from "@/components/profile/ReputationScore"
import { SwapBadge } from "@/components/profile/SwapBadge"
import { VouchButton } from "@/components/profile/VouchButton"
import { VerifiedSkillTag } from "@/components/profile/VerifiedSkillTag"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { EditProfileModal } from "@/components/profile/EditProfileModal"

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = React.use(params)
  const { user: currentUser } = useAuthStore()
  
  const [profile, setProfile] = React.useState<any>(null)
  const [listings, setListings] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFollowing, setIsFollowing] = React.useState(false)

  React.useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [profileData, listingsData] = await Promise.all([
          fetchUserProfile(userId).catch(() => null),
          fetchUserListings(userId).catch(() => ({ listings: [] }))
        ])
        if (profileData) {
          // API returns user object directly, not wrapped in { user }
          setProfile(profileData)
          setIsFollowing(profileData.isFollowing || false)
        }
        if (listingsData && listingsData.listings) {
          setListings(listingsData.listings)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [userId])

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please log in to follow users")
      return
    }
    
    try {
      if (isFollowing) {
        await unfollowUser(userId)
        setIsFollowing(false)
        toast.success(`Unfollowed ${profile?.name}`)
      } else {
        await followUser(userId)
        setIsFollowing(true)
        toast.success(`Following ${profile?.name}`)
      }
    } catch (error) {
      toast.error("Action failed. Please try again.")
    }
  }

  const isOwnProfile = currentUser?._id === userId

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {currentUser ? <ProtectedNavbar /> : <LandingHeader />}
        <main className="flex-1 container mx-auto px-4 pt-10 pb-16">
          <div className="flex items-start gap-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {currentUser ? <ProtectedNavbar /> : <LandingHeader />}
        <main className="flex-1 flex flex-col items-center justify-center pt-24">
          <h2 className="text-2xl font-bold mb-2 text-foreground">User not found</h2>
          <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {currentUser ? <ProtectedNavbar /> : <LandingHeader />}
      
      <main className="flex-1">
        {/* Profile Header */}
        <div className="bg-card border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-3xl bg-muted text-muted-foreground font-bold">
                    {profile.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                      {profile.name}
                    </h1>
                    {profile.isVerified && (
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    )}
                    {/* Badge */}
                    <SwapBadge swapsCount={profile.swapsCount || 0} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Joined {profile.createdAt ? formatDistanceToNow(new Date(profile.createdAt)) : "recently"} ago
                    </span>
                    {profile.timezone && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {profile.timezone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <div className="flex gap-3 w-full md:w-auto">
                  {!isOwnProfile ? (
                    <>
                      <Button 
                        onClick={handleFollowToggle}
                        variant={isFollowing ? "outline" : "default"} 
                        className={`rounded-xl cursor-pointer flex-1 md:flex-none ${!isFollowing ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        {isFollowing ? <UserMinus className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                      <VouchButton userId={userId} userName={profile.name} />
                    </>
                  ) : (
                    <EditProfileModal 
                      profile={profile} 
                      onProfileUpdated={(updated) => setProfile({ ...profile, ...updated })} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bio and Metrics */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                      About
                    </span>
                  </div>
                  <p className="text-foreground/80 font-medium leading-relaxed">
                    {profile.bio || "This user hasn't added a bio yet."}
                  </p>
                </div>

                {profile.skillTags && profile.skillTags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px w-8 bg-primary" />
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                        Skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillTags.map((skill: string) => (
                        <VerifiedSkillTag key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <ReputationScore score={profile.reputationScore || 0} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
              <TabsTrigger value="listings" className="rounded-lg cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4 mr-2" />
                Listings
              </TabsTrigger>
              <TabsTrigger value="vouches" className="rounded-lg cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BadgeCheck className="h-4 w-4 mr-2" />
                Vouches
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {listings.length > 0 ? (
                  <ListingGrid listings={listings} />
                ) : (
                  <div className="text-center py-20 bg-card rounded-xl border border-border/40">
                    <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground">No listings yet</h3>
                    <p className="text-sm text-muted-foreground">This user hasn't created any skill listings.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="vouches" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20 bg-card rounded-xl border border-border/40"
              >
                <BadgeCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">Vouches Coming Soon</h3>
                <p className="text-sm text-muted-foreground">This user's community vouches will appear here.</p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
