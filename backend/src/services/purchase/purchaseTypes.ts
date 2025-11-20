export interface PurchaseEntity {
  id: string; // UUID
  productName: string;
  quantity: number;
  unitMeasure: 'un' | 'kg' | 'g' | 'L' | 'mL';
  unitPrice: number;
  totalPrice: number;
  purchaseDate: Date;
}

export interface PurchaseCreateRequest {
  idAccount: number;
  productName: string;
  quantity: number;
  unitMeasure: string;
  unitPrice: number;
  purchaseDate: string; // ISO Date string or YYYY-MM-DD
}

export interface PurchaseUpdateRequest extends PurchaseCreateRequest {
  id: string; // UUID
}

export interface PurchaseListResponse {
  list: PurchaseEntity[];
  totalSpent: number;
}
