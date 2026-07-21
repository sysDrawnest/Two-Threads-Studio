export interface ErrorWithDetails {
  message?: string;
  code?: string;
  status?: number;
  data?: any;
  name?: string;
}

/**
 * Maps any error object or HTTP response to clear, human-friendly user messages
 * aligned with Two Threads Studio UX specifications.
 */
export function getFriendlyErrorMessage(err: unknown, fallbackAction: 'login' | 'register' | 'general' = 'general'): string {
  // 1. Check network connectivity first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'No internet connection. Please check your network and try again.';
  }

  if (!err) {
    return 'Something went wrong. Please try again.';
  }

  // Extract properties
  let message = '';
  let code = '';
  let status = 0;

  if (typeof err === 'string') {
    message = err;
  } else if (typeof err === 'object') {
    const e = err as ErrorWithDetails;
    message = e.message || '';
    code = e.code || e.data?.code || '';
    status = e.status || e.data?.status || 0;
  }

  // 2. Check for network disconnect / inability to connect to backend
  if (
    code === 'ERR_NETWORK' ||
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('Network Error') ||
    message.includes('Unable to connect')
  ) {
    return 'Unable to connect to the server. Please check if the backend service is running.';
  }

  // 3. Map Error Codes & HTTP Statuses
  switch (code) {
    case 'USER_NOT_FOUND':
      return 'No account found with this email address.';
    case 'INVALID_PASSWORD':
      return 'Incorrect password. Please try again.';
    case 'INVALID_EMAIL_FORMAT':
      return 'Please enter a valid email address.';
    case 'ACCOUNT_BLOCKED':
      return 'Your account has been temporarily suspended. Please contact support.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Please verify your email before signing in.';
    case 'TOO_MANY_ATTEMPTS':
      return 'Too many failed login attempts. Please try again in 15 minutes.';
    case 'EMAIL_EXISTS':
      return 'An account with this email already exists.';
    case 'WEAK_PASSWORD':
      return 'Password must contain at least 8 characters, including an uppercase letter, lowercase letter, number, and special character.';
    case 'INVALID_PHONE':
      return 'Please enter a valid mobile number.';
    case 'OTP_INCORRECT':
      return 'The verification code is incorrect.';
    case 'OTP_EXPIRED':
      return 'This verification code has expired. Please request a new one.';
    case 'TOKEN_EXPIRED':
      return 'This password reset link has expired. Please request a new one.';
    case 'INVALID_TOKEN':
      return 'Invalid reset token.';
    case 'SERVER_ERROR':
      return 'Something went wrong on our end. Please try again shortly.';
  }

  // HTTP Status fallback mapping
  if (status === 404) {
    return 'No account found with this email address.';
  }
  if (status === 401) {
    return 'Incorrect password. Please try again.';
  }
  if (status === 403) {
    return 'Your account has been temporarily suspended. Please contact support.';
  }
  if (status === 409) {
    return 'An account with this email already exists.';
  }
  if (status === 429) {
    return 'Too many failed login attempts. Please try again in 15 minutes.';
  }
  if (status >= 500) {
    return 'Something went wrong on our end. Please try again shortly.';
  }

  // 4. Return message if valid string, else fallback
  if (message && message !== 'Failed to fetch' && message !== 'NetworkError' && message !== 'An error occurred') {
    return message;
  }

  if (fallbackAction === 'login') {
    return 'Incorrect email or password.';
  }
  if (fallbackAction === 'register') {
    return 'Unable to create account. Please check your details and try again.';
  }

  return 'Something went wrong. Please try again.';
}
