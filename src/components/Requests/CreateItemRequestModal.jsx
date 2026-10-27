import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BellPlus, Check } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const CreateItemRequestModal = () => {
  const { 
    isRequestModalOpen, 
    setIsRequestModalOpen, 
    addItemRequest, 
    currentUser, 
    prefilledRequestQuery,
    setPrefilledRequestQuery,
    setIsAuthOpen
  } = useApp();

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'all',
    max_budget: '',
    description: '',
    campus_location: ''
  });

  useEffect(() => {
    if (isRequestModalOpen) {
      setFormData({
        item_name: prefilledRequestQuery || '',
        category: 'all',
        max_budget: '',
        description: '',
        campus_location: currentUser?.dorm_block ? `${currentUser.dorm_block} / Main Quad` : 'COS Canteen / Library'
      });
    }
  }, [isRequestModalOpen, prefilledRequestQuery, currentUser]);

  if (!isRequestModalOpen) return null;

  const handleClose = () => {
    setIsRequestModalOpen(false);
    setPrefilledRequestQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    if (!formData.item_name.trim()) {
      alert('Please enter the item name you are looking for.');
      return;
    }

    addItemRequest({
      item_name: formData.item_name,
      category: formData.category,
      max_budget: formData.max_budget,
      description: formData.description,
      campus_location: formData.campus_location
    });

    handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <BellPlus size={20} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>Request an Item on Campus</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Notify campus sellers what you're looking to buy
              </div>
            </div>
          </div>

          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Email Alert Banner */}
          <div style={{
            padding: '0.75rem 0.9rem',
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.1rem' }}>✉️</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              <strong>Automated Campus Alert</strong>: As soon as any student lists this item for sale, you will instantly receive an email alert at <strong>{currentUser?.email || 'your @thapar.edu email'}</strong>!
            </div>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">Item You Are Looking For *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Casio FX-991CW Calculator, ED Drawing Board, Lab Coat, Cycle..."
              value={formData.item_name}
              onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
              required
              autoFocus
            />
          </div>

          {/* Category & Budget Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Budget (₹)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="0"
                  step="10"
                  className="form-input"
                  placeholder="e.g. 500"
                  value={formData.max_budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_budget: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label">Preferred Pickup Spot / Hostel</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hostel J / COS Canteen / Central Library"
                value={formData.campus_location}
                onChange={(e) => setFormData(prev => ({ ...prev, campus_location: e.target.value }))}
              />
            </div>
          </div>

          {/* Description / Specific Notes */}
          <div className="form-group">
            <label className="form-label">Specific Details & Requirements (Optional)</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="e.g. Need for 2nd semester maths. Good condition preferred. Needed urgently before Friday!"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} />
              <span>Broadcast Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
