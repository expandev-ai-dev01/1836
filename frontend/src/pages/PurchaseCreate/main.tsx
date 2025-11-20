import { useNavigate } from 'react-router-dom';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { usePurchaseCreate } from '@/domain/purchase/hooks/usePurchaseCreate';
import type { CreatePurchaseDto } from '@/domain/purchase/types';

export const PurchaseCreatePage = () => {
  const navigate = useNavigate();
  const { createPurchase, isCreating } = usePurchaseCreate();

  const handleSubmit = async (data: CreatePurchaseDto) => {
    try {
      await createPurchase(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create purchase:', error);
      alert('Erro ao salvar a compra. Tente novamente.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Nova Compra</h1>
      </div>

      <PurchaseForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard')}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default PurchaseCreatePage;
