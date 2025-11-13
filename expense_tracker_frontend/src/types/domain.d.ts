/**
 * Category type
 */
export interface Category {
  id: string;
  name: string;
  color?: string | null;
}

/**
 * Expense type
 */
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category_id?: string | null;
  merchant?: string | null;
  notes?: string | null;
  date: string; // ISO date
  receipt_url?: string | null;
}

/**
 * Budget type
 */
export interface Budget {
  id: string;
  user_id: string;
  category_id?: string | null;
  month: string; // YYYY-MM
  limit: number;
  spent?: number;
}
