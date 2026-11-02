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
import { MySellingItemsModal } from './components/Product/MySellingItemsModal';
import { CreateItemRequestModal } from './components/Requests/CreateItemRequestModal';
import { CampusRequestsModal } from './components/Requests/CampusRequestsModal';
import { ToastContainer } from './components/Common/ToastContainer';
import { 
  Building2, 
  PlusCircle, 
  ShieldCheck, 
  SearchX, 
  GraduationCap, 
  MessageSquare, 
  Star,
  ArrowLeft,
  BellPlus
} from 'lucide-react';

const MarketplaceView = ({ onBackToLanding }) => {
  const { 
    listings, 
    setIsCreateListingOpen, 
    searchQuery, 
    setSelectedCategory, 
    setSelectedCondition,
    currentUser,
    setIsRequestModalOpen,
    setPrefilledRequestQuery
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
          <div style={{ maxWidth: '650px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.4rem', color: '#ffffff' }}>
              Your Trusted Peer-to-Peer Campus Exchange
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--hero-muted)', lineHeight: 1.5, margin: 0 }}>
              Save money, declutter your room, and get what you need for the semester directly from fellow students.
            </p>
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              No campus listings found
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {searchQuery ? `No items matching "${searchQuery}"` : 'Try clearing your category or condition filters'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setPrefilledRequestQuery(searchQuery || '');
                  setIsRequestModalOpen(true);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <BellPlus size={16} />
                <span>{searchQuery ? `Request "${searchQuery}" on Campus` : 'Post a Campus Item Request'}</span>
              </button>
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
          padding: '2rem 1.75rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(94, 36, 36, 0.08)',
              border: '1px solid rgba(94, 36, 36, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} color="#5E2424" />
            </div>
            <div>
              <h4 style={{ 
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, 
                fontSize: '1rem', 
                marginBottom: '0.25rem', 
                color: 'var(--text-main)' 
              }}>
                Google @thapar.edu Auth
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#554242', lineHeight: 1.45, margin: 0 }}>
                Only students with valid @thapar.edu Google accounts can buy and sell.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(94, 36, 36, 0.08)',
              border: '1px solid rgba(94, 36, 36, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MessageSquare size={24} color="#5E2424" />
            </div>
            <div>
              <h4 style={{ 
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, 
                fontSize: '1rem', 
                marginBottom: '0.25rem', 
                color: 'var(--text-main)' 
              }}>
                Safe 1-on-1 Campus Chat
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#554242', lineHeight: 1.45, margin: 0 }}>
                Propose counter-offers and arrange meetups at COS Canteen or Central Library.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(94, 36, 36, 0.08)',
              border: '1px solid rgba(94, 36, 36, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Star size={24} color="#5E2424" />
            </div>
            <div>
              <h4 style={{ 
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, 
                fontSize: '1rem', 
                marginBottom: '0.25rem', 
                color: 'var(--text-main)' 
              }}>
                Student Ratings & Reviews
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#554242', lineHeight: 1.45, margin: 0 }}>
                Rate traders after each transaction to build campus trust and reputation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductDetailModal />
      <CreateEditListingModal />
      <MySellingItemsModal />
      <ChatModal />
      <ReviewModal />
      <AuthModal />
      <ProfileModal />
      <CreateItemRequestModal />
      <CampusRequestsModal />
      <ToastContainer />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        padding: '2rem 1rem',
        textAlign: 'center',
        marginTop: '3.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
            <Building2 size={19} color="#5E2424" />
            <span><strong style={{ color: '#5E2424' }}>notoLX</strong> • Thapar University Marketplace</span>
          </div>
          <div style={{ color: '#665252', fontSize: '0.84rem' }}>
            Built for TIET Students (@thapar.edu) • Vintage Campus Marketplace
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
