import { useNavigate, useParams } from 'react-router-dom';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { usePurchaseDetail } from '@/domain/purchase/hooks/usePurchaseDetail';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { CreatePurchaseDto } from '@/domain/purchase/types';

export const PurchaseEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { purchase, isLoading, error, updatePurchase, isUpdating } = usePurchaseDetail({ id });

  const handleSubmit = async (data: CreatePurchaseDto) => {
    try {
      await updatePurchase(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update purchase:', error);
      alert('Erro ao atualizar a compra. Tente novamente.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !purchase) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Erro</h3>
        <p className="mt-2 text-sm text-red-700">Compra não encontrada ou erro ao carregar.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm font-medium text-red-800 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar Compra</h1>
      </div>

      <PurchaseForm
        initialData={purchase}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard')}
        isSubmitting={isUpdating}
      />
    </div>
  );
};

export default PurchaseEditPage;
