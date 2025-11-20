import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { PurchaseSummaryProps } from './types';

export const PurchaseSummary = ({ total, isLoading }: PurchaseSummaryProps) => {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">Total Gasto (Mês Atual)</h3>
      <div className="mt-2 flex items-baseline">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <span className="text-3xl font-bold text-gray-900">{formattedTotal}</span>
        )}
      </div>
    </div>
  );
};
