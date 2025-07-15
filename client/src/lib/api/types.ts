/**
 * Global API response type
 */
export type ApiResponse<T> = {
  data: T;
  status: string;
  message?: string;
};

/**
 * Error response from API
 */
export type ApiError = {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
};

/**
 * Runtime configuration interface
 */
export type RuntimeConfig = {
  API_BASE_URL: string;
};

/**
 * Configuration result type
 */
export type ConfigMetadata = {
  apiUrl: string;
  source: string;
  isProduction: boolean;
};
