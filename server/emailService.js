import nodemailer from 'nodemailer';

let cachedTransporter = null;
let isRealTransporter = false;

export const getMailTransporter = async () => {
  if (cachedTransporter) return { transporter: cachedTransporter, isReal: isRealTransporter };

  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS;

  // 1. Production / Custom Gmail or SMTP configuration
  if (user && pass) {
    const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || user.includes('@gmail.com');
    if (isGmail) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      isRealTransporter = true;
      return { transporter: cachedTransporter, isReal: true };
    }

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user, pass }
    });
    isRealTransporter = true;
    return { transporter: cachedTransporter, isReal: true };
  }

  // 2. Fallback to Ethereal ephemeral test account for dev/testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    isRealTransporter = false;
    return { transporter: cachedTransporter, isReal: false };
  } catch (err) {
    console.warn('Ethereal test account unavailable:', err.message);
    return { transporter: null, isReal: false };
  }
};

export const sendRequestMatchEmail = async ({ requester_email, requester_name, item_name, listing, originUrl }) => {
  if (!requester_email || !listing || !listing.title) {
    throw new Error('Missing required parameters for email notification.');
  }

  const subject = `🎒 [notoLX] Great news! "${listing.title}" is now available on campus!`;
  const textContent = `Hi ${requester_name || 'Student'},\n\nYou recently requested "${item_name}" on notoLX.\n\nA fellow student just uploaded a matching item for sale:\n- Item: ${listing.title}\n- Price: ₹${listing.price}\n- Campus Location: ${listing.campus_location || 'Campus'}\n\nKindly check it out on notoLX (Campus Second-Hand Marketplace) before it gets reserved!\n\nBest regards,\nnotoLX Team @ Thapar Institute`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; border-radius: 12px; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #10b981; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">🎒 notoLX</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">Campus Peer-to-Peer Marketplace • Thapar University (@thapar.edu)</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 10px; border: 1px solid #334155;">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 19px;">Great news, ${requester_name || 'fellow student'}! 🎉</h3>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          You previously created a campus request for <strong style="color: #f1f5f9;">"${item_name}"</strong>.
        </p>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          A student has just listed a matching item on the marketplace:
        </p>

        <div style="background-color: #0f172a; padding: 18px; border-radius: 8px; margin: 18px 0; border: 1px solid #334155;">
          <div style="font-size: 18px; font-weight: bold; color: #ffffff;">${listing.title}</div>
          <div style="font-size: 18px; font-weight: 800; color: #10b981; margin-top: 6px;">₹${listing.price}</div>
          <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">📍 Campus Pickup: <strong style="color: #e2e8f0;">${listing.campus_location || 'Campus Quad'}</strong></div>
          ${listing.condition ? `<div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">Condition: <strong style="color: #e2e8f0;">${listing.condition}</strong></div>` : ''}
        </div>

        <p style="color: #cbd5e1; font-size: 14px; margin-top: 20px;">
          Log into <strong>notoLX</strong> to chat with the seller and reserve it before someone else does!
        </p>

        <div style="text-align: center; margin: 28px 0 12px 0;">
          <a href="${originUrl || 'http://localhost:5173'}" style="background-color: #10b981; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 14px; display: inline-block;">
            Open notoLX & View Listing →
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
        This automated notification was sent because you have an active campus request on notoLX (@thapar.edu).
      </div>
    </div>
  `;

  const { transporter, isReal } = await getMailTransporter();
  let previewUrl = null;

  if (transporter) {
    const fromAddress = (process.env.SMTP_USER || process.env.GMAIL_USER)
      ? `"notoLX Campus Marketplace" <${process.env.SMTP_USER || process.env.GMAIL_USER}>` 
      : '"notoLX Campus Marketplace" <no-reply@notolx.thapar.edu>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: requester_email,
      subject,
      text: textContent,
      html: htmlContent
    });

    if (!isReal) {
      previewUrl = nodemailer.getTestMessageUrl(info);
    }

    console.log(`📧 [EMAIL ${isReal ? 'DELIVERED TO INBOX' : 'TEST PREVIEW'}] To: ${requester_email} | Subject: ${subject}`);
    if (previewUrl) {
      console.log(`🔗 [EMAIL PREVIEW URL]: ${previewUrl}`);
    }

    return {
      success: true,
      sentReal: isReal,
      recipient: requester_email,
      previewUrl,
      subject
    };
  } else {
    console.log(`📧 [SIMULATED EMAIL LOG] To: ${requester_email}\nSubject: ${subject}\n${textContent}`);
    return {
      success: true,
      sentReal: false,
      recipient: requester_email,
      previewUrl: null,
      subject
    };
  }
};
