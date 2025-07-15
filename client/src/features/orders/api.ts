import api from '@/lib/api';
import type { Order } from './types';

/**
 * Get all orders
 */
export async function getOrders() {
  try {
    const result = await api.get<Order[]>('/orders');
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Get an order by ID.
 * @param orderId - The ID of the order.
 * @returns The order.
 */
export async function getOrderById(orderId: number): Promise<Order> {
  try {
    return await api.get(`/orders/${orderId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
