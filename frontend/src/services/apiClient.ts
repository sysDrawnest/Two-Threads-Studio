const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

interface RequestOptions extends RequestInit {
  body?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path: string, options: RequestOptions = {}) {
  const url = `${API_BASE_URL}${path}`;
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

  const response = await fetch(url, finalOptions);

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || 'An error occurred';
    throw new ApiError(errorMessage, response.status, data);
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
