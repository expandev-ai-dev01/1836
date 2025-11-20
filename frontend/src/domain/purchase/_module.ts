/**
 * @module purchase
 * @summary Module for managing food purchases
 * @domain purchase
 */

export * from './components/PurchaseList';
export * from './components/PurchaseForm';
export * from './components/PurchaseSummary';
export * from './hooks/usePurchaseList';
export * from './hooks/usePurchaseDetail';
export * from './hooks/usePurchaseCreate';
export * from './services/purchaseService';
export * from './types';

export const moduleMetadata = {
  name: 'purchase',
  domain: 'functional',
  version: '1.0.0',
} as const;
