import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  IndianRupee, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Share2
} from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    activeProductDetail, 
    setActiveProductDetail, 
    currentUser, 
    allStudents, 
    startOrOpenChat,
    setEditingListing,
    deleteListing,
    markListingStatus,
    reviews,
    addToast
  } = useApp();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!activeProductDetail) return null;

  const isOwner = currentUser && (
    currentUser.id === product.seller_id || 
    (currentUser.email && product.seller_email && currentUser.email.toLowerCase() === product.seller_email.toLowerCase())
  );
  const seller = isOwner ? currentUser : (
    allStudents.find(s => s.id === product.seller_id || (s.email && product.seller_email && s.email.toLowerCase() === product.seller_email.toLowerCase())) || currentUser || { full_name: product.seller_name || 'Campus Student' }
  );
  const sellerReviews = reviews.filter(r => r.reviewee_id === seller.id);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Listing link copied to clipboard!', 'info');
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveProductDetail(null)}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              fontWeight: 800, 
              fontSize: '0.75rem', 
              padding: '0.2rem 0.6rem', 
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase'
            }}>
              {product.category}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Posted {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="modal-close-btn" onClick={handleShare} title="Share listing">
              <Share2 size={18} />
            </button>
            <button className="modal-close-btn" onClick={() => setActiveProductDetail(null)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body - Two Column Layout on Desktop */}
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Image Viewer */}
          <div>
            <div style={{
              width: '100%',
              height: '320px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-input)',
              position: 'relative'
            }}>
              <img 
                src={images[selectedImgIndex]} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.status !== 'available' && (
                <div className="status-overlay">
                  {product.status === 'sold' ? 'SOLD OUT' : 'RESERVED'}
                </div>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImgIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Pickup Location Map Box */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Campus Pickup Spot</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{product.campus_location}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Seller Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    ₹{product.original_price.toFixed(2)}
                  </span>
                )}
                <span className={`condition-badge condition-${product.condition.toLowerCase().replace(' ', '-')}`} style={{ position: 'static', marginLeft: 'auto' }}>
                  {product.condition}
                </span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem' }}>
                {product.title}
              </h2>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

            {/* Seller Trust Summary Card */}
            <div style={{
              padding: '0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={seller.avatar_url} 
                  alt={seller.full_name} 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{seller.full_name}</span>
                    <ShieldCheck size={16} color="var(--primary)" title="Verified Student" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {seller.college_name} • {seller.dorm_block}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>
                    <Star size={16} fill="#f59e0b" />
                    <span>{seller.rating_avg}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    {seller.rating_count || 5} campus reviews
                  </div>
                </div>
              </div>

              {sellerReviews.length > 0 && (
                <div style={{ 
                  fontSize: '0.78rem', 
                  fontStyle: 'italic', 
                  color: 'var(--text-muted)', 
                  backgroundColor: 'var(--bg-card)', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)' 
                }}>
                  "{sellerReviews[0].comment}"
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {!isOwner ? (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                    onClick={() => {
                      setActiveProductDetail(null);
                      startOrOpenChat(product);
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>Chat with Seller</span>
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%' }}
                    onClick={() => {
                      setActiveProductDetail(null);
                      startOrOpenChat(product);
                    }}
                  >
                    <IndianRupee size={18} />
                    <span>Make an Offer</span>
                  </button>
                </>
              ) : (
                /* Owner Actions */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Seller Controls
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {product.status !== 'reserved' ? (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => markListingStatus(product.id, 'reserved')}
                      >
                        <Clock size={14} /> Mark Reserved
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => markListingStatus(product.id, 'available')}
                      >
                        <CheckCircle2 size={14} /> Mark Available
                      </button>
                    )}

                    {product.status !== 'sold' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => markListingStatus(product.id, 'sold')}
                      >
                        <CheckCircle2 size={14} /> Mark Sold
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setActiveProductDetail(null);
                        setEditingListing(product);
                      }}
                    >
                      <Edit3 size={14} /> Edit Details
                    </button>

                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                          deleteListing(product.id);
                        }
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
