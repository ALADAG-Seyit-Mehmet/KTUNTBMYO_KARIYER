import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.');
    }
    setLoading(false);
  };

  return (
    <div className="container auth-container" style={{ margin: '50px auto', maxWidth: '500px' }}>
      <h2>Şifremi Unuttum</h2>
      <p>Şifrenizi sıfırlamak için e-posta adresinizi girin.</p>

      {error && <div style={{ color: '#E53935', marginBottom: '15px', padding: '10px', background: 'rgba(229,57,53,0.1)', borderRadius: '5px' }}>{error}</div>}
      {message && <div style={{ color: '#43A047', marginBottom: '15px', padding: '10px', background: 'rgba(67,160,71,0.1)', borderRadius: '5px' }}>{message}</div>}

      <form className="auth-form" onSubmit={handleReset}>
        <div className="form-group">
          <label htmlFor="email">E-posta Adresiniz</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@sirket.com" 
            required 
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '15px' }}>
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/login" style={{ color: 'var(--primary-red)', textDecoration: 'none' }}>Giriş Sayfasına Dön</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
