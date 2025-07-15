import type { User } from './types';

/**
 * Get the initials of a user
 * @param user - The user
 * @returns The initials of the user
 */
export function getUserInitials(user: User) {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
