import api from '@/lib/api';
import type { User } from './types';

/**
 * Get all users
 * @returns {Promise<User[]>}
 */
export async function getUsers(): Promise<User[]> {
  try {
    return await api.get<User[]>('/users');
  } catch (error) {
    console.error(error);
    return [];
  }
}
