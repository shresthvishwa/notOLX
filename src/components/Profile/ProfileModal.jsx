import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Star, Package, LogOut } from 'lucide-react';
import { ProductCard } from '../Marketplace/ProductCard';

export const ProfileModal = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    currentUser, 
    rawListings, 
    reviews,
    allStudents,
    handleLogout
  } = useApp();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'reviews'

  if (!isProfileOpen || !currentUser) return null;

  const userListings = rawListings.filter(item => item.seller_id === currentUser.id);
  const userReviews = reviews.filter(r => r.reviewee_id === currentUser.id);

  return (
    <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <h2 className="modal-title">Verified Student Profile</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setIsProfileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Profile Header Box */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <img 
              src={currentUser.avatar_url} 
              alt={currentUser.full_name} 
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentUser.full_name}</h3>
                <span style={{ 
                  backgroundColor: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: 'var(--radius-full)' 
                }}>
                  VERIFIED STUDENT
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {currentUser.college_name} • {currentUser.major}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                ID: {currentUser.college_id} • Dorm: {currentUser.dorm_block}
              </div>
            </div>

            {/* Rating & Log Out Box */}
            <div style={{ textAlign: 'center', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', justifyContent: 'center' }}>
                  <Star size={20} fill="#f59e0b" />
                  <span>{currentUser.rating_avg || 5.0}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentUser.rating_count || userReviews.length || 12} Campus Reviews
                </div>
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  handleLogout();
                  setIsProfileOpen(false);
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setActiveTab('listings')}
              style={{
                padding: '0.65rem 1.25rem',
                border: 'none',
                borderBottom: activeTab === 'listings' ? '3px solid var(--primary)' : '3px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'listings' ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Package size={16} /> My Campus Listings ({userListings.length})
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '0.65rem 1.25rem',
                border: 'none',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'reviews' ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Star size={16} /> Received Feedback ({userReviews.length})
            </button>
          </div>

          {/* Tab Content 1: My Listings */}
          {activeTab === 'listings' && (
            <div>
              {userListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No active listings yet. Click "Sell Item" to list your used books, calculators, cycles or gear!
                </div>
              ) : (
                <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  {userListings.map(item => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Received Feedback */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {userReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No reviews received yet. Complete a deal on campus to start receiving verified student ratings!
                </div>
              ) : (
                userReviews.map(rev => {
                  const reviewer = allStudents.find(s => s.id === rev.reviewer_id) || { full_name: 'Student Buyer', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' };

                  return (
                    <div 
                      key={rev.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={reviewer.avatar_url} alt="reviewer" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{reviewer.full_name}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 800 }}>
                          <Star size={14} fill="#f59e0b" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      {rev.comment && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{rev.comment}"
                        </div>
                      )}

                      {rev.tags && rev.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                          {rev.tags.map((tag, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
