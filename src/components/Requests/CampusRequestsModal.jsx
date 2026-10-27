import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Search, 
  PlusCircle, 
  Tag, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  Trash2, 
  Sparkles,
  User,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const CampusRequestsModal = () => {
  const { 
    itemRequests, 
    isCampusRequestsBoardOpen, 
    setIsCampusRequestsBoardOpen, 
    setIsRequestModalOpen, 
    currentUser, 
    deleteItemRequest, 
    fulfillItemRequest,
    setIsCreateListingOpen,
    setPrefilledRequestQuery
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isCampusRequestsBoardOpen) return null;

  const handleClose = () => {
    setIsCampusRequestsBoardOpen(false);
  };

  const handleFulfillBySelling = (request) => {
    setIsCampusRequestsBoardOpen(false);
    setIsCreateListingOpen(true);
  };

  const activeRequests = (itemRequests || []).filter(r => r.status !== 'cancelled');

  const filteredRequests = activeRequests.filter(req => {
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesSearch = !searchFilter.trim() || 
      req.item_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (req.description && req.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (req.requester_name && req.requester_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (req.campus_location && req.campus_location.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '820px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>Campus Requests & Wanted Items</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Items fellow Thapar students are actively looking to buy
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsCampusRequestsBoardOpen(false);
                setIsRequestModalOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={15} />
              <span>Post Request</span>
            </button>

            <button className="modal-close-btn" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ 
                  paddingLeft: '32px', 
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  WebkitTextFillColor: 'var(--text-main)',
                  caretColor: 'var(--primary)'
                }}
                placeholder="Search requested items, hostel, student..."
                value={searchFilter || ''}
                onChange={(e) => setSearchFilter(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* Category Dropdown */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', fontSize: '0.85rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body - Requests List */}
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1.25rem' }}>
          {filteredRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎒</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                No active requests found
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                {searchFilter ? `No requests matching "${searchFilter}".` : 'Be the first to post a request for an item you need on campus!'}
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCampusRequestsBoardOpen(false);
                  setIsRequestModalOpen(true);
                }}
              >
                <PlusCircle size={15} />
                <span>Create Campus Request</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
              {filteredRequests.map((req) => {
                const isOwn = currentUser?.id === req.requester_id || (currentUser?.email && req.requester_email && currentUser.email.toLowerCase() === req.requester_email.toLowerCase());

                return (
                  <div
                    key={req.id}
                    style={{
                      padding: '1rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    {/* Top Row: Title + Budget + Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            {req.item_name}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            textTransform: 'capitalize'
                          }}>
                            {req.category || 'Item'}
                          </span>
                          {req.status === 'fulfilled' && (
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981'
                            }}>
                              ✓ Fulfilled
                            </span>
                          )}
                        </div>

                        {req.description && (
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                            "{req.description}"
                          </p>
                        )}
                      </div>

                      {/* Budget Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Willing to pay</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {req.max_budget ? `₹${parseFloat(req.max_budget).toFixed(2)}` : 'Negotiable'}
                        </div>
                      </div>
                    </div>

                    {/* Meta Row: Requester & Location */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.65rem',
                      marginTop: '0.2rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          <User size={13} color="var(--primary)" />
                          <span>{req.requester_name}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 500 }}>
                            (@thapar.edu)
                          </span>
                        </span>

                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} color="var(--primary)" />
                          <span>{req.campus_location || 'Campus'}</span>
                        </span>

                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)' }}>
                          <Clock size={12} />
                          <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {isOwn ? (
                          <>
                            {req.status !== 'fulfilled' && (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => fulfillItemRequest(req.id)}
                                style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}
                                title="Mark as acquired"
                              >
                                <CheckCircle2 size={13} color="#10b981" />
                                <span>Got It</span>
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                if (confirm('Remove this item request?')) {
                                  deleteItemRequest(req.id);
                                }
                              }}
                              style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', color: '#ef4444' }}
                              title="Delete request"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleFulfillBySelling(req)}
                            style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <span>I Have This / Sell</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
