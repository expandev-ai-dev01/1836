import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseDetailOptions, UsePurchaseDetailReturn } from './types';
import type { UpdatePurchaseDto } from '../../types';

/**
 * @hook usePurchaseDetail
 * @summary Manages a single purchase record for editing
 * @domain purchase
 * @type domain-hook
 */
export const usePurchaseDetail = ({ id }: UsePurchaseDetailOptions): UsePurchaseDetailReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['purchase', id];

  const {
    data: purchase,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => purchaseService.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePurchaseDto) => purchaseService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    purchase,
    isLoading,
    error: error as Error | null,
    updatePurchase: async (data: UpdatePurchaseDto) => {
      await updateMutation.mutateAsync(data);
    },
    isUpdating: updateMutation.isPending,
  };
};
