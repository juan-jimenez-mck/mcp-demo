import ApiClient from './client';
export type { ApiResponse, ApiError, ConfigMetadata } from './types';
export { getApiConfig } from './config';

/**
 * Export the API client singleton
 */
export default ApiClient.getInstance();
