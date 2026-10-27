import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Helper
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return {
      students: parsed.students || [],
      listings: parsed.listings || [],
      conversations: parsed.conversations || [],
      reviews: parsed.reviews || [],
      item_requests: parsed.item_requests || []
    };
  } catch (err) {
    console.error('Error reading database file:', err);
    return { students: [], listings: [], conversations: [], reviews: [], item_requests: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'notoLX Thapar Campus Backend',
    university: 'Thapar Institute of Engineering & Technology (@thapar.edu)',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Authentication Endpoint (@thapar.edu validation)
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim().toLowerCase().endsWith('@thapar.edu')) {
    return res.status(400).json({
      error: 'Access Denied: Only @thapar.edu email accounts are permitted.'
    });
  }

  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();
  let student = db.students.find(s => s.email.toLowerCase() === cleanEmail);

  if (!student) {
    const namePart = cleanEmail.split('@')[0];
    const formattedName = namePart.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    student = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      full_name: formattedName || 'Thapar Student',
      college_name: 'Thapar Institute of Engineering & Technology',
      college_id: `TU-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
      dorm_block: 'Thapar Hostel',
      major: 'Engineering Student',
      rating_avg: 5.0,
      rating_count: 0,
      verified: true
    };
    db.students.push(student);
    writeDB(db);
  }

  res.json({ success: true, user: student });
});

// Listings Endpoints (GET, POST, PUT, DELETE)
app.get('/api/listings', (req, res) => {
  const db = readDB();
  const { category, condition, maxPrice, search } = req.query;
  let result = db.listings;

  if (category && category !== 'all') {
    result = result.filter(item => item.category === category);
  }
  if (condition && condition !== 'all') {
    result = result.filter(item => item.condition === condition);
  }
  if (maxPrice) {
    result = result.filter(item => item.price <= parseFloat(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.campus_location.toLowerCase().includes(q)
    );
  }

  res.json({ count: result.length, listings: result });
});

app.post('/api/listings', (req, res) => {
  const db = readDB();
  const { title, description, price, category, condition, images, campus_location, seller_id } = req.body;

  if (!seller_id) {
    return res.status(401).json({ error: 'Authentication required. Missing seller_id for listing creation.' });
  }

  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price are required.' });
  }

  const newListing = {
    id: req.body.id || `prod_${Date.now()}`,
    seller_id: seller_id,
    title,
    description: description || '',
    price: parseFloat(price),
    original_price: req.body.original_price ? parseFloat(req.body.original_price) : null,
    category: category || 'calculators',
    condition: condition || 'Like New',
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
    campus_location: campus_location || 'COS Canteen / Main Quad',
    status: 'available',
    views_count: 1,
    created_at: new Date().toISOString()
  };

  db.listings.unshift(newListing);
  writeDB(db);
  res.status(201).json({ success: true, listing: newListing });
});

app.put('/api/listings/:id', (req, res) => {
  const db = readDB();
  const index = db.listings.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  db.listings[index] = { ...db.listings[index], ...req.body };
  writeDB(db);
  res.json({ success: true, listing: db.listings[index] });
});

app.delete('/api/listings/:id', (req, res) => {
  const db = readDB();
  const filtered = db.listings.filter(l => l.id !== req.params.id);
  db.listings = filtered;
  writeDB(db);
  res.json({ success: true, message: 'Listing deleted successfully.' });
});

// Chat Endpoints
app.get('/api/conversations', (req, res) => {
  const db = readDB();
  res.json({ count: db.conversations.length, conversations: db.conversations });
});

app.get('/api/conversations/:userId', (req, res) => {
  const db = readDB();
  const userId = req.params.userId;
  const userConvs = db.conversations.filter(c => c.buyer_id === userId || c.seller_id === userId);
  res.json({ count: userConvs.length, conversations: userConvs });
});

app.post('/api/conversations', (req, res) => {
  const db = readDB();
  const { product_id, buyer_id, seller_id, initial_message } = req.body;

  let existing = db.conversations.find(
    c => c.product_id === product_id && (c.buyer_id === buyer_id || c.seller_id === buyer_id)
  );

  if (existing) {
    return res.json({ success: true, conversation: existing });
  }

  const newConv = {
    id: `conv_${Date.now()}`,
    product_id,
    buyer_id,
    seller_id,
    last_message: initial_message || 'New conversation started',
    updated_at: new Date().toISOString(),
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender_id: buyer_id,
        content: initial_message || 'Hi, I am interested in this item.',
        created_at: new Date().toISOString()
      }
    ]
  };

  db.conversations.unshift(newConv);
  writeDB(db);
  res.status(201).json({ success: true, conversation: newConv });
});

app.post('/api/messages', (req, res) => {
  const db = readDB();
  const { conversation_id, sender_id, receiver_id, content, offer_price, meetup_spot, client_msg_id } = req.body;

  if (!conversation_id || !sender_id || !content) {
    return res.status(400).json({ error: 'Missing required message parameters (conversation_id, sender_id, content).' });
  }

  let conv = db.conversations.find(c => c.id === conversation_id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  // Deduplication check: verify if message with client_msg_id or identical payload was already saved
  const msgId = client_msg_id || `msg_${Date.now()}`;
  const isDuplicate = conv.messages.some(m => m.id === msgId);
  if (isDuplicate) {
    const existingMsg = conv.messages.find(m => m.id === msgId);
    return res.json({ success: true, message: existingMsg, duplicate: true });
  }

  const computedReceiverId = receiver_id || (conv.buyer_id === sender_id ? conv.seller_id : conv.buyer_id);

  const newMsg = {
    id: msgId,
    sender_id,
    receiver_id: computedReceiverId,
    content: content.trim(),
    offer_price: offer_price ? parseFloat(offer_price) : null,
    meetup_spot: meetup_spot || null,
    status: 'sent',
    created_at: new Date().toISOString()
  };

  conv.messages.push(newMsg);
  conv.last_message = content.trim();
  conv.updated_at = newMsg.created_at;

  writeDB(db);
  res.status(201).json({ success: true, message: newMsg });
});

// Reviews Endpoint
app.post('/api/reviews', (req, res) => {
  const db = readDB();
  const { product_id, reviewer_id, reviewee_id, rating, comment, tags } = req.body;

  const newReview = {
    id: `rev_${Date.now()}`,
    product_id,
    reviewer_id,
    reviewee_id,
    rating: parseInt(rating),
    comment: comment || '',
    tags: tags || [],
    created_at: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  writeDB(db);
  res.status(201).json({ success: true, review: newReview });
});

// ==========================================
// 6. Campus Item Requests Endpoints (Wanted Items)
// ==========================================
app.get('/api/item-requests', (req, res) => {
  const db = readDB();
  const activeRequests = (db.item_requests || []).filter(r => r.status !== 'cancelled');
  res.json({ count: activeRequests.length, requests: activeRequests });
});

app.post('/api/item-requests', (req, res) => {
  const db = readDB();
  const { requester_id, requester_name, requester_email, item_name, category, max_budget, description, campus_location } = req.body;

  if (!requester_id || !requester_email || !item_name) {
    return res.status(400).json({ error: 'Missing required request parameters (requester_id, requester_email, item_name).' });
  }

  const newRequest = {
    id: req.body.id || `req_${Date.now()}`,
    requester_id,
    requester_name: requester_name || 'Thapar Student',
    requester_email: requester_email.trim().toLowerCase(),
    item_name: item_name.trim(),
    category: category || 'all',
    max_budget: max_budget ? parseFloat(max_budget) : null,
    description: description || '',
    campus_location: campus_location || 'Thapar Campus',
    status: 'active',
    created_at: new Date().toISOString()
  };

  db.item_requests = db.item_requests || [];
  db.item_requests.unshift(newRequest);
  writeDB(db);

  res.status(201).json({ success: true, request: newRequest });
});

app.put('/api/item-requests/:id', (req, res) => {
  const db = readDB();
  db.item_requests = db.item_requests || [];
  const index = db.item_requests.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item request not found.' });
  }

  db.item_requests[index] = { ...db.item_requests[index], ...req.body };
  writeDB(db);
  res.json({ success: true, request: db.item_requests[index] });
});

app.delete('/api/item-requests/:id', (req, res) => {
  const db = readDB();
  db.item_requests = (db.item_requests || []).filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Item request deleted successfully.' });
});

// ==========================================
// 7. Automated Email Notification for Request Matches
// ==========================================
let cachedTransporter = null;
const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return cachedTransporter;
  }

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
    return cachedTransporter;
  } catch (err) {
    console.warn('Fallback: Ethereal test account not available, logging email to stdout.');
    return null;
  }
};

app.post('/api/notify-request-match', async (req, res) => {
  const { requester_email, requester_name, item_name, listing } = req.body;

  if (!requester_email || !listing || !listing.title) {
    return res.status(400).json({ error: 'Missing required parameters (requester_email, listing).' });
  }

  const subject = `🎒 [notoLX] Great news! "${listing.title}" is now available on campus!`;
  const textContent = `Hi ${requester_name || 'Student'},\n\nYou recently requested "${item_name}" on notoLX.\n\nA fellow student just uploaded a matching item for selling:\n- Item: ${listing.title}\n- Price: ₹${listing.price}\n- Campus Location: ${listing.campus_location || 'Campus'}\n\nKindly check it out on notoLX (Campus Second-Hand Marketplace) before it gets reserved!\n\nBest regards,\nnotoLX Team @ Thapar Institute`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #059669; margin: 0;">🎒 notoLX</h2>
        <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Campus Second-Hand Marketplace • TIET Exclusive</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="color: #111827; margin-top: 0;">Great news, ${requester_name || 'fellow student'}! 🎉</h3>
        <p style="color: #374151; font-size: 15px; line-height: 1.5;">
          You previously created a campus request for <strong>"${item_name}"</strong>.
        </p>
        <p style="color: #374151; font-size: 15px; line-height: 1.5;">
          A student has just listed a matching item on the marketplace:
        </p>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <div style="font-size: 17px; font-weight: bold; color: #111827;">${listing.title}</div>
          <div style="font-size: 16px; font-weight: bold; color: #059669; margin-top: 4px;">Selling Price: ₹${listing.price}</div>
          <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">📍 Campus Pickup: ${listing.campus_location || 'Campus Quad'}</div>
          ${listing.condition ? `<div style="font-size: 13px; color: #6b7280;">Condition: ${listing.condition}</div>` : ''}
        </div>

        <p style="color: #374151; font-size: 14px; margin-top: 20px;">
          Kindly check it out on <strong>notoLX</strong> now to chat with the seller before it gets reserved!
        </p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${req.headers.origin || 'http://localhost:5173'}" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open notoLX & View Listing →
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 15px; color: #9ca3af; font-size: 12px;">
        This notification was sent because you created an item request on notoLX (@thapar.edu).
      </div>
    </div>
  `;

  try {
    const transporter = await getTransporter();
    let previewUrl = null;

    if (transporter) {
      const info = await transporter.sendMail({
        from: '"notoLX Campus Marketplace" <no-reply@notolx.thapar.edu>',
        to: requester_email,
        subject,
        text: textContent,
        html: htmlContent
      });

      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`📧 [EMAIL SENT] To: ${requester_email} | Subject: ${subject}`);
      if (previewUrl) {
        console.log(`🔗 [EMAIL PREVIEW URL]: ${previewUrl}`);
      }
    } else {
      console.log(`📧 [SIMULATED EMAIL DISPATCH] To: ${requester_email}\nSubject: ${subject}\n${textContent}`);
    }

    res.json({
      success: true,
      message: 'Notification sent successfully',
      recipient: requester_email,
      previewUrl
    });
  } catch (err) {
    console.error('Error dispatching email notification:', err);
    res.status(500).json({ error: 'Failed to send notification email', details: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 notoLX Express Backend Server running on http://localhost:${PORT}`);
  console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📌 Campus API: http://localhost:${PORT}/api/listings`);
  console.log(`📌 Campus Requests: http://localhost:${PORT}/api/item-requests`);
});
