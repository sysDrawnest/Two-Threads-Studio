import pino from 'pino';
import pretty from 'pino-pretty';
import { loggerConfig, formatHTTPLog, formatBusinessEvent, formatErrorLog } from '../config/logger';

let logger: pino.Logger;

if (loggerConfig.pretty) {
  const prettyStream = pretty({
    colorize: true,
    ignore: 'pid,hostname,type,req,res,responseTime,userRole,userEmail,duration,route,query,role,email,ip,reason,orderNo,customer,amount,payment,risk,gateway,transaction,status,provider,message,product,remaining,threshold,template,recipients,time,userId,err,error,msg,path',
    translateTime: 'SYS:standard',
    messageFormat: (log: any, messageKey: string) => {
      // 1. Check if it's an error log (fatal/error levels or contains error objects)
      const isErrorLog = log.level >= 50 || log.err || log.error;
      if (isErrorLog && log.type !== 'payment_error') {
        return formatErrorLog(log);
      }

      // 2. Check if it's an HTTP request log
      if (log.req) {
        return formatHTTPLog(log);
      }

      // 3. Check if it's a structured business event
      if (log.type) {
        const formatted = formatBusinessEvent(log);
        if (formatted) return formatted;
      }

      // 4. Fallback to normal message formatting
      return log[messageKey] || '';
    },
  });

  logger = pino({ level: loggerConfig.level }, prettyStream);
} else {
  logger = pino({ level: loggerConfig.level });
}

export default logger;
