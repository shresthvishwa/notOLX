import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Star, Eye, Trash2, User } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { setActiveProductDetail, allStudents, currentUser, deleteListing } = useApp();

  const isMine = currentUser && (
    currentUser.id === product.seller_id || 
    (currentUser.email && product.seller_email && currentUser.email.toLowerCase() === product.seller_email.toLowerCase())
  );

  const seller = isMine ? currentUser : (
    allStudents.find(s => s.id === product.seller_id || (s.email && product.seller_email && s.email.toLowerCase() === product.seller_email.toLowerCase())) || {
      full_name: product.seller_name || 'Campus Student',
      rating_avg: 5.0,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    }
  );

  const getConditionClass = (cond) => {
    switch (cond) {
      case 'Like New': return 'condition-like-new';
      case 'Excellent': return 'condition-excellent';
      case 'Good': return 'condition-good';
      default: return 'condition-fair';
    }
  };

  return (
    <div 
      className="product-card"
      onClick={() => setActiveProductDetail(product)}
      style={{ position: 'relative' }}
    >
      {/* Product Image Container */}
      <div className="card-img-wrapper">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'} 
          alt={product.title}
          className="card-img"
          loading="lazy"
        />

        {/* Condition Badge */}
        <span className={`condition-badge ${getConditionClass(product.condition)}`}>
          {product.condition}
        </span>

        {/* "Posted by You" Badge */}
        {isMine && (
          <span style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            zIndex: 2
          }}>
            <User size={10} /> Posted by You
          </span>
        )}

        {/* Status Overlay if Reserved/Sold */}
        {product.status !== 'available' && (
          <div className="status-overlay">
            {product.status === 'sold' ? 'SOLD OUT' : 'RESERVED'}
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="card-body">
        <div className="card-price-row">
          <div>
            <span className="card-price">₹{product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="card-original-price">₹{product.original_price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Views count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
            <Eye size={12} />
            <span>{product.views_count || 12}</span>
          </div>
        </div>

        <h3 className="card-title">{product.title}</h3>

        {/* Campus Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <MapPin size={13} color="var(--primary)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.campus_location}
          </span>
        </div>

        {/* Seller Info & Rating Footer */}
        <div className="card-meta" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: 0 }}>
            <img 
              src={seller.avatar_url} 
              alt={seller.full_name} 
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 700, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isMine ? `You (${seller.full_name.split(' ')[0]})` : seller.full_name.split(' ')[0]}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, color: '#f59e0b', fontSize: '0.78rem' }}>
              <Star size={12} fill="#f59e0b" />
              <span>{seller.rating_avg || 5.0}</span>
            </div>

            {isMine && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete your listing "${product.title}" from campus marketplace?`)) {
                    deleteListing(product.id);
                  }
                }}
                style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '4px' }}
                title="Delete your posted item"
              >
                <Trash2 size={11} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
