export interface Wallet {
  id: string;
  user_id: string;
  cash_balance_cents: number;
  credit_balance: number;
  escrow_cash_cents: number;
  escrow_credits: number;
  last_activity_at: Date;
  created_at: Date;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'earn' | 'spend' | 'escrow' | 'release' | 'purchase' | 'payout';
  amount: number;
  currency: 'cash' | 'credits';
  order_id?: string;
  description?: string;
  created_at: Date;
}
