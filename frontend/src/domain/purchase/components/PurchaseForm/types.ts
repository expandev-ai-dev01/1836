import { CreatePurchaseDto, Purchase } from '../../types';

export interface PurchaseFormProps {
  initialData?: Purchase;
  onSubmit: (data: CreatePurchaseDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
