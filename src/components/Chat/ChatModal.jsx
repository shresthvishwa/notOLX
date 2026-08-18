import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  IndianRupee, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { MOCK_MEETUP_SPOTS } from '../../data/mockData';

export const ChatModal = () => {
  const { 
    activeChat, 
    setActiveChat, 
    conversations, 
    sendMessage, 
    currentUser, 
    allStudents, 
    rawListings,
    markListingStatus
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [selectedMeetupSpot, setSelectedMeetupSpot] = useState(MOCK_MEETUP_SPOTS[0]);
  const [showOfferWidget, setShowOfferWidget] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  if (!activeChat) return null;

  // Retrieve current active conversation details
  const conversation = conversations.find(c => c.id === activeChat.id) || activeChat;
  const product = rawListings.find(l => l.id === conversation.product_id) || {
    title: 'Campus Item',
    price: 0,
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80'],
    status: 'available'
  };

  const isSeller = currentUser.id === conversation.seller_id;
  const otherUserId = isSeller ? conversation.buyer_id : conversation.seller_id;
  const otherUser = allStudents.find(s => s.id === otherUserId) || {
    full_name: isSeller ? 'Student Buyer' : 'Student Seller',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    dorm_block: 'Campus Dorm'
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(conversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendOffer = () => {
    const offerVal = parseFloat(offerPriceInput);
    if (!offerVal || isNaN(offerVal)) return;

    const offerMsg = `Proposed Price Offer: ₹${offerVal.toFixed(2)} with pickup at ${selectedMeetupSpot}`;
    sendMessage(conversation.id, offerMsg, offerVal, selectedMeetupSpot);
    setOfferPriceInput('');
    setShowOfferWidget(false);
  };

  const userConversations = conversations.filter(
    c => c.buyer_id === currentUser.id || c.seller_id === currentUser.id
  );

  return (
    <div className="modal-overlay" onClick={() => setActiveChat(null)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Sidebar: Conversations List */}
        <div style={{
          width: '280px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={18} color="var(--primary)" />
            <span>Campus Messages</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {userConversations.map(conv => {
              const convProduct = rawListings.find(l => l.id === conv.product_id) || product;
              const convOtherId = conv.seller_id === currentUser.id ? conv.buyer_id : conv.seller_id;
              const convOtherUser = allStudents.find(s => s.id === convOtherId) || otherUser;
              const isSelected = conv.id === conversation.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveChat(conv)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--bg-card)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <img 
                    src={convProduct.images && convProduct.images[0] ? convProduct.images[0] : convOtherUser.avatar_url} 
                    alt="item" 
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {convOtherUser.full_name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>
                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {convProduct.title}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.last_message}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Chat Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
          
          {/* Active Chat Header */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={otherUser.avatar_url} 
                alt={otherUser.full_name} 
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 800, fontSize: '0.95rem' }}>
                  <span>{otherUser.full_name}</span>
                  <ShieldCheck size={14} color="var(--primary)" title="Verified Campus Student" />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{isSeller ? 'Buyer' : 'Seller'} • {otherUser.dorm_block || 'Thapar Campus'}</span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                    Live Realtime
                  </span>
                </div>
              </div>
            </div>

            {/* Product Summary Header Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.title}
              </span>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.88rem' }}>
                ₹{product.price?.toFixed(2)}
              </span>

              {isSeller && product.status === 'available' && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => markListingStatus(product.id, 'sold')}
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
                >
                  Confirm Sale
                </button>
              )}
            </div>

            <button className="modal-close-btn" onClick={() => setActiveChat(null)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            backgroundColor: 'var(--bg-app)'
          }}>
            <div style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-card)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              alignSelf: 'center',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Campus Verified Chat • Meet in safe public campus areas</span>
            </div>

            {conversation.messages && conversation.messages.map(msg => {
              const isMine = msg.sender_id === currentUser.id;

              return (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: isMine ? 'var(--primary)' : 'var(--bg-card)',
                    color: isMine ? '#ffffff' : 'var(--text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    border: isMine ? 'none' : '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    lineHeight: 1.4
                  }}>
                    {/* If message contains price offer details */}
                    {msg.offer_price && (
                      <div style={{
                        padding: '0.5rem',
                        marginBottom: '0.4rem',
                        backgroundColor: isMine ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: isMine ? '#ffffff' : 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <IndianRupee size={16} /> Offer Amount: ₹{msg.offer_price.toFixed(2)}
                        </div>
                        {msg.meetup_spot && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem', fontSize: '0.78rem' }}>
                            <MapPin size={14} /> Pickup: {msg.meetup_spot}
                          </div>
                        )}
                      </div>
                    )}

                    <span>{msg.content}</span>
                  </div>

                  <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.2rem', padding: '0 0.3rem' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Offer Widget Drawer */}
          {showOfferWidget && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              animation: 'slideUp 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={14} color="var(--primary)" /> Propose Price & Campus Meetup
                </span>
                <button className="modal-close-btn" onClick={() => setShowOfferWidget(false)}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Offer Amount (₹)</label>
                  <input 
                    type="number"
                    step="1"
                    className="form-input"
                    placeholder={`Original ₹${product.price}`}
                    value={offerPriceInput}
                    onChange={(e) => setOfferPriceInput(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Campus Meetup Spot</label>
                  <select
                    className="form-select"
                    value={selectedMeetupSpot}
                    onChange={(e) => setSelectedMeetupSpot(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem' }}
                  >
                    {MOCK_MEETUP_SPOTS.map((spot, idx) => (
                      <option key={idx} value={spot}>{spot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleSendOffer}
                style={{ alignSelf: 'flex-end' }}
              >
                Send Official Counter Offer
              </button>
            </div>
          )}

          {/* Text Message Input Bar */}
          <form 
            onSubmit={handleSendText}
            style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowOfferWidget(!showOfferWidget)}
              title="Make counter offer"
            >
              <IndianRupee size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem' }}>Offer</span>
            </button>

            <input 
              type="text" 
              className="form-input"
              placeholder="Type message to negotiate, arrange pickup..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <button type="submit" className="btn btn-primary">
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
