import api from '@/lib/api';
import type { Account } from './types';

/**
 * Get all accounts
 */
export async function getAccounts() {
  try {
    const result = await api.get<Account[]>('/accounts');
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
