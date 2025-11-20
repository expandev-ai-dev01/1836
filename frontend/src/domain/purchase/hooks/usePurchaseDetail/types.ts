import { Purchase, UpdatePurchaseDto } from '../../types';

export interface UsePurchaseDetailOptions {
  id?: string;
}

export interface UsePurchaseDetailReturn {
  purchase: Purchase | undefined;
  isLoading: boolean;
  error: Error | null;
  updatePurchase: (data: UpdatePurchaseDto) => Promise<void>;
  isUpdating: boolean;
}
