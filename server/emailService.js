import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Automatically load .env if not already present in process.env
const loadEnvFromDisk = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return;
  try {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile();
    }
  } catch {}
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch {}
};

loadEnvFromDisk();

let cachedTransporter = null;
let isRealTransporter = false;

export const getMailTransporter = async () => {
  if (cachedTransporter) return { transporter: cachedTransporter, isReal: isRealTransporter };

  loadEnvFromDisk();

  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || '').trim();
  // Strip spaces if user provided a 16-character Google App Password with spaces (e.g. "abcd efgh ijkl mnop")
  const pass = rawPass.replace(/\s+/g, '');

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

  // 2. Fallback to Ethereal ephemeral test account for dev/testing when no real credentials provided
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

export const verifyEmailService = async () => {
  const { transporter, isReal } = await getMailTransporter();
  if (!transporter) {
    return { success: false, isReal: false, message: 'No email transporter available.' };
  }
  try {
    await transporter.verify();
    return { 
      success: true, 
      isReal, 
      user: process.env.SMTP_USER || process.env.GMAIL_USER || 'test account',
      message: isReal ? 'Real Gmail SMTP connected & verified successfully!' : 'Ethereal dev preview active.'
    };
  } catch (err) {
    return { success: false, isReal, message: err.message };
  }
};

export const sendRequestMatchEmail = async ({ requester_email, requester_name, item_name, listing, originUrl }) => {
  if (!requester_email || !listing || !listing.title) {
    throw new Error('Missing required parameters for email notification.');
  }

  const subject = `🎒 [notoLX] Great news! "${listing.title}" is now available on campus!`;
  const textContent = `Hi ${requester_name || 'Student'},\n\nYou recently requested "${item_name}" on notoLX.\n\nA fellow student just uploaded a matching item for sale:\n- Item: ${listing.title}\n- Price: ₹${listing.price}\n- Campus Location: ${listing.campus_location || 'Campus'}\n\nKindly check it out on notoLX (Campus Second-Hand Marketplace) before it gets reserved!\n\nBest regards,\nnotoLX Team @ Thapar Institute`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px 16px; background-color: #F3E6DD;">
      <div style="background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #D8CCC0; box-shadow: 0 4px 18px rgba(34, 22, 22, 0.08);">
        
        <!-- Header -->
        <div style="background-color: #5E2424; padding: 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">🎒 notoLX</h1>
          <p style="color: #EBDDCE; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">Thapar Institute of Engineering & Technology • @thapar.edu</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px;">
          <h2 style="color: #221616; margin-top: 0; font-size: 18px; font-weight: 700;">Great news, ${requester_name || 'fellow student'}! 🎉</h2>
          <p style="color: #5C4A4A; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
            You posted a campus request for <strong style="color: #221616;">"${item_name}"</strong>. A fellow student just listed a matching item on <strong>notoLX</strong>:
          </p>

          <!-- Listing Card -->
          <div style="background-color: #FAF4ED; border: 1px solid #D8CCC0; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 17px; font-weight: 800; color: #221616;">${listing.title}</div>
            <div style="font-size: 20px; font-weight: 800; color: #5E2424; margin-top: 6px;">₹${listing.price}</div>
            <div style="font-size: 13px; color: #5C4A4A; margin-top: 8px;">📍 Campus Pickup: <strong style="color: #221616;">${listing.campus_location || 'Campus Quad'}</strong></div>
            ${listing.condition ? `<div style="font-size: 13px; color: #5C4A4A; margin-top: 4px;">Condition: <strong style="color: #221616;">${listing.condition}</strong></div>` : ''}
          </div>

          <p style="color: #5C4A4A; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
            Log into <strong>notoLX</strong> to start a direct campus chat with the seller and reserve it before someone else does!
          </p>

          <div style="text-align: center; margin: 24px 0 8px 0;">
            <a href="${originUrl || 'https://notolx.thapar.edu'}" style="background-color: #5E2424; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: 0.2px;">
              Open notoLX & View Listing →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #FAF4ED; border-top: 1px solid #D8CCC0; padding: 16px 20px; text-align: center; font-size: 12px; color: #7E6C6C;">
          This automated campus alert was sent to <strong style="color: #221616;">${requester_email}</strong> because of an active item request on notoLX.
        </div>
      </div>
    </div>
  `;

  const { transporter, isReal } = await getMailTransporter();
  let previewUrl = null;

  if (transporter) {
    const senderEmail = process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply.notolx@gmail.com';
    const fromAddress = `"notoLX Campus Marketplace" <${senderEmail}>`;

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

    console.log(`📧 [EMAIL ${isReal ? 'DELIVERED TO REAL INBOX' : 'TEST PREVIEW'}] To: ${requester_email} | Subject: ${subject}`);
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
