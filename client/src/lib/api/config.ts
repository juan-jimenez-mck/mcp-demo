import { DEFAULT_API_BASE_URL } from './constants';
import type { ConfigMetadata, RuntimeConfig } from './types';

/**
 * Extend the Window interface to include runtime config
 */
declare global {
  interface Window {
    APP_CONFIG?: RuntimeConfig;
  }
}

/**
 * Resolve API configuration
 * @returns The API configuration
 */
export function getApiConfig(): ConfigMetadata {
  const isBrowser = typeof window !== 'undefined';

  const apiUrl = isBrowser ? window.APP_CONFIG?.API_BASE_URL : null;
  const isProduction = import.meta.env.MODE === 'production';

  if (apiUrl) {
    return {
      apiUrl,
      source: 'runtime',
      isProduction,
    };
  }

  return {
    apiUrl: DEFAULT_API_BASE_URL,
    source: 'default',
    isProduction,
  };
}
