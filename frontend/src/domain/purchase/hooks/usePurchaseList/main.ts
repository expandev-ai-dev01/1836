import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { isSameMonth, isSameYear, parseISO } from 'date-fns';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseListReturn } from './types';

/**
 * @hook usePurchaseList
 * @summary Manages the list of purchases and calculates monthly total
 * @domain purchase
 * @type domain-hook
 */
export const usePurchaseList = (): UsePurchaseListReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['purchases'];

  const {
    data: purchases = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: purchaseService.list,
  });

  const deleteMutation = useMutation({
    mutationFn: purchaseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const monthlyTotal = useMemo(() => {
    if (!purchases.length) return 0;

    const now = new Date();
    return purchases.reduce((total, purchase) => {
      const purchaseDate = parseISO(purchase.purchaseDate);
      if (isSameMonth(purchaseDate, now) && isSameYear(purchaseDate, now)) {
        return total + purchase.quantity * purchase.unitPrice;
      }
      return total;
    }, 0);
  }, [purchases]);

  // Sort purchases by date (newest first) as per RU-001
  const sortedPurchases = useMemo(() => {
    return [...purchases].sort(
      (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );
  }, [purchases]);

  return {
    purchases: sortedPurchases,
    monthlyTotal,
    isLoading,
    error: error as Error | null,
    refetch,
    deletePurchase: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isDeleting: deleteMutation.isPending,
  };
};
