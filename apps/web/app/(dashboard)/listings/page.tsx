"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { ListingFilters } from "@/components/listings/ListingFilters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { fetchListings, searchListings } from "@/lib/listings"

interface Filters {
  category: string
  minPrice: string
  maxPrice: string
  sortBy: string
  sortOrder: string
  search: string
}

const defaultFilters: Filters = {
  category: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
}

export default function BrowseListingsPage() {
  const [listings, setListings] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<Filters>(defaultFilters)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true)
      try {
        const params: Record<string, unknown> = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }
        if (filters.category) params.category = filters.category
        if (filters.minPrice) params.minPrice = Number(filters.minPrice) * 100 // dollars → cents
        if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice) * 100

        let result
        if (filters.search.trim()) {
          result = await searchListings(filters.search, params as any)
        } else {
          result = await fetchListings(params as any)
        }

        setListings(result.listings)
        setPagination((prev) => ({
          ...prev,
          total: result.total,
          totalPages: result.totalPages,
          page: result.page,
        }))
      } catch (error) {
        console.error("Failed to load listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadListings()
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.sortBy, filters.sortOrder, filters.search, pagination.page, pagination.limit])

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      handleFilterChange({ search: value })
    }, 300)
  }

  // Generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    const { page, totalPages } = pagination
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, page - 2)
      let end = Math.min(totalPages, start + maxVisible - 1)
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      for (let i = start; i <= end; i++) pages.push(i)
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
              Browse Skills
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground mb-2">
            DISCOVER EXPERTISE
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            Find the perfect skill for your project — pay with cash or swap with credits.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for skills, e.g. 'React Development', 'Logo Design'..."
              onChange={handleSearchInput}
              className="pl-12 h-12 rounded-xl border-input bg-card text-base shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <ListingFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results count + mobile filter toggle */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground font-medium">
                <span className="font-mono highlight-number text-foreground font-bold">
                  {pagination.total}
                </span>{" "}
                skills found
              </p>

              {/* Mobile filter button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden rounded-lg cursor-pointer gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-5 overflow-y-auto">
                  <SheetTitle className="text-lg font-bold text-foreground mb-4">
                    Filters
                  </SheetTitle>
                  <ListingFilters
                    filters={filters}
                    onFilterChange={(f) => {
                      handleFilterChange(f)
                      setMobileFiltersOpen(false)
                    }}
                    onReset={() => {
                      handleResetFilters()
                      setMobileFiltersOpen(false)
                    }}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Listing Grid or Loading Skeletons */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/40 p-5 space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-16 rounded-sm" />
                      <Skeleton className="h-5 w-16 rounded-sm" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ListingGrid listings={listings} />
            )}

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-1.5 mt-10"
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded-lg cursor-pointer min-w-9 font-mono highlight-number ${
                      pageNum === pagination.page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="rounded-lg cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
