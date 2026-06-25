import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is actually in a recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Geçersiz veya süresi dolmuş sıfırlama bağlantısı. Lütfen tekrar deneyin.');
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Şifreniz başarıyla güncellendi! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="container auth-container" style={{ margin: '50px auto', maxWidth: '500px' }}>
      <h2>Yeni Şifre Belirle</h2>
      <p>Lütfen hesabınız için yeni bir şifre girin.</p>

      {error && <div style={{ color: '#E53935', marginBottom: '15px', padding: '10px', background: 'rgba(229,57,53,0.1)', borderRadius: '5px' }}>{error}</div>}
      {message && <div style={{ color: '#43A047', marginBottom: '15px', padding: '10px', background: 'rgba(67,160,71,0.1)', borderRadius: '5px' }}>{message}</div>}

      <form className="auth-form" onSubmit={handleUpdatePassword}>
        <div className="form-group">
          <label htmlFor="password">Yeni Şifre</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
            minLength="6"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '15px' }}>
          {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
