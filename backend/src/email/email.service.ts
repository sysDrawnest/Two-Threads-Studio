/**
 * Email Service
 *
 * Thin wrapper around the Resend SDK.
 * The sender address is read from EMAIL_FROM env var — never hardcoded.
 *
 * Usage:
 *   await emailService.send({ to: 'user@example.com', subject: '...', html: '...' });
 *
 * To add a background queue later: replace the send() implementation with
 * a BullMQ enqueue call — callers need not change.
 */

import { Resend } from 'resend';
import logger from '../lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || 'Two Threads Studio <onboarding@resend.dev>';

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

export const emailService = {
  send: async (params: SendEmailParams): Promise<void> => {
    if (!process.env.RESEND_API_KEY) {
      logger.warn({ to: params.to, subject: params.subject }, '[EmailService] RESEND_API_KEY not set — skipping email');
      return;
    }

    try {
      const payload: any = {
        from: FROM,
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

      const { data, error } = await resend.emails.send(payload);

      if (error) {
        logger.error({ error, to: params.to, subject: params.subject }, '[EmailService] Resend API error');
      } else {
        logger.info({ id: data?.id, to: params.to, subject: params.subject }, '[EmailService] Email sent');
      }
    } catch (err) {
      // Non-fatal — email failures should not crash the payment flow
      logger.error({ err, to: params.to, subject: params.subject }, '[EmailService] Failed to send email');
    }
  },
};
