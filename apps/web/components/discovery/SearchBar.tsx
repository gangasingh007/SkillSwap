"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const popularSearches = ['React', 'Figma Design', 'Copywriting', 'Node.js', 'SEO']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/listings?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/listings?q=${encodeURIComponent(suggestion)}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <form onSubmit={handleSearch} className="relative w-full flex items-center shadow-sm group">
        <Search className="z-20 absolute left-5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Search for skills (e.g. React, Copywriting, UI Design)..."
          className="w-full pl-14 pr-32 py-7 text-lg rounded-full bg-card/80 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all shadow-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          className="absolute right-2 rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-transform active:scale-95 shadow-md"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </form>
      
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
        <span className="font-medium mr-2">Popular:</span>
        {popularSearches.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1 rounded-full bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border/50 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
