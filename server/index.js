import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { students: [], listings: [], conversations: [], reviews: [] };
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
    server: 'notOLX Thapar Campus Backend',
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

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 notOLX Express Backend Server running on http://localhost:${PORT}`);
  console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📌 Campus API: http://localhost:${PORT}/api/listings`);
});
