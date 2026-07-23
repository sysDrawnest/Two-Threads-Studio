/**
 * Email Service
 *
 * Thin wrapper around the Resend SDK.
 * The sender address is read dynamically from EMAIL_FROM env var — never hardcoded.
 *
 * Usage:
 *   const res = await emailService.send({ to: 'user@example.com', subject: '...', html: '...' });
 */

import { Resend } from 'resend';
import logger from '../lib/logger';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | Uint8Array;
    contentType?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: any;
}

export const emailService = {
  send: async (params: SendEmailParams): Promise<SendEmailResult> => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || 'Two Threads Studio <onboarding@resend.dev>';

    if (!apiKey) {
      logger.warn({ to: params.to, subject: params.subject }, '[Email] RESEND_API_KEY not set — skipping email dispatch');
      return { success: false, error: 'RESEND_API_KEY environment variable is missing' };
    }

    try {
      const resend = new Resend(apiKey);
      const payload: any = {
        from: fromAddress,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
      };

      if (params.attachments && params.attachments.length > 0) {
        payload.attachments = params.attachments.map((a) => ({
          filename: a.filename,
          content: Buffer.from(a.content).toString('base64'),
          ...(a.contentType ? { content_type: a.contentType } : {}),
        }));
      }

      logger.info({ recipient: params.to, subject: params.subject, from: fromAddress }, '[Email] Sending email...');

      const response = await resend.emails.send(payload);

      if (response.error) {
        logger.error(
          {
            error: response.error,
            recipient: params.to,
            subject: params.subject,
            from: fromAddress,
          },
          '[Email] Failed to send email via Resend API'
        );
        return { success: false, error: response.error };
      }

      logger.info(
        {
          id: response.data?.id,
          recipient: params.to,
          subject: params.subject,
          from: fromAddress,
        },
        '[Email] Email sent successfully'
      );

      return { success: true, id: response.data?.id };
    } catch (err: any) {
      logger.error(
        {
          err,
          message: err.message,
          stack: err.stack,
          recipient: params.to,
          subject: params.subject,
          from: fromAddress,
        },
        '[Email] Unexpected exception during email dispatch'
      );
      return { success: false, error: err };
    }
  },
};
