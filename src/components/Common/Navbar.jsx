import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  User, 
  ChevronDown, 
  Moon, 
  Sun,
  ShieldCheck,
  Sparkles,
  LogOut,
  LogIn
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    allStudents, 
    switchPersona, 
    searchQuery, 
    setSearchQuery, 
    setIsAuthOpen, 
    setIsCreateListingOpen, 
    setIsProfileOpen,
    setActiveChat,
    conversations,
    theme,
    toggleTheme,
    handleLogout
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  // Match conversations for current user by ID or Email (fallback to all conversations)
  const userConvs = currentUser ? conversations.filter(c => {
    if (!c) return false;
    const isBuyer = c.buyer_id === currentUser.id;
    const isSeller = c.seller_id === currentUser.id;
    const buyerStudent = allStudents.find(s => s.id === c.buyer_id);
    const sellerStudent = allStudents.find(s => s.id === c.seller_id);
    const emailMatch = (buyerStudent && buyerStudent.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
                       (sellerStudent && sellerStudent.email?.toLowerCase() === currentUser.email?.toLowerCase());
    return isBuyer || isSeller || emailMatch;
  }) : conversations;

  const activeUserConversations = userConvs.length > 0 ? userConvs : conversations;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setSearchQuery(''); }}>
            <Building2 size={26} color="var(--primary)" />
            <span>notOLX</span>
            <span className="brand-badge">@thapar.edu</span>
          </a>

          {/* College Campus Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
            <ShieldCheck size={14} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)' }}>TIET Campus Exclusive</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search Casio, cycles, textbooks, lab coats at Thapar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Controls & User Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sell Item CTA Button */}
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreateListingOpen(true)}
          >
            <PlusCircle size={18} />
            <span>Sell Item</span>
          </button>

          {/* Messages Notification Button & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
              style={{ position: 'relative' }}
              title="Campus Chat & Offers"
            >
              <MessageSquare size={18} />
              {activeUserConversations.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeUserConversations.length}
                </span>
              )}
            </button>

            {/* Conversations Dropdown List */}
            {isChatMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                zIndex: 60,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                width: '320px',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-input)'
                }}>
                  <span>Campus Messages ({activeUserConversations.length})</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Live</span>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {activeUserConversations.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      No active messages yet. Click "Chat with Seller" on any listing to negotiate!
                    </div>
                  ) : (
                    activeUserConversations.map(conv => {
                      const otherId = conv.buyer_id === currentUser.id ? conv.seller_id : conv.buyer_id;
                      const otherUser = allStudents.find(s => s.id === otherId) || { full_name: 'Thapar Trader', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader' };

                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setActiveChat(conv);
                            setIsChatMenuOpen(false);
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <img
                            src={otherUser.avatar_url}
                            alt={otherUser.full_name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{otherUser.full_name}</span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                              {conv.last_message}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Log Out Menu */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem' }}
              >
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser.full_name} 
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currentUser.full_name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {isPersonaMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  zIndex: 50,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '260px',
                  padding: '0.6rem'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0.3rem 0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={12} color="var(--primary)" /> Switch Student Persona
                  </div>

                  {allStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        switchPersona(student.id);
                        setIsPersonaMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: currentUser.id === student.id ? 'var(--primary-light)' : 'transparent',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '0.2rem'
                      }}
                    >
                      <img 
                        src={student.avatar_url} 
                        alt={student.full_name} 
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{student.full_name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.major}</span>
                      </div>
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.4rem 0' }}></div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsPersonaMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <User size={15} /> View My Profile & Listings
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setIsPersonaMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <ShieldCheck size={15} /> Student Verification / Login
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsPersonaMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#7f1d1d',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.35rem'
                    }}
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsAuthOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <LogIn size={15} /> Sign In (@thapar.edu)
            </button>
          )}

          {/* Light/Dark Mode Toggle */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            style={{ padding: '0.5rem' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--text-main)" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
