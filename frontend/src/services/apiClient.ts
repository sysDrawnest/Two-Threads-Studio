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

// ─── Token Refresh State ───────────────────────────────────────────────────────
// Prevent concurrent refresh storms: if a refresh is already in-flight,
// queue the callers and resolve them all with the same new token.
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeToRefresh(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(token: string | null) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    // Another request is already refreshing — wait for it
    return new Promise((resolve) => {
      subscribeToRefresh(resolve);
    });
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem('tt_refresh_token');

  if (!refreshToken) {
    isRefreshing = false;
    notifyRefreshSubscribers(null);
    return null;
  }

  try {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      isRefreshing = false;
      notifyRefreshSubscribers(null);
      return null;
    }

    const refreshResult = await refreshResponse.json();
    if (refreshResult.success && refreshResult.data?.accessToken) {
      const newAccessToken = refreshResult.data.accessToken;
      localStorage.setItem('tt_access_token', newAccessToken);
      if (refreshResult.data.refreshToken) {
        localStorage.setItem('tt_refresh_token', refreshResult.data.refreshToken);
      }
      isRefreshing = false;
      notifyRefreshSubscribers(newAccessToken);
      return newAccessToken;
    }

    isRefreshing = false;
    notifyRefreshSubscribers(null);
    return null;
  } catch {
    isRefreshing = false;
    notifyRefreshSubscribers(null);
    return null;
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
  let requestBody = options.body;

  // Set Content-Type to JSON if sending a plain object (not FormData or Blob)
  if (requestBody && typeof requestBody === 'object' && !(requestBody instanceof FormData) && !(requestBody instanceof Blob)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    requestBody = JSON.stringify(requestBody);
  }

  // Inject JWT from localStorage
  const token = localStorage.getItem('tt_access_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Inject Guest ID
  const guestId = localStorage.getItem('tts_guest_id');
  if (guestId && !headers.has('x-guest-id')) {
    headers.set('x-guest-id', guestId);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
    body: requestBody,
  };

  let response: Response;
  try {
    response = await fetch(url, finalOptions);
  } catch (netErr: any) {
    throw new ApiError(
      'Unable to connect to the server. Please check if the backend server is running.',
      0,
      'ERR_NETWORK',
      netErr
    );
  }

  // ─── Parse response body ────────────────────────────────────────────────────
  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  // ─── Handle 401: Attempt token refresh then retry original request ──────────
  // IMPORTANT: Only trigger logout if refresh itself definitively fails.
  // A 400 validation error on the product form must NEVER log the admin out.
  if (
    response.status === 401 &&
    !url.includes('/auth/refresh') &&
    !url.includes('/auth/login')
  ) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry the original request with fresh access token
      const retryHeaders = new Headers(headers);
      retryHeaders.set('Authorization', `Bearer ${newToken}`);

      // Rebuild body: if FormData, we must re-create it since it may be consumed
      const retryOptions: RequestInit = {
        ...options,
        headers: retryHeaders,
        body: requestBody,
      };

      let retryResponse: Response;
      try {
        retryResponse = await fetch(url, retryOptions);
      } catch (netErr: any) {
        throw new ApiError(
          'Unable to connect to the server after token refresh.',
          0,
          'ERR_NETWORK',
          netErr
        );
      }

      let retryData: any = null;
      const retryContentType = retryResponse.headers.get('content-type');
      if (retryContentType && retryContentType.includes('application/json')) {
        try {
          retryData = await retryResponse.json();
        } catch {
          retryData = null;
        }
      }

      if (!retryResponse.ok) {
        // Retry also failed — but only dispatch logout if STILL 401
        if (retryResponse.status === 401) {
          window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } }));
        }
        const errorMessage = retryData?.message || retryResponse.statusText || 'An error occurred';
        const code = retryData?.code || 'REQUEST_FAILED';
        throw new ApiError(errorMessage, retryResponse.status, code, retryData);
      }

      return retryData;
    }

    // Refresh definitively failed (no new token returned) — now safe to logout
    window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'refresh_failed' } }));
    const errorMessage = data?.message || 'Session expired. Please log in again.';
    throw new ApiError(errorMessage, response.status, data?.code || 'UNAUTHORIZED', data);
  }

  // ─── Non-401 errors: surface them without touching auth state ──────────────
  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || 'An error occurred';
    const code = data?.code;
    throw new ApiError(errorMessage, response.status, code, data);
  }

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
