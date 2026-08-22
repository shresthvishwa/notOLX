import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Tag, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Eye, 
  MapPin, 
  Sparkles,
  PackageCheck,
  AlertCircle
} from 'lucide-react';

export const MySellingItemsModal = () => {
  const { 
    isMyListingsOpen, 
    setIsMyListingsOpen, 
    currentUser, 
    rawListings, 
    setIsCreateListingOpen, 
    setEditingListing, 
    deleteListing, 
    markListingStatus,
    setIsAuthOpen 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'reserved', 'sold'
  const [deletingId, setDeletingId] = useState(null);

  if (!isMyListingsOpen) return null;

  if (!currentUser) {
    return (
      <div className="modal-overlay" onClick={() => setIsMyListingsOpen(false)}>
        <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
          <AlertCircle size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sign In Required</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Please sign in with your @thapar.edu student account to view and manage your selling items.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setIsMyListingsOpen(false);
              setIsAuthOpen(true);
            }}
          >
            Sign In (@thapar.edu)
          </button>
        </div>
      </div>
    );
  }

  // Get items posted by current user
  const userListings = rawListings.filter(item => item.seller_id === currentUser.id);

  // Filtered by status tab
  const filteredListings = userListings.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const availableCount = userListings.filter(i => i.status === 'available').length;
  const reservedCount = userListings.filter(i => i.status === 'reserved').length;
  const soldCount = userListings.filter(i => i.status === 'sold').length;

  const handleEdit = (item) => {
    setEditingListing(item);
    setIsMyListingsOpen(false);
  };

  const handleDeleteConfirm = (id) => {
    deleteListing(id);
    setDeletingId(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsMyListingsOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tag size={20} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>My Selling Items</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Manage items you've posted for sale on campus
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsMyListingsOpen(false);
                setIsCreateListingOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={15} /> Post New Item
            </button>

            <button className="modal-close-btn" onClick={() => setIsMyListingsOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{userListings.length}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Posted</div>
            </div>

            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(5, 150, 105, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{availableCount}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Active / Available</div>
            </div>

            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{reservedCount}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>Reserved</div>
            </div>

            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6' }}>{soldCount}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase' }}>Deals Completed</div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
            >
              All Items ({userListings.length})
            </button>
            <button
              className={`pill-btn ${statusFilter === 'available' ? 'active' : ''}`}
              onClick={() => setStatusFilter('available')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
            >
              Available ({availableCount})
            </button>
            <button
              className={`pill-btn ${statusFilter === 'reserved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('reserved')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
            >
              Reserved ({reservedCount})
            </button>
            <button
              className={`pill-btn ${statusFilter === 'sold' ? 'active' : ''}`}
              onClick={() => setStatusFilter('sold')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
            >
              Sold ({soldCount})
            </button>
          </div>

          {/* Items List */}
          {filteredListings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)'
            }}>
              <Tag size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                No selling items in this tab
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {userListings.length === 0 
                  ? "You haven't listed any items for sale yet. Start selling your used calculators, textbooks, or cycles to fellow students!"
                  : "No items match the selected filter."}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsMyListingsOpen(false);
                  setIsCreateListingOpen(true);
                }}
              >
                <PlusCircle size={18} /> Post an Item for Sale
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredListings.map(item => {
                const img = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80';

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Item Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '240px' }}>
                      <img 
                        src={img} 
                        alt={item.title} 
                        style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.title}</h4>
                          
                          {/* Status Badge */}
                          {item.status === 'available' && (
                            <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                              AVAILABLE
                            </span>
                          )}
                          {item.status === 'reserved' && (
                            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                              RESERVED
                            </span>
                          )}
                          {item.status === 'sold' && (
                            <span style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                              SOLD
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{item.price}</span>
                          <span>• {item.condition}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <MapPin size={12} /> {item.campus_location}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Eye size={12} /> {item.views_count || 1} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {/* Mark Status Toggle */}
                      {item.status === 'available' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => markListingStatus(item.id, 'reserved')}
                          title="Mark as Reserved for a buyer"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Clock size={13} /> Reserve
                        </button>
                      )}

                      {item.status === 'reserved' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => markListingStatus(item.id, 'available')}
                          title="Make Available again"
                          style={{ fontSize: '0.78rem' }}
                        >
                          Unreserve
                        </button>
                      )}

                      {item.status !== 'sold' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => markListingStatus(item.id, 'sold')}
                          title="Mark deal as Sold"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <PackageCheck size={13} /> Mark Sold
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(item)}
                        title="Edit listing details"
                      >
                        <Edit3 size={14} /> Edit
                      </button>

                      {/* Delete */}
                      {deletingId === item.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteConfirm(item.id)}
                            style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setDeletingId(null)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDeletingId(item.id)}
                          title="Delete this listing"
                          style={{ color: '#dc2626' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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
