export type UnitMeasure = 'un' | 'kg' | 'g' | 'L' | 'mL';

export interface Purchase {
  id: string;
  productName: string;
  quantity: number;
  unitMeasure: UnitMeasure;
  unitPrice: number;
  purchaseDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePurchaseDto {
  productName: string;
  quantity: number;
  unitMeasure: UnitMeasure;
  unitPrice: number;
  purchaseDate: string;
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {}

export interface PurchaseListFilters {
  startDate?: string;
  endDate?: string;
}
