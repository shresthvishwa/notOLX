import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Star, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { setActiveProductDetail, allStudents } = useApp();

  const seller = allStudents.find(s => s.id === product.seller_id) || {
    full_name: 'Student Seller',
    rating_avg: 5.0,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

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
        <div className="card-meta">
          <img 
            src={seller.avatar_url} 
            alt={seller.full_name} 
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {(seller.full_name || 'Student Seller').split(' ')[0]}
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, color: '#f59e0b' }}>
            <Star size={12} fill="#f59e0b" />
            <span>{seller.rating_avg || 5.0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
