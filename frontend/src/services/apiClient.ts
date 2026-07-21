// In development: use relative path so Vite's dev proxy handles routing
// (avoids cross-origin CORS entirely in dev — browser sees same-origin requests).
// In production: VITE_API_URL must be set to the absolute backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface RequestOptions extends RequestInit {
  body?: any;
  params?: Record<string, any>;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  data: any;

  constructor(message: string, status: number, code?: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

async function request(path: string, options: RequestOptions = {}) {
  // Check browser online status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new ApiError(
      'No internet connection. Please check your network and try again.',
      0,
      'OFFLINE'
    );
  }

  let url = `${API_BASE_URL}${path}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(options.headers);

  // Set Content-Type to JSON if sending a body and it is a plain object
  if (options.body && typeof options.body === 'object') {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  // Inject JWT from localStorage
  const token = localStorage.getItem('tt_access_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Inject Guest ID
  const guestId = localStorage.getItem('tts_guest_id');
  if (guestId) {
    headers.set('x-guest-id', guestId);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;
  try {
    response = await fetch(url, finalOptions);
  } catch (netErr: any) {
    throw new ApiError(
      'Unable to connect to the server. Please check your network and try again.',
      0,
      'ERR_NETWORK',
      netErr
    );
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  // Handle 401 Unauthorized by attempting to refresh the token
  if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
    const refreshToken = localStorage.getItem('tt_refresh_token');
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success && refreshResult.data) {
            localStorage.setItem('tt_access_token', refreshResult.data.accessToken);
            if (refreshResult.data.refreshToken) {
              localStorage.setItem('tt_refresh_token', refreshResult.data.refreshToken);
            }
            
            // Retry the original request
            const retryHeaders = new Headers(options.headers);
            retryHeaders.set('Authorization', `Bearer ${refreshResult.data.accessToken}`);
            
            if (options.body && typeof options.body === 'object') {
              retryHeaders.set('Content-Type', 'application/json');
            }

            const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
            
            let retryData: any = null;
            const retryContentType = retryResponse.headers.get('content-type');
            if (retryContentType && retryContentType.includes('application/json')) {
              retryData = await retryResponse.json();
            }

            if (!retryResponse.ok) {
              const errorMessage = retryData?.message || retryResponse.statusText || 'An error occurred';
              const code = retryData?.code || 'RETRY_FAILED';
              throw new ApiError(errorMessage, retryResponse.status, code, retryData);
            }
            
            return retryData;
          }
        }
      } catch (err) {
        console.error('Failed to refresh token', err);
      }
    }
    
    // If refresh failed or there is no refresh token, dispatch logout event
    window.dispatchEvent(new Event('auth:logout'));
    const errorMessage = data?.message || response.statusText || 'Unauthorized';
    const code = data?.code || 'UNAUTHORIZED';
    throw new ApiError(errorMessage, response.status, code, data);
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || 'An error occurred';
    const code = data?.code;
    throw new ApiError(errorMessage, response.status, code, data);
  }

  // Return standard response structure or data
  return data;
}

export const apiClient = {
  get: (path: string, options?: RequestOptions) =>
    request(path, { ...options, method: 'GET' }),
  
  post: (path: string, body?: any, options?: RequestOptions) =>
    request(path, { ...options, method: 'POST', body }),
  
  put: (path: string, body?: any, options?: RequestOptions) =>
    request(path, { ...options, method: 'PUT', body }),
  
  patch: (path: string, body?: any, options?: RequestOptions) =>
    request(path, { ...options, method: 'PATCH', body }),
  
  delete: (path: string, options?: RequestOptions) =>
    request(path, { ...options, method: 'DELETE' }),
};
