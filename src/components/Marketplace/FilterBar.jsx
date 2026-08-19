import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  Sparkles, 
  Calculator, 
  BookOpen, 
  Bike, 
  FlaskConical, 
  Home, 
  Dumbbell, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Calculator: Calculator,
  BookOpen: BookOpen,
  Bike: Bike,
  FlaskConical: FlaskConical,
  Home: Home,
  Dumbbell: Dumbbell
};

export const FilterBar = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedCondition, 
    setSelectedCondition,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    listings,
    searchQuery
  } = useApp();

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Category Pills Slider */}
      <div className="category-pills">
        {CATEGORIES.map(cat => {
          const IconComponent = ICON_MAP[cat.icon] || Sparkles;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              className={`pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <IconComponent size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginTop: '0.5rem'
      }}>
        {/* Results Counter & Search Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
            {listings.length}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
            {listings.length === 1 ? 'item available' : 'items available'}
          </span>
          {searchQuery && (
            <span style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              padding: '0.15rem 0.5rem', 
              borderRadius: 'var(--radius-full)' 
            }}>
              "{searchQuery}"
            </span>
          )}
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Condition Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="form-select"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="all">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Max Price:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>₹{priceRange.max}</span>
            <input
              type="range"
              min="10"
              max="50000"
              step="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
              style={{ width: '90px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
