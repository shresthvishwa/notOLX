import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, handleLogin } = useApp();
  const [emailInput, setEmailInput] = useState('shresth.vishwakarma@thapar.edu');
  const [isSimulatingIdCheck, setIsSimulatingIdCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = (emailInput || '').trim().toLowerCase();

    if (!clean.endsWith('@thapar.edu')) {
      setErrorMsg('Only @thapar.edu email accounts are allowed on this marketplace.');
      return;
    }

    setErrorMsg('');
    setIsSimulatingIdCheck(true);
    setTimeout(() => {
      setIsSimulatingIdCheck(false);
      const success = handleLogin(clean);
      if (!success) {
        setErrorMsg('Only @thapar.edu email accounts are allowed.');
      }
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <h2 className="modal-title">Thapar ID Authentication</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAuthOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(5, 150, 105, 0.2)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem'
          }}>
            <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1.4 }}>
              <strong>Campus Exclusive Protection:</strong> Access is restricted strictly to verified <strong>@thapar.edu</strong> email accounts.
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fecaca',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* College Email Input */}
          <div className="form-group">
            <label className="form-label">Thapar Email Address (@thapar.edu) *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="username@thapar.edu"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMsg('');
                }}
                required
              />
            </div>
          </div>

          {/* Live Student ID Verification Badge Card Preview */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: '2px dashed var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Digital Thapar Student Pass
              </span>
              <span style={{ 
                backgroundColor: emailInput.toLowerCase().endsWith('@thapar.edu') ? 'var(--primary-light)' : '#fef2f2', 
                color: emailInput.toLowerCase().endsWith('@thapar.edu') ? 'var(--primary)' : '#dc2626', 
                fontSize: '0.68rem', 
                fontWeight: 800, 
                padding: '0.15rem 0.5rem', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <CheckCircle2 size={12} /> {emailInput.toLowerCase().endsWith('@thapar.edu') ? 'VALID @THAPAR.EDU' : 'INVALID DOMAIN'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                {emailInput ? emailInput.charAt(0).toUpperCase() : 'T'}
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  {emailInput.split('@')[0] || 'Thapar Student'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Thapar Institute of Engineering & Technology
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem' }}
              disabled={isSimulatingIdCheck}
            >
              {isSimulatingIdCheck ? (
                <span>Verifying @thapar.edu ID...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify Thapar ID & Login</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
