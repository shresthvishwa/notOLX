import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleSignInModal } from './GoogleSignInModal';
import { 
  Building2, 
  Lock, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export const LandingPage = ({ onExploreMarketplace }) => {
  const { theme, toggleTheme, addToast } = useApp();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F3E6DD',
      backgroundImage: `url('/landing-bg-clean.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      color: '#221616',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Top Navigation Bar */}
      <header style={{
        padding: '1.5rem 2.5rem',
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        zIndex: 20
      }}>
        
        {/* Left: Brand Logo & Domain Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }} 
            onClick={() => setActiveTab('Home')}
          >
            <Building2 size={24} strokeWidth={2.2} color="#221616" />
            <span style={{
              fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#221616',
              letterSpacing: '-0.02em'
            }}>
              notoLX
            </span>
          </div>

          <span style={{
            border: '1px solid rgba(34, 22, 22, 0.2)',
            backgroundColor: 'rgba(34, 22, 22, 0.05)',
            color: '#342525',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.22rem 0.68rem',
            borderRadius: '9999px',
            letterSpacing: '-0.01em'
          }}>
            @thapar.edu
          </span>
        </div>

        {/* Center: Pill Navigation Menu */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {['Home', 'Browse', 'Sell', 'About'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'Browse') {
                    if (onExploreMarketplace) onExploreMarketplace();
                  } else if (tab === 'Sell') {
                    setIsGoogleModalOpen(true);
                  } else if (tab === 'About') {
                    addToast('notoLX: The verified peer-to-peer marketplace exclusively for Thapar University students (@thapar.edu)', 'info');
                  }
                }}
                style={{
                  backgroundColor: isActive ? '#1A1616' : 'transparent',
                  color: isActive ? '#ffffff' : '#221616',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: isActive ? '0.48rem 1.45rem' : '0.48rem 1.15rem',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#221616';
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Google Sign-In Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid rgba(34, 22, 22, 0.22)',
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#221616',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#221616" />}
          </button>

          {/* Continue with Google button */}
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            style={{
              backgroundColor: '#1A1616',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.55rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(26, 22, 22, 0.18)',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2c2424';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1616';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </header>

      {/* Main Hero Center Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '880px',
        margin: '0 auto',
        width: '100%',
        zIndex: 10
      }}>

        {/* Framed Title Block with Corner Brackets */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          maxWidth: '740px',
          padding: '0.5rem 1.5rem'
        }}>
          {/* Top-Left Corner Bracket ┌ */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            left: '-12px',
            width: '26px',
            height: '26px',
            borderTop: '2.5px solid #5C4848',
            borderLeft: '2.5px solid #5C4848',
            pointerEvents: 'none'
          }} />

          {/* Center Painted Brush Banner with Restyled notoLX */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '0.85rem 3rem',
            marginBottom: '1.4rem',
            userSelect: 'none'
          }}>
            {/* Vector Textured Dry Brush Swatch */}
            <svg 
              viewBox="0 0 360 86" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                filter: 'drop-shadow(0 4px 12px rgba(95, 36, 36, 0.22))',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            >
              {/* Main Paint Body */}
              <path 
                d="M12 42C24 22 58 14 110 12C172 10 242 12 300 16C332 18 352 26 348 43C344 60 322 72 278 74C212 77 140 76 72 73C38 71 8 62 12 42Z" 
                fill="#5E2424"
              />
              {/* Upper Textured Bristle Sweep */}
              <path 
                d="M32 18C68 12 122 10 182 8C242 6 302 10 332 16C336 17 326 22 312 20C252 14 182 13 122 15C78 17 42 22 32 18Z" 
                fill="#501E1E" 
                opacity="0.88"
              />
              {/* Lower Dry Paint Texture */}
              <path 
                d="M24 66C66 73 138 76 212 77C278 78 328 74 342 69C346 70 332 77 302 79C226 82 146 81 66 77C30 75 18 69 24 66Z" 
                fill="#461A1A" 
                opacity="0.92"
              />
              {/* Side Paint Flecks */}
              <circle cx="6" cy="42" r="3.5" fill="#5E2424" opacity="0.65" />
              <circle cx="354" cy="40" r="3.5" fill="#5E2424" opacity="0.65" />
            </svg>

            {/* Stylized notoLX text */}
            <span style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 'clamp(2.3rem, 5vw, 3rem)',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.07em',
              transform: 'rotate(-1.8deg)',
              display: 'inline-block',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
              lineHeight: 1
            }}>
              notoLX
            </span>
          </div>

          {/* Main Headline: your campus, your marketplace. */}
          <h1 style={{
            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem, 6.2vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: '#261616',
            margin: 0
          }}>
            your campus,<br />
            your marketplace.
          </h1>

          {/* Bottom-Right Corner Bracket ┘ */}
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            width: '26px',
            height: '26px',
            borderBottom: '2.5px solid #5C4848',
            borderRight: '2.5px solid #5C4848',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2.2vw, 1.28rem)',
          fontWeight: 500,
          color: '#554242',
          marginTop: '1.35rem',
          marginBottom: '2.2rem',
          letterSpacing: '-0.01em',
          maxWidth: '620px'
        }}>
          Buy, sell, and exchange with fellow Thapar students.
        </p>

        {/* Big Black CTA Button: Continue with Google (@thapar.edu) */}
        <button
          onClick={() => setIsGoogleModalOpen(true)}
          style={{
            backgroundColor: '#161313',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem 2.5rem',
            fontSize: 'clamp(0.98rem, 2vw, 1.12rem)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(22, 19, 19, 0.22)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2c2424';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(22, 19, 19, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#161313';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(22, 19, 19, 0.22)';
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
          </svg>
          <span>Continue with Google (@thapar.edu)</span>
          <ArrowRight size={19} />
        </button>

        {/* Security Note */}
        <div style={{
          marginTop: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          color: '#5C4A4A',
          fontSize: '0.84rem',
          fontWeight: 500
        }}>
          <Lock size={13} color="#5C4A4A" />
          <span>Exclusively for verified <strong>@thapar.edu</strong> accounts.</span>
        </div>
      </main>

      {/* Subtle bottom spacing padding */}
      <div style={{ height: '3rem' }} />

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
