import api from '@/lib/api';
import type { Email } from './types';

/**
 * Get an email by ID.
 * @param emailId - The ID of the email.
 * @returns The email.
 */
export async function getEmailById(emailId: number): Promise<Email> {
  try {
    return await api.get(`/notifications/emails/${emailId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
