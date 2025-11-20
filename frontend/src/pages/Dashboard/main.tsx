import { Link } from 'react-router-dom';
import { usePurchaseList } from '@/domain/purchase/hooks/usePurchaseList';
import { PurchaseList } from '@/domain/purchase/components/PurchaseList';
import { PurchaseSummary } from '@/domain/purchase/components/PurchaseSummary';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

export const DashboardPage = () => {
  const { purchases, monthlyTotal, isLoading, error, deletePurchase } = usePurchaseList();

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
        <p className="mt-2 text-sm text-red-700">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Compras</h1>
        <Link
          to="/dashboard/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Adicionar Nova Compra
        </Link>
      </div>

      <PurchaseSummary total={monthlyTotal} isLoading={isLoading} />

      <ErrorBoundary>
        <PurchaseList purchases={purchases} isLoading={isLoading} onDelete={deletePurchase} />
      </ErrorBoundary>
    </div>
  );
};

export default DashboardPage;
