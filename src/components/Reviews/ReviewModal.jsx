import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, X, Check, Award, ShieldCheck } from 'lucide-react';

const SUGGESTED_TAGS = [
  'Punctual',
  'Item as described',
  'Great communicator',
  'Fair price',
  'Friendly seller',
  'Fast campus pickup'
];

export const ReviewModal = () => {
  const { 
    reviewPendingProduct, 
    setReviewPendingProduct, 
    currentUser, 
    allStudents, 
    submitReview 
  } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Item as described']);

  if (!reviewPendingProduct) return null;

  const isSeller = currentUser.id === reviewPendingProduct.seller_id;
  const revieweeId = isSeller ? 'usr_1' : reviewPendingProduct.seller_id; // Default partner
  const reviewee = allStudents.find(s => s.id === revieweeId) || {
    full_name: 'Student Partner',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    college_name: 'Stanford University'
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({
      product_id: reviewPendingProduct.id,
      reviewee_id: revieweeId,
      rating,
      comment,
      tags: selectedTags
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setReviewPendingProduct(null)}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary)" />
            <h2 className="modal-title">Rate Your Campus Deal</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setReviewPendingProduct(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <img 
              src={reviewee.avatar_url} 
              alt={reviewee.full_name} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem auto' }}
            />
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{reviewee.full_name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Transaction for "{reviewPendingProduct.title}"
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div style={{ margin: '1.25rem 0' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              How was your experience trading with this student?
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(rating)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star 
                    size={32} 
                    fill={(hoverRating >= starVal) ? '#f59e0b' : 'none'} 
                    color={(hoverRating >= starVal) ? '#f59e0b' : 'var(--text-light)'} 
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.4rem' }}>
              {rating === 5 && 'Outstanding Student! 🌟🌟🌟🌟🌟'}
              {rating === 4 && 'Great Deal! 👍'}
              {rating === 3 && 'Average Experience'}
              {rating <= 2 && 'Needs Improvement'}
            </div>
          </div>

          {/* Tag Pills Selection */}
          <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Positive Feedback Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
              {SUGGESTED_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Comment Text Area */}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Review Comment (Optional)</label>
            <textarea 
              rows={3}
              className="form-textarea"
              placeholder="Write a brief note to help other students on campus..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setReviewPendingProduct(null)}
              style={{ flex: 1 }}
            >
              Skip
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <Check size={16} />
              <span>Submit Campus Review</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
