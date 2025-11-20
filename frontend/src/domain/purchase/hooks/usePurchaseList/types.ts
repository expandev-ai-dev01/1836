import { Purchase } from '../../types';

export interface UsePurchaseListReturn {
  purchases: Purchase[];
  monthlyTotal: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  deletePurchase: (id: string) => Promise<void>;
  isDeleting: boolean;
}
