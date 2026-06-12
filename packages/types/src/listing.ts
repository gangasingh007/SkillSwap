export interface Listing {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Development' | 'Design' | 'Marketing' | 'Writing' | 'Business' | 'Education' | 'Other';
  cashPrice: number;
  creditPrice: number;
  deliveryFormat: 'async' | 'live_call' | 'document';
  turnaroundDays: number;
  revisionsIncluded: number;
  samples: { type: 'image' | 'pdf' | 'link', url: string }[];
  visibility: 'public' | 'credits_only' | 'cash_only';
  isActive: boolean;
  analytics: { views: number, requests: number, conversions: number };
  isPromoted: boolean;
  createdAt: Date;
}
