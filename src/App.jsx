import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/Landing/LandingPage';
import { Navbar } from './components/Common/Navbar';
import { FilterBar } from './components/Marketplace/FilterBar';
import { ProductCard } from './components/Marketplace/ProductCard';
import { ProductDetailModal } from './components/Product/ProductDetailModal';
import { CreateEditListingModal } from './components/Product/CreateEditListingModal';
import { ChatModal } from './components/Chat/ChatModal';
import { ReviewModal } from './components/Reviews/ReviewModal';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { ToastContainer } from './components/Common/ToastContainer';
import { 
  Building2, 
  PlusCircle, 
  ShieldCheck, 
  SearchX, 
  GraduationCap, 
  MessageSquare, 
  Star,
  ArrowLeft
} from 'lucide-react';

const MarketplaceView = ({ onBackToLanding }) => {
  const { 
    listings, 
    setIsCreateListingOpen, 
    searchQuery, 
    setSelectedCategory, 
    setSelectedCondition,
    currentUser
  } = useApp();

  return (
    <div className="app-container">
      {/* Navbar with back button option */}
      <Navbar />

      <main className="main-content">
        {/* Navigation Breadcrumb / Landing toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onBackToLanding}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={14} />
            <span>Landing Page</span>
          </button>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            {currentUser ? (
              <>Logged in as: <strong style={{ color: 'var(--text-main)' }}>{currentUser.full_name}</strong> ({currentUser.email})</>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Not Signed In • Click "Sign In" to access full marketplace features</span>
            )}
          </div>
        </div>

        {/* Hero Banner / Campus Welcome Card */}
        <div style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--hero-bg)',
          color: 'var(--hero-text)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, margin: 0, color: '#ffffff' }}>
              Your Trusted Peer-to-Peer Campus Exchange
            </h1>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreateListingOpen(true)}
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.95rem'
            }}
          >
            <PlusCircle size={20} />
            <span>Post a Listing</span>
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Product Cards Grid */}
        {listings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            marginTop: '1rem'
          }}>
            <SearchX size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--noir-silver)' }}>
              No campus listings found
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {searchQuery ? `No items matching "${searchQuery}"` : 'Try clearing your category or condition filters'}
            </p>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {listings.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}

        {/* How it Works / Trust Pillars */}
        <div style={{
          marginTop: '3.5rem',
          padding: '2rem 1.5rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <ShieldCheck size={28} color="var(--noir-silver)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.2rem', color: 'var(--noir-silver)' }}>Google @thapar.edu Auth</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Only students with valid @thapar.edu Google accounts can buy and sell.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <MessageSquare size={28} color="var(--noir-silver)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.2rem', color: 'var(--noir-silver)' }}>Safe 1-on-1 Campus Chat</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Propose counter-offers and arrange meetups at COS Canteen or Central Library.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <Star size={28} color="var(--noir-silver)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.2rem', color: 'var(--noir-silver)' }}>Student Ratings & Reviews</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Rate traders after each transaction to build campus trust and reputation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductDetailModal />
      <CreateEditListingModal />
      <ChatModal />
      <ReviewModal />
      <AuthModal />
      <ProfileModal />
      <ToastContainer />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem 1rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--noir-silver)' }}>
            <Building2 size={18} /> notOLX • Thapar University Marketplace
          </div>
          <div>
            Built for TIET Students (@thapar.edu) • Gothic Noir Aesthetic
          </div>
        </div>
      </footer>
    </div>
  );
};

const MainRouter = () => {
  const { currentUser, viewMode, setViewMode } = useApp();

  return (
    <>
      {viewMode === 'landing' || !currentUser ? (
        <LandingPage onExploreMarketplace={() => setViewMode('marketplace')} />
      ) : (
        <MarketplaceView onBackToLanding={() => setViewMode('landing')} />
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
