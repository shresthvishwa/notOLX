import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleSignInModal } from './GoogleSignInModal';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  IndianRupee, 
  MapPin,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { MOCK_LISTINGS } from '../../data/mockData';

export const LandingPage = ({ onExploreMarketplace }) => {
  const { theme, toggleTheme } = useApp();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Gothic Noir Navbar */}
      <header style={{
        padding: '1.2rem 2rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={28} color="var(--text-main)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              notOLX
            </span>
            <span style={{ 
              backgroundColor: 'var(--noir-charcoal)', 
              color: 'var(--text-main)', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              padding: '0.2rem 0.6rem', 
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)'
            }}>
              @thapar.edu
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Light / Dark Mode Toggle */}
            <button 
              className="btn btn-secondary btn-sm"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              style={{ padding: '0.55rem' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--text-main)" />}
            </button>

            <button 
              className="btn btn-primary"
              onClick={() => setIsGoogleModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 1.5rem 4rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--noir-charcoal)',
          color: 'var(--noir-silver)',
          border: '1px solid var(--border-color)',
          fontSize: '0.82rem',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <ShieldCheck size={16} color="var(--noir-silver)" />
          <span>THAPAR UNIVERSITY EXCLUSIVE</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.2rem',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
          maxWidth: '850px'
        }}>
          Campus Second-Hand Marketplace for <span style={{ color: 'var(--noir-taupe)', textDecoration: 'underline', textDecorationColor: 'var(--border-color)' }}>Thapar Students</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: 1.6
        }}>
          The Verified Student Marketplace for Thapar University. Buy and sell campus essentials—from textbooks to electronics—exclusively with verified <strong>@thapar.edu</strong> accounts.
        </p>

        {/* Primary CTA Button: Sign In with Google */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setIsGoogleModalOpen(true)}
            style={{
              padding: '0.9rem 2.2rem',
              fontSize: '1.05rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(209, 208, 208, 0.25)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
            </svg>
            <span>Sign in with Google (@thapar.edu)</span>
            <ArrowRight size={18} />
          </button>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Lock size={12} /> Google SSO domain check automatically enforced
          </span>
        </div>

      </section>

      {/* Feature Pillars Grid (Boxed) */}
      <section style={{
        padding: '2.5rem 1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '950px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--noir-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="var(--noir-silver)" />
            </div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>100% Verified TIET Students</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
              Strict Google OAuth email authentication. Only students holding an active `@thapar.edu` account can publish or purchase.
            </p>
          </div>

          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--noir-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="var(--noir-silver)" />
            </div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Real-Time Offer Negotiation</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
              Chat 1-on-1 directly with sellers. Propose custom price counter-offers and set safe campus meetup locations.
            </p>
          </div>

          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--noir-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="var(--noir-silver)" />
            </div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Safe Campus Meetup Spots</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
              Trade conveniently at recognizable campus landmarks like COS Canteen, Nava Nalanda Library Plaza, and Hostel J.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--noir-black)',
        padding: '2rem 1rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--noir-taupe)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--noir-silver)' }}>
            <Building2 size={18} /> notOLX • Thapar University Marketplace
          </div>
          <div>
            Built exclusively for TIET Students (@thapar.edu) • Gothic Noir Aesthetic
          </div>
        </div>
      </footer>

      {/* Google Auth Modal */}
      <GoogleSignInModal 
        isOpen={isGoogleModalOpen} 
        onClose={() => setIsGoogleModalOpen(false)}
        onAuthenticated={() => {
          if (onExploreMarketplace) onExploreMarketplace();
        }}
      />
    </div>
  );
};
