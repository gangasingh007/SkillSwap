export interface Order {
  _id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'active' | 'delivered' | 'completed' | 'disputed' | 'refunded';
  paymentType: 'cash' | 'credits';
  amount: number;
  deliverable?: { type: 'file' | 'link' | 'text', url?: string, content?: string };
  proposedTimeline: Date;
  agreedTimeline: Date;
  revisionsUsed: number;
  deliveredAt?: Date;
  confirmedAt?: Date;
  autoConfirmAt: Date;
  createdAt: Date;
}
