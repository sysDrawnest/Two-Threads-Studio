import { Router, Request, Response } from 'express';
import { emailService } from '../email/email.service';
import logger from '../lib/logger';

const router = Router();

/**
 * Dev-only endpoint for testing Resend Email Delivery
 * POST /api/v1/dev/test-email
 */
router.post('/test-email', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({
      success: false,
      message: 'Dev endpoints are disabled in production mode.',
    });
    return;
  }

  const recipient = req.body?.to || 'sethysaiyangyadatta@gmail.com';
  const sender = process.env.EMAIL_FROM || 'Two Threads Studio <onboarding@resend.dev>';
  const apiKeyPresent = Boolean(process.env.RESEND_API_KEY);

  logger.info({ recipient, sender }, '[DevController] Executing Resend email delivery test');

  const result = await emailService.send({
    to: recipient,
    subject: 'Two Threads Studio - Email Test',
    html: `
      <div style="font-family: serif, Georgia, sans-serif; padding: 24px; background-color: #fef8f3; color: #171311; border: 1px solid #e0d0c0; borderRadius: 8px;">
        <h2 style="color: #2b231f; font-weight: 500;">Two Threads Studio — Development Email Test</h2>
        <p>This is a test email sent through <strong>Resend</strong>.</p>
        <p>If you received this email, the email delivery system is configured correctly.</p>
        <hr style="border: none; border-top: 1px solid #e0d0c0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #706050;">Two Threads Studio Development Environment</p>
      </div>
    `,
  });

  if (result.success) {
    res.status(200).json({
      success: true,
      message: 'Email request accepted by Resend',
      messageId: result.id,
      recipient,
      sender,
      env: {
        nodeEnv: process.env.NODE_ENV,
        resendApiKeyPresent: apiKeyPresent,
        emailFrom: sender,
      },
      apiResponse: {
        status: 200,
        id: result.id,
        error: null,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to send email via Resend',
      recipient,
      sender,
      env: {
        nodeEnv: process.env.NODE_ENV,
        resendApiKeyPresent: apiKeyPresent,
        emailFrom: sender,
      },
      apiResponse: {
        status: 500,
        id: null,
        error: result.error,
      },
    });
  }
});

export default router;
