import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';
import { signInWithGoogle, isThaparEmail, isSupabaseConfigured } from '../../lib/supabase';

export const GoogleSignInModal = ({ isOpen, onClose, onAuthenticated }) => {
  const { handleLogin, allStudents, addToast } = useApp();
  const [googleEmail, setGoogleEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleOAuthLogin = async () => {
    setErrorMsg('');
    if (isSupabaseConfigured) {
      setIsSigningIn(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setIsSigningIn(false);
        setErrorMsg(error.message || 'Google OAuth Sign-In failed.');
      }
    } else {
      // Prompt user to select/type their @thapar.edu email
      setErrorMsg('Please enter your @thapar.edu Google email address below or select a student account.');
    }
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    const email = googleEmail.trim().toLowerCase();

    if (!isThaparEmail(email)) {
      setErrorMsg('Access Denied: Only @thapar.edu Google email accounts are permitted on notOLX.');
      addToast('Access Denied: Only @thapar.edu emails are allowed.', 'error');
      return;
    }

    setErrorMsg('');
    setIsSigningIn(true);

    setTimeout(() => {
      setIsSigningIn(false);
      const success = handleLogin(email);
      if (success) {
        onClose();
        if (onAuthenticated) onAuthenticated();
      } else {
        setErrorMsg('Access Denied: Only @thapar.edu accounts are permitted.');
      }
    }, 600);
  };

  const handleSelectPreVerified = (email) => {
    if (!isThaparEmail(email)) {
      setErrorMsg('Access Denied: Only @thapar.edu Google email accounts are permitted.');
      return;
    }
    setGoogleEmail(email);
    setErrorMsg('');
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      handleLogin(email);
      onClose();
      if (onAuthenticated) onAuthenticated();
    }, 600);
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

        {/* Form Body */}
        <form onSubmit={handleGoogleSubmit} className="modal-body">
          
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

          {/* Primary Google OAuth Sign-In Button */}
          <button
            type="button"
            onClick={handleOAuthLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--noir-silver)',
              backgroundColor: '#ffffff',
              color: '#111827',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
            </svg>
            <span>Sign in with @thapar.edu Google Account</span>
          </button>

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

          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-light)', margin: '0.75rem 0' }}>
            — or enter custom @thapar.edu Google email —
          </div>

          {/* Manual Google Email Input */}
          <div className="form-group">
            <input 
              type="email"
              className="form-input"
              placeholder="yourname@thapar.edu"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={isSigningIn}
          >
            {isSigningIn ? 'Authenticating with Google...' : 'Continue to Thapar Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
};
