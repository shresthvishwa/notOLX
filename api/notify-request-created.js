import { sendRequestConfirmationEmail } from '../server/emailService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { requester_email, requester_name, item_name, max_budget, campus_location } = req.body || {};

    if (!requester_email || !item_name) {
      return res.status(400).json({ error: 'Missing required parameters (requester_email, item_name).' });
    }

    const originUrl = req.headers.origin || req.headers.referer || 'https://notolx.thapar.edu';
    const result = await sendRequestConfirmationEmail({
      requester_email,
      requester_name,
      item_name,
      max_budget,
      campus_location,
      originUrl
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Vercel API error dispatching request confirmation:', err);
    return res.status(500).json({ error: 'Failed to send confirmation email', details: err.message });
  }
}
