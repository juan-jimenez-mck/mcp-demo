import api from '@/lib/api';
import type { Product } from './types';

/**
 * Get all products
 */
export async function getProducts() {
  try {
    const result = await api.get<Product[]>('/products');
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
