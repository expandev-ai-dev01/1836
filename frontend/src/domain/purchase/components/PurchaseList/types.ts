import { Purchase } from '../../types';

export interface PurchaseListProps {
  purchases: Purchase[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}
