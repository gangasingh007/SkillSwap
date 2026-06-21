import api from './api';

export async function fetchListings(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { data } = await api.get('/listings', { params });
  return data;
}

export async function fetchListingById(id: string) {
  const { data } = await api.get(`/listings/${id}`);
  return data;
}

export async function searchListings(query: string, params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get('/listings/search', { params: { q: query, ...params } });
  return data;
}

export async function fetchTrendingListings(limit?: number) {
  const { data } = await api.get('/listings/trending', { params: { limit } });
  return data;
}

export async function fetchMyListings() {
  const { data } = await api.get('/listings/my');
  return data;
}

export async function createListing(listingData: {
  title: string;
  description: string;
  category: string;
  skillTags?: string[];
  cashPrice: number;
  creditPrice: number;
  deliveryFormat: string;
  turnaroundDays: number;
  revisionsIncluded: number;
  samples?: { type: string; url: string }[];
  visibility?: string;
}) {
  const { data } = await api.post('/listings', listingData);
  return data;
}

export async function updateListing(id: string, listingData: Record<string, unknown>) {
  const { data } = await api.patch(`/listings/${id}`, listingData);
  return data;
}

export async function deleteListing(id: string) {
  await api.delete(`/listings/${id}`);
}
