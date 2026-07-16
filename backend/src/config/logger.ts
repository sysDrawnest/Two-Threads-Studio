import { env } from './env';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const getStatusColor = (status: number) => {
  if (status >= 500) return colors.red;
  if (status >= 400) return colors.yellow;
  if (status >= 300) return colors.cyan;
  return colors.green;
};

export const formatHTTPLog = (log: any) => {
  const method = `${colors.bold}${colors.magenta}${log.req.method.padEnd(6)}${colors.reset}`;
  const url = log.req.url;
  const statusNum = log.res?.statusCode || 200;
  const statusColor = getStatusColor(statusNum);
  const status = `${statusColor}${statusNum}${colors.reset}`;
  const duration = `${colors.cyan}${log.responseTime}ms${colors.reset}`;
  const role = `${colors.bold}${colors.white}${log.userRole || 'Guest'}${colors.reset}`;
  const ip = log.req.remoteAddress || '::1';

  let detail = '';
  if (env.LOG_HTTP_BODY && log.req.body && Object.keys(log.req.body).length > 0) {
    detail += `\n${colors.dim}Body: ${JSON.stringify(log.req.body, null, 2)}${colors.reset}`;
  }
  if (env.LOG_HEADERS && log.req.headers && Object.keys(log.req.headers).length > 0) {
    detail += `\n${colors.dim}Headers: ${JSON.stringify(log.req.headers, null, 2)}${colors.reset}`;
  }

  return `${method} ${url.padEnd(40)} ${status}   ${duration.padStart(6)}   ${role}   [${ip}]${detail}`;
};

export const formatBusinessEvent = (log: any) => {
  const type = log.type;

  if (type === 'order_created') {
    return `
[ORDER CREATED] ${colors.bold}${colors.yellow}NEW ORDER PLACED${colors.reset}
Order No      : ${log.orderNo}
Customer      : ${log.customer}
Amount        : INR ${log.amount}
Payment       : ${log.payment}
Risk          : ${log.risk}
`;
  }

  if (type === 'payment_verified') {
    return `
[PAYMENT VERIFIED] ${colors.bold}${colors.green}PAYMENT TRANSACTION CONFIRMED${colors.reset}
Order         : ${log.orderNo}
Gateway       : ${log.gateway}
Transaction   : ${log.transaction}
Amount        : INR ${log.amount}
Status        : ${log.status}
`;
  }

  if (type === 'payment_error') {
    return `
------------------------------------------------------------
[PAYMENT ERROR] TRANSACTION FAILURE
------------------------------------------------------------
Order         : ${log.orderNo}
Provider      : ${log.provider}
Message       : ${log.message}
Time          : ${new Date().toLocaleTimeString('en-IN', { hour12: false })}
------------------------------------------------------------
`;
  }

  if (type === 'order_shipped') {
    return `
[ORDER SHIPPED] ${colors.bold}${colors.blue}PACKAGE SENT TO COURIER${colors.reset}
Order         : ${log.orderNo}
Courier       : ${log.courier}
Tracking      : ${log.tracking}
Status        : ${log.status}
`;
  }

  if (type === 'risk_analysis') {
    const scoreColor = log.trustScore >= 75 ? colors.green : log.trustScore >= 40 ? colors.yellow : colors.red;
    return `
[RISK ANALYSIS] ${colors.bold}${colors.magenta}TRUST & FRAUD ENGINE RUN${colors.reset}
Customer      : ${log.customer}
Trust Score   : ${scoreColor}${log.trustScore}${colors.reset}
COD           : ${log.cod}
Decision      : ${log.decision === 'APPROVED' ? `${colors.green}APPROVED${colors.reset}` : `${colors.red}REJECTED${colors.reset}`}
`;
  }

  if (type === 'email_sent') {
    return `
[EMAIL SENT] ${colors.bold}${colors.cyan}NOTIFICATION DISPATCHED${colors.reset}
Template      : ${log.template}
Recipients    : ${log.recipients}
Status        : ${log.status === 'SUCCESS' ? `${colors.green}SUCCESS${colors.reset}` : `${colors.red}FAILED${colors.reset}`}
Time          : ${log.time} ms
`;
  }

  if (type === 'login_success') {
    return `
[LOGIN SUCCESS] ${colors.bold}${colors.green}SESSION ESTABLISHED${colors.reset}
Role          : ${log.role}
Email         : ${log.email}
IP            : ${log.ip}
`;
  }

  if (type === 'login_failed') {
    return `
[LOGIN FAILED] ${colors.bold}${colors.red}AUTHENTICATION REJECTED${colors.reset}
Email         : ${log.email}
Reason        : ${log.reason}
`;
  }

  if (type === 'database_query') {
    return `
[DATABASE] ${colors.bold}${colors.blue}QUERY EXECUTED${colors.reset}
Query         : ${log.query}
Duration      : ${log.duration} ms
`;
  }

  if (type === 'slow_query') {
    return `
[SLOW QUERY] ${colors.bold}${colors.red}DATABASE LATENCY WARNING${colors.reset}
Duration      : ${colors.red}${colors.bold}${log.duration} ms${colors.reset}
Route         : ${log.route}
`;
  }

  if (type === 'low_stock') {
    return `
[LOW STOCK] ${colors.bold}${colors.yellow}INVENTORY DEPLTETION WARNING${colors.reset}
Product       : ${log.product}
Remaining     : ${colors.red}${log.remaining}${colors.reset}
Threshold     : ${log.threshold}
`;
  }

  if (type === 'customer_registered') {
    return `
[CUSTOMER REGISTERED] ${colors.bold}${colors.green}NEW ACCOUNT CREATED${colors.reset}
Email         : ${log.email}
ID            : ${log.userId}
`;
  }

  return null;
};

export const formatErrorLog = (log: any) => {
  const errMsg = log.msg || log.err?.message || log.error?.message || 'Unknown Error';
  const errStack = log.err?.stack || log.error?.stack;
  const name = log.err?.name || log.error?.name || 'Error';
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });

  let output = `
------------------------------------------------------------
[ERROR] ${name.toUpperCase()} OCCURRED
------------------------------------------------------------
Message       : ${errMsg}
Time          : ${time}
`;

  if (env.NODE_ENV === 'development' && errStack) {
    output += `\nStack:\n${colors.dim}${errStack}${colors.reset}\n`;
  }
  output += `------------------------------------------------------------\n`;

  return output;
};

export const loggerConfig = {
  level: env.LOG_LEVEL || (env.NODE_ENV === 'development' ? 'debug' : 'info'),
  pretty: env.LOG_PRETTY,
};
