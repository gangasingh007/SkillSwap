"use client"
import { create } from 'zustand';

interface ListingFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: string;
  search: string;
}

interface ListingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListingsState {
  listings: any[];
  currentListing: any | null;
  isLoading: boolean;
  filters: ListingFilters;
  pagination: ListingPagination;
  setListings: (listings: any[], pagination: Partial<ListingPagination>) => void;
  setCurrentListing: (listing: any | null) => void;
  setFilters: (filters: Partial<ListingFilters>) => void;
  setLoading: (isLoading: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: ListingFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
};

export const useListingsStore = create<ListingsState>((set) => ({
  listings: [],
  currentListing: null,
  isLoading: false,
  filters: defaultFilters,
  pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  setListings: (listings, pagination) => set((state) => ({
    listings,
    pagination: { ...state.pagination, ...pagination },
  })),
  setCurrentListing: (listing) => set({ currentListing: listing }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  setLoading: (isLoading) => set({ isLoading }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
