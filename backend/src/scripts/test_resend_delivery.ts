import { emailService } from '../email/email.service';

async function testResendDelivery() {
  console.log('================================================================');
  console.log('✉️ RESEND EMAIL DELIVERY TEST & VERIFICATION');
  console.log('================================================================\n');

  console.log('1. ENVIRONMENT CONFIGURATION CHECK:');
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'Two Threads Studio <onboarding@resend.dev>';
  
  console.log('   RESEND_API_KEY Present:', Boolean(apiKey));
  console.log('   RESEND_API_KEY Prefix :', apiKey ? `${apiKey.slice(0, 7)}...` : 'NONE');
  console.log('   EMAIL_FROM Configured  :', emailFrom);
  console.log('   NODE_ENV               :', process.env.NODE_ENV);
  console.log('----------------------------------------------------------------\n');

  // TEST A: Target sethysaiyangyadatta@gmail.com
  console.log('2A. DISPATCHING TEST EMAIL TO sethysaiyangyadatta@gmail.com:');
  const targetRecipientA = 'sethysaiyangyadatta@gmail.com';
  const startA = Date.now();
  const resultA = await emailService.send({
    to: targetRecipientA,
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
  const durationA = Date.now() - startA;

  console.log('\n3A. RAW RESEND API RESPONSE (sethysaiyangyadatta@gmail.com):');
  console.log('   Duration          :', `${durationA} ms`);
  console.log('   Success Status    :', resultA.success ? '✅ TRUE' : '❌ FALSE (403 SANDBOX RESTRICTION)');
  console.log('   Message ID        :', resultA.id || 'NONE');
  console.log('   Raw Error Payload :', JSON.stringify(resultA.error, null, 2));
  console.log('----------------------------------------------------------------\n');

  // TEST B: Target shreyasisahoo116@gmail.com (Resend Account Owner)
  console.log('2B. DISPATCHING TEST EMAIL TO RESEND ACCOUNT OWNER (shreyasisahoo116@gmail.com):');
  const targetRecipientB = 'shreyasisahoo116@gmail.com';
  const startB = Date.now();
  const resultB = await emailService.send({
    to: targetRecipientB,
    subject: 'Two Threads Studio - Email Delivery Verification',
    html: `
      <div style="font-family: serif, Georgia, sans-serif; padding: 24px; background-color: #fef8f3; color: #171311; border: 1px solid #e0d0c0; borderRadius: 8px;">
        <h2 style="color: #2b231f; font-weight: 500;">Two Threads Studio — Development Email Delivery Verification</h2>
        <p>This is a test email sent through <strong>Resend</strong>.</p>
        <p>If you received this email, the email delivery system is configured correctly.</p>
        <hr style="border: none; border-top: 1px solid #e0d0c0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #706050;">Two Threads Studio Development Environment</p>
      </div>
    `,
  });
  const durationB = Date.now() - startB;

  console.log('\n3B. RAW RESEND API RESPONSE (shreyasisahoo116@gmail.com):');
  console.log('   Duration          :', `${durationB} ms`);
  console.log('   Success Status    :', resultB.success ? '✅ TRUE (ACCEPTED BY RESEND)' : '❌ FALSE');
  console.log('   Message ID        :', resultB.id || 'NONE');
  console.log('   Raw Error Payload :', JSON.stringify(resultB.error || null, null, 2));
  console.log('----------------------------------------------------------------\n');

  console.log('================================================================');
  console.log('🎉 RESEND EMAIL TEST COMPLETE');
  console.log('================================================================\n');
}

testResendDelivery().catch((err) => {
  console.error('❌ Test Execution Failed:', err);
  process.exit(1);
});
