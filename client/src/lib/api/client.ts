import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { ApiError, ApiResponse } from './types';
import { getApiConfig } from './config';

/**
 * API client
 * @description A client for making API requests
 */
export default class ApiClient {
  private readonly client: AxiosInstance;
  private _authToken?: string;
  private static _instance: ApiClient | null = null;

  static getInstance(): ApiClient {
    if (!ApiClient._instance) {
      const config = getApiConfig();
      ApiClient._instance = new ApiClient(config.apiUrl);

      if (!config.isProduction) {
        console.log(`🔧 API instance created: ${config.apiUrl}`);
      }
    }

    return ApiClient._instance;
  }

  private constructor(baseURL: string) {
    // Create Axios instance with default config
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this._authToken) {
          config.headers.Authorization = `Bearer ${this._authToken}`;
        }
        return config;
      },
      (error: unknown) => {
        const errorMessage =
          typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Request error';

        return Promise.reject(new Error(errorMessage));
      },
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => this.handleSuccess(response),
      (error: AxiosError) => this.handleError(error),
    );
  }

  /**
   * Update the base URL dynamically (useful for runtime configuration changes)
   * @param newBaseURL - The new base URL
   */
  public updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
    console.log('API base URL updated to:', newBaseURL);
  }

  /**
   * Set the auth token for API requests
   * @param token - The auth token
   */
  public set_AuthToken(token: string): void {
    this._authToken = token;
  }

  /**
   * Clear the auth token (e.g., on logout)
   */
  public clear_AuthToken(): void {
    this._authToken = undefined;
  }

  /**
   * Handle successful responses
   * @param response - The response from the API
   * @returns The response from the API
   */
  private handleSuccess(response: AxiosResponse): AxiosResponse {
    return response;
  }

  /**
   * Handle error responses
   * @param error - The error from the API
   * @returns The error from the API
   */
  private handleError(error: AxiosError): Promise<never> {
    const { response } = error;

    // Default error structure
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: response?.status ?? 500,
    };

    // Parse error details from response if available
    if (response?.data) {
      const errorData = response.data as ApiError;

      apiError.message = errorData.message ?? apiError.message;
      apiError.code = errorData.code;
      apiError.errors = errorData.errors;
    }

    // Handle specific status codes
    switch (response?.status) {
      case 401:
        // Handle unauthorized (could trigger logout)
        apiError.message = 'Authentication required';
        break;
      case 403:
        apiError.message = "You don't have permission to access this resource";
        break;
      case 404:
        apiError.message = 'Resource not found';
        break;
      case 422:
        apiError.message = 'Validation failed';
        break;
      case 500:
        apiError.message = 'Server error, please try again later';
        break;
    }

    return Promise.reject(new Error(apiError.message));
  }

  /**
   * Generic request method
   * @param config - The request config
   * @returns The response from the API
   */
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data as T;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }

      let errorMessage = 'Request failed';
      if (typeof error === 'object' && error !== null) {
        errorMessage = (error as { message?: string }).message ?? errorMessage;
      }

      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * Stream request using axios - creates a fetch-compatible response for streaming
   * @param config - The request config
   * @returns A Response-like object with streaming capabilities
   */
  public async stream(uri: string, data?: unknown): Promise<Response> {
    try {
      // Build the full URL
      const baseURL = this.client.defaults.baseURL || '';
      const url = uri.startsWith('http') ? uri : `${baseURL}${uri}`;

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream, application/json',
        'Cache-Control': 'no-cache',
      };

      // Add auth token if available
      if (this._authToken) {
        headers.Authorization = `Bearer ${this._authToken}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }

      let errorMessage = 'Stream request failed';
      if (typeof error === 'object' && error !== null) {
        errorMessage = (error as { message?: string }).message ?? errorMessage;
      }

      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * GET request
   * @param url - The URL to request
   * @param params - The parameters to request
   * @returns The response from the API
   */
  public async get<T>(url: string, params?: URLSearchParams): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  /**
   * POST request
   * @param url - The URL to request
   * @param data - The data to request
   * @returns The response from the API
   */
  public async post<T, P>(url: string, data?: P): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  /**
   * PUT request
   * @param url - The URL to request
   * @param data - The data to request
   * @returns The response from the API
   */
  public async put<T, P>(url: string, data?: P): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  /**
   * PATCH request
   * @param url - The URL to request
   * @param data - The data to request
   * @returns The response from the API
   */
  public async patch<T, P>(url: string, data?: P): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   * @param url - The URL to request
   * @returns The response from the API
   */
  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }

  /**
   * Upload files using FormData
   * @param url - The URL to upload to
   * @param formData - The FormData containing files
   * @returns The response from the API
   */
  public async upload<T>(url: string, formData: FormData): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }

  /**
   * Download a file
   * @param url - The URL to download from
   * @param customHeaders - Optional custom headers to override defaults
   * @returns The response from the API
   */
  public async download<T>(
    url: string,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      responseType: 'blob',
      headers: {
        // Accept any content type - let server determine the appropriate type
        Accept: '*/*',
        // Don't override Content-Type for downloads (server sets this)
        // Keep other headers that might be needed
        'Cache-Control': 'no-cache',
        ...customHeaders,
      },
    });
  }
}
