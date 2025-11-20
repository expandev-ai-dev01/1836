import { authenticatedClient } from '@/core/lib/api';
import type { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from '../types';

/**
 * @service purchaseService
 * @summary Service for managing purchase records
 * @domain purchase
 * @type rest-service
 * @apiContext internal
 */
export const purchaseService = {
  /**
   * @endpoint GET /api/v1/internal/purchase
   * @summary List all purchases
   */
  async list(): Promise<Purchase[]> {
    const response = await authenticatedClient.get('/purchase');
    // Assuming the API returns { success: true, data: [...] } or just the data array in a wrapper
    // Based on controller: res.json(successResponse(data))
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/purchase/:id
   * @summary Get a single purchase by ID
   */
  async getById(id: string): Promise<Purchase> {
    const response = await authenticatedClient.get(`/purchase/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/purchase
   * @summary Create a new purchase
   */
  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.post('/purchase', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/purchase/:id
   * @summary Update an existing purchase
   */
  async update(id: string, data: UpdatePurchaseDto): Promise<void> {
    await authenticatedClient.put(`/purchase/${id}`, data);
  },

  /**
   * @endpoint DELETE /api/v1/internal/purchase/:id
   * @summary Delete a purchase
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/purchase/${id}`);
  },
};
