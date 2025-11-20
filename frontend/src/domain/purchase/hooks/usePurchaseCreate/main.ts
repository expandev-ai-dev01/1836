import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { CreatePurchaseDto } from '../../types';

/**
 * @hook usePurchaseCreate
 * @summary Manages creation of new purchases
 * @domain purchase
 * @type domain-hook
 */
export const usePurchaseCreate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePurchaseDto) => purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    createPurchase: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
