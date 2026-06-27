import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchListingById } from '@/lib/listings'
import { ListingDetailClient } from './ClientPage'

// For SEO
export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const params = await props.params;
    const listing = await fetchListingById(params.id)
    if (!listing) {
      return {
        title: 'Listing Not Found | SkillSwap',
      }
    }
    
    return {
      title: `${listing.title} | SkillSwap`,
      description: listing.description.substring(0, 150) + '...',
    }
  } catch (error) {
    return {
      title: 'Listing | SkillSwap',
    }
  }
}

export default async function ListingDetailPage(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    // SSR fetch the listing data
    const listing = await fetchListingById(params.id)
    
    if (!listing) {
      notFound()
    }
    
    return <ListingDetailClient listing={listing} />
  } catch (error) {
    // If the API is down or returns a 500, we can just show notFound for now
    // or handle it with an error.tsx boundary
    notFound()
  }
}
