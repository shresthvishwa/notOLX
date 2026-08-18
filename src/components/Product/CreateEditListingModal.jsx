import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Plus, Image as ImageIcon, Camera, Check } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

const PRESET_IMAGES = [
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tech Mouse', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lab Coat', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mini Fridge', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80' }
];

export const CreateEditListingModal = () => {
  const { 
    isCreateListingOpen, 
    setIsCreateListingOpen, 
    editingListing, 
    setEditingListing,
    addListing, 
    updateListing,
    currentUser
  } = useApp();

  const isOpen = isCreateListingOpen || Boolean(editingListing);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    category: 'calculators',
    condition: 'Like New',
    campus_location: '',
    imageUrlInput: ''
  });

  const [imagesList, setImagesList] = useState([]);

  useEffect(() => {
    if (editingListing) {
      setFormData({
        title: editingListing.title || '',
        description: editingListing.description || '',
        price: editingListing.price || '',
        original_price: editingListing.original_price || '',
        category: editingListing.category || 'calculators',
        condition: editingListing.condition || 'Like New',
        campus_location: editingListing.campus_location || '',
        imageUrlInput: ''
      });
      setImagesList(editingListing.images || []);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        original_price: '',
        category: 'calculators',
        condition: 'Like New',
        campus_location: `${currentUser?.dorm_block || 'Main Quad'} / Green Library`,
        imageUrlInput: ''
      });
      setImagesList([]);
    }
  }, [editingListing, isCreateListingOpen, currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsCreateListingOpen(false);
    setEditingListing(null);
  };

  const handleAddImageUrl = (urlToAdd) => {
    const url = urlToAdd || formData.imageUrlInput;
    if (url && url.trim()) {
      setImagesList(prev => [...prev, url.trim()]);
      setFormData(prev => ({ ...prev, imageUrlInput: '' }));
    }
  };

  const handleRemoveImage = (index) => {
    setImagesList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please provide item name and price');
      return;
    }

    const payload = {
      ...formData,
      images: imagesList.length > 0 ? imagesList : [PRESET_IMAGES[0].url]
    };

    if (editingListing) {
      updateListing(editingListing.id, payload);
    } else {
      addListing(payload);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--primary)" />
            <h2 className="modal-title">
              {editingListing ? 'Edit Campus Listing' : 'Sell an Item on Campus'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., TI-84 Plus Calculator, Firefox Cycle, Physics Textbook..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Category & Condition Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition *</label>
              <select 
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
              >
                <option value="Like New">Like New (Unused / Boxed)</option>
                <option value="Excellent">Excellent (Minor cosmetic wear)</option>
                <option value="Good">Good (Fully functional)</option>
                <option value="Fair">Fair (Heavy use, lower price)</option>
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input 
                type="number" 
                step="0.5"
                min="1"
                className="form-input"
                placeholder="450.00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Retail Price (₹)</label>
              <input 
                type="number" 
                step="0.5"
                className="form-input"
                placeholder="120.00 (Optional)"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
              />
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label">Campus Pickup Location *</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Rinconada Dorm / Green Library Plaza"
              value={formData.campus_location}
              onChange={(e) => setFormData(prev => ({ ...prev, campus_location: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Item Description</label>
            <textarea 
              rows={3}
              className="form-textarea"
              placeholder="Mention details like quarter used, inclusions (cables, locks, boxes), reason for selling..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Image Upload & Presets */}
          <div className="form-group">
            <label className="form-label">Product Images</label>
            
            {/* Quick Sample Image Presets */}
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Quick photo presets for fast testing:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAddImageUrl(preset.url)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Plus size={12} /> {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="url" 
                className="form-input"
                placeholder="Paste image URL (https://...)"
                value={formData.imageUrlInput}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrlInput: e.target.value }))}
              />
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => handleAddImageUrl()}
              >
                Add Image
              </button>
            </div>

            {/* Image Preview Thumbnails */}
            {imagesList.length > 0 && (
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                {imagesList.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingListing ? 'Update Listing' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
