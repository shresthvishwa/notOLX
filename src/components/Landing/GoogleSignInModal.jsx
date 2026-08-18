import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const GoogleSignInModal = ({ isOpen, onClose, onAuthenticated }) => {
  const { handleLogin, allStudents } = useApp();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreVerified = (email) => {
    setErrorMsg('');
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      handleLogin(email);
      onClose();
      if (onAuthenticated) onAuthenticated();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '460px', 
          backgroundColor: '#141212', 
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderColor: 'var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
            </svg>
            <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>Sign in with Google</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'var(--noir-charcoal)',
            color: 'var(--noir-silver)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--noir-taupe)',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={18} color="var(--noir-silver)" style={{ flexShrink: 0 }} />
            <span>Only <strong>@thapar.edu</strong> Google accounts are authorized for access.</span>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#7f1d1d',
              color: '#fca5a5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #991b1b',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Select Demo Accounts */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--noir-taupe)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Choose a Thapar Student Google Account:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {allStudents.map(student => (
                <button
                  key={student.id}
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => handleSelectPreVerified(student.email)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--noir-silver)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={student.avatar_url} alt="user" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{student.full_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{student.email}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--noir-taupe)" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
