import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { cn } from '@/core/lib/utils';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { PurchaseFormProps } from './types';

const purchaseSchema = z.object({
  productName: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  unitMeasure: z.enum(['un', 'kg', 'g', 'L', 'mL'], {
    errorMap: () => ({ message: 'Selecione uma unidade válida' }),
  }),
  unitPrice: z.coerce.number().positive('Preço deve ser maior que zero'),
  purchaseDate: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Data não pode ser futura',
  }),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const PurchaseForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: PurchaseFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      productName: '',
      quantity: undefined,
      unitMeasure: 'un',
      unitPrice: undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        productName: initialData.productName,
        quantity: initialData.quantity,
        unitMeasure: initialData.unitMeasure,
        unitPrice: initialData.unitPrice,
        purchaseDate: initialData.purchaseDate.split('T')[0],
      });
    }
  }, [initialData, reset]);

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const totalItem = quantity && unitPrice ? quantity * unitPrice : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Name */}
        <div className="col-span-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="productName"
            {...register('productName')}
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
              errors.productName && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          />
          {errors.productName && (
            <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantidade *
          </label>
          <input
            type="number"
            step="0.001"
            id="quantity"
            {...register('quantity')}
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
              errors.quantity && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        {/* Unit Measure */}
        <div>
          <label htmlFor="unitMeasure" className="block text-sm font-medium text-gray-700">
            Unidade *
          </label>
          <select
            id="unitMeasure"
            {...register('unitMeasure')}
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
              errors.unitMeasure && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          >
            <option value="un">Unidade (un)</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="g">Grama (g)</option>
            <option value="L">Litro (L)</option>
            <option value="mL">Mililitro (mL)</option>
          </select>
          {errors.unitMeasure && (
            <p className="mt-1 text-sm text-red-600">{errors.unitMeasure.message}</p>
          )}
        </div>

        {/* Unit Price */}
        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
            Preço Unitário *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="unitPrice"
              {...register('unitPrice')}
              className={cn(
                'block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
                errors.unitPrice && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
          </div>
          {errors.unitPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
          )}
        </div>

        {/* Purchase Date */}
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Data da Compra *
          </label>
          <input
            type="date"
            id="purchaseDate"
            {...register('purchaseDate')}
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
              errors.purchaseDate && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
          )}
        </div>

        {/* Total Item Preview */}
        <div className="col-span-2 rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Total do Item (Estimado)</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalItem)}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="mr-2 text-white" /> : null}
          Salvar
        </button>
      </div>
    </form>
  );
};
