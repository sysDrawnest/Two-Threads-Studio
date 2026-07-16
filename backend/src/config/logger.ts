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
🛒 ${colors.bold}${colors.yellow}ORDER CREATED${colors.reset}
Order No      : ${log.orderNo}
Customer      : ${log.customer}
Amount        : ₹${log.amount}
Payment       : ${log.payment}
Risk          : ${log.risk}
`;
  }

  if (type === 'payment_verified') {
    return `
💳 ${colors.bold}${colors.green}PAYMENT VERIFIED${colors.reset}
Order         : ${log.orderNo}
Gateway       : ${log.gateway}
Transaction   : ${log.transaction}
Amount        : ₹${log.amount}
Status        : ${log.status}
`;
  }

  if (type === 'payment_error') {
    return `
\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PAYMENT ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
Order         : ${log.orderNo}
Provider      : ${log.provider}
Message       : ${log.message}
Time          : ${new Date().toLocaleTimeString('en-IN', { hour12: false })}
\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
`;
  }

  if (type === 'order_shipped') {
    return `
📦 ${colors.bold}${colors.blue}ORDER SHIPPED${colors.reset}
Order         : ${log.orderNo}
Courier       : ${log.courier}
Tracking      : ${log.tracking}
Status        : ${log.status}
`;
  }

  if (type === 'risk_analysis') {
    const scoreColor = log.trustScore >= 75 ? colors.green : log.trustScore >= 40 ? colors.yellow : colors.red;
    return `
🛡 ${colors.bold}${colors.magenta}RISK ANALYSIS${colors.reset}
Customer      : ${log.customer}
Trust Score   : ${scoreColor}${log.trustScore}${colors.reset}
COD           : ${log.cod}
Decision      : ${log.decision === 'APPROVED' ? `${colors.green}APPROVED${colors.reset}` : `${colors.red}REJECTED${colors.reset}`}
`;
  }

  if (type === 'email_sent') {
    return `
📨 ${colors.bold}${colors.cyan}EMAIL SENT${colors.reset}
Template      : ${log.template}
Recipients    : ${log.recipients}
Status        : ${log.status === 'SUCCESS' ? `${colors.green}SUCCESS${colors.reset}` : `${colors.red}FAILED${colors.reset}`}
Time          : ${log.time} ms
`;
  }

  if (type === 'login_success') {
    return `
🔐 ${colors.bold}${colors.green}LOGIN SUCCESS${colors.reset}
Role          : ${log.role}
Email         : ${log.email}
IP            : ${log.ip}
`;
  }

  if (type === 'login_failed') {
    return `
🔐 ${colors.bold}${colors.red}LOGIN FAILED${colors.reset}
Email         : ${log.email}
Reason        : ${log.reason}
`;
  }

  if (type === 'database_query') {
    return `
🗄 ${colors.bold}${colors.blue}DATABASE${colors.reset}
Query         : ${log.query}
Duration      : ${log.duration} ms
`;
  }

  if (type === 'slow_query') {
    return `
⚠ ${colors.bold}${colors.red}SLOW QUERY${colors.reset}
Duration      : ${colors.red}${colors.bold}${log.duration} ms${colors.reset}
Route         : ${log.route}
`;
  }

  if (type === 'low_stock') {
    return `
⚠ ${colors.bold}${colors.yellow}LOW STOCK${colors.reset}
Product       : ${log.product}
Remaining     : ${colors.red}${log.remaining}${colors.reset}
Threshold     : ${log.threshold}
`;
  }

  if (type === 'customer_registered') {
    return `
✓ ${colors.bold}${colors.green}Customer Registered${colors.reset}
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
\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ${name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
Message       : ${errMsg}
Time          : ${time}
`;

  if (env.NODE_ENV === 'development' && errStack) {
    output += `\nStack:\n${colors.dim}${errStack}${colors.reset}\n`;
  }
  output += `\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n`;

  return output;
};

export const loggerConfig = {
  level: env.LOG_LEVEL || (env.NODE_ENV === 'development' ? 'debug' : 'info'),
  pretty: env.LOG_PRETTY,
};
