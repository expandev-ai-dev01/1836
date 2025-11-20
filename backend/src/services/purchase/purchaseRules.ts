import { getPool } from '@/utils/database';
import {
  PurchaseCreateRequest,
  PurchaseListResponse,
  PurchaseUpdateRequest,
  PurchaseEntity,
} from './purchaseTypes';

export async function purchaseCreate(params: PurchaseCreateRequest): Promise<{ id: string }> {
  const pool = await getPool();
  const totalPrice = params.quantity * params.unitPrice;

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('unitMeasure', params.unitMeasure)
    .input('unitPrice', params.unitPrice)
    .input('totalPrice', totalPrice)
    .input('purchaseDate', params.purchaseDate)
    .execute('spPurchaseCreate');

  return result.recordset[0];
}

export async function purchaseUpdate(params: PurchaseUpdateRequest): Promise<void> {
  const pool = await getPool();
  const totalPrice = params.quantity * params.unitPrice;

  await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('uuid', params.id)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('unitMeasure', params.unitMeasure)
    .input('unitPrice', params.unitPrice)
    .input('totalPrice', totalPrice)
    .input('purchaseDate', params.purchaseDate)
    .execute('spPurchaseUpdate');
}

export async function purchaseDelete(params: { idAccount: number; id: string }): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('uuid', params.id)
    .execute('spPurchaseDelete');
}

export async function purchaseList(params: { idAccount: number }): Promise<PurchaseListResponse> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .execute('spPurchaseList');

  // Fix TS7053: Cast recordsets to any[] to allow numeric indexing
  const recordsets = result.recordsets as any[];

  return {
    list: recordsets[0] as PurchaseEntity[],
    totalSpent: recordsets[1]?.[0]?.totalSpent || 0,
  };
}

export async function purchaseGet(params: {
  idAccount: number;
  id: string;
}): Promise<PurchaseEntity | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('uuid', params.id)
    .execute('spPurchaseGet');

  return result.recordset[0] || null;
}
