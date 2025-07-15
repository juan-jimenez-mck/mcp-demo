import api from '@/lib/api';
import type { ChatRequest, ChatSession } from './types';

/**
 * Streams the chat response from the server.
 * @param text - The text to send to the server.
 * @param onMessage - The function to call when a message is received.
 * @param onError - The function to call when an error occurs.
 * @param onComplete - The function to call when the chat is complete.
 */
export function streamChat(request: ChatRequest): Promise<Response> {
  try {
    return api.stream('/chat', {
      ...request,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Gets the sessions for a user.
 * @returns The sessions for the user.
 */
export function getUserSessions(): Promise<ChatSession[]> {
  try {
    return api.get(`/chat/sessions`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Gets a session by its ID.
 * @param id - The ID of the session.
 * @returns The session.
 */
export function getSessionById(id: number): Promise<ChatSession> {
  try {
    return api.get(`/chat/sessions/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
